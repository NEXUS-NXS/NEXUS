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
  Brain,
  Users,
  BarChart3,
  Star,
  Calendar,
  Target,
  Activity,
  Crown,
  Flame,
  ChevronRight,
  Check,
  Lock,
  Sparkles,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import "./Profile.css"

const Profile = () => {
  const { user, logout } = useUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "Alexandra Chen",
    email: user?.email || "alexandra.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    bio: "Passionate actuarial science student with a focus on risk analytics and financial modeling. Currently preparing for SOA Fellowship exams while working on innovative insurance technology solutions.",
    university: "Stanford University",
    major: "Actuarial Science & Statistics",
    graduationYear: "2024",
    linkedIn: "linkedin.com/in/alexandrachen",
    github: "github.com/alexchen",
    website: "alexandrachen.dev",
  })

  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log("Image uploaded:", e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("Profile saved:", profileData)
  }

  const achievements = [
    {
      id: 1,
      name: "First Course Master",
      icon: BookOpen,
      earned: true,
      date: "2024-01-15",
      description: "Completed your first actuarial course with excellence",
      rarity: "common",
    },
    {
      id: 2,
      name: "Study Streak Legend",
      icon: Flame,
      earned: true,
      date: "2024-01-20",
      description: "Maintained a 30-day study streak",
      rarity: "rare",
    },
    {
      id: 3,
      name: "Exam P Champion",
      icon: Crown,
      earned: false,
      progress: 85,
      description: "Master the Probability exam",
      rarity: "epic",
    },
    {
      id: 4,
      name: "Community Leader",
      icon: Users,
      earned: true,
      date: "2024-02-01",
      description: "Helped 50+ students in study groups",
      rarity: "rare",
    },
    {
      id: 5,
      name: "Analytics Wizard",
      icon: BarChart3,
      earned: false,
      progress: 65,
      description: "Complete advanced analytics modules",
      rarity: "epic",
    },
    {
      id: 6,
      name: "Simulation Expert",
      icon: Brain,
      earned: false,
      progress: 45,
      description: "Master Monte Carlo simulations",
      rarity: "legendary",
    },
  ]

  const learningStats = [
    { label: "Courses Completed", value: "24", icon: BookOpen, color: "#6366f1", trend: "+3 this month" },
    { label: "Study Hours", value: "342", icon: Clock, color: "#10b981", trend: "+28 this week" },
    { label: "Certificates Earned", value: "8", icon: Award, color: "#f59e0b", trend: "+2 this month" },
    { label: "Current Streak", value: "28 days", icon: Flame, color: "#ef4444", trend: "Personal best!" },
  ]

  const skillsData = [
    { name: "Probability Theory", level: 95, category: "Core", color: "#6366f1" },
    { name: "Financial Mathematics", level: 88, category: "Core", color: "#8b5cf6" },
    { name: "Life Contingencies", level: 82, category: "Advanced", color: "#06b6d4" },
    { name: "Risk Management", level: 76, category: "Advanced", color: "#10b981" },
    { name: "Statistical Modeling", level: 90, category: "Core", color: "#f59e0b" },
    { name: "Insurance Analytics", level: 70, category: "Specialized", color: "#ef4444" },
  ]

  const recentActivity = [
    {
      type: "course",
      title: "Completed: Advanced Stochastic Processes",
      time: "2 hours ago",
      points: "+150 XP",
      icon: BookOpen,
    },
    {
      type: "achievement",
      title: "Earned: Study Streak - 28 Days",
      time: "1 day ago",
      points: "+500 XP",
      icon: Flame,
    },
    {
      type: "simulation",
      title: "Mastered: Black-Scholes Model Simulation",
      time: "3 days ago",
      points: "+200 XP",
      icon: BarChart3,
    },
    {
      type: "group",
      title: "Led: SOA Exam FM Study Session",
      time: "1 week ago",
      points: "+100 XP",
      icon: Users,
    },
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "learning", label: "Learning Journey", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="modern-profile-page">
      {/* Enhanced Header Section */}
      <div className="profile-hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
          <div className="floating-elements">
            <div className="float-element float-1"></div>
            <div className="float-element float-2"></div>
            <div className="float-element float-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="profile-main-info">
            <div className="profile-avatar-container">
              <div className="avatar-wrapper">
                <img src="/placeholder.svg?height=140&width=140" alt="Profile" className="profile-avatar-img" />
                <div className="avatar-status-indicator"></div>
                <button className="avatar-upload-btn" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div className="profile-level-badge">
                <Crown size={16} />
                <span>Level 12</span>
              </div>
            </div>

            <div className="profile-identity">
              <div className="name-section">
                <h1 className="profile-name">{profileData.name}</h1>
                <div className="profile-badges">
                  <span className="badge verified">
                    <Check size={12} />
                    Verified Student
                  </span>
                  <span className="badge premium">
                    <Sparkles size={12} />
                    Premium
                  </span>
                </div>
              </div>

              <p className="profile-title">Actuarial Science Specialist</p>

              <div className="profile-meta">
                <div className="meta-item">
                  <MapPin size={14} />
                  <span>{profileData.location}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>Joined January 2023</span>
                </div>
              </div>

              <div className="profile-quick-stats">
                {learningStats.map((stat, index) => (
                  <div key={index} className="quick-stat-item">
                    <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon size={16} style={{ color: stat.color }} />
                    </div>
                    <div className="stat-details">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-actions-section">
            <button className="action-btn primary" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={16} />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
            <button className="action-btn secondary">
              <Download size={16} />
              Export Data
            </button>
            <button className="action-btn icon-only">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-navigation">
        <div className="nav-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="tab-indicator"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="profile-main-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="content-grid">
              {/* About Section */}
              <div className="content-card featured">
                <div className="card-header">
                  <h3>About Me</h3>
                  {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
                <div className="card-content">
                  {isEditing ? (
                    <div className="edit-form">
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="modern-textarea"
                      />
                    </div>
                  ) : (
                    <p className="bio-text">{profileData.bio}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Contact & Links</h3>
                </div>
                <div className="card-content">
                  <div className="contact-grid">
                    <div className="contact-item">
                      <div className="contact-icon">
                        <Mail size={16} />
                      </div>
                      <div className="contact-details">
                        <span className="contact-label">Email</span>
                        {isEditing ? (
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="modern-input"
                          />
                        ) : (
                          <span className="contact-value">{profileData.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <Phone size={16} />
                      </div>
                      <div className="contact-details">
                        <span className="contact-label">Phone</span>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="modern-input"
                          />
                        ) : (
                          <span className="contact-value">{profileData.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <Globe size={16} />
                      </div>
                      <div className="contact-details">
                        <span className="contact-label">Website</span>
                        {isEditing ? (
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                            className="modern-input"
                          />
                        ) : (
                          <a
                            href={`https://${profileData.website}`}
                            className="contact-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {profileData.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Education</h3>
                </div>
                <div className="card-content">
                  <div className="education-item">
                    <div className="education-icon">
                      <BookOpen size={20} />
                    </div>
                    <div className="education-details">
                      <h4>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.university}
                            onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                            className="modern-input"
                          />
                        ) : (
                          profileData.university
                        )}
                      </h4>
                      <p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.major}
                            onChange={(e) => setProfileData({ ...profileData, major: e.target.value })}
                            className="modern-input"
                          />
                        ) : (
                          profileData.major
                        )}
                      </p>
                      <span className="graduation-info">
                        Class of{" "}
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.graduationYear}
                            onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                            className="modern-input inline"
                          />
                        ) : (
                          profileData.graduationYear
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="content-card full-width">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                  <button className="view-all-btn">
                    View All
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="card-content">
                  <div className="activity-timeline">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon-wrapper">
                          <activity.icon size={16} />
                        </div>
                        <div className="activity-content">
                          <div className="activity-main">
                            <p className="activity-title">{activity.title}</p>
                            <span className="activity-points">{activity.points}</span>
                          </div>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="edit-actions">
                <button className="action-btn primary large" onClick={handleSave}>
                  <Save size={16} />
                  Save Changes
                </button>
                <button className="action-btn secondary large" onClick={() => setIsEditing(false)}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "learning" && (
          <div className="learning-section">
            <div className="content-grid">
              {/* Learning Path */}
              <div className="content-card featured">
                <div className="card-header">
                  <h3>Current Learning Path</h3>
                  <span className="progress-indicator">75% Complete</span>
                </div>
                <div className="card-content">
                  <div className="learning-path">
                    <div className="path-info">
                      <h4>Associate of Society of Actuaries (ASA)</h4>
                      <p>Master the fundamentals of actuarial science</p>
                    </div>
                    <div className="path-progress">
                      <div className="progress-bar-modern">
                        <div className="progress-fill" style={{ width: "75%" }}>
                          <div className="progress-glow"></div>
                        </div>
                      </div>
                      <div className="progress-stats">
                        <span>9 of 12 courses completed</span>
                        <span>Next: Predictive Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Radar */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Skills Overview</h3>
                </div>
                <div className="card-content">
                  <div className="skills-grid">
                    {skillsData.map((skill, index) => (
                      <div key={index} className="skill-item-modern">
                        <div className="skill-header">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-category">{skill.category}</span>
                        </div>
                        <div className="skill-progress">
                          <div className="skill-bar-container">
                            <div
                              className="skill-bar-fill"
                              style={{
                                width: `${skill.level}%`,
                                backgroundColor: skill.color,
                              }}
                            ></div>
                          </div>
                          <span className="skill-percentage">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exam Progress */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Exam Preparation</h3>
                </div>
                <div className="card-content">
                  <div className="exam-list">
                    <div className="exam-item completed">
                      <div className="exam-status-icon">
                        <Check size={16} />
                      </div>
                      <div className="exam-details">
                        <h4>SOA Exam P</h4>
                        <p>Probability</p>
                        <span className="exam-score">Score: 9/10</span>
                      </div>
                      <div className="exam-badge success">Passed</div>
                    </div>

                    <div className="exam-item in-progress">
                      <div className="exam-status-icon">
                        <Activity size={16} />
                      </div>
                      <div className="exam-details">
                        <h4>SOA Exam FM</h4>
                        <p>Financial Mathematics</p>
                        <div className="exam-progress-bar">
                          <div className="progress-fill" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div className="exam-badge progress">85% Ready</div>
                    </div>

                    <div className="exam-item upcoming">
                      <div className="exam-status-icon">
                        <Target size={16} />
                      </div>
                      <div className="exam-details">
                        <h4>SOA Exam IFM</h4>
                        <p>Investment & Financial Markets</p>
                        <span className="exam-date">Target: June 2024</span>
                      </div>
                      <div className="exam-badge upcoming">Upcoming</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="achievements-section">
            <div className="achievements-header">
              <div className="header-content">
                <h2>Achievements & Badges</h2>
                <p>Showcase your learning milestones and accomplishments</p>
              </div>
              <div className="achievement-summary">
                <div className="summary-stat">
                  <span className="stat-number">{achievements.filter((a) => a.earned).length}</span>
                  <span className="stat-label">Earned</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">{achievements.length}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
            </div>

            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`achievement-card-modern ${achievement.earned ? "earned" : "locked"} ${achievement.rarity}`}
                >
                  <div className="achievement-glow"></div>
                  <div className="achievement-header">
                    <div className="achievement-icon-modern">
                      <achievement.icon size={24} />
                    </div>
                    <div className="achievement-rarity">
                      {achievement.rarity === "legendary" && <Crown size={12} />}
                      {achievement.rarity === "epic" && <Star size={12} />}
                      {achievement.rarity === "rare" && <Sparkles size={12} />}
                      <span>{achievement.rarity}</span>
                    </div>
                  </div>

                  <div className="achievement-content">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>

                    {achievement.earned ? (
                      <div className="achievement-earned">
                        <Check size={14} />
                        <span>Earned {achievement.date}</span>
                      </div>
                    ) : (
                      <div className="achievement-progress">
                        <div className="progress-bar-mini">
                          <div className="progress-fill" style={{ width: `${achievement.progress}%` }}></div>
                        </div>
                        <span>{achievement.progress}% complete</span>
                      </div>
                    )}
                  </div>

                  {achievement.earned && <div className="earned-badge">✓</div>}
                  {!achievement.earned && (
                    <div className="locked-overlay">
                      <Lock size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <div className="content-grid">
              <div className="content-card">
                <div className="card-header">
                  <h3>
                    <Bell size={20} />
                    Notifications
                  </h3>
                </div>
                <div className="card-content">
                  <div className="settings-list">
                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Course Updates</h4>
                        <p>Get notified about new courses and updates</p>
                      </div>
                      <label className="modern-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Study Reminders</h4>
                        <p>Daily reminders to keep your streak going</p>
                      </div>
                      <label className="modern-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Achievement Alerts</h4>
                        <p>Celebrate your accomplishments</p>
                      </div>
                      <label className="modern-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <h3>
                    <Palette size={20} />
                    Appearance
                  </h3>
                </div>
                <div className="card-content">
                  <div className="settings-list">
                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Theme</h4>
                        <p>Choose your preferred theme</p>
                      </div>
                      <select className="modern-select">
                        <option>Dark</option>
                        <option>Light</option>
                        <option>Auto</option>
                      </select>
                    </div>

                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Language</h4>
                        <p>Select your language preference</p>
                      </div>
                      <select className="modern-select">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <h3>
                    <Globe size={20} />
                    Privacy
                  </h3>
                </div>
                <div className="card-content">
                  <div className="settings-list">
                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Profile Visibility</h4>
                        <p>Control who can see your profile</p>
                      </div>
                      <label className="modern-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="setting-item-modern">
                      <div className="setting-info">
                        <h4>Study Group Invitations</h4>
                        <p>Allow others to invite you to study groups</p>
                      </div>
                      <label className="modern-toggle">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="security-section">
            <div className="content-grid">
              <div className="content-card">
                <div className="card-header">
                  <h3>
                    <Shield size={20} />
                    Password & Security
                  </h3>
                </div>
                <div className="card-content">
                  <div className="security-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <div className="password-input-modern">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="modern-input"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" className="modern-input" />
                    </div>

                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Confirm new password" className="modern-input" />
                    </div>

                    <button className="action-btn primary">Update Password</button>
                  </div>
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <h3>Two-Factor Authentication</h3>
                </div>
                <div className="card-content">
                  <div className="security-feature">
                    <div className="feature-icon">
                      <Shield size={24} />
                    </div>
                    <div className="feature-content">
                      <h4>Secure Your Account</h4>
                      <p>Add an extra layer of security with 2FA</p>
                      <button className="action-btn secondary">Enable 2FA</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-card danger">
                <div className="card-header">
                  <h3>Danger Zone</h3>
                </div>
                <div className="card-content">
                  <div className="danger-actions">
                    <div className="danger-item">
                      <div className="danger-info">
                        <h4>Sign Out All Devices</h4>
                        <p>This will sign you out of all devices except this one</p>
                      </div>
                      <button className="action-btn danger" onClick={logout}>
                        Sign Out All
                      </button>
                    </div>

                    <div className="danger-item">
                      <div className="danger-info">
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all data</p>
                      </div>
                      <button className="action-btn danger">Delete Account</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
