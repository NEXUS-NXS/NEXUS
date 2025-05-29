"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useCourses } from "../context/CourseContext"
import WeeklyGoalTracker from "../components/dashboard/WeeklyGoalTracker"
import TopicSuggestion from "../components/dashboard/TopicSuggestion"
import TrendingCourses from "../components/dashboard/TrendingCourses"
import "./Dashboard.css"

const Dashboard = () => {
  const { user } = useUser()
  const { courses, fetchInProgressCourses } = useCourses()
  const [inProgressCourses, setInProgressCourses] = useState([])

  useEffect(() => {
    const loadCourses = async () => {
      const coursesData = await fetchInProgressCourses()
      setInProgressCourses(coursesData)
    }

    loadCourses()
  }, [fetchInProgressCourses])

  // Calculate stats
  const completedCourses = user?.stats?.completedCourses || 0
  const completedLessons = user?.stats?.completedLessons || 47
  const watchTime = user?.stats?.watchTime || { hours: 30, minutes: 47 }

  // Mock data for continue learning courses
  const continuelearningCourses = [
    {
      id: 1,
      title: "python programming basics",
      image: "/placeholder.svg?height=120&width=200",
      enrollments: "23M",
      progress: 51,
      category: "Course",
    },
    {
      id: 2,
      title: "python programming basics",
      image: "/placeholder.svg?height=120&width=200",
      enrollments: "23M",
      progress: 51,
      category: "Course",
    },
    {
      id: 3,
      title: "python programming basics",
      image: "/placeholder.svg?height=120&width=200",
      enrollments: "23M",
      progress: 51,
      category: "Course",
    },
    {
      id: 3,
      title: "python programming basics",
      image: "/placeholder.svg?height=120&width=200",
      enrollments: "23M",
      progress: 51,
      category: "Course",
    },
    
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Welcome, {user?.name || "Jeremiah"}!</h1>
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
        
        <div className="featured-course">
          <div className="featured-course-content">
            <h2>Complete python basics programming</h2>
            <p>Automate tasks, create scripts, and lay the foundation for more advanced Python programming.</p>
            <Link to="/course/python-basics" className="start-learning-btn">
              Start learning
            </Link>
          </div>
        </div>
        <div className="featured-course">
          <div className="featured-course-content">
            <h2>Complete python basics programming</h2>
            <p>Automate tasks, create scripts, and lay the foundation for more advanced Python programming.</p>
            <Link to="/course/python-basics" className="start-learning-btn">
              Start learning
            </Link>
          </div>
        </div>
      </div>

        <h3>Continue Learning</h3>
      <div className="continue-learning">
        
        <div className="course-grid-dbd">
          {continuelearningCourses.map((course) => (
            <div key={course.id} className="enhanced-course-card-dbd">
              <div className="course-image-dbd">
                <img src={course.image || "/placeholder.svg"} alt={course.title} />
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
                <button className="continue-course-btn-dbd">Continue Course</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TopicSuggestion />

      <TrendingCourses />
    </div>
  )
}

export default Dashboard
