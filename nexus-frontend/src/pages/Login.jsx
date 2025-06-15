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
          setIsLoading(false)
          return
        }
        const success = await register(
          formData.fullName,
          formData.email,
          formData.password,
          formData.confirmPassword,
          formData.gender,
          formData.education
        )
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
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    // Social login not implemented
  }

  return (
    <div className="nexus-login-page">
      <div className="nexus-login-container">
        {/* Left Panel */}
        <div className="nexus-login-left">
          <div className="nexus-login-illustration">
            <div className="nexus-math-drawings">
              <MathClock />
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
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="nexus-form-row">
                    <div className="nexus-form-group nexus-half-width">
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="nexus-form-group nexus-half-width">
                      <select name="education" value={formData.education} onChange={handleInputChange} required>
                        <option value="">Education</option>
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

          <div className="nexus-decorative-waves">
            <img src="/assets/linear-wave-rainbow.png" alt="" />
          </div>
        </div>
      </div>
      {/* Website Footer */}
      <footer className="nexus-website-footer">
        <div className="nexus-footer-content">
          <div className="nexus-footer-section">
            <div className="nexus-footer-logo">
              <div className="nexus-footer-logo-icon">
                <img src="/assets/nexus-white-logo.png" alt="" />
              </div>
            </div>
            <p className="nexus-footer-description">
              Empowering actuarial professionals with cutting-edge tools, comprehensive resources, and a thriving
              community to advance their careers.
            </p>
            <div className="nexus-footer-social">
              <a href="#" className="nexus-social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="nexus-social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="nexus-social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="nexus-social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="nexus-footer-section">
            <h4 className="nexus-footer-title">Platform</h4>
            <ul className="nexus-footer-links">
              <li>
                <Link to="/courses">Courses</Link>
              </li>
              <li>
                <Link to="/simulations">Simulations</Link>
              </li>
              <li>
                <Link to="/study-groups">Study Groups</Link>
              </li>
              <li>
                <Link to="/career-guidance">Career Guidance</Link>
              </li>
              <li>
                <Link to="/certifications">Certifications</Link>
              </li>
              <li>
                <Link to="/resources">Resources</Link>
              </li>
            </ul>
          </div>

          <div className="nexus-footer-section">
            <h4 className="nexus-footer-title">Company</h4>
            <ul className="nexus-footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/press">Press</Link>
              </li>
              <li>
                <Link to="/partnerships">Partnerships</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="nexus-footer-section">
            <h4 className="nexus-footer-title">Support</h4>
            <ul className="nexus-footer-links">
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/documentation">Documentation</Link>
              </li>
              <li>
                <Link to="/community">Community</Link>
              </li>
              <li>
                <Link to="/status">System Status</Link>
              </li>
              <li>
                <Link to="/feedback">Feedback</Link>
              </li>
            </ul>
          </div>

          <div className="nexus-footer-section">
            <h4 className="nexus-footer-title">Legal</h4>
            <ul className="nexus-footer-links">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/security">Security</Link>
              </li>
              <li>
                <Link to="/compliance">Compliance</Link>
              </li>
            </ul>
          </div>

          <div className="nexus-footer-section">
            <h4 className="nexus-footer-title">Contact Info</h4>
            <div className="nexus-footer-contact">
              <p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@nexus.com
              </p>
              <p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +1 (555) 123-4567
              </p>
              <p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                123 Actuarial Street
                <br />
                New York, NY 10001
              </p>
            </div>
          </div>
        </div>

        <div className="nexus-footer-bottom">
          <div className="nexus-footer-bottom-content">
            <p>&copy; 2025 Nexus. All rights reserved.</p>
            <div className="nexus-footer-bottom-links">
              <Link to="/accessibility">Accessibility</Link>
              <Link to="/sitemap">Sitemap</Link>
              <span>Made with ❤️ for actuaries</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Login