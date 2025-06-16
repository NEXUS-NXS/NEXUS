"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  GraduationCapIcon as Graduation,
  Award,
  Heart,
  Briefcase,
  BarChart3,
  LogOut,
  X,
} from "lucide-react"
import { useUser } from "../../context/UserContext"
import "./Sidebar.css"

const Sidebar = ({ isMobile, isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(isMobile)
  const { logout } = useUser()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest(".sidebar") && !event.target.closest(".menu-button-top-nav")) {
        onClose()
      }
    }

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isMobile, isOpen, onClose])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isOpen])

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && <div className="mobile-sidebar-overlay" onClick={onClose} />}

        {/* Mobile Sidebar */}
        <div className={`sidebar mobile-sidebar ${isOpen ? "mobile-open" : ""}`}>
          <div className="logo-container mobile-header">
            <img src="/assets/nexus (1).png" alt="Nexus Logo" className="logo" />
            <button className="mobile-close-btn" onClick={onClose} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <nav className="nav-menu">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/study-groups"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <Users size={20} />
              <span>Study Groups</span>
            </NavLink>

            <NavLink
              to="/chats"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <MessageSquare size={20} />
              <span>Chats</span>
            </NavLink>

            <NavLink
              to="/resources"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <BookOpen size={20} />
              <span>Resources</span>
            </NavLink>

            <NavLink
              to="/learninghub"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <Graduation size={20} />
              <span>Learning Hub</span>
            </NavLink>

            <NavLink
              to="/my-certificates"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <Award size={20} />
              <span>My Certificates</span>
            </NavLink>

            <NavLink
              to="/well-being"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <Heart size={20} />
              <span>Well Being Center</span>
            </NavLink>

            <NavLink
              to="/career-guidance"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={handleLinkClick}
            >
              <Briefcase size={20} />
              <span>Career Guidance</span>
            </NavLink>

            <a href="http://localhost:3000/" className="nav-item" onClick={handleLinkClick}>
              <BarChart3 size={20} />
              <span>Simulations</span>
            </a>
          </nav>

          <div className="sidebar-footer">
            <button
              className="logout-btn"
              onClick={() => {
                logout()
                handleLinkClick()
              }}
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </>
    )
  }

  // Desktop Sidebar (existing behavior)
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <img src="/assets/nexus (1).png" alt="Nexus Logo" className="logo" />
      </div>

      {isMobile && (
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? "→" : "←"}
        </button>
      )}

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/study-groups" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Users size={20} />
          {!collapsed && <span>Study Groups</span>}
        </NavLink>

        <NavLink to="/chats" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <MessageSquare size={20} />
          {!collapsed && <span>Chats</span>}
        </NavLink>

        <NavLink to="/resources" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <BookOpen size={20} />
          {!collapsed && <span>Resources</span>}
        </NavLink>

        <NavLink to="/learninghub" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Graduation size={20} />
          {!collapsed && <span>Learning Hub</span>}
        </NavLink>

        <NavLink to="/my-certificates" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Award size={20} />
          {!collapsed && <span>My Certificates</span>}
        </NavLink>

        <NavLink to="/well-being" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Heart size={20} />
          {!collapsed && <span>Well Being Center</span>}
        </NavLink>

        <NavLink to="/career-guidance" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <Briefcase size={20} />
          {!collapsed && <span>Career Guidance</span>}
        </NavLink>

        <a href="http://localhost:3000/" className="nav-item">
          <BarChart3 size={20} />
          {!collapsed && <span>Simulations</span>}
        </a>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
