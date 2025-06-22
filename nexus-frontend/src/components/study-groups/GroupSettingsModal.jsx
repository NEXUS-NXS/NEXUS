"use client"

import { useState, useRef } from "react"
import {
  X,
  Users,
  Settings,
  UserPlus,
  Camera,
  Globe,
  Lock,
  Hash,
  Trash2,
  Check,
  Crown,
  Shield,
  User,
  Search,
  Plus,
  Minus,
  Save,
} from "lucide-react"
import "./GroupSettingsModal.css"

const GroupSettingsModal = ({ group, isOpen, onClose, onUpdateGroup, currentUser }) => {
  const [activeTab, setActiveTab] = useState("requests")
  const [groupData, setGroupData] = useState({
    name: group?.name || "",
    description: group?.description || "",
    isPrivate: group?.isPrivate || false,
    maxMembers: group?.maxMembers || 50,
    tags: group?.tags || ["Probability", "Statistics"],
    avatar: group?.avatar || null,
  })

  const [joinRequests] = useState([
    {
      id: 1,
      user: {
        id: "req1",
        name: "Alex Thompson",
        email: "alex.thompson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "MIT",
        year: "3rd Year",
      },
      message:
        "Hi! I'm really interested in joining this study group. I'm preparing for SOA Exam P and would love to collaborate.",
      requestDate: "2024-01-10T14:30:00Z",
    },
    {
      id: 2,
      user: {
        id: "req2",
        name: "Maria Garcia",
        email: "maria.garcia@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "Stanford",
        year: "2nd Year",
      },
      message: "Looking forward to studying probability theory with like-minded students!",
      requestDate: "2024-01-09T16:45:00Z",
    },
    {
      id: 3,
      user: {
        id: "req3",
        name: "James Wilson",
        email: "james.wilson@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        university: "UCLA",
        year: "4th Year",
      },
      message: "I have experience with actuarial modeling and would like to share knowledge with the group.",
      requestDate: "2024-01-08T11:20:00Z",
    },
  ])

  const [members] = useState([
    {
      id: "user123",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "owner",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinDate: "2024-01-01",
      university: "Harvard",
    },
    {
      id: "user456",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      joinDate: "2024-01-02",
      university: "MIT",
    },
    {
      id: "user789",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      joinDate: "2024-01-03",
      university: "Stanford",
    },
    {
      id: "user101",
      name: "David Kim",
      email: "david.kim@email.com",
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      joinDate: "2024-01-04",
      university: "UC Berkeley",
    },
  ])

  const [newTag, setNewTag] = useState("")
  const [memberSearch, setMemberSearch] = useState("")
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleApproveRequest = (requestId) => {
    console.log("Approving request:", requestId)
    // Add logic to approve join request
  }

  const handleRejectRequest = (requestId) => {
    console.log("Rejecting request:", requestId)
    // Add logic to reject join request
  }

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      console.log("Removing member:", memberId)
      // Add logic to remove member
    }
  }

  const handleChangeRole = (memberId, newRole) => {
    console.log("Changing role:", memberId, newRole)
    // Add logic to change member role
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setGroupData({ ...groupData, avatar: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !groupData.tags.includes(newTag.trim())) {
      setGroupData({
        ...groupData,
        tags: [...groupData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setGroupData({
      ...groupData,
      tags: groupData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSaveSettings = () => {
    onUpdateGroup(groupData)
    onClose()
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "owner":
        return <Crown size={14} className="set-role-icon set-owner" />
      case "admin":
        return <Shield size={14} className="set-role-icon set-admin" />
      default:
        return <User size={14} className="set-role-icon set-member" />
    }
  }

  return (
    <div className="set-group-settings-overlay">
      <div className="set-group-settings-modal">
        <div className="set-modal-header">
          <h2>Group Settings</h2>
          <button className="set-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="set-modal-tabs">
          <button
            className={`set-tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <UserPlus size={16} />
            Join Requests
            {joinRequests.length > 0 && <span className="set-tab-badge">{joinRequests.length}</span>}
          </button>
          <button
            className={`set-tab-btn ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <Users size={16} />
            Members
          </button>
          <button
            className={`set-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        <div className="set-modal-content">
          {activeTab === "requests" && (
            <div className="set-requests-tab">
              <div className="set-tab-header">
                <h3>Pending Join Requests</h3>
                <p className="set-tab-description">Review and manage users who want to join your group</p>
              </div>

              {joinRequests.length === 0 ? (
                <div className="set-empty-state">
                  <UserPlus size={48} />
                  <h4>No pending requests</h4>
                  <p>When users request to join your private group, they'll appear here.</p>
                </div>
              ) : (
                <div className="set-requests-list">
                  {joinRequests.map((request) => (
                    <div key={request.id} className="set-request-item">
                      <div className="set-request-user">
                        <div className="set-user-avatar">
                          <img src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
                        </div>
                        <div className="set-user-info">
                          <h4>{request.user.name}</h4>
                          <p className="set-user-email">{request.user.email}</p>
                          <div className="set-user-details">
                            <span>{request.user.university}</span>
                            <span>{request.user.year}</span>
                          </div>
                        </div>
                      </div>

                      <div className="set-request-message">
                        <p>"{request.message}"</p>
                        <span className="set-request-date">Requested {formatDate(request.requestDate)}</span>
                      </div>

                      <div className="set-request-actions">
                        <button className="set-approve-btn" onClick={() => handleApproveRequest(request.id)}>
                          <Check size={16} />
                          Approve
                        </button>
                        <button className="set-reject-btn" onClick={() => handleRejectRequest(request.id)}>
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="set-members-tab">
              <div className="set-tab-header">
                <h3>Group Members ({members.length})</h3>
                <div className="set-member-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="set-members-list">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="set-member-item">
                    <div className="set-member-user">
                      <div className="set-user-avatar">
                        <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <div className={`set-status-indicator ${member.status}`}></div>
                      </div>
                      <div className="set-user-info">
                        <div className="set-user-name">
                          {member.name}
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="set-user-email">{member.email}</p>
                        <div className="set-user-details">
                          <span>{member.university}</span>
                          <span>Joined {formatDate(member.joinDate)}</span>
                        </div>
                      </div>
                    </div>

                    {member.id !== currentUser?.id && (
                      <div className="set-member-actions">
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="set-role-select"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          {member.role === "owner" && <option value="owner">Owner</option>}
                        </select>
                        <button
                          className="set-remove-btn"
                          onClick={() => handleRemoveMember(member.id)}
                          title="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="set-settings-tab">
              <div className="set-settings-section">
                <h3>Group Information</h3>

                <div className="set-setting-item">
                  <label>Group Icon</label>
                  <div className="set-avatar-upload">
                    <div className="set-current-avatar">
                      <img src={groupData.avatar || "/placeholder.svg"} alt="Group avatar" />
                    </div>
                    <button className="set-upload-btn" onClick={() => fileInputRef.current?.click()}>
                      <Camera size={16} />
                      Change Icon
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                <div className="set-setting-item">
                  <label>Group Name</label>
                  <input
                    type="text"
                    value={groupData.name}
                    onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
                    placeholder="Enter group name"
                  />
                </div>

                <div className="set-setting-item">
                  <label>Description</label>
                  <textarea
                    value={groupData.description}
                    onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
                    placeholder="Describe your group's purpose and goals"
                    rows={4}
                  />
                  <span className="set-char-count">{groupData.description.length}/500</span>
                </div>
              </div>

              <div className="set-settings-section">
                <h3>Privacy & Access</h3>

                <div className="set-setting-item">
                  <div className="set-privacy-toggle">
                    <div className="set-toggle-info">
                      <label>Group Privacy</label>
                      <p>
                        {groupData.isPrivate
                          ? "Private groups require approval to join"
                          : "Public groups allow anyone to join instantly"}
                      </p>
                    </div>
                    <button
                      className={`set-toggle-btn ${groupData.isPrivate ? "private" : "public"}`}
                      onClick={() => setGroupData({ ...groupData, isPrivate: !groupData.isPrivate })}
                    >
                      {groupData.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                      {groupData.isPrivate ? "Private" : "Public"}
                    </button>
                  </div>
                </div>

                <div className="set-setting-item">
                  <label>Maximum Members</label>
                  <div className="set-member-limit">
                    <button
                      className="set-limit-btn"
                      onClick={() => setGroupData({ ...groupData, maxMembers: Math.max(5, groupData.maxMembers - 5) })}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="set-limit-value">{groupData.maxMembers}</span>
                    <button
                      className="set-limit-btn"
                      onClick={() =>
                        setGroupData({ ...groupData, maxMembers: Math.min(200, groupData.maxMembers + 5) })
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="set-limit-note">Current members: {members.length}</p>
                </div>
              </div>

              <div className="set-settings-section">
                <h3>Tags & Topics</h3>

                <div className="set-setting-item">
                  <label>Study Topics</label>
                  <div className="set-tags-container">
                    {groupData.tags.map((tag, index) => (
                      <div key={index} className="set-tag-item">
                        <Hash size={12} />
                        {tag}
                        <button className="set-remove-tag" onClick={() => handleRemoveTag(tag)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="set-add-tag">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a topic tag"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <button className="set-add-tag-btn" onClick={handleAddTag}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="set-settings-actions">
                <button className="set-cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button className="set-save-btn" onClick={handleSaveSettings}>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupSettingsModal
