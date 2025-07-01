"use client";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import HelpCenter from "./pages/HelpCenter";
import StudyGroups from "./pages/StudyGroups";
import Chats from "./pages/Chats";
import Resources from "./pages/Resources";
import MyCertificates from "./pages/MyCertificates";
import WellBeingCenter from "./pages/WellBeingCenter";
import CareerGuidance from "./pages/CareerGuidance";
import VideoCall from "./pages/VideoCall";
import AudioCall from "./pages/AudioCall";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import { CourseProvider } from "./context/CourseContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";
import LearningHub from "./pages/LearningHub";
import CourseLesson from "./pages/CourseLesson";
import CourseContentManager from "./pages/CourseContentManager";
import CreateCourse from "./pages/CreateCourse";
import MentorMatch from "./pages/MentorMatch";
import ErrorBoundary from "./components/ErrorBoundary";
import CourseLibrary from "./pages/CourseLibrary";

function AppContent({ isMobile }) {
  const location = useLocation();
  const noLayoutRoutes = ["/login", "/register"];
  const isNoLayoutRoute = noLayoutRoutes.includes(location.pathname);

  // State for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    console.log("Menu toggle called, current state:", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    console.log("Sidebar close called");
    setIsSidebarOpen(false);
  };

  return (
    <ErrorBoundary>
      {isNoLayoutRoute ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Sidebar isMobile={isMobile} isOpen={isSidebarOpen} onClose={handleSidebarClose} />
          <div className="main-content">
            <Header onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
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
                  path="/course/:courseId/preview"
                  element={
                    <ProtectedRoute>
                      <CourseLesson />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/course/:courseId"
                  element={
                    
                      <CourseLesson />
                    
                  }
                />
                <Route path="/admin/course-library" element={<CourseLibrary/>}/>
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
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <HelpCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/video-call"
                  element={
                    <ProtectedRoute>
                      <VideoCall />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audio-call"
                  element={
                    <ProtectedRoute>
                      <AudioCall />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/course/:courseId/content-manager"
                  element={
                    <ProtectedRoute>
                      <CourseContentManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-course"
                  element={
                    
                      <CreateCourse />
                    
                  }
                />
                <Route
                  path="/mentor-match"
                  element={
                    <ProtectedRoute>
                      <MentorMatch />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </ErrorBoundary>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      console.log("Mobile check:", mobile, "Width:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  );
}

export default App;