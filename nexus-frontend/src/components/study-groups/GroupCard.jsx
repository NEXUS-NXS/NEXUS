"use client"

import { useState } from "react"
import { Users, Calendar, MessageSquare, Lock, Crown, Settings } from "lucide-react"
import { useUser } from "../../context/UserContext"
import axios from "axios"
import "./GroupCard.css"

const GroupCard = ({ group, onJoin, onLeave, onViewDetails, currentUser, showManageButton = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return "No upcoming sessions"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return "No recent activity"
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    return diffInHours < 1 ? "Just now" : diffInHours < 24 ? `${diffInHours}h ago` : `${Math.floor(diffInHours / 24)}d ago`
  }

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    return parts.length === 2 ? parts.pop().split(";").shift() : null
  }

  const isOwner = group.owner?.id === currentUser?.chat_user_id
  console.log(isOwner)

  const isMember = Array.isArray(group.members)
    ? group.members.some((m) => m.user.id === currentUser?.chat_user_id)
    : false

  const isFull = group.members?.length >= group.max_members

  // const isOwner = group.owner?.id === currentUser?.chat_user_id
  // const isMember = group.memberships?.some(m => m.user.id === currentUser?.chat_user_id)
  // const isFull = group.memberships?.length >= group.max_members

  // Add console.log to debug isMember
  console.log(`GroupCard (group id: ${group.id}): isMember=${isMember}, currentUser.chat_user_id=${currentUser?.chat_user_id}, memberships=`, group.memberships)

  const handleJoinGroup = async () => {
    if (!currentUser) {
      setError("Please log in")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const result = await onJoin(group.id)
      if (!result.success) {
        setError(result.error?.detail || "Failed to join group")
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to join group")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveGroup = async () => {
    if (!currentUser) {
      setError("Please log in")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const result = await onLeave(group.id)
      if (!result.success) {
        setError(result.error?.detail || "Failed to leave group")
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to leave group")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="group-card">
      <div className="group-card-header">
        <div className="group-avatar">
          <img
            src={group.icon || "/placeholder.svg"}
            alt={group.name}
            onError={(e) => (e.target.src = "/placeholder.svg")}
          />
          {group.status === "PRIVATE" && (
            <div className="private-badge">
              <Lock size={12} />
            </div>
          )}
        </div>
        <div className="group-info">
          <h3 className="group-name" onClick={() => onViewDetails(group)}>
            {group.name}
          </h3>
          <div className="group-owner">
            {isOwner && <Crown size={14} className="owner-icon" />}
            <span>by {group.owner?.chat_username}</span>
          </div>
        </div>
        {showManageButton && (
          <button className="manage-btn">
            <Settings size={16} />
          </button>
        )}
      </div>

      <p className="group-description">{group.description}</p>

      <div className="group-tags">
        {group.tags?.map((tag, index) => (
          <span key={index} className="tag">
            {tag.name}
          </span>
        ))}
      </div>

      <div className="group-stats">
        <div className="stat">
          <Users size={16} />
          <span>{group.members?.length || 0}/{group.max_members}</span>

        </div>
        <div className="stat">
          <Calendar size={16} />
          <span>{formatDate(group.next_session)}</span>
        </div>
        <div className="stat">
          <MessageSquare size={16} />
          <span>{getTimeAgo(group.last_message_timestamp)}</span>
        </div>
      </div>

      <div className="group-actions">
        {error && <p className="error">{error}</p>}
        <button className="view-details-btn" onClick={() => onViewDetails(group)}>
          View Details
        </button>
        {isMember ? (
          <button className="leave-btn" onClick={handleLeaveGroup} disabled={isLoading}>
            {isLoading ? "Leaving..." : "Leave Group"}
          </button>
        ) : (
          <button
            className={`join-btn ${isFull ? "disabled" : ""}`}
            onClick={handleJoinGroup}
            disabled={isFull || isLoading}
          >
            {isLoading ? "Joining..." : isFull ? "Full" : "Join Group"}
          </button>
        )}
      </div>
    </div>
  )
}

export default GroupCard