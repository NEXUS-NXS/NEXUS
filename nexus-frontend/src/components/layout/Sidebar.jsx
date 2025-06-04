"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useUser } from "../../context/UserContext"
import "./Sidebar.css"

const Sidebar = ({ isMobile }) => {
  const [collapsed, setCollapsed] = useState(isMobile)
  const { logout } = useUser()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <img src="/assets/nexus (1).png" alt="Nexus Logo" className="logo" />
        {/* {!collapsed && <span className="logo-text">NEXUS</span>} */}
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

        {/* <NavLink to="/simulations" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <BarChart3 size={20} />
          {!collapsed && <span>Simulations</span>}
        </NavLink> */}
        <a href="http://localhost:3000/" className={`nav-item`} >
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
