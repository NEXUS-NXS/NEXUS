"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import "./Login.css"
import MathClock from "../components/clock/MathClock"

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    education: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useUser()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }
        const success = await register(formData.fullName, formData.email, formData.password)
        if (success) {
          navigate("/")
        } else {
          setError("Registration failed. Please try again.")
        }
      } else {
        const success = await login(formData.email, formData.password)
        if (success) {
          navigate("/")
        } else {
          setError("Invalid email or password")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic here
  }

  return (
    <div className="nexus-login-page">
      <div className="nexus-login-container">
        {/* Left Panel */}
        <div className="nexus-login-left">
          <div className="nexus-login-illustration">
            <div className="nexus-math-drawings">
              {/* Mathematical illustrations will be CSS-based */}
              <MathClock/>
            </div>
          </div>

          <div className="nexus-login-content">
            <h1 className="nexus-login-title">
              {isSignUp ? "Sign up for Nexus to get started!" : "Log in to Nexus to get started!"}
            </h1>
            <p className="nexus-login-subtitle">Shape your actuarial career with Nexus—launch your journey now!</p>
          </div>

          <div className="nexus-login-footer">
            <p>
              By {isSignUp ? "signing up" : "logging in"} for Nexus, you agree to our{" "}
              <Link to="/terms" className="nexus-footer-link">
                Terms of use
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="nexus-footer-link">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="nexus-login-right">
          <div className="nexus-login-form-container">
            <div className="nexus-logo-section">
              <div className="nexus-logo">
                <img src="/assets/nexus-big-logo.png" alt="" />
              </div>
            </div>

            <div className="nexus-form-header">
              <h3>{isSignUp ? "sign up with:" : "sign in with:"}</h3>
            </div>

            <div className="nexus-social-buttons">
              <button className="nexus-social-btn nexus-google-btn" onClick={() => handleSocialLogin("google")}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                google
              </button>
              <button className="nexus-social-btn nexus-facebook-btn" onClick={() => handleSocialLogin("facebook")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                facebook
              </button>
            </div>

            <div className="nexus-divider">
              <span>or Email</span>
            </div>

            {error && <div className="nexus-error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="nexus-login-form">
              {isSignUp && (
                <div className="nexus-form-group">
                  <div className="nexus-input-container">
                    <svg
                      className="nexus-input-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="nexus-form-group">
                <div className="nexus-input-container">
                  <svg
                    className="nexus-input-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="nexus-form-group">
                <div className="nexus-input-container">
                  <svg
                    className="nexus-input-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <>
                  <div className="nexus-form-group">
                    <div className="nexus-input-container">
                      <svg
                        className="nexus-input-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <circle cx="12" cy="16" r="1" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="nexus-form-row">
                    <div className="nexus-form-group nexus-half-width">
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="nexus-form-group nexus-half-width">
                      <select name="education" value={formData.education} onChange={handleInputChange} required>
                        <option value="">undergraduate</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Postgraduate</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="nexus-submit-btn" disabled={isLoading}>
                {isLoading ? "Please wait..." : isSignUp ? "Get started" : "Sign in"}
              </button>
            </form>

            <div className="nexus-form-footer">
              <p>
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button type="button" className="nexus-toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
                  {isSignUp ? "Login" : "Sign up"}
                </button>
              </p>
            </div>
          </div>

          {/* Decorative waves */}
          <div className="nexus-decorative-waves">
            <img src="/assets/linear-wave-rainbow.png" alt="" />
          </div>
        </div>
      </div>

      {/* Website Footer */}
    
    </div>
  )
}

export default Login
