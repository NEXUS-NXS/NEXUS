"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Users,
  Clock,
  Star,
  Search,
  Grid,
  List,
  Play,
  Edit,
  Eye,
  MoreVertical,
  Calendar,
  Award,
  TrendingUp,
} from "lucide-react"
import "./CourseLibrary.css"
import { useUser } from "../context/UserContext"
import axios from "axios"

const CourseLibrary = () => {
  const navigate = useNavigate()
  const { isAuthenticated, getAccessToken, refreshToken } = useUser()

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("recent")

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "actuarial-science", label: "Actuarial Science" },
    { value: "finance", label: "Finance" },
    { value: "data-science", label: "Data Science" },
    { value: "risk-management", label: "Risk Management" },
    { value: "programming", label: "Programming" },
    { value: "compliance", label: "Compliance" },
  ]

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner", color: "#10b981" },
    { value: "intermediate", label: "Intermediate", color: "#f59e0b" },
    { value: "advanced", label: "Advanced", color: "#ef4444" },
  ]

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "title", label: "Alphabetical" },
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to view your courses.")
      setLoading(false)
      navigate("/login")
      return
    }
    fetchCourses()
  }, [isAuthenticated])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const accessToken = getAccessToken()
      const response = await axios.get("https://127.0.0.1:8000/courses/api/courses/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
        params: {
          instructor_courses: true, // Filter for courses by the authenticated instructor
        },
      })
      setCourses(response.data.results || response.data)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch courses:", err)
      if (err.response?.status === 401) {
        const refreshed = await refreshToken()
        if (refreshed) {
          fetchCourses()
        } else {
          setError("Authentication failed. Please log in again.")
          navigate("/login")
        }
      } else {
        setError("Failed to fetch your courses: " + (err.response?.data?.detail || err.message))
      }
      setLoading(false)
    }
  }

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.updated_at) - new Date(a.updated_at)
        case "popular":
          return b.enrollment_count - a.enrollment_count
        case "rating":
          return b.rating - a.rating
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}/content-manager`)
  }

  const handlePreviewCourse = (courseId) => {
    navigate(`/course/${courseId}/preview`)
  }

  const getDifficultyColor = (difficulty) => {
    const diff = difficulties.find((d) => d.value === difficulty)
    return diff?.color || "#6b7280"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="course-library-loading">
        <div className="loading-spinner"></div>
        <p>Loading your courses...</p>
      </div>
    )
  }

  return (
    <div className="course-library">
      {error && <div className="error-message">{error}</div>}

      {/* Header */}
      <div className="library-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="library-title">My Courses</h1>
            <p className="library-subtitle">Manage and organize your created courses</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{courses.length}</span>
                <span className="stat-label">Total Courses</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{courses.reduce((sum, course) => sum + course.enrollment_count, 0)}</span>
                <span className="stat-label">Total Enrollments</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{courses.filter((c) => c.status === "published").length}</span>
                <span className="stat-label">Published</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="library-controls">
        <div className="search-section">
          <div className="search-input-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
              <Grid size={18} />
            </button>
            <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredAndSortedCourses.length} of {courses.length} courses
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Course Grid/List */}
      <div className={`courses-container ${viewMode}`}>
        {filteredAndSortedCourses.length === 0 ? (
          <div className="no-courses">
            <BookOpen size={48} className="no-courses-icon" />
            <h3>No courses found</h3>
            <p>You haven't created any courses yet. Start by creating a new course!</p>
            <button className="btn-primary" onClick={() => navigate("/create-course")}>
              Create New Course
            </button>
          </div>
        ) : (
          filteredAndSortedCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="thumbnail-image" />
                <div className="course-status">
                  <span className={`status-badge ${course.status}`}>{course.status}</span>
                </div>
                <div className="course-overlay">
                  <button className="overlay-btn primary" onClick={() => handleCourseClick(course.id)}>
                    <Edit size={16} />
                    Manage
                  </button>
                  <button className="overlay-btn secondary" onClick={() => handlePreviewCourse(course.id)}>
                    <Eye size={16} />
                    Preview
                  </button>
                </div>
              </div>

              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-menu">
                    <button className="menu-btn">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <p className="course-description">{course.description}</p>

                <div className="course-meta">
                  <div className="meta-row">
                    <div className="meta-item">
                      <span
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(course.difficulty) }}
                      >
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{course.estimated_duration}</span>
                    </div>
                  </div>

                  <div className="meta-row">
                    <div className="meta-item">
                      <BookOpen size={14} />
                      <span>{course.total_lessons} lessons</span>
                    </div>
                    <div className="meta-item">
                      <Users size={14} />
                      <span>{course.enrollment_count} enrolled</span>
                    </div>
                  </div>

                  {course.rating > 0 && (
                    <div className="meta-row">
                      <div className="meta-item">
                        <Star size={14} className="star-filled" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="meta-item">
                        <Award size={14} />
                        <span>{course.completion_rate}% completion</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="course-footer">
                  <div className="course-dates">
                    <div className="date-item">
                      <Calendar size={12} />
                      <span>Updated {formatDate(course.updated_at)}</span>
                    </div>
                  </div>

                  <div className="course-actions">
                    <button className="action-btn secondary" onClick={() => handlePreviewCourse(course.id)}>
                      <Play size={14} />
                      Preview
                    </button>
                    <button className="action-btn primary" onClick={() => handleCourseClick(course.id)}>
                      <Edit size={14} />
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (if needed) */}
      {filteredAndSortedCourses.length > 12 && (
        <div className="pagination">
          <button className="pagination-btn">Previous</button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-btn">Next</button>
        </div>
      )}
    </div>
  )
}

export default CourseLibrary