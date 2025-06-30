"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, BookOpen, Users, Target } from "lucide-react"
import "./CreateCourse.css"

const CreateCourse = () => {
  const navigate = useNavigate()
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    estimatedDuration: "",
    learningObjectives: [""],
    prerequisites: [""],
    tags: "",
    instructor: {
      name: "",
      email: "",
      bio: "",
      expertise: [""],
      experience: "",
      profileImage: "",
      socialLinks: {
        linkedin: "",
        twitter: "",
        website: "",
      },
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Programming",
    "Data Science",
    "Business",
    "Design",
    "Marketing",
    "Finance",
    "Actuarial Science",
    "Mathematics",
    "Other",
  ]

  const difficulties = [
    { value: "beginner", label: "Beginner", color: "#48bb78" },
    { value: "intermediate", label: "Intermediate", color: "#ed8936" },
    { value: "advanced", label: "Advanced", color: "#f56565" },
  ]

  const addLearningObjective = () => {
    setCourseForm((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }))
  }

  const removeLearningObjective = (index) => {
    setCourseForm((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
    }))
  }

  const updateLearningObjective = (index, value) => {
    setCourseForm((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => (i === index ? value : obj)),
    }))
  }

  const addPrerequisite = () => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""],
    }))
  }

  const removePrerequisite = (index) => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }))
  }

  const updatePrerequisite = (index, value) => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.map((req, i) => (i === index ? value : req)),
    }))
  }

  const addExpertise = () => {
    setCourseForm((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        expertise: [...prev.instructor.expertise, ""],
      },
    }))
  }

  const removeExpertise = (index) => {
    setCourseForm((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        expertise: prev.instructor.expertise.filter((_, i) => i !== index),
      },
    }))
  }

  const updateExpertise = (index, value) => {
    setCourseForm((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        expertise: prev.instructor.expertise.map((exp, i) => (i === index ? value : exp)),
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!courseForm.title.trim() || !courseForm.description.trim() || !courseForm.instructor.name.trim()) {
      alert("Please fill in the required fields (Title, Description, and Instructor Name)")
      return
    }

    setIsSubmitting(true)

    try {
      // Create new course object
      const newCourse = {
        id: Date.now().toString(),
        ...courseForm,
        learningObjectives: courseForm.learningObjectives.filter((obj) => obj.trim()),
        prerequisites: courseForm.prerequisites.filter((req) => req.trim()),
        instructor: {
          ...courseForm.instructor,
          expertise: courseForm.instructor.expertise.filter((exp) => exp.trim()),
        },
        tags: courseForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [],
        status: "draft",
        totalLessons: 0,
        totalDuration: 0,
      }

      // Save to localStorage
      const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]")
      const updatedCourses = [...existingCourses, newCourse]
      localStorage.setItem("courses", JSON.stringify(updatedCourses))

      // Also save the individual course
      localStorage.setItem(`course_${newCourse.id}`, JSON.stringify(newCourse))

      // Navigate to course content manager - FIXED TO MATCH YOUR ROUTE
      navigate("/add-course")
    } catch (error) {
      console.error("Error creating course:", error)
      alert("Error creating course. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-course-container">
      <div className="create-course-header">
        <div className="header-content">
          <h1>Create New Course</h1>
          <p>Build an engaging learning experience for your students</p>
        </div>
      </div>

      <div className="create-course-content">
        <form onSubmit={handleSubmit} className="course-form">
          {/* Basic Information */}
          <div className="form-section">
            <div className="section-header">
              <BookOpen size={20} />
              <h2>Basic Information</h2>
            </div>

            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Course Description *</label>
              <textarea
                id="description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Describe what students will learn in this course"
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                  id="difficulty"
                  value={courseForm.difficulty}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                >
                  {difficulties.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Estimated Duration</label>
                <input
                  type="text"
                  id="duration"
                  value={courseForm.estimatedDuration}
                  onChange={(e) => setCourseForm({ ...courseForm, estimatedDuration: e.target.value })}
                  placeholder="e.g., 4 weeks, 20 hours"
                />
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="form-section">
            <div className="section-header">
              <Target size={20} />
              <h2>Learning Objectives</h2>
            </div>

            <p className="section-description">What will students be able to do after completing this course?</p>

            {courseForm.learningObjectives.map((objective, index) => (
              <div key={index} className="dynamic-input">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateLearningObjective(index, e.target.value)}
                  placeholder={`Learning objective ${index + 1}`}
                />
                {courseForm.learningObjectives.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeLearningObjective(index)}>
                    ×
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="add-item-btn" onClick={addLearningObjective}>
              <Plus size={16} />
              Add Learning Objective
            </button>
          </div>

          {/* Prerequisites */}
          <div className="form-section">
            <div className="section-header">
              <Users size={20} />
              <h2>Prerequisites</h2>
            </div>

            <p className="section-description">What should students know before taking this course?</p>

            {courseForm.prerequisites.map((prerequisite, index) => (
              <div key={index} className="dynamic-input">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  placeholder={`Prerequisite ${index + 1}`}
                />
                {courseForm.prerequisites.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removePrerequisite(index)}>
                    ×
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="add-item-btn" onClick={addPrerequisite}>
              <Plus size={16} />
              Add Prerequisite
            </button>
          </div>

          {/* Instructor Details */}
          <div className="form-section">
            <div className="section-header">
              <Users size={20} />
              <h2>Instructor Details</h2>
            </div>

            <p className="section-description">Provide information about the course instructor</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="instructorName">Instructor Name *</label>
                <input
                  type="text"
                  id="instructorName"
                  value={courseForm.instructor.name}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      instructor: { ...courseForm.instructor, name: e.target.value },
                    })
                  }
                  placeholder="Enter instructor name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="instructorEmail">Email</label>
                <input
                  type="email"
                  id="instructorEmail"
                  value={courseForm.instructor.email}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      instructor: { ...courseForm.instructor, email: e.target.value },
                    })
                  }
                  placeholder="instructor@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <input
                  type="text"
                  id="experience"
                  value={courseForm.instructor.experience}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      instructor: { ...courseForm.instructor, experience: e.target.value },
                    })
                  }
                  placeholder="e.g., 5+ years"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="instructorBio">Instructor Bio</label>
              <textarea
                id="instructorBio"
                value={courseForm.instructor.bio}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    instructor: { ...courseForm.instructor, bio: e.target.value },
                  })
                }
                placeholder="Brief description of the instructor's background and qualifications"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profileImage">Profile Image URL</label>
              <input
                type="url"
                id="profileImage"
                value={courseForm.instructor.profileImage}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    instructor: { ...courseForm.instructor, profileImage: e.target.value },
                  })
                }
                placeholder="https://example.com/profile-image.jpg"
              />
            </div>

            {/* Areas of Expertise */}
            <div className="form-group">
              <label>Areas of Expertise</label>
              <p className="field-description">What are the instructor's main areas of expertise?</p>

              {courseForm.instructor.expertise.map((expertise, index) => (
                <div key={index} className="dynamic-input">
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => updateExpertise(index, e.target.value)}
                    placeholder={`Area of expertise ${index + 1}`}
                  />
                  {courseForm.instructor.expertise.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeExpertise(index)}>
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="add-item-btn" onClick={addExpertise}>
                <Plus size={16} />
                Add Expertise Area
              </button>
            </div>

            {/* Social Links */}
            <div className="form-group">
              <label>Social Links (Optional)</label>
              <div className="social-links-grid">
                <div className="form-group">
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    type="url"
                    id="linkedin"
                    value={courseForm.instructor.socialLinks.linkedin}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        instructor: {
                          ...courseForm.instructor,
                          socialLinks: { ...courseForm.instructor.socialLinks, linkedin: e.target.value },
                        },
                      })
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="twitter">Twitter</label>
                  <input
                    type="url"
                    id="twitter"
                    value={courseForm.instructor.socialLinks.twitter}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        instructor: {
                          ...courseForm.instructor,
                          socialLinks: { ...courseForm.instructor.socialLinks, twitter: e.target.value },
                        },
                      })
                    }
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    value={courseForm.instructor.socialLinks.website}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        instructor: {
                          ...courseForm.instructor,
                          socialLinks: { ...courseForm.instructor.socialLinks, website: e.target.value },
                        },
                      })
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                value={courseForm.tags}
                onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                placeholder="Enter tags separated by commas (e.g., python, data analysis, statistics)"
              />
              <small>Separate tags with commas to help students find your course</small>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse
