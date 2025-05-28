"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Star, Users, Clock, BookOpen, Play, Award, TrendingUp } from "lucide-react"
import "./LearningHub.css"
import { useNavigate} from 'react-router-dom'

const courseCategories = [
  { id: "all", name: "All Categories" },
  { id: "programming", name: "Programming" },
  { id: "data-science", name: "Data Science" },
  { id: "machine-learning", name: "Machine Learning" },
  { id: "statistics", name: "Statistics" },
  { id: "finance", name: "Financial Modeling" },
  { id: "risk-management", name: "Risk Management" },
  { id: "certification", name: "Certification Prep" },
]

const courseLevels = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
  { id: "expert", name: "Expert" },
]

const LearningHub = () => {
    const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("enrolled")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [availableCourses, setAvailableCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
    // Mock enrolled courses
    const mockEnrolledCourses = [
      {
        id: 1,
        title: "Python for Actuarial Science",
        instructor: "Dr. Sarah Johnson",
        category: "programming",
        level: "intermediate",
        progress: 75,
        rating: 4.8,
        students: 1250,
        duration: "8 weeks",
        thumbnail: "/placeholder.svg?height=200&width=300",
        nextLesson: "Monte Carlo Simulations",
        totalLessons: 24,
        completedLessons: 18,
        nextLessonId: 6
      },
      {
        id: 2,
        title: "R for Statistical Analysis",
        instructor: "Prof. Michael Chen",
        category: "statistics",
        level: "beginner",
        progress: 45,
        rating: 4.6,
        students: 890,
        duration: "6 weeks",
        thumbnail: "/placeholder.svg?height=200&width=300",
        nextLesson: "Hypothesis Testing",
        totalLessons: 20,
        completedLessons: 9,
        nextLessonId: 3
      },
      {
        id: 3,
        title: "Machine Learning for Risk Assessment",
        instructor: "Dr. Emily Rodriguez",
        category: "machine-learning",
        level: "advanced",
        progress: 30,
        rating: 4.9,
        students: 567,
        duration: "12 weeks",
        thumbnail: "/placeholder.svg?height=200&width=300",
        nextLesson: "Neural Networks",
        totalLessons: 36,
        completedLessons: 11,
        nextLessonId: 5
      },
    ]

    // Mock available courses
    const mockAvailableCourses = [
      {
        id: 4,
        title: "SQL for Actuarial Data Analysis",
        instructor: "Dr. James Wilson",
        category: "data-science",
        level: "beginner",
        rating: 4.7,
        students: 2100,
        duration: "5 weeks",
        price: "$149",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Master SQL for actuarial data manipulation and analysis",
        lessons: 18,
        isPopular: true,
      },
      {
        id: 5,
        title: "Advanced Excel for Actuaries",
        instructor: "Lisa Thompson",
        category: "finance",
        level: "intermediate",
        rating: 4.5,
        students: 1800,
        duration: "4 weeks",
        price: "$99",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Advanced Excel techniques for actuarial modeling",
        lessons: 15,
        isPopular: false,
      },
      {
        id: 6,
        title: "SOA Exam P Preparation",
        instructor: "Dr. Robert Kim",
        category: "certification",
        level: "intermediate",
        rating: 4.9,
        students: 3200,
        duration: "16 weeks",
        price: "$299",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Comprehensive preparation for SOA Exam P",
        lessons: 48,
        isPopular: true,
      },
      {
        id: 7,
        title: "Deep Learning for Insurance",
        instructor: "Dr. Anna Petrov",
        category: "machine-learning",
        level: "expert",
        rating: 4.8,
        students: 450,
        duration: "14 weeks",
        price: "$399",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Apply deep learning techniques to insurance problems",
        lessons: 42,
        isPopular: false,
      },
      {
        id: 8,
        title: "Tableau for Actuarial Visualization",
        instructor: "Mark Davis",
        category: "data-science",
        level: "beginner",
        rating: 4.6,
        students: 1100,
        duration: "6 weeks",
        price: "$179",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Create compelling visualizations for actuarial data",
        lessons: 22,
        isPopular: false,
      },
      {
        id: 9,
        title: "Stochastic Processes in Python",
        instructor: "Dr. Catherine Lee",
        category: "programming",
        level: "advanced",
        rating: 4.7,
        students: 680,
        duration: "10 weeks",
        price: "$249",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Implement stochastic processes for actuarial modeling",
        lessons: 30,
        isPopular: true,
      },
      {
        id: 10,
        title: "CAS Exam MAS-I Preparation",
        instructor: "Prof. David Brown",
        category: "certification",
        level: "advanced",
        rating: 4.8,
        students: 890,
        duration: "20 weeks",
        price: "$349",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description: "Master modern actuarial statistics for CAS MAS-I",
        lessons: 60,
        isPopular: true,
      },
    ]

    setEnrolledCourses(mockEnrolledCourses)
    setAvailableCourses(mockAvailableCourses)
    setFilteredCourses(mockAvailableCourses)
  }, [])

  useEffect(() => {
    const coursesToFilter = activeTab === "enrolled" ? enrolledCourses : availableCourses
    let filtered = coursesToFilter

    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query),
      )
    }

    setFilteredCourses(filtered)
  }, [activeTab, selectedCategory, selectedLevel, searchQuery, enrolledCourses, availableCourses])

  const handleContinueLearning = (course)=>{
    navigate('/course/${course.id}/lesson/${course.nextLessonId || 1}')
  }

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
            <span className="instructor">by {course.instructor}</span>
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
            {course.completedLessons} of {course.totalLessons} lessons completed
          </span>
        </div>
        <div className="next-lesson">
          <Play size={16} />
          <span>Next: {course.nextLesson}</span>
        </div>
        {/* <button className="continue-btn">Continue Learning</button> */}
        <button className="continue-btn" onClick={()=>handleContinueLearning(course)} >Continue Learning</button>
      </div>
    </div>
  )

  const renderAvailableCourse = (course) => (
    <div key={course.id} className="available-course-card">
      {course.isPopular && <div className="popular-badge">Popular</div>}
      <div className="course-thumbnail">
        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
        <div className="course-overlay">
          <button className="preview-btn">Preview</button>
        </div>
      </div>
      <div className="course-content">
        <div className="course-header">
          <h3>{course.title}</h3>
          <div className="course-meta">
            <span className="instructor">by {course.instructor}</span>
            <div className="course-stats">
              <div className="rating">
                <Star size={14} fill="currentColor" />
                <span>{course.rating}</span>
              </div>
              <div className="students">
                <Users size={14} />
                <span>{course.students.toLocaleString()}</span>
              </div>
              <div className="duration">
                <Clock size={14} />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="course-description">{course.description}</p>
        <div className="course-footer">
          <div className="course-info">
            <span className="lessons">{course.lessons} lessons</span>
            <span className={`level level-${course.level}`}>{course.level}</span>
          </div>
          <div className="course-actions">
            <span className="price">{course.price}</span>
            <button className="enroll-btn">Enroll Now</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="learning-hub">
      <div className="hub-header">
        <h1>Learning Hub</h1>
        <p>Advance your actuarial career with cutting-edge technology courses</p>

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
  )
}

export default LearningHub
