"use client"

import { useState, useEffect } from "react"
import { X, Lock, Globe } from "lucide-react"
import axios from "axios"
import { useUser } from "../../context/UserContext"
import "./CreateGroupModal.css"

const CreateGroupModal = ({ onClose, onCreateGroup }) => {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: 1,
    exam_focus_id: 1,
    max_members: 10,
    status: "PUBLIC",
    tag_ids: [],
  })

  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [examFocuses, setExamFocuses] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch dropdown data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, examFocusRes, tagsRes] = await Promise.all([
          axios.get("https://127.0.0.1:8000/chats/categories/", { withCredentials: true }),
          axios.get("https://127.0.0.1:8000/chats/exam-focus/", { withCredentials: true }),
          axios.get("https://127.0.0.1:8000/chats/tags/", { withCredentials: true }),
        ])

        setCategories(categoriesRes.data.map(cat => ({
          id: cat.id,
          name: cat.name.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        })))
        setExamFocuses(examFocusRes.data.map(exam => ({
          id: exam.id,
          name: exam.name.replace("_", " ")
        })))
        setTags(tagsRes.data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error)
        setErrors({ fetch: "Failed to load options. Please try again." })
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleTagChange = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId]
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Group name must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (formData.max_members < 2) {
      newErrors.max_members = "Group must allow at least 2 members"
    } else if (formData.max_members > 100) {
      newErrors.max_members = "Group cannot exceed 100 members"
    }

    if (formData.tag_ids.length === 0) {
      newErrors.tag_ids = "At least one tag is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Fetch CSRF token
      const csrfToken = await axios.get("https://127.0.0.1:8000/auth/csrf/", {
        withCredentials: true,
      }).then(() => {
        const cookie = document.cookie
          .split("; ")
          .find(row => row.startsWith("csrftoken="))
          ?.split("=")[1]
        return cookie
      })

      if (!csrfToken) {
        throw new Error("CSRF token not found")
      }

      // Map form data to backend format
      const payload = {
        name: formData.name,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        exam_focus_id: parseInt(formData.exam_focus_id),
        max_members: formData.max_members,
        status: formData.status,
        tag_ids: formData.tag_ids,
      }

      const response = await axios.post(
        "https://127.0.0.1:8000/chats/groups/",
        payload,
        {
          headers: { "X-CSRFToken": csrfToken },
          withCredentials: true,
        }
      )

      onCreateGroup(response.data)
      onClose()
    } catch (error) {
      console.error("Group creation failed:", error)
      setErrors({
        submit: error.response?.data?.detail || "Failed to create group. Please try again."
      })
    }
  }

  if (loading) {
    return <div className="modal-overlay">Loading...</div>
  }

  return (
    <div className="modal-overlay">
      <div className="create-group-modal">
        <div className="modal-header">
          <h2>Create Study Group</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-group-form">
          {errors.submit && <span className="error-text form-error">{errors.submit}</span>}

          <div className="form-group">
            <label htmlFor="name">Group Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter group name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your study group's purpose and goals"
              rows={4}
              className={errors.description ? "error" : ""}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="exam_focus_id">Exam Focus</label>
              <select
                id="exam_focus_id"
                name="exam_focus_id"
                value={formData.exam_focus_id}
                onChange={handleInputChange}
              >
                {examFocuses.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="max_members">Maximum Members</label>
            <input
              type="number"
              id="max_members"
              name="max_members"
              value={formData.max_members}
              onChange={handleInputChange}
              min="2"
              max="100"
              className={errors.max_members ? "error" : ""}
            />
            {errors.max_members && <span className="error-text">{errors.max_members}</span>}
          </div>

          <div className="form-group">
            <label>Tags *</label>
            <div className="tags-container">
              {tags.map((tag) => (
                <label key={tag.id} className="tag-label">
                  <input
                    type="checkbox"
                    checked={formData.tag_ids.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
            {errors.tag_ids && <span className="error-text">{errors.tag_ids}</span>}
          </div>

          <div className="privacy-section">
            <div className="privacy-option">
              <input
                type="radio"
                id="public"
                name="status"
                checked={formData.status === "PUBLIC"}
                onChange={() => setFormData((prev) => ({ ...prev, status: "PUBLIC" }))}
              />
              <label htmlFor="public" className="privacy-label">
                <Globe size={16} />
                <div>
                  <strong>Public Group</strong>
                  <p>Anyone can find and join this group</p>
                </div>
              </label>
            </div>

            <div className="privacy-option">
              <input
                type="radio"
                id="private"
                name="status"
                checked={formData.status === "PRIVATE"}
                onChange={() => setFormData((prev) => ({ ...prev, status: "PRIVATE" }))}
              />
              <label htmlFor="private" className="privacy-label">
                <Lock size={16} />
                <div>
                  <strong>Private Group</strong>
                  <p>Only invited members can join</p>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn" disabled={loading}>
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGroupModal