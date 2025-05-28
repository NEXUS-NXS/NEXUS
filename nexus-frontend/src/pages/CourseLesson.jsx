"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  BookOpen,
  PlayCircle,
  FileText,
  Clock,
  Users,
  Star,
  Volume2,
  Maximize,
  Settings,
} from "lucide-react"
import "./CourseLesson.css"

const CourseLesson = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [navigationOpen, setNavigationOpen] = useState(true)
  const [expandedModules, setExpandedModules] = useState([1, 2])
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)

  useEffect(() => {
    // Enhanced mock course data with structured content
    const mockCourseData = {
      id: courseId,
      title: "Python for Actuarial Science",
      instructor: "Dr. Sarah Johnson, FSA",
      rating: 4.8,
      enrolledStudents: 1250,
      totalDuration: "8 weeks",
      overallProgress: 65,
      modules: [
        {
          id: 1,
          title: "Introduction to Python",
          progress: 100,
          isCompleted: true,
          lessons: [
            {
              id: 1,
              title: "What is Python?",
              type: "video",
              duration: "10:30",
              isCompleted: true,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview: "Introduction to Python programming language and its applications in actuarial science.",
                learningObjectives: [
                  "Understand what Python is and its role in actuarial science",
                  "Learn about Python's advantages for data analysis",
                  "Explore real-world applications in insurance and risk management",
                ],
                keyPoints: [
                  {
                    title: "What is Python?",
                    content:
                      "Python is a high-level, interpreted programming language known for its simplicity and readability. It has become the go-to language for actuarial professionals due to its powerful libraries for data analysis, statistical modeling, and machine learning.",
                  },
                  {
                    title: "Why Python for Actuaries?",
                    content: "Python offers several advantages for actuarial work:",
                    bullets: [
                      "Extensive libraries for statistical analysis (NumPy, SciPy, Pandas)",
                      "Machine learning capabilities (Scikit-learn, TensorFlow)",
                      "Data visualization tools (Matplotlib, Seaborn, Plotly)",
                      "Integration with databases and APIs",
                      "Large community and extensive documentation",
                    ],
                  },
                  {
                    title: "Applications in Actuarial Science",
                    content: "Python is used across various actuarial domains:",
                    bullets: [
                      "Pricing models for life and non-life insurance",
                      "Risk assessment and capital modeling",
                      "Claims analysis and fraud detection",
                      "Portfolio optimization and asset-liability modeling",
                      "Regulatory reporting and compliance",
                    ],
                  },
                ],
                codeExample: {
                  title: "Simple Actuarial Calculation",
                  code: `# Calculate present value of annuity
import numpy as np

def present_value_annuity(payment, rate, periods):
    """Calculate present value of ordinary annuity"""
    pv = payment * ((1 - (1 + rate)**(-periods)) / rate)
    return pv

# Example: Monthly payment of $1000, 5% annual rate, 20 years
monthly_rate = 0.05 / 12
periods = 20 * 12
pv = present_value_annuity(1000, monthly_rate, periods)
print("Present Value: $" + "{:,.2f}".format(pv))`,
                },
                summary:
                  "Python is a powerful tool for actuarial professionals, offering extensive libraries and capabilities for data analysis, modeling, and automation of complex calculations.",
              },
            },
            {
              id: 2,
              title: "Setting up Python Environment",
              type: "video",
              duration: "15:45",
              isCompleted: true,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview:
                  "Learn how to install and configure Python for actuarial work, including essential libraries and development environments.",
                learningObjectives: [
                  "Install Python and essential packages",
                  "Set up a development environment",
                  "Configure Jupyter notebooks for interactive analysis",
                ],
                keyPoints: [
                  {
                    title: "Python Installation Options",
                    content: "There are several ways to install Python for actuarial work:",
                    bullets: [
                      "Anaconda Distribution (Recommended for beginners)",
                      "Official Python.org installer",
                      "Package managers (Homebrew for Mac, Chocolatey for Windows)",
                    ],
                  },
                  {
                    title: "Essential Libraries for Actuaries",
                    content: "Key Python libraries every actuary should know:",
                    bullets: [
                      "NumPy - Numerical computing and arrays",
                      "Pandas - Data manipulation and analysis",
                      "Matplotlib/Seaborn - Data visualization",
                      "SciPy - Scientific computing and statistics",
                      "Scikit-learn - Machine learning",
                      "Jupyter - Interactive notebooks",
                    ],
                  },
                ],
              },
            },
            {
              id: 3,
              title: "Module 1 Assessment",
              type: "quiz",
              duration: "15:00",
              isCompleted: false,
              questions: [
                {
                  id: 1,
                  question: "What is Python primarily used for in actuarial science?",
                  options: ["Data analysis and modeling", "Web development", "Game development", "Mobile apps"],
                  correct: 0,
                },
                {
                  id: 2,
                  question: "Which Python library is most commonly used for numerical computations?",
                  options: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
                  correct: 1,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          title: "Python Fundamentals",
          progress: 67,
          isCompleted: false,
          lessons: [
            {
              id: 4,
              title: "Variables and Data Types",
              type: "video",
              duration: "20:15",
              isCompleted: true,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview: "Understanding Python variables and data types essential for actuarial calculations.",
                learningObjectives: [
                  "Master Python data types and their applications",
                  "Learn variable naming conventions",
                  "Understand type conversion and validation",
                ],
                keyPoints: [
                  {
                    title: "Python Data Types",
                    content: "Python has several built-in data types that are crucial for actuarial work:",
                    bullets: [
                      "int - Whole numbers (policy counts, ages)",
                      "float - Decimal numbers (premiums, rates, probabilities)",
                      "str - Text data (policy numbers, names)",
                      "bool - True/False values (claim status, eligibility)",
                      "list - Ordered collections (premium schedules)",
                      "dict - Key-value pairs (policyholder data)",
                    ],
                  },
                ],
                codeExample: {
                  title: "Actuarial Data Types Example",
                  code: `# Actuarial variables and data types
policy_number = "POL-2024-001"  # string
insured_age = 35               # integer
annual_premium = 1250.50       # float
is_smoker = False             # boolean
mortality_rates = [0.001, 0.002, 0.003]  # list
policy_data = {               # dictionary
    "name": "John Doe",
    "age": 35,
    "premium": 1250.50,
    "smoker": False
}

print("Policy: " + policy_number)
print("Premium: $" + "{:,.2f}".format(annual_premium))
print("Smoker status: " + str(is_smoker))`,
                },
              },
            },
            {
              id: 5,
              title: "Control Structures",
              type: "video",
              duration: "25:30",
              isCompleted: true,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview: "Learn about loops and conditional statements for actuarial logic implementation.",
                keyPoints: [
                  {
                    title: "Conditional Statements",
                    content: "Use if/elif/else statements for actuarial decision logic:",
                    bullets: [
                      "Risk classification based on age and health",
                      "Premium adjustments for different coverage types",
                      "Claim validation and processing rules",
                    ],
                  },
                ],
              },
            },
            {
              id: 6,
              title: "Functions and Modules",
              type: "video",
              duration: "18:45",
              isCompleted: false,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview: "Creating reusable code with functions and modules for actuarial calculations.",
                keyPoints: [
                  {
                    title: "Function Benefits",
                    content: "Functions help organize actuarial calculations:",
                    bullets: [
                      "Reusable premium calculation formulas",
                      "Standardized risk assessment procedures",
                      "Modular reserve calculation methods",
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          id: 3,
          title: "Data Analysis with Pandas",
          progress: 25,
          isCompleted: false,
          lessons: [
            {
              id: 7,
              title: "Introduction to Pandas",
              type: "video",
              duration: "22:10",
              isCompleted: false,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview: "Getting started with Pandas for actuarial data manipulation and analysis.",
                keyPoints: [
                  {
                    title: "Pandas for Actuaries",
                    content: "Pandas is essential for handling actuarial datasets:",
                    bullets: [
                      "Policy data management",
                      "Claims data analysis",
                      "Experience studies",
                      "Regulatory reporting",
                    ],
                  },
                ],
              },
            },
            {
              id: 8,
              title: "Data Cleaning Techniques",
              type: "video",
              duration: "28:20",
              isCompleted: false,
              videoUrl: "/placeholder-video.mp4",
              content: {
                overview: "Essential data cleaning techniques for actuarial datasets.",
                keyPoints: [
                  {
                    title: "Common Data Issues",
                    content: "Typical problems in actuarial data:",
                    bullets: [
                      "Missing policy information",
                      "Inconsistent date formats",
                      "Duplicate records",
                      "Invalid claim amounts",
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    setCourseData(mockCourseData)

    // Find current lesson
    const allLessons = mockCourseData.modules.flatMap((module) => module.lessons)
    const lesson = allLessons.find((l) => l.id === Number.parseInt(lessonId)) || allLessons[0]
    setActiveLesson(lesson)
  }, [courseId, lessonId])

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const selectLesson = (lesson) => {
    setActiveLesson(lesson)
    setVideoCurrentTime(0)
    setVideoProgress(0)
    setVideoPlaying(false)
    navigate(`/course/${courseId}/lesson/${lesson.id}`)
  }

  const navigateToNextLesson = () => {
    const allLessons = courseData.modules.flatMap((module) => module.lessons)
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id)
    if (currentIndex < allLessons.length - 1) {
      selectLesson(allLessons[currentIndex + 1])
    }
  }

  const navigateToPreviousLesson = () => {
    const allLessons = courseData.modules.flatMap((module) => module.lessons)
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id)
    if (currentIndex > 0) {
      selectLesson(allLessons[currentIndex - 1])
    }
  }

  const calculateOverallProgress = () => {
    const allLessons = courseData?.modules.flatMap((module) => module.lessons) || []
    const completedLessons = allLessons.filter((lesson) => lesson.isCompleted).length
    return Math.round((completedLessons / allLessons.length) * 100)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!courseData || !activeLesson) {
    return (
      <div className="lesson-loading-container">
        <div className="lesson-loading-spinner"></div>
        <p>Loading course content...</p>
      </div>
    )
  }

  return (
    <div className="lesson-page-container">
      {/* Course Navigation Sidebar */}
      <div className={`lesson-navigation-sidebar ${navigationOpen ? "expanded" : "collapsed"}`}>
        <div className="navigation-header">
          <button className="back-to-hub-btn" onClick={() => navigate("/learninghub")}>
            <ChevronLeft size={18} />
            <span>Learning Hub</span>
          </button>
          <button className="navigation-toggle-btn" onClick={() => setNavigationOpen(!navigationOpen)}>
            {navigationOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {navigationOpen && (
          <>
            <div className="course-overview-section">
              <h2 className="course-main-title">{courseData.title}</h2>
              <div className="course-instructor-info">
                <span className="instructor-name">by {courseData.instructor}</span>
              </div>

              <div className="course-statistics">
                <div className="stat-item">
                  <Star size={14} fill="currentColor" />
                  <span>{courseData.rating}</span>
                </div>
                <div className="stat-item">
                  <Users size={14} />
                  <span>{courseData.enrolledStudents.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <Clock size={14} />
                  <span>{courseData.totalDuration}</span>
                </div>
              </div>

              <div className="overall-progress-section">
                <div className="progress-info">
                  <span className="progress-label">Course Progress</span>
                  <span className="progress-percentage">{calculateOverallProgress()}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${calculateOverallProgress()}%` }}></div>
                </div>
              </div>
            </div>

            <div className="modules-navigation-section">
              {courseData.modules.map((module) => (
                <div key={module.id} className="module-navigation-item">
                  <button className="module-header-btn" onClick={() => toggleModuleExpansion(module.id)}>
                    <div className="module-title-section">
                      {expandedModules.includes(module.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <span className="module-title-text">{module.title}</span>
                    </div>
                    <div className="module-progress-indicator">
                      <span className="module-progress-text">{module.progress}%</span>
                      {module.isCompleted && <CheckCircle size={16} className="completed-icon" />}
                    </div>
                  </button>

                  {expandedModules.includes(module.id) && (
                    <div className="lessons-navigation-list">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`lesson-navigation-item ${
                            activeLesson.id === lesson.id ? "active" : ""
                          } ${lesson.isCompleted ? "completed" : ""}`}
                          onClick={() => selectLesson(lesson)}
                        >
                          <div className="lesson-status-icon">
                            {lesson.isCompleted ? (
                              <CheckCircle size={16} />
                            ) : lesson.type === "quiz" ? (
                              <FileText size={16} />
                            ) : (
                              <PlayCircle size={16} />
                            )}
                          </div>
                          <div className="lesson-details">
                            <span className="lesson-title-text">{lesson.title}</span>
                            <span className="lesson-duration-text">{lesson.duration}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Learning Content */}
      <div className="main-learning-content">
        <div className="lesson-header-section">
          <div className="lesson-breadcrumb">
            <span className="breadcrumb-item">
              {courseData.modules.find((m) => m.lessons.some((l) => l.id === activeLesson.id))?.title}
            </span>
            <ChevronRight size={14} />
            <span className="breadcrumb-current">{activeLesson.title}</span>
          </div>

          <h1 className="lesson-main-title">{activeLesson.title}</h1>

          <div className="lesson-navigation-controls">
            <button className="lesson-nav-btn previous" onClick={navigateToPreviousLesson}>
              <SkipBack size={18} />
              <span>Previous</span>
            </button>
            <button className="lesson-nav-btn next" onClick={navigateToNextLesson}>
              <span>Next</span>
              <SkipForward size={18} />
            </button>
          </div>
        </div>

        {activeLesson.type === "video" ? (
          <div className="video-learning-section">
            {/* Video Player */}
            <div className="video-player-container">
              <div className="video-player-wrapper">
                <div className="video-placeholder">
                  <div className="video-play-overlay">
                    <button className="video-play-button">
                      {videoPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                  </div>
                  <div className="video-info-overlay">
                    <span className="video-duration">{activeLesson.duration}</span>
                  </div>
                </div>

                <div className="video-controls-bar">
                  <button className="video-control-btn">
                    {videoPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  <div className="video-progress-container">
                    <div className="video-progress-bar">
                      <div className="video-progress-fill" style={{ width: `${videoProgress}%` }}></div>
                    </div>
                    <span className="video-time-display">
                      {formatTime(videoCurrentTime)} / {activeLesson.duration}
                    </span>
                  </div>

                  <div className="video-additional-controls">
                    <button className="video-control-btn">
                      <Volume2 size={16} />
                    </button>
                    <button className="video-control-btn">
                      <Settings size={16} />
                    </button>
                    <button className="video-control-btn">
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Notes Content */}
            <div className="lesson-notes-container">
              <div className="notes-header">
                <BookOpen size={20} />
                <h2>Lesson Notes</h2>
              </div>

              <div className="notes-content">
                {/* Overview Section */}
                <div className="notes-section">
                  <h3 className="notes-section-title">Overview</h3>
                  <p className="notes-paragraph">{activeLesson.content.overview}</p>
                </div>

                {/* Learning Objectives */}
                {activeLesson.content.learningObjectives && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Learning Objectives</h3>
                    <ul className="notes-objectives-list">
                      {activeLesson.content.learningObjectives.map((objective, index) => (
                        <li key={index} className="notes-objective-item">
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Points */}
                {activeLesson.content.keyPoints && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Key Points</h3>
                    {activeLesson.content.keyPoints.map((point, index) => (
                      <div key={index} className="notes-key-point">
                        <h4 className="notes-point-title">{point.title}</h4>
                        <p className="notes-point-content">{point.content}</p>
                        {point.bullets && (
                          <ul className="notes-bullet-list">
                            {point.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="notes-bullet-item">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Example */}
                {activeLesson.content.codeExample && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Code Example</h3>
                    <div className="notes-code-block">
                      <h4 className="code-block-title">{activeLesson.content.codeExample.title}</h4>
                      <pre className="code-block-content">
                        <code>{activeLesson.content.codeExample.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {activeLesson.content.summary && (
                  <div className="notes-section">
                    <h3 className="notes-section-title">Summary</h3>
                    <div className="notes-summary-box">
                      <p className="notes-summary-text">{activeLesson.content.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Quiz Section
          <div className="quiz-learning-section">
            <div className="quiz-container">
              <div className="quiz-header">
                <h2 className="quiz-title">Assessment: {activeLesson.title}</h2>
                <p className="quiz-description">Test your understanding of the concepts covered in this module.</p>
              </div>

              <div className="quiz-questions-container">
                {activeLesson.questions?.map((question, index) => (
                  <div key={question.id} className="quiz-question-item">
                    <h3 className="question-text">
                      Question {index + 1}: {question.question}
                    </h3>
                    <div className="question-options">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="option-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optionIndex}
                            className="option-input"
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="quiz-actions">
                <button className="quiz-submit-btn">Submit Assessment</button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Completion Section */}
        <div className="lesson-completion-section">
          <button className="complete-lesson-button">
            <CheckCircle size={18} />
            <span>Mark as Complete</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseLesson
