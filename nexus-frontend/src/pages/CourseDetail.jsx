"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Play, CheckCircle, Clock, Award, ArrowLeft, BookOpen, FileText, MessageCircle } from "lucide-react"
import "./CourseDetail.css"

const CourseDetail = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [activeTab, setActiveTab] = useState("content")
  const [activeModule, setActiveModule] = useState(null)

  useEffect(() => {
    // Simulating API call to fetch course details
    const fetchCourseDetails = async () => {
      // This would be an API call in a real application
      const mockCourse = {
        id: id,
        title: "Python Programming Basics",
        description:
          "Learn the fundamentals of Python programming, from basic syntax to advanced concepts like object-oriented programming.",
        level: "Beginner",
        duration: "10 hours",
        instructor: "Dr. Alex Johnson",
        progress: 51,
        modules: [
          {
            id: 1,
            title: "Introduction to Python",
            completed: true,
            lessons: [
              { id: 1, title: "What is Python?", duration: "10 min", completed: true },
              { id: 2, title: "Setting up your environment", duration: "15 min", completed: true },
              { id: 3, title: "Your first Python program", duration: "20 min", completed: true },
              { id: 4, title: "Module 1 Quiz", duration: "15 min", completed: true, isQuiz: true },
            ],
          },
          {
            id: 2,
            title: "Python Basics",
            completed: true,
            lessons: [
              { id: 5, title: "Variables and Data Types", duration: "25 min", completed: true },
              { id: 6, title: "Operators", duration: "20 min", completed: true },
              { id: 7, title: "Control Flow", duration: "30 min", completed: true },
              { id: 8, title: "Module 2 Quiz", duration: "15 min", completed: true, isQuiz: true },
            ],
          },
          {
            id: 3,
            title: "Data Structures",
            completed: false,
            lessons: [
              { id: 9, title: "Lists and Tuples", duration: "30 min", completed: true },
              { id: 10, title: "Dictionaries", duration: "25 min", completed: true },
              { id: 11, title: "Sets", duration: "20 min", completed: false },
              { id: 12, title: "Module 3 Quiz", duration: "15 min", completed: false, isQuiz: true },
            ],
          },
          {
            id: 4,
            title: "Functions",
            completed: false,
            lessons: [
              { id: 13, title: "Defining Functions", duration: "25 min", completed: false },
              { id: 14, title: "Parameters and Arguments", duration: "30 min", completed: false },
              { id: 15, title: "Return Values", duration: "20 min", completed: false },
              { id: 16, title: "Module 4 Quiz", duration: "15 min", completed: false, isQuiz: true },
            ],
          },
          {
            id: 5,
            title: "Object-Oriented Programming",
            completed: false,
            lessons: [
              { id: 17, title: "Classes and Objects", duration: "35 min", completed: false },
              { id: 18, title: "Inheritance", duration: "30 min", completed: false },
              { id: 19, title: "Polymorphism", duration: "25 min", completed: false },
              { id: 20, title: "Module 5 Quiz", duration: "15 min", completed: false, isQuiz: true },
            ],
          },
          {
            id: 6,
            title: "Final Project",
            completed: false,
            lessons: [
              { id: 21, title: "Project Requirements", duration: "15 min", completed: false },
              { id: 22, title: "Project Implementation", duration: "60 min", completed: false },
              { id: 23, title: "Final Exam", duration: "45 min", completed: false, isQuiz: true },
            ],
          },
        ],
        requirements: [
          "No prior programming experience required",
          "Basic computer skills",
          "Computer with internet access",
        ],
        outcomes: [
          "Write Python programs from scratch",
          "Understand core programming concepts",
          "Work with Python data structures",
          "Create functions and classes",
          "Build simple applications",
        ],
        discussions: [
          {
            id: 1,
            user: "Jane Smith",
            message: "I'm having trouble with the dictionaries concept. Can someone explain?",
            timestamp: "2 days ago",
            replies: 3,
          },
          {
            id: 2,
            user: "Mike Johnson",
            message: "Great course! The examples are really helpful.",
            timestamp: "1 week ago",
            replies: 5,
          },
        ],
        resources: [
          { id: 1, title: "Python Cheat Sheet", type: "PDF" },
          { id: 2, title: "Practice Exercises", type: "ZIP" },
          { id: 3, title: "Python Documentation", type: "Link" },
        ],
      }

      setCourse(mockCourse)
      setActiveModule(mockCourse.modules[0])
    }

    fetchCourseDetails()
  }, [id])

  if (!course) {
    return <div className="loading">Loading course details...</div>
  }

  const completedLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.filter((lesson) => lesson.completed).length
  }, 0)

  const totalLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.length
  }, 0)

  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  const handleModuleClick = (module) => {
    setActiveModule(module)
  }

  const handleLessonClick = (lesson) => {
    // In a real app, this would navigate to the lesson content
    alert(`Starting lesson: ${lesson.title}`)
  }

  return (
    <div className="course-detail-page">
      <div className="course-header">
        <Link to="/my-courses" className="back-link">
          <ArrowLeft size={16} />
          Back to My Courses
        </Link>

        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <div className="meta-item">
            <BookOpen size={16} />
            <span>{course.level}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="meta-item">
            <Award size={16} />
            <span>Certificate</span>
          </div>
        </div>

        <div className="course-progress-container">
          <div className="progress-stats">
            <span>
              {completedLessons}/{totalLessons} lessons completed
            </span>
            <span>{progressPercentage}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="course-tabs">
        <button
          className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Course Content
        </button>
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "discussions" ? "active" : ""}`}
          onClick={() => setActiveTab("discussions")}
        >
          Discussions
        </button>
        <button
          className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
      </div>

      <div className="course-content">
        {activeTab === "content" && (
          <div className="content-tab">
            <div className="modules-list">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className={`module-item ${activeModule?.id === module.id ? "active" : ""} ${module.completed ? "completed" : ""}`}
                  onClick={() => handleModuleClick(module)}
                >
                  <div className="module-header">
                    <h3>{module.title}</h3>
                    {module.completed && <CheckCircle size={16} className="completed-icon" />}
                  </div>
                  <p>{module.lessons.length} lessons</p>
                </div>
              ))}
            </div>

            <div className="lessons-list">
              {activeModule && (
                <>
                  <h2>{activeModule.title}</h2>
                  {activeModule.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${lesson.completed ? "completed" : ""}`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="lesson-icon">{lesson.isQuiz ? <FileText size={18} /> : <Play size={18} />}</div>
                      <div className="lesson-info">
                        <h4>{lesson.title}</h4>
                        <span>{lesson.duration}</span>
                      </div>
                      {lesson.completed && <CheckCircle size={16} className="completed-icon" />}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="overview-section">
              <h2>About this course</h2>
              <p>{course.description}</p>
            </div>

            <div className="overview-section">
              <h2>What you'll learn</h2>
              <ul className="outcomes-list">
                {course.outcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            </div>

            <div className="overview-section">
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {course.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="overview-section">
              <h2>Instructor</h2>
              <div className="instructor-info">
                <div className="instructor-avatar">
                  <img src="/assets/instructor-avatar.jpg" alt={course.instructor} />
                </div>
                <div className="instructor-details">
                  <h3>{course.instructor}</h3>
                  <p>Python Expert & Data Scientist</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="discussions-tab">
            <div className="discussions-header">
              <h2>Course Discussions</h2>
              <button className="new-post-btn">
                <MessageCircle size={16} />
                New Post
              </button>
            </div>

            <div className="discussions-list">
              {course.discussions.map((discussion) => (
                <div key={discussion.id} className="discussion-item">
                  <div className="discussion-avatar">
                    <img src={`/assets/avatar-${discussion.id}.jpg`} alt={discussion.user} />
                  </div>
                  <div className="discussion-content">
                    <div className="discussion-header">
                      <h3>{discussion.user}</h3>
                      <span>{discussion.timestamp}</span>
                    </div>
                    <p>{discussion.message}</p>
                    <div className="discussion-actions">
                      <button className="reply-btn">Reply</button>
                      <span>{discussion.replies} replies</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="resources-tab">
            <h2>Course Resources</h2>
            <div className="resources-list">
              {course.resources.map((resource) => (
                <div key={resource.id} className="resource-item">
                  <div className="resource-icon">
                    <FileText size={20} />
                  </div>
                  <div className="resource-info">
                    <h3>{resource.title}</h3>
                    <span>{resource.type}</span>
                  </div>
                  <button className="download-btn">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
