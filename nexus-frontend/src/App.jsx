"use client"

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import Dashboard from "./pages/Dashboard"
import StudyGroups from "./pages/StudyGroups"
import Chats from "./pages/Chats"
import Resources from "./pages/Resources"
import MyCourses from "./pages/MyCourses"
import MyCertificates from "./pages/MyCertificates"
import WellBeingCenter from "./pages/WellBeingCenter"
import CareerGuidance from "./pages/CareerGuidance"
import Simulations from "./pages/Simulations"
import CourseDetail from "./pages/CourseDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { UserProvider } from "./context/UserContext"
import { CourseProvider } from "./context/CourseContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "./App.css"
import LearningHub from "./pages/LearningHub"
import CourseLesson from "./pages/CourseLesson"
import CourseContentManager from "./pages/CourseContentManager"

function AppContent({ isMobile }) {
  const location = useLocation()
  const noLayoutRoutes = ["/login", "/register"]
  const isNoLayoutRoute = noLayoutRoutes.includes(location.pathname)

  return isNoLayoutRoute ? (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  ) : (
    <>
      <Sidebar isMobile={isMobile} />
      <div className="main-content">
        <Header />
        <div className="page-container">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study-groups"
              element={
                <ProtectedRoute>
                  <StudyGroups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learninghub"
              element={
                <ProtectedRoute>
                  <LearningHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/lesson/:lessonId"
              element={
                <ProtectedRoute>
                  <CourseLesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-certificates"
              element={
                <ProtectedRoute>
                  <MyCertificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/well-being"
              element={
                <ProtectedRoute>
                  <WellBeingCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/career-guidance"
              element={
                <ProtectedRoute>
                  <CareerGuidance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulations"
              element={
                <ProtectedRoute>
                  <Simulations />
                </ProtectedRoute>
              }
            />
            <Route path="/add-course" element={<CourseContentManager />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <UserProvider>
      <CourseProvider>
        <Router>
          <div className="app-container">
            <AppContent isMobile={isMobile} />
          </div>
        </Router>
      </CourseProvider>
    </UserProvider>
  )
}

export default App
