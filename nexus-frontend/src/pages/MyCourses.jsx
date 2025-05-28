"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BookOpen, BarChart } from "lucide-react"
import CourseCard from "../components/courses/CourseCard"
import "./MyCourses.css"

const courseCategories = [
  { id: "all", name: "All Courses" },
  { id: "python", name: "Python" },
  { id: "r", name: "R Programming" },
  { id: "excel", name: "Advanced Excel" },
  { id: "ml", name: "Machine Learning" },
  { id: "ai", name: "Artificial Intelligence" },
  { id: "data", name: "Data Science" },
  { id: "actuarial", name: "Actuarial Topics" },
  { id: "math", name: "Mathematical Topics" },
]

const courseStatuses = [
  { id: "all", name: "All Statuses" },
  { id: "in-progress", name: "In Progress" },
  { id: "completed", name: "Completed" },
  { id: "not-started", name: "Not Started" },
]

const courseLevels = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
]

const MyCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
    // Simulating API call to fetch courses
    const fetchCourses = async () => {
      // This would be an API call in a real application
      const mockCourses = [
        {
          id: "python-basics",
          title: "Python Programming Basics",
          category: "python",
          level: "beginner",
          status: "in-progress",
          progress: 51,
          image: "/assets/python-course.jpg",
        },
        {
          id: "python-intermediate",
          title: "Python Programming Basics",
          category: "python",
          level: "intermediate",
          status: "in-progress",
          progress: 80,
          image: "/assets/python-course.jpg",
        },
        {
          id: "python-advanced",
          title: "Python Programming Basics",
          category: "python",
          level: "advanced",
          status: "in-progress",
          progress: 10,
          image: "/assets/python-course.jpg",
        },
        {
          id: "r-basics",
          title: "R Programming Fundamentals",
          category: "r",
          level: "beginner",
          status: "not-started",
          progress: 0,
          image: "/assets/r-course.jpg",
        },
        {
          id: "excel-advanced",
          title: "Advanced Excel for Actuaries",
          category: "excel",
          level: "intermediate",
          status: "completed",
          progress: 100,
          image: "/assets/excel-course.jpg",
        },
        {
          id: "ml-intro",
          title: "Introduction to Machine Learning",
          category: "ml",
          level: "beginner",
          status: "in-progress",
          progress: 35,
          image: "/assets/ml-course.jpg",
        },
        {
          id: "actuarial-models",
          title: "Actuarial Modeling Techniques",
          category: "actuarial",
          level: "advanced",
          status: "not-started",
          progress: 0,
          image: "/assets/actuarial-course.jpg",
        },
        {
          id: "data-visualization",
          title: "Data Visualization with Python",
          category: "data",
          level: "intermediate",
          status: "in-progress",
          progress: 22,
          image: "/assets/data-viz-course.jpg",
        },
      ]

      setCourses(mockCourses)
      setFilteredCourses(mockCourses)
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    // Filter courses based on selected category, status, level, and search query
    let filtered = courses

    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((course) => course.status === selectedStatus)
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((course) => course.title.toLowerCase().includes(query))
    }

    setFilteredCourses(filtered)
  }, [selectedCategory, selectedStatus, selectedLevel, searchQuery, courses])

  return (
    <div className="my-courses-page">
      <div className="courses-header">
        <h1>My Courses</h1>
        <p>Track your progress and continue learning</p>

        <div className="courses-search">
          <div className="search-input-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <Filter size={18} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {courseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <BookOpen size={18} />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              {courseStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-container">
            <BarChart size={18} />
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

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
        ) : (
          <div className="no-courses">
            <p>No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses
