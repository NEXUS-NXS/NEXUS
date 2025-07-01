// LearningHub.jsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Star, Users, Clock, BookOpen, Play, Award, TrendingUp } from "lucide-react";
import "./LearningHub.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";

const courseCategories = [
  { id: "all", name: "All Categories" },
  { id: "programming", name: "Programming" },
  { id: "data-science", name: "Data Science" },
  { id: "machine-learning", name: "Machine Learning" },
  { id: "statistics", name: "Statistics" },
  { id: "finance", name: "Financial Modeling" },
  { id: "risk-management", name: "Risk Management" },
  { id: "certification", name: "Certification Prep" },
];

const courseLevels = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
  { id: "expert", name: "Expert" },
];

const LearningHub = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchCsrfToken, refreshToken } = useUser();
  const [activeTab, setActiveTab] = useState("enrolled");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAccessToken = () => localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const accessToken = getAccessToken();
        const csrfToken = await fetchCsrfToken();
        if (!accessToken || !isAuthenticated) {
          setError("Please log in to view courses.");
          return;
        }

        // Fetch enrolled courses
        const enrolledResponse = await axios.get("https://127.0.0.1:8000/courses/api/enrolled-courses/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        });
        setEnrolledCourses(enrolledResponse.data.results || []);

        // Fetch available courses
        const availableResponse = await axios.get(
          "https://127.0.0.1:8000/courses/api/courses/?status=published",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        );
        setAvailableCourses(availableResponse.data.results || []);
        setFilteredCourses(availableResponse.data.results || []);
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshed = await refreshToken();
          if (refreshed) {
            fetchCourses(); // Retry after refreshing token
          } else {
            setError("Authentication failed. Please log in again.");
          }
        } else {
          setError(err.response?.data?.detail || "Failed to fetch courses.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated]);

  useEffect(() => {
    const coursesToFilter = activeTab === "enrolled" ? enrolledCourses : availableCourses;
    let filtered = [...coursesToFilter];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.difficulty === selectedLevel);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor?.user?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(filtered);
  }, [activeTab, selectedCategory, selectedLevel, searchQuery, enrolledCourses, availableCourses]);

  const handleEnroll = async (courseId) => {
    try {
      const accessToken = getAccessToken();
      const csrfToken = await fetchCsrfToken();
      await axios.post(
        "https://127.0.0.1:8000/courses/api/enrollments/",
        { course: courseId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // Refresh enrolled courses
      const enrolledResponse = await axios.get("https://127.0.0.1:8000/courses/api/enrolled-courses/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
      setEnrolledCourses(enrolledResponse.data.results || []);
      alert("Successfully enrolled!");
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) handleEnroll(courseId); // Retry
        else setError("Please log in to enroll.");
      } else {
        setError(err.response?.data?.detail || "Failed to enroll.");
      }
    }
  };

  const handleContinueLearning = (course) => {
    navigate(`/course/${course.id}/lesson/${course.next_lesson_id || 1}`);
  };

  const renderEnrolledCourse = (course) => (
    <div key={course.id} className="enrolled-course-card">
      <div className="course-thumbnail">
        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
        <div className="progress-overlay">
          <div className="progress-circle">
            <span>{course.progress}%</span>
          </div>
        </div>
      </div>
      <div className="course-content">
        <div className="course-header">
          <h3>{course.title}</h3>
          <div className="course-meta">
            <span className="instructor">by {course.instructor?.user}</span>
            <div className="rating">
              <Star size={14} fill="currentColor" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
        <div className="progress-info">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
          </div>
          <span className="progress-text">
            {course.completed_lessons} of {course.total_lessons} lessons completed
          </span>
        </div>
        <div className="next-lesson">
          <Play size={16} />
          <span>Next: {course.next_lesson}</span>
        </div>
        <button className="continue-btn" onClick={() => handleContinueLearning(course)}>
          Continue Learning
        </button>
      </div>
    </div>
  );

  const renderAvailableCourse = (course) => (
    <div key={course.id} className="available-course-card">
      {course.is_popular && <div className="popular-badge">Popular</div>}
      <div className="course-thumbnail">
        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
        <div className="course-overlay">
          <button
            className="preview-btn"
            onClick={() => navigate(`/course/${course.id}/preview`)}
          >
            Preview
          </button>
        </div>
      </div>
      <div className="course-content">
        <div className="course-header">
          <h3>{course.title}</h3>
          <div className="course-meta">
            <span className="instructor">by {course.instructor?.user}</span>
            <div className="course-stats">
              <div className="rating">
                <Star size={14} fill="currentColor" />
                <span>{course.rating}</span>
              </div>
              <div className="students">
                <Users size={14} />
                <span>{course.enrolled_students.toLocaleString()}</span>
              </div>
              <div className="duration">
                <Clock size={14} />
                <span>{course.estimated_duration}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="course-description">{course.description}</p>
        <div className="course-footer">
          <div className="course-info">
            <span className="lessons">{course.total_lessons} lessons</span>
            <span className={`level level-${course.difficulty}`}>{course.difficulty}</span>
          </div>
          <div className="course-actions">
            <span className="price">{course.price}</span>
            <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="learning-hub">
      <div className="hub-header">
        <h1>Learning Hub</h1>
        <p>Advance your actuarial career with cutting-edge technology courses</p>
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading courses...</p>}
        <div className="hub-tabs">
          <button
            className={`tab-btn ${activeTab === "enrolled" ? "active" : ""}`}
            onClick={() => setActiveTab("enrolled")}
          >
            <BookOpen size={20} />
            My Enrolled Courses ({enrolledCourses.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "available" ? "active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            <TrendingUp size={20} />
            All Available Courses ({availableCourses.length})
          </button>
        </div>
      </div>

      <div className="hub-filters">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={18} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {courseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <Award size={18} />
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              {courseLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="courses-container">
        {activeTab === "enrolled" ? (
          <div className="enrolled-courses">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(renderEnrolledCourse)
            ) : (
              <div className="no-courses">
                <p>No enrolled courses found. Start learning today!</p>
                <button onClick={() => setActiveTab("available")} className="browse-btn">
                  Browse Available Courses
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="available-courses">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(renderAvailableCourse)
            ) : (
              <div className="no-courses">
                <p>No courses found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;