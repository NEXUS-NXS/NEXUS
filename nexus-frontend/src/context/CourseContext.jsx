"use client"

import { createContext, useContext, useState } from "react"

const CourseContext = createContext(undefined)

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([])

  const fetchInProgressCourses = async () => {
    // In a real app, this would make an API call
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockCourses = [
      {
        id: "python-basics",
        title: "Python Programming Basics",
        category: "python",
        level: "beginner",
        status: "in-progress",
        progress: 51,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "python-intermediate",
        title: "Python Programming Basics",
        category: "python",
        level: "intermediate",
        status: "in-progress",
        progress: 80,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "python-advanced",
        title: "Python Programming Basics",
        category: "python",
        level: "advanced",
        status: "in-progress",
        progress: 10,
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    setCourses(mockCourses)
    return mockCourses
  }

  const fetchAllCourses = async () => {
    // In a real app, this would make an API call
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockCourses = [
      {
        id: "python-basics",
        title: "Python Programming Basics",
        category: "python",
        level: "beginner",
        status: "in-progress",
        progress: 51,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "python-intermediate",
        title: "Python Programming Basics",
        category: "python",
        level: "intermediate",
        status: "in-progress",
        progress: 80,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "python-advanced",
        title: "Python Programming Basics",
        category: "python",
        level: "advanced",
        status: "in-progress",
        progress: 10,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "r-basics",
        title: "R Programming Fundamentals",
        category: "r",
        level: "beginner",
        status: "not-started",
        progress: 0,
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "excel-advanced",
        title: "Advanced Excel for Actuaries",
        category: "excel",
        level: "intermediate",
        status: "completed",
        progress: 100,
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    setCourses(mockCourses)
    return mockCourses
  }

  const fetchCourseById = async (id) => {
    // In a real app, this would make an API call
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock course details
    return {
      id: id,
      title: "Python Programming Basics",
      description: "Learn the fundamentals of Python programming, from basic syntax to advanced concepts.",
      level: "Beginner",
      duration: "10 hours",
      instructor: "Dr. Alex Johnson",
      progress: 51,
      // Additional details would be here
    }
  }

  return (
    <CourseContext.Provider value={{ courses, fetchInProgressCourses, fetchAllCourses, fetchCourseById }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider")
  }
  return context
}
