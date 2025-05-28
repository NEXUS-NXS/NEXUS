"use client"

import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext(undefined)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("nexus_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored user data", error)
        localStorage.removeItem("nexus_user")
      }
    }
  }, [])

  const login = async (email, password) => {
    // In a real app, this would make an API call to authenticate
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser = {
        id: "123456",
        name: "John Doe",
        email: email,
        notifications: 3,
        points: 750,
        stats: {
          completedCourses: 0,
          completedLessons: 47,
          watchTime: {
            hours: 30,
            minutes: 47,
          },
        },
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("nexus_user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login failed", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("nexus_user")
  }

  const register = async (name, email, password) => {
    // In a real app, this would make an API call to register
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const mockUser = {
        id: "123456",
        name: name,
        email: email,
        notifications: 0,
        points: 0,
        stats: {
          completedCourses: 0,
          completedLessons: 0,
          watchTime: {
            hours: 0,
            minutes: 0,
          },
        },
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("nexus_user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Registration failed", error)
      return false
    }
  }

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, register }}>{children}</UserContext.Provider>
  )
}

const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export { useUser }
