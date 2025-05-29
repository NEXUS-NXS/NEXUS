"use client"

import { useState } from "react"
import {
  Bell,
  User,
  Search,
  ChevronDown,
  Menu,
  BookOpen,
  Award,
  TrendingUp,
  Star,
  Users,
  Calculator,
  BarChart3,
  Shield,
  Briefcase,
  Database,
  Brain,
  Target,
} from "lucide-react"
import { useUser } from "../../context/UserContext"
import "./Header.css"

const Header = () => {
  const { user } = useUser()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showBrowseMenu, setShowBrowseMenu] = useState(false)

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const toggleBrowseMenu = () => {
    setShowBrowseMenu(!showBrowseMenu)
  }

  const browseMenuData = {
    categories: [
      { name: "Probability & Statistics", icon: BarChart3, popular: true },
      { name: "Life Insurance Mathematics", icon: Shield, popular: false },
      { name: "Property & Casualty", icon: Calculator, popular: true },
      { name: "Pension Mathematics", icon: TrendingUp, popular: false },
      { name: "Risk Management", icon: Target, popular: true },
      { name: "Financial Mathematics", icon: Briefcase, popular: false },
      { name: "Actuarial Modeling", icon: Database, popular: true },
      { name: "Machine Learning for Actuaries", icon: Brain, popular: false },
    ],
    featuredCourses: [
      { name: "SOA Exam P Preparation", level: "Beginner", rating: 4.8, students: "12.5k" },
      { name: "Advanced Life Contingencies", level: "Advanced", rating: 4.9, students: "3.2k" },
      { name: "Predictive Analytics in Insurance", level: "Intermediate", rating: 4.7, students: "8.1k" },
      { name: "Regulatory Capital Modeling", level: "Advanced", rating: 4.6, students: "2.8k" },
    ],
    learningPaths: [
      { name: "Associate of Society of Actuaries (ASA)", duration: "18-24 months", courses: 12 },
      { name: "Chartered Property Casualty Underwriter", duration: "12-18 months", courses: 8 },
      { name: "Data Science for Insurance", duration: "6-9 months", courses: 6 },
      { name: "Enterprise Risk Management", duration: "9-12 months", courses: 7 },
    ],
    certifications: [
      { name: "SOA Associate (ASA)", provider: "Society of Actuaries", level: "Professional" },
      { name: "CAS Associate (ACAS)", provider: "Casualty Actuarial Society", level: "Professional" },
      { name: "FRM Certification", provider: "GARP", level: "Professional" },
      { name: "Certified Actuarial Analyst", provider: "SOA/CAS", level: "Entry-Level" },
    ],
  }

  return (
    <header className="header-top-nav">
      <div className="header-left-top-nav">
        <button className="menu-button-top-nav">
          <Menu size={20} />
        </button>

        <div className="browse-container-top-nav">
          <button className="browse-button-top-nav" onClick={toggleBrowseMenu}>
            Browse
            <ChevronDown size={16} className={`browse-arrow-top-nav ${showBrowseMenu ? "rotated" : ""}`} />
          </button>

          {showBrowseMenu && (
            <div className="browse-dropdown-top-nav">
              <div className="browse-overlay-top-nav" onClick={() => setShowBrowseMenu(false)} />

              <div className="browse-content-top-nav">
                <div className="browse-section-top-nav">
                  <div className="section-header-top-nav">
                    <BookOpen size={18} />
                    <h3>Course Categories</h3>
                  </div>
                  <div className="category-grid-top-nav">
                    {browseMenuData.categories.map((category, index) => (
                      <div key={index} className={`category-item-top-nav ${category.popular ? "popular" : ""}`}>
                        <category.icon size={16} className="category-icon-top-nav" />
                        <span>{category.name}</span>
                        {category.popular && <span className="popular-badge-top-nav">Popular</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="browse-section-top-nav">
                  <div className="section-header-top-nav">
                    <Star size={18} />
                    <h3>Featured Courses</h3>
                  </div>
                  <div className="featured-courses-top-nav">
                    {browseMenuData.featuredCourses.map((course, index) => (
                      <div key={index} className="course-item-top-nav">
                        <div className="course-info-top-nav">
                          <h4>{course.name}</h4>
                          <div className="course-meta-top-nav">
                            <span className={`level-top-nav ${course.level.toLowerCase()}`}>{course.level}</span>
                            <div className="rating-top-nav">
                              <Star size={12} fill="currentColor-top-nav" />
                              <span>{course.rating}</span>
                            </div>
                            <div className="students-top-nav">
                              <Users size={12} />
                              <span>{course.students}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="browse-section-top-nav">
                  <div className="section-header-top-nav">
                    <TrendingUp size={18} />
                    <h3>Learning Paths</h3>
                  </div>
                  <div className="learning-paths-top-nav">
                    {browseMenuData.learningPaths.map((path, index) => (
                      <div key={index} className="path-item-top-nav">
                        <h4>{path.name}</h4>
                        <div className="path-meta-top-nav">
                          <span className="duration-top-nav">{path.duration}</span>
                          <span className="courses-top-nav">{path.courses} courses</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="browse-section-top-nav">
                  <div className="section-header-top-nav">
                    <Award size={18} />
                    <h3>Professional Certifications</h3>
                  </div>
                  <div className="certifications-top-nav">
                    {browseMenuData.certifications.map((cert, index) => (
                      <div key={index} className="cert-item-top-nav">
                        <div className="cert-info-top-nav">
                          <h4>{cert.name}</h4>
                          <p className="cert-provider-top-nav">{cert.provider}</p>
                          <span className={`cert-level-top-nav ${cert.level.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                            {cert.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="search-container-top-nav">
        <Search size={18} className="search-icon-top-nav" />
        <input type="text" placeholder="Search courses, exams, study materials..." className="search-input-top-nav" />
      </div>

      <div className="header-actions-top-nav">
        <div className="notification-icon-top-nav">
          <Bell size={20} />
          {user?.notifications > 0 && <span className="notification-badge-top-nav">{user.notifications}</span>}
        </div>

        <div className="profile-container-top-nav">
          <div className="profile-trigger-top-nav" onClick={toggleProfileMenu}>
            <div className="avatar-top-nav">
              {user?.profileImage ? (
                <img src={user.profileImage || "/placeholder.svg"} alt={user.name} />
              ) : (
                <User size={20} />
              )}
            </div>
          </div>

          {showProfileMenu && (
            <div className="profile-menu-top-nav">
              <div className="profile-header-top-nav">
                <p className="profile-name-top-nav">{user?.name}</p>
                <p className="profile-email-top-nav">{user?.email}</p>
              </div>
              <ul>
                <li>Profile Settings</li>
                <li>Account</li>
                <li>Help Center</li>
                <li className="logout-top-nav">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
