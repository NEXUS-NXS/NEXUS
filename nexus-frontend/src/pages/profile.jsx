"use client"

import { useState, useRef } from "react"
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Shield,
  Bell,
  Palette,
  Globe,
  Download,
  Eye,
  EyeOff,
  Settings,
  Trophy,
  Zap,
  Brain,
  Users,
  BarChart3,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import "./Profile.css"

const Profile = () => {
  const { user, logout } = useUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Aspiring actuary passionate about risk management and statistical modeling. Currently preparing for SOA exams.",
    university: "Columbia University",
    major: "Actuarial Science",
    graduationYear: "2025",
    linkedIn: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  })

  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Handle image upload
        console.log("Image uploaded:", e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save profile data
    console.log("Profile saved:", profileData)
  }

  const achievements = [
    { id: 1, name: "First Course Completed", icon: BookOpen, earned: true, date: "2024-01-15" },
    { id: 2, name: "Study Streak - 7 Days", icon: Zap, earned: true, date: "2024-01-20" },
    { id: 3, name: "Exam P Ready", icon: Trophy, earned: false, progress: 75 },
    { id: 4, name: "Community Helper", icon: Users, earned: true, date: "2024-02-01" },
    { id: 5, name: "Analytics Master", icon: BarChart3, earned: false, progress: 45 },
    { id: 6, name: "Simulation Expert", icon: Brain, earned: false, progress: 30 },
  ]

  const learningStats = [
    { label: "Courses Completed", value: "12", icon: BookOpen, color: "#4F46E5" },
    { label: "Study Hours", value: "156", icon: Clock, color: "#059669" },
    { label: "Certificates Earned", value: "3", icon: Award, color: "#DC2626" },
    { label: "Current Streak", value: "15 days", icon: Zap, color: "#D97706" },
  ]

  const recentActivity = [
    { type: "course", title: "Completed: Advanced Probability Theory", time: "2 hours ago" },
    { type: "achievement", title: "Earned: Study Streak - 14 Days", time: "1 day ago" },
    { type: "simulation", title: "Ran: Monte Carlo Risk Analysis", time: "3 days ago" },
    { type: "group", title: "Joined: SOA Exam P Study Group", time: "1 week ago" },
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "learning", label: "Learning Progress", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="banner-gradient"></div>
        </div>

        <div className="profile-info">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img src="/placeholder.svg?height=120&width=120" alt="Profile" />
              <button className="avatar-edit-btn" onClick={() => fileInputRef.current?.click()}>
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <div className="profile-details">
              <div className="profile-name-section">
                <h1>{profileData.name}</h1>
                <p className="profile-title">Actuarial Science Student</p>
                <div className="profile-location">
                  <MapPin size={14} />
                  <span>{profileData.location}</span>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{user?.points || 750}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Courses</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Certificates</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={16} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            <button className="btn-primary">
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>About Me</h3>
                  {isEditing ? (
                    <div className="edit-form">
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  ) : (
                    <p>{profileData.bio}</p>
                  )}
                </div>

                <div className="overview-card">
                  <h3>Contact Information</h3>
                  <div className="contact-info">
                    <div className="contact-item">
                      <Mail size={16} />
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      ) : (
                        <span>{profileData.email}</span>
                      )}
                    </div>
                    <div className="contact-item">
                      <Phone size={16} />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      ) : (
                        <span>{profileData.phone}</span>
                      )}
                    </div>
                    <div className="contact-item">
                      <MapPin size={16} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                      ) : (
                        <span>{profileData.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Education</h3>
                  <div className="education-info">
                    <div className="education-item">
                      <strong>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.university}
                            onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                          />
                        ) : (
                          profileData.university
                        )}
                      </strong>
                      <p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.major}
                            onChange={(e) => setProfileData({ ...profileData, major: e.target.value })}
                          />
                        ) : (
                          profileData.major
                        )}
                      </p>
                      <span className="graduation-year">
                        Class of{" "}
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.graduationYear}
                            onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                            style={{ width: "60px" }}
                          />
                        ) : (
                          profileData.graduationYear
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Learning Statistics</h3>
                  <div className="learning-stats-grid">
                    {learningStats.map((stat, index) => (
                      <div key={index} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                          <stat.icon size={20} />
                        </div>
                        <div className="stat-content">
                          <span className="stat-number">{stat.value}</span>
                          <span className="stat-text">{stat.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className={`activity-icon ${activity.type}`}>
                          {activity.type === "course" && <BookOpen size={14} />}
                          {activity.type === "achievement" && <Award size={14} />}
                          {activity.type === "simulation" && <BarChart3 size={14} />}
                          {activity.type === "group" && <Users size={14} />}
                        </div>
                        <div className="activity-content">
                          <p>{activity.title}</p>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="edit-actions">
                  <button className="btn-primary" onClick={handleSave}>
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "learning" && (
            <div className="learning-tab">
              <div className="learning-progress-grid">
                <div className="progress-card">
                  <h3>Current Learning Path</h3>
                  <div className="learning-path">
                    <div className="path-header">
                      <h4>Associate of Society of Actuaries (ASA)</h4>
                      <span className="path-progress">6/12 Courses</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "50%" }}></div>
                    </div>
                    <p>Next: Life Contingencies</p>
                  </div>
                </div>

                <div className="progress-card">
                  <h3>Exam Preparation</h3>
                  <div className="exam-progress">
                    <div className="exam-item">
                      <div className="exam-info">
                        <span className="exam-name">SOA Exam P</span>
                        <span className="exam-status completed">Passed</span>
                      </div>
                      <div className="exam-score">Score: 8/10</div>
                    </div>
                    <div className="exam-item">
                      <div className="exam-info">
                        <span className="exam-name">SOA Exam FM</span>
                        <span className="exam-status in-progress">In Progress</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div className="exam-item">
                      <div className="exam-info">
                        <span className="exam-name">SOA Exam IFM</span>
                        <span className="exam-status upcoming">Upcoming</span>
                      </div>
                      <div className="exam-date">Target: June 2024</div>
                    </div>
                  </div>
                </div>

                <div className="progress-card">
                  <h3>Skills Development</h3>
                  <div className="skills-grid">
                    <div className="skill-item">
                      <span className="skill-name">Probability Theory</span>
                      <div className="skill-level">
                        <div className="skill-bar" style={{ width: "90%" }}></div>
                        <span>90%</span>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span className="skill-name">Financial Mathematics</span>
                      <div className="skill-level">
                        <div className="skill-bar" style={{ width: "85%" }}></div>
                        <span>85%</span>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span className="skill-name">Life Contingencies</span>
                      <div className="skill-level">
                        <div className="skill-bar" style={{ width: "70%" }}></div>
                        <span>70%</span>
                      </div>
                    </div>
                    <div className="skill-item">
                      <span className="skill-name">Risk Management</span>
                      <div className="skill-level">
                        <div className="skill-bar" style={{ width: "65%" }}></div>
                        <span>65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="achievements-tab">
              <div className="achievements-header">
                <h3>Your Achievements</h3>
                <div className="achievement-stats">
                  <span>
                    {achievements.filter((a) => a.earned).length} of {achievements.length} earned
                  </span>
                </div>
              </div>

              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`achievement-card ${achievement.earned ? "earned" : "locked"}`}>
                    <div className="achievement-icon">
                      <achievement.icon size={24} />
                    </div>
                    <div className="achievement-content">
                      <h4>{achievement.name}</h4>
                      {achievement.earned ? (
                        <p className="achievement-date">Earned on {achievement.date}</p>
                      ) : (
                        <div className="achievement-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${achievement.progress}%` }}></div>
                          </div>
                          <span>{achievement.progress}% complete</span>
                        </div>
                      )}
                    </div>
                    {achievement.earned && <div className="achievement-badge">✓</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-tab">
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>
                    <Bell size={20} />
                    Notifications
                  </h3>
                  <div className="settings-options">
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Course updates</span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Study reminders</span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" />
                        <span>Marketing emails</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>
                    <Palette size={20} />
                    Appearance
                  </h3>
                  <div className="settings-options">
                    <div className="setting-item">
                      <label>Theme</label>
                      <select>
                        <option>Dark</option>
                        <option>Light</option>
                        <option>Auto</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Language</label>
                      <select>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>
                    <Globe size={20} />
                    Privacy
                  </h3>
                  <div className="settings-options">
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        <span>Show profile to other students</span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" />
                        <span>Allow study group invitations</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="security-tab">
              <div className="security-grid">
                <div className="security-card">
                  <h3>
                    <Shield size={20} />
                    Password & Security
                  </h3>
                  <div className="security-options">
                    <div className="security-item">
                      <label>Current Password</label>
                      <div className="password-input">
                        <input type={showPassword ? "text" : "password"} placeholder="Enter current password" />
                        <button onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="security-item">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="security-item">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="security-card">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>

                <div className="security-card">
                  <h3>Active Sessions</h3>
                  <div className="sessions-list">
                    <div className="session-item">
                      <div className="session-info">
                        <strong>Current Session</strong>
                        <p>Chrome on Windows • New York, NY</p>
                      </div>
                      <span className="session-status active">Active</span>
                    </div>
                  </div>
                </div>

                <div className="security-card danger">
                  <h3>Danger Zone</h3>
                  <p>These actions cannot be undone</p>
                  <div className="danger-actions">
                    <button className="btn-danger" onClick={logout}>
                      Sign Out All Devices
                    </button>
                    <button className="btn-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
