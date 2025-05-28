"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        navigate("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page-lg">
      <div className="login-container-lg">
        <div className="login-header-lg">
          <img src="/assets/nexus-logo.png" alt="Nexus Logo" className="login-logo-lg" />
          <h1>Welcome to Nexus</h1>
          <p>Sign in to continue to your account</p>
        </div>

        {error && <div className="error-message-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form-lg">
          <div className="form-group-lg">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group-lg">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-actions-lg">
            <div className="remember-me-lg">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password-lg">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="login-button-lg" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer-lg">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="login-background-lg">
        <div className="login-info-lg">
          <h2>Expand Your Actuarial Career</h2>
          <p>
            Access a comprehensive library of resources, courses, and tools designed specifically for actuarial
            professionals.
          </p>
          <ul>
            <li>Professional certification preparation</li>
            <li>Technical skills development</li>
            <li>Career advancement resources</li>
            <li>Community of actuarial professionals</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
