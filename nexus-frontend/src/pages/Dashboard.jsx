"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useCourses } from "../context/CourseContext";
import WeeklyGoalTracker from "../components/dashboard/WeeklyGoalTracker";
import TopicSuggestion from "../components/dashboard/TopicSuggestion";
import TrendingCourses from "../components/dashboard/TrendingCourses";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, getAccessToken, fetchCsrfToken, refreshToken } = useUser();
  const { fetchInProgressCourses } = useCourses();
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coverPictures, setCoverPictures] = useState({});
  const [error, setError] = useState(null);
  const loggedErrors = useRef(new Set());

  useEffect(() => {
    const loadInProgressCourses = async () => {
      try {
        const coursesData = await fetchInProgressCourses();
        console.log("In-progress courses from CourseContext:", coursesData);
        setInProgressCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch in-progress courses:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        setError("Failed to load in-progress courses. Please try again.");
      }
    };

    loadInProgressCourses();
  }, [fetchInProgressCourses]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const accessToken = getAccessToken();
        const csrfToken = await fetchCsrfToken();

        if (!accessToken || !csrfToken) {
          throw new Error("Missing access token or CSRF token");
        }

        const response = await axios.get("https://127.0.0.1:8000/courses/api/courses/", {
          params: { status: "published" },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });

        console.log("Featured courses response:", response.data);
        const courses = response.data.results || response.data;
        setFeaturedCourses(
          courses.slice(0, 2).map((course) => ({
            id: course.id,
            title: course.title,
            slug: course.slug,
            description: course.description,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch featured courses:", error);
        if (error.response?.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            fetchFeaturedCourses();
          } else {
            setError("Authentication failed. Please log in again.");
          }
        } else {
          setError("Failed to load featured courses. Please try again.");
        }
      }
    };

    fetchFeaturedCourses();
  }, [getAccessToken, fetchCsrfToken, refreshToken]);

  // Fetch cover images for both in-progress and featured courses
  useEffect(() => {
    const fetchCoverImages = async () => {
      const allCourses = [...inProgressCourses, ...featuredCourses];
      const uniqueCourseIds = [...new Set(allCourses.map((course) => course.id))];
      if (uniqueCourseIds.length === 0) return;

      console.log("Fetching cover images for course IDs:", uniqueCourseIds.join(","));

      try {
        const accessToken = getAccessToken();
        const csrfToken = await fetchCsrfToken();
        const coverPicturePromises = uniqueCourseIds.map(async (courseId) => {
          try {
            const coverResponse = await axios.get(
              `https://127.0.0.1:8000/courses/api/courses/${courseId}/get-cover/`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "X-CSRFToken": csrfToken,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
                timeout: 5000,
              }
            );
            console.log(`Cover picture for course ${courseId}:`, coverResponse.data.cover_picture);
            return { id: courseId, cover_picture: coverResponse.data.cover_picture || "/placeholder.svg?height=120&width=200" };
          } catch (err) {
            console.error(`Failed to fetch cover for course ${courseId}:`, {
              status: err.response?.status,
              data: err.response?.data,
              message: err.message,
            });
            return { id: courseId, cover_picture: "/placeholder.svg?height=120&width=200" };
          }
        });

        const coverPicturesData = await Promise.all(coverPicturePromises);
        const coverPicturesMap = coverPicturesData.reduce((acc, { id, cover_picture }) => {
          acc[id] = cover_picture;
          return acc;
        }, {});
        console.log("Cover pictures map:", coverPicturesMap);
        setCoverPictures(coverPicturesMap);
      } catch (err) {
        console.error("Failed to fetch cover pictures:", {
          message: err.message,
          stack: err.stack,
        });
        setCoverPictures({});
      }
    };

    fetchCoverImages();
  }, [inProgressCourses, featuredCourses, getAccessToken, fetchCsrfToken]);

  // Handle Continue Learning navigation
  const handleContinueLearning = (course) => {
    console.log("Continuing to lesson:", { courseId: course.id, nextLessonId: course.next_lesson_id });
    navigate(`/course/${course.id}/lesson/${course.next_lesson_id}`);
  };

  // Calculate stats
  const completedCourses = user?.stats?.completedCourses || 0;
  const completedLessons = user?.stats?.completedLessons || 47;
  const watchTime = user?.stats?.watchTime || { hours: 30, minutes: 47 };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Welcome, {user?.full_name || "Learner"}!</h1>
              <p>Track, manage and schedule your learning with Nexus</p>

              <div className="overview-section">
                <h3>overview</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">{completedCourses}</span>
                      <span className="stat-label">Courses completed</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">{completedLessons}</span>
                      <span className="stat-label">Lessons completed</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="stat-details">
                      <span className="stat-number">
                        {watchTime.hours} Hrs {watchTime.minutes}min
                      </span>
                      <span className="stat-label">Watch time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WeeklyGoalTracker />
          </div>
        </div>
      </div>

      <h3>Jump right in!</h3>
      <div className="jump-section">
        {error && <p className="error-message">{error}</p>}
        {featuredCourses.length > 0 ? (
          featuredCourses.map((course) => (
            <div key={course.id} className="featured-course">
              <div className="featured-course-content">
                
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <Link to={`/course/${course.slug}`} className="start-learning-btn">
                  Start learning
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No featured courses available.</p>
        )}
      </div>

      <h3>Continue Learning</h3>
      <div className="continue-learning">
        {error && <p className="error-message">{error}</p>}
        {inProgressCourses.length > 0 ? (
          <div className="course-grid-dbd">
            {inProgressCourses.map((course) => (
              <div key={course.id} className="enhanced-course-card-dbd">
                <div className="course-image-dbd">
                  <img
                    src={coverPictures[course.id] || "/placeholder.svg?height=120&width=200"}
                    alt={course.title}
                    onError={(e) => {
                      if (!loggedErrors.current.has(`inprogress-${course.id}`)) {
                        console.log(`Image load failed for in-progress course ${course.id}:`, coverPictures[course.id]);
                        loggedErrors.current.add(`inprogress-${course.id}`);
                        e.target.src = "/placeholder.svg?height=120&width=200";
                      }
                    }}
                  />
                  <div className="enrollments-badge-dbd">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {course.enrollments} enrollments
                  </div>
                </div>
                <div className="course-info-dbd">
                  <span className="course-category-dbd">{course.category}</span>
                  <h4 className="course-title-dbd">{course.title}</h4>
                  <div className="progress-section-dbd">
                    <div className="progress-bar-dbd">
                      <div className="progress-fill-dbd" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="progress-text-dbd">{course.progress}% completed</span>
                  </div>
                  <button
                    className="continue-course-btn-dbd"
                    onClick={() => handleContinueLearning(course)}
                  >
                    Continue Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses in progress.</p>
        )}
      </div>

      <TopicSuggestion />
      <TrendingCourses />
    </div>
  );
};

export default Dashboard;