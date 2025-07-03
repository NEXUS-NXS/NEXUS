"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const { getAccessToken, fetchCsrfToken, refreshToken } = useUser();

  const fetchInProgressCourses = async () => {
    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();

      if (!accessToken || !csrfToken) {
        throw new Error("Missing access token or CSRF token");
      }

      const response = await axios.get(
        "https://nexus-test-api-8bf398f16fc4.herokuapp.com/courses/api/enrolled-courses/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("Enrolled courses response:", response.data);
      const coursesData = response.data.results || response.data;
      const mappedCourses = coursesData.map((course) => ({
        id: course.id, // UUID
        title: course.title,
        slug: course.slug,
        image: course.cover_picture || "/placeholder.svg?height=120&width=200",
        enrollments: course.enrolled_students
          ? course.enrolled_students >= 1000
            ? `${(course.enrolled_students / 1000).toFixed(1)}K`
            : course.enrolled_students
          : "0",
        progress: parseFloat(course.progress || 0).toFixed(1),
        category: course.category || "Course",
        next_lesson_id: course.next_lesson_id || "first",
      }));

      setCourses(mappedCourses);
      return mappedCourses;
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
      if (error.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return await fetchInProgressCourses();
        } else {
          throw new Error("Authentication failed. Please log in again.");
        }
      }
      throw error;
    }
  };

  return (
    <CourseContext.Provider value={{ courses, fetchInProgressCourses }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
