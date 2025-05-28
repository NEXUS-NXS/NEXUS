"use client"

import { Navigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
