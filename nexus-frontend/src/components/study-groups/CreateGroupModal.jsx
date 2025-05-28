"use client"

import { useState } from "react"
import { X, Lock, Globe } from "lucide-react"
import "./CreateGroupModal.css"

const CreateGroupModal = ({ onClose, onCreateGroup }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "exam-prep",
    examType: "all",
    maxMembers: 20,
    isPrivate: false,
    tags: "",
  })

  const [errors, setErrors] = useState({})

  const categories = [
    { id: "exam-prep", name: "Exam Preparation" },
    { id: "study-sessions", name: "Study Sessions" },
    { id: "project-groups", name: "Project Groups" },
    { id: "discussion", name: "Discussion Groups" },
  ]

  const examTypes = [
    { id: "all", name: "All Exams" },
    { id: "soa-p", name: "SOA Exam P" },
    { id: "soa-fm", name: "SOA Exam FM" },
    { id: "soa-ifm", name: "SOA Exam IFM" },
    { id: "soa-ltam", name: "SOA Exam LTAM" },
    { id: "soa-stam", name: "SOA Exam STAM" },
    { id: "cas-1", name: "CAS Exam 1" },
    { id: "cas-2", name: "CAS Exam 2" },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
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

    if (formData.maxMembers < 2) {
      newErrors.maxMembers = "Group must allow at least 2 members"
    } else if (formData.maxMembers > 100) {
      newErrors.maxMembers = "Group cannot exceed 100 members"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const groupData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    }

    onCreateGroup(groupData)
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
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="examType">Exam Focus</label>
              <select id="examType" name="examType" value={formData.examType} onChange={handleInputChange}>
                {examTypes.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="maxMembers">Maximum Members</label>
            <input
              type="number"
              id="maxMembers"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleInputChange}
              min="2"
              max="100"
              className={errors.maxMembers ? "error" : ""}
            />
            {errors.maxMembers && <span className="error-text">{errors.maxMembers}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., Probability, Statistics, SOA"
            />
          </div>

          <div className="privacy-section">
            <div className="privacy-option">
              <input
                type="radio"
                id="public"
                name="privacy"
                checked={!formData.isPrivate}
                onChange={() => setFormData((prev) => ({ ...prev, isPrivate: false }))}
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
                name="privacy"
                checked={formData.isPrivate}
                onChange={() => setFormData((prev) => ({ ...prev, isPrivate: true }))}
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
            <button type="submit" className="create-btn">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGroupModal
