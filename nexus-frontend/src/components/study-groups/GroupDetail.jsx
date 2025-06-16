"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Crown,
  Lock,
  Globe,
  Send,
  Paperclip,
  Video,
  MoreVertical,
} from "lucide-react"
import "./GroupDetail.css"
import GroupSettingsModal from "./GroupSettingsModal"

const GroupDetail = ({ group, onBack, onLeave, currentUser }) => {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      userId: "user123",
      message: "Hey everyone! Ready for today's study session?",
      timestamp: "2024-01-11T10:30:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      user: "Mike Chen",
      userId: "user456",
      message: "Yes! I've prepared some practice problems for probability distributions.",
      timestamp: "2024-01-11T10:32:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      user: "Emily Rodriguez",
      userId: "user789",
      message: "Great! I'll share my notes on conditional probability.",
      timestamp: "2024-01-11T10:35:00Z",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  const [members] = useState([
    {
      id: "user123",
      name: "Sarah Johnson",
      role: "owner",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinDate: "2024-01-01",
    },
    {
      id: "user456",
      name: "Mike Chen",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinDate: "2024-01-02",
    },
    {
      id: "user789",
      name: "Emily Rodriguez",
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      joinDate: "2024-01-03",
    },
    {
      id: "user101",
      name: "David Kim",
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      joinDate: "2024-01-04",
    },
  ])

  const [upcomingSessions] = useState([
    {
      id: 1,
      title: "Probability Distributions Review",
      date: "2024-01-15T18:00:00Z",
      duration: "2 hours",
      type: "study",
      organizer: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Mock Exam Practice",
      date: "2024-01-17T19:00:00Z",
      duration: "3 hours",
      type: "exam",
      organizer: "Mike Chen",
    },
  ])

  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const isOwner = group.ownerId === currentUser?.id

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      user: currentUser.name,
      userId: currentUser.id,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatSessionDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="group-detail-page">
      <div className="group-detail-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Groups
        </button>

        <div className="group-header-info">
          <div className="group-avatar-large">
            <img src={group.avatar || "/placeholder.svg"} alt={group.name} />
            {group.isPrivate && (
              <div className="privacy-badge">
                <Lock size={16} />
              </div>
            )}
          </div>

          <div className="group-details">
            <h1>{group.name}</h1>
            <p className="group-description">{group.description}</p>
            <div className="group-meta">
              <span className="member-count">
                <Users size={16} />
                {group.members} members
              </span>
              <span className="privacy-status">
                {group.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                {group.isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>

          <div className="group-actions">
            <button className="video-call-btn">
              <Video size={16} />
              Start Call
            </button>
            {isOwner ? (
              <button className="settings-btn" onClick={() => setShowSettingsModal(true)}>
                <Settings size={16} />
                Settings
              </button>
            ) : (
              <button className="leave-group-btn" onClick={onLeave}>
                Leave Group
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="group-detail-tabs">
        <button className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          <MessageSquare size={16} />
          Chat
        </button>
        <button
          className={`tab-btn ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <Users size={16} />
          Members
        </button>
        <button
          className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          <Calendar size={16} />
          Sessions
        </button>
      </div>

      <div className="group-detail-content">
        {activeTab === "chat" && (
          <div className="chat-tab">
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.userId === currentUser.id ? "own-message" : ""}`}>
                  <div className="message-avatar">
                    <img src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-user">{msg.user}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="message-text">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <div className="chat-input-container">
                <button type="button" className="attachment-btn">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                />
                <button type="submit" className="send-btn" disabled={!message.trim()}>
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-tab">
            <div className="members-header">
              <h3>Members ({members.length})</h3>
              {isOwner && (
                <button className="invite-btn">
                  <Users size={16} />
                  Invite Members
                </button>
              )}
            </div>

            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <div className={`status-indicator ${member.status}`}></div>
                  </div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.name}
                      {member.role === "owner" && <Crown size={14} className="role-icon owner" />}
                      {member.role === "admin" && <Settings size={14} className="role-icon admin" />}
                    </div>
                    <div className="member-details">
                      <span className="member-role">{member.role}</span>
                      <span className="join-date">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {isOwner && member.id !== currentUser.id && (
                    <button className="member-options">
                      <MoreVertical size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="sessions-tab">
            <div className="sessions-header">
              <h3>Upcoming Sessions</h3>
              {isOwner && (
                <button className="schedule-btn">
                  <Calendar size={16} />
                  Schedule Session
                </button>
              )}
            </div>

            <div className="sessions-list">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <h4>{session.title}</h4>
                    <div className="session-details">
                      <span className="session-date">
                        <Calendar size={14} />
                        {formatSessionDate(session.date)}
                      </span>
                      <span className="session-duration">Duration: {session.duration}</span>
                      <span className="session-organizer">Organized by {session.organizer}</span>
                    </div>
                  </div>
                  <div className="session-actions">
                    <button className="join-session-btn">Join Session</button>
                  </div>
                </div>
              ))}
            </div>

            {upcomingSessions.length === 0 && (
              <div className="no-sessions">
                <p>No upcoming sessions scheduled.</p>
                {isOwner && (
                  <button className="schedule-first-btn">
                    <Calendar size={16} />
                    Schedule First Session
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showSettingsModal && (
        <GroupSettingsModal
          group={group}
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onUpdateGroup={(updatedGroup) => {
            // Handle group update logic here
            console.log("Updated group:", updatedGroup)
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

export default GroupDetail
