// context/UserContext.jsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from 'axios'

// enable cookies in axios requests
axios.defaults.withCredentials=true

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

        // verify authentication with a protected end
        checkAuth()
      } catch (error) {
        console.error("Failed to parse stored user data", error)
        localStorage.removeItem("nexus_user")
        setIsAuthenticated(false)
      }
    }
  }, [])

  const checkAuth = async()=>{
    try{
      // call a protected endpoint to verify authentication
      await axios.get("http://127.0.0.1:8000/auth/protected/")
      setIsAuthenticated(true)

    }catch (error){
      console.error("Authentication check failed", error) 
      isAuthenticated(false)
      localStorage.removeItem("nexus_user")
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/token/", {
        email,
        password,
      })

      const { user=userData} = response.data

      // store userdata 
      localStorage.setItem("nexus_user", JSON.stringify(userData))

      // update context state
      setUser(userData)
      setIsAuthenticated(true)

      return true
    } catch (error) {
      console.error("Login failed", error)
      const errorMessage = error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join(" ") || "login failed"

      throw new Error(errorMessage)

    }
  }

  const logout = async () => {
    try{
      await axios.post("http://127.0.0.1:8000/auth/logout/")

    } catch (error) {
      console.error("Logout failed", error)
    }

    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("nexus_user")
  } 
    
    

  const register = async (fullName, email, password, confirmPassword, gender, education) => {
    // In a real app, this would make an API call to register
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register/", {
       full_name: fullName,
        email,
        password,
        password2: confirmPassword,
        gender, 
        education,
      })

      const {user:userData} = response.data
      
      // store userdata
      localStorage.setItem("nexus_user", JSON.stringify(userData))

      // update context state
      setUser(userData)
      setIsAuthenticated(true)

      return true

    } catch (error) {
      console.error("Registration failed", error)
      const errorMessage = error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join(" ") || "Registration failed"

      throw new Error(errorMessage)

    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/token/refresh/")
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error("Token refresh failed", error)
      logout()
      return false
    }
  }

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout, register, refreshToken }}>{children}</UserContext.Provider>
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
