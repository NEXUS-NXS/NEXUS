"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  X,
  Video,
  HelpCircle,
  BookOpen,
  Settings,
  Eye,
} from "lucide-react"
import "./CourseContentManager.css"

const CourseContentManager = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [courseContent, setCourseContent] = useState(null)
  const [activeTab, setActiveTab] = useState("modules")
  const [editingModule, setEditingModule] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(null)
  const [expandedModules, setExpandedModules] = useState([])

  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
  })

  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video",
    duration: "",
    description: "",
    videoUrl: "",
    content: {
      overview: "",
      learningObjectives: [""],
      keyPoints: [{ title: "", content: "", bullets: [""] }],
      codeExample: { title: "", code: "" },
      summary: "",
    },
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        explanation: "",
      },
    ],
  })

  useEffect(() => {
    // Load existing course content from localStorage
    const savedCourse = localStorage.getItem(`course_${courseId}`)

    if (savedCourse) {
      const courseData = JSON.parse(savedCourse)
      setCourseContent(courseData)
      // Set first module as expanded if it exists
      if (courseData.modules && courseData.modules.length > 0) {
        setExpandedModules([courseData.modules[0].id])
      }
    } else {
      // If no saved course, create a basic structure with the course data
      const basicCourseContent = {
        id: courseId,
        title: "New Course",
        description: "Course description",
        modules: [],
      }
      setCourseContent(basicCourseContent)
    }
  }, [courseId])

  // Module Management Functions
  const handleAddModule = () => {
    if (!moduleForm.title.trim()) return

    const newModule = {
      id: Date.now(),
      title: moduleForm.title,
      description: moduleForm.description,
      lessons: [],
    }

    setCourseContent((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }))

    setModuleForm({ title: "", description: "" })
    setShowAddModule(false)
  }

  const handleEditModule = (moduleId, updatedData) => {
    setCourseContent((prev) => ({
      ...prev,
      modules: prev.modules.map((module) => (module.id === moduleId ? { ...module, ...updatedData } : module)),
    }))
    setEditingModule(null)
  }

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.filter((module) => module.id !== moduleId),
      }))
    }
  }

  // Lesson Management Functions
  const handleAddLesson = (moduleId) => {
    if (!lessonForm.title.trim()) return

    const newLesson = {
      id: Date.now(),
      ...lessonForm,
      isCompleted: false,
    }

    setCourseContent((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module,
      ),
    }))

    // Reset form
    setLessonForm({
      title: "",
      type: "video",
      duration: "",
      description: "",
      videoUrl: "",
      content: {
        overview: "",
        learningObjectives: [""],
        keyPoints: [{ title: "", content: "", bullets: [""] }],
        codeExample: { title: "", code: "" },
        summary: "",
      },
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correct: 0,
          explanation: "",
        },
      ],
    })
    setShowAddLesson(null)
  }

  const handleEditLesson = (moduleId, lessonId, updatedData) => {
    setCourseContent((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, ...updatedData } : lesson,
              ),
            }
          : module,
      ),
    }))
    setEditingLesson(null)
  }

  const handleDeleteLesson = (moduleId, lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setCourseContent((prev) => ({
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === moduleId
            ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) }
            : module,
        ),
      }))
    }
  }

  // Content Form Helpers
  const addLearningObjective = () => {
    setLessonForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        learningObjectives: [...prev.content.learningObjectives, ""],
      },
    }))
  }

  const removeLearningObjective = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        learningObjectives: prev.content.learningObjectives.filter((_, i) => i !== index),
      },
    }))
  }

  const addKeyPoint = () => {
    setLessonForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        keyPoints: [...prev.content.keyPoints, { title: "", content: "", bullets: [""] }],
      },
    }))
  }

  const removeKeyPoint = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        keyPoints: prev.content.keyPoints.filter((_, i) => i !== index),
      },
    }))
  }

  const addBulletPoint = (keyPointIndex) => {
    setLessonForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        keyPoints: prev.content.keyPoints.map((point, i) =>
          i === keyPointIndex ? { ...point, bullets: [...point.bullets, ""] } : point,
        ),
      },
    }))
  }

  const removeBulletPoint = (keyPointIndex, bulletIndex) => {
    setLessonForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        keyPoints: prev.content.keyPoints.map((point, i) =>
          i === keyPointIndex ? { ...point, bullets: point.bullets.filter((_, j) => j !== bulletIndex) } : point,
        ),
      },
    }))
  }

  const addQuestion = () => {
    setLessonForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correct: 0,
          explanation: "",
        },
      ],
    }))
  }

  const removeQuestion = (index) => {
    setLessonForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleSaveCourse = () => {
    // Save course content to localStorage
    const updatedCourse = {
      ...courseContent,
      updatedAt: new Date().toISOString(),
      totalLessons: courseContent.modules.reduce((total, module) => total + module.lessons.length, 0),
    }

    localStorage.setItem(`course_${courseId}`, JSON.stringify(updatedCourse))

    // Also update the courses list
    const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]")
    const updatedCourses = existingCourses.map((course) => (course.id === courseId ? updatedCourse : course))
    localStorage.setItem("courses", JSON.stringify(updatedCourses))

    alert("Course content saved successfully!")
  }

  const handlePreviewCourse = () => {
    // Navigate to course preview
    navigate(`/course/${courseId}/lesson/1`)
  }

  if (!courseContent) {
    return (
      <div className="content-manager-loading">
        <div className="loading-spinner"></div>
        <p>Loading course content manager...</p>
      </div>
    )
  }

  return (
    <div className="course-content-manager">
      <div className="manager-header">
        <div className="header-info">
          <h1 className="manager-title">Course Content Manager</h1>
          <p className="manager-subtitle">{courseContent.title}</p>
        </div>
        <div className="header-actions">
          <button className="action-btn preview" onClick={handlePreviewCourse}>
            <Eye size={18} />
            Preview Course
          </button>
          <button className="action-btn save" onClick={handleSaveCourse}>
            <Save size={18} />
            Save Course
          </button>
        </div>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === "modules" ? "active" : ""}`}
          onClick={() => setActiveTab("modules")}
        >
          <BookOpen size={18} />
          Modules & Lessons
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={18} />
          Course Settings
        </button>
      </div>

      <div className="manager-content">
        {activeTab === "modules" && (
          <div className="modules-section">
            <div className="section-header">
              <h2>Course Modules</h2>
              <button className="add-btn" onClick={() => setShowAddModule(true)}>
                <Plus size={18} />
                Add Module
              </button>
            </div>

            {/* Add Module Form */}
            {showAddModule && (
              <div className="add-form-container">
                <div className="form-card">
                  <h3>Add New Module</h3>
                  <div className="form-group">
                    <label>Module Title</label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      placeholder="Enter module title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      placeholder="Enter module description"
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setShowAddModule(false)}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={handleAddModule}>
                      Add Module
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modules List */}
            <div className="modules-list">
              {courseContent.modules.map((module) => (
                <div key={module.id} className="module-card">
                  <div className="module-header">
                    <button className="expand-btn" onClick={() => toggleModuleExpansion(module.id)}>
                      {expandedModules.includes(module.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div className="module-info">
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                      <span className="lesson-count">{module.lessons.length} lessons</span>
                    </div>
                    <div className="module-actions">
                      <button className="action-icon" onClick={() => setEditingModule(module.id)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="action-icon delete" onClick={() => handleDeleteModule(module.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {expandedModules.includes(module.id) && (
                    <div className="module-content">
                      <div className="lessons-header">
                        <h4>Lessons</h4>
                        <button className="add-lesson-btn" onClick={() => setShowAddLesson(module.id)}>
                          <Plus size={16} />
                          Add Lesson
                        </button>
                      </div>

                      {/* Add Lesson Form */}
                      {showAddLesson === module.id && (
                        <div className="lesson-form-container">
                          <div className="lesson-form">
                            <h4>Add New Lesson</h4>
                            {/* Basic Lesson Info */}
                            <div className="form-section">
                              <h5>Basic Information</h5>
                              <div className="form-row">
                                <div className="form-group">
                                  <label>Lesson Title</label>
                                  <input
                                    type="text"
                                    value={lessonForm.title}
                                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    placeholder="Enter lesson title"
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Type</label>
                                  <select
                                    value={lessonForm.type}
                                    onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                                  >
                                    <option value="video">Video Lesson</option>
                                    <option value="quiz">Assessment/Quiz</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label>Duration</label>
                                  <input
                                    type="text"
                                    value={lessonForm.duration}
                                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                    placeholder="e.g., 15:30"
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Description</label>
                                <textarea
                                  value={lessonForm.description}
                                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                  placeholder="Enter lesson description"
                                  rows={2}
                                />
                              </div>
                              {lessonForm.type === "video" && (
                                <div className="form-group">
                                  <label>Video URL</label>
                                  <input
                                    type="text"
                                    value={lessonForm.videoUrl}
                                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                    placeholder="Enter video URL or upload path"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Lesson Content */}
                            {lessonForm.type === "video" && (
                              <div className="form-section">
                                <h5>Lesson Content</h5>
                                <div className="form-group">
                                  <label>Overview</label>
                                  <textarea
                                    value={lessonForm.content.overview}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        content: { ...lessonForm.content, overview: e.target.value },
                                      })
                                    }
                                    placeholder="Enter lesson overview"
                                    rows={3}
                                  />
                                </div>

                                {/* Learning Objectives */}
                                <div className="form-group">
                                  <label>Learning Objectives</label>
                                  {lessonForm.content.learningObjectives.map((objective, index) => (
                                    <div key={index} className="objective-input">
                                      <input
                                        type="text"
                                        value={objective}
                                        onChange={(e) => {
                                          const newObjectives = [...lessonForm.content.learningObjectives]
                                          newObjectives[index] = e.target.value
                                          setLessonForm({
                                            ...lessonForm,
                                            content: { ...lessonForm.content, learningObjectives: newObjectives },
                                          })
                                        }}
                                        placeholder="Enter learning objective"
                                      />
                                      <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeLearningObjective(index)}
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  ))}
                                  <button type="button" className="add-item-btn" onClick={addLearningObjective}>
                                    <Plus size={16} />
                                    Add Objective
                                  </button>
                                </div>

                                {/* Key Points */}
                                <div className="form-group">
                                  <label>Key Points</label>
                                  {lessonForm.content.keyPoints.map((point, pointIndex) => (
                                    <div key={pointIndex} className="key-point-section">
                                      <div className="key-point-header">
                                        <input
                                          type="text"
                                          value={point.title}
                                          onChange={(e) => {
                                            const newPoints = [...lessonForm.content.keyPoints]
                                            newPoints[pointIndex].title = e.target.value
                                            setLessonForm({
                                              ...lessonForm,
                                              content: { ...lessonForm.content, keyPoints: newPoints },
                                            })
                                          }}
                                          placeholder="Key point title"
                                        />
                                        <button
                                          type="button"
                                          className="remove-btn"
                                          onClick={() => removeKeyPoint(pointIndex)}
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                      <textarea
                                        value={point.content}
                                        onChange={(e) => {
                                          const newPoints = [...lessonForm.content.keyPoints]
                                          newPoints[pointIndex].content = e.target.value
                                          setLessonForm({
                                            ...lessonForm,
                                            content: { ...lessonForm.content, keyPoints: newPoints },
                                          })
                                        }}
                                        placeholder="Key point content"
                                        rows={2}
                                      />
                                      <div className="bullets-section">
                                        <label>Bullet Points</label>
                                        {point.bullets.map((bullet, bulletIndex) => (
                                          <div key={bulletIndex} className="bullet-input">
                                            <input
                                              type="text"
                                              value={bullet}
                                              onChange={(e) => {
                                                const newPoints = [...lessonForm.content.keyPoints]
                                                newPoints[pointIndex].bullets[bulletIndex] = e.target.value
                                                setLessonForm({
                                                  ...lessonForm,
                                                  content: { ...lessonForm.content, keyPoints: newPoints },
                                                })
                                              }}
                                              placeholder="Enter bullet point"
                                            />
                                            <button
                                              type="button"
                                              className="remove-btn"
                                              onClick={() => removeBulletPoint(pointIndex, bulletIndex)}
                                            >
                                              <X size={16} />
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          type="button"
                                          className="add-item-btn small"
                                          onClick={() => addBulletPoint(pointIndex)}
                                        >
                                          <Plus size={14} />
                                          Add Bullet
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <button type="button" className="add-item-btn" onClick={addKeyPoint}>
                                    <Plus size={16} />
                                    Add Key Point
                                  </button>
                                </div>

                                {/* Code Example */}
                                <div className="form-group">
                                  <label>Code Example (Optional)</label>
                                  <input
                                    type="text"
                                    value={lessonForm.content.codeExample.title}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        content: {
                                          ...lessonForm.content,
                                          codeExample: { ...lessonForm.content.codeExample, title: e.target.value },
                                        },
                                      })
                                    }
                                    placeholder="Code example title"
                                  />
                                  <textarea
                                    value={lessonForm.content.codeExample.code}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        content: {
                                          ...lessonForm.content,
                                          codeExample: { ...lessonForm.content.codeExample, code: e.target.value },
                                        },
                                      })
                                    }
                                    placeholder="Enter code example"
                                    rows={6}
                                    className="code-textarea"
                                  />
                                </div>

                                {/* Summary */}
                                <div className="form-group">
                                  <label>Summary</label>
                                  <textarea
                                    value={lessonForm.content.summary}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        content: { ...lessonForm.content, summary: e.target.value },
                                      })
                                    }
                                    placeholder="Enter lesson summary"
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Quiz Questions */}
                            {lessonForm.type === "quiz" && (
                              <div className="form-section">
                                <h5>Assessment Questions</h5>
                                {lessonForm.questions.map((question, questionIndex) => (
                                  <div key={questionIndex} className="question-section">
                                    <div className="question-header">
                                      <h6>Question {questionIndex + 1}</h6>
                                      <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeQuestion(questionIndex)}
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                    <div className="form-group">
                                      <label>Question Text</label>
                                      <textarea
                                        value={question.question}
                                        onChange={(e) => {
                                          const newQuestions = [...lessonForm.questions]
                                          newQuestions[questionIndex].question = e.target.value
                                          setLessonForm({ ...lessonForm, questions: newQuestions })
                                        }}
                                        placeholder="Enter question text"
                                        rows={2}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label>Answer Options</label>
                                      {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="option-input">
                                          <input
                                            type="radio"
                                            name={`correct-${questionIndex}`}
                                            checked={question.correct === optionIndex}
                                            onChange={() => {
                                              const newQuestions = [...lessonForm.questions]
                                              newQuestions[questionIndex].correct = optionIndex
                                              setLessonForm({ ...lessonForm, questions: newQuestions })
                                            }}
                                          />
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                              const newQuestions = [...lessonForm.questions]
                                              newQuestions[questionIndex].options[optionIndex] = e.target.value
                                              setLessonForm({ ...lessonForm, questions: newQuestions })
                                            }}
                                            placeholder={`Option ${optionIndex + 1}`}
                                          />
                                          <span className="correct-indicator">
                                            {question.correct === optionIndex ? "✓ Correct" : ""}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="form-group">
                                      <label>Explanation (Optional)</label>
                                      <textarea
                                        value={question.explanation}
                                        onChange={(e) => {
                                          const newQuestions = [...lessonForm.questions]
                                          newQuestions[questionIndex].explanation = e.target.value
                                          setLessonForm({ ...lessonForm, questions: newQuestions })
                                        }}
                                        placeholder="Explain why this is the correct answer"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button type="button" className="add-item-btn" onClick={addQuestion}>
                                  <Plus size={16} />
                                  Add Question
                                </button>
                              </div>
                            )}

                            <div className="form-actions">
                              <button className="btn-secondary" onClick={() => setShowAddLesson(null)}>
                                Cancel
                              </button>
                              <button className="btn-primary" onClick={() => handleAddLesson(module.id)}>
                                Add Lesson
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lessons List */}
                      <div className="lessons-list">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="lesson-item">
                            <div className="lesson-icon">
                              {lesson.type === "video" ? <Video size={16} /> : <HelpCircle size={16} />}
                            </div>
                            <div className="lesson-info">
                              <h5>{lesson.title}</h5>
                              <p>{lesson.description}</p>
                              <div className="lesson-meta">
                                <span className="lesson-type">{lesson.type}</span>
                                <span className="lesson-duration">{lesson.duration}</span>
                              </div>
                            </div>
                            <div className="lesson-actions">
                              <button className="action-icon" onClick={() => setEditingLesson(lesson.id)}>
                                <Edit3 size={14} />
                              </button>
                              <button
                                className="action-icon"
                                onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className="action-icon delete"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>Course Settings</h3>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={courseContent.title}
                  onChange={(e) => setCourseContent({ ...courseContent, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Course Description</label>
                <textarea
                  value={courseContent.description}
                  onChange={(e) => setCourseContent({ ...courseContent, description: e.target.value })}
                  rows={4}
                />
              </div>
              <button className="btn-primary" onClick={handleSaveCourse}>
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseContentManager
