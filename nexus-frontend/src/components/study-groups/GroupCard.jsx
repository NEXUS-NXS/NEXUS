"use client"

import { Users, Calendar, MessageSquare, Lock, Crown, Settings } from "lucide-react"
import "./GroupCard.css"

const GroupCard = ({ group, onJoin, onLeave, onViewDetails, currentUser, showManageButton = false }) => {
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

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const isOwner = group.owner?.id === currentUser?.chat_user_id
  const isMember = group.memberships?.some(m => m.user.id === currentUser?.chat_user_id)
  const isFull = group.memberships?.length >= group.max_members

  return (
    <div className="group-card">
      <div className="group-card-header">
        <div className="group-avatar">
          <img 
            src={group.icon || "/placeholder.svg"} 
            alt={group.name} 
            onError={(e) => { e.target.src = "/placeholder.svg" }}
          />
          {group.status === 'PRIVATE' && (
            <div className="private-badge">
              <Lock size={12} />
            </div>
          )}
        </div>
        <div className="group-info">
          <h3 className="group-name">{group.name}</h3>
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
          <span>
            {group.memberships?.length || 0}/{group.max_members}
          </span>
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
        <button className="view-details-btn" onClick={onViewDetails}>
          View Details
        </button>
        {isMember ? (
          <button className="leave-btn" onClick={onLeave}>
            Leave Group
          </button>
        ) : (
          <button 
            className={`join-btn ${isFull ? "disabled" : ""}`} 
            onClick={onJoin} 
            disabled={isFull}
          >
            {isFull ? "Full" : "Join Group"}
          </button>
        )}
      </div>
    </div>
  )
}

export default GroupCard