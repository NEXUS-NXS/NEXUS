"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Award,
  Calendar,
  Download,
  Share2,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import "./MyCertificates.css"

const certificateCategories = [
  { id: "all", name: "All Certificates" },
  { id: "actuarial", name: "Actuarial" },
  { id: "technical", name: "Technical Skills" },
  { id: "professional", name: "Professional Development" },
  { id: "data", name: "Data Science" },
]

const certificateStatuses = [
  { id: "all", name: "All Statuses" },
  { id: "completed", name: "Completed" },
  { id: "in-progress", name: "In Progress" },
  { id: "expired", name: "Expired" },
]

const MyCertificates = () => {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [certificates, setCertificates] = useState([])
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [activeTab, setActiveTab] = useState("certificates")
  const [upcomingExams, setUpcomingExams] = useState([])
  const [recommendedCertifications, setRecommendedCertifications] = useState([])

  useEffect(() => {
    fetchCertificates()
    fetchUpcomingExams()
    fetchRecommendedCertifications()
  }, [])

  useEffect(() => {
    filterCertificates()
  }, [selectedCategory, selectedStatus, searchQuery, certificates])

  const fetchCertificates = async () => {
    // Simulate API call
    const mockCertificates = [
      {
        id: 1,
        title: "Actuarial Science Fundamentals",
        issuer: "Nexus Academy",
        category: "actuarial",
        status: "completed",
        completionDate: "2023-12-15T10:00:00Z",
        expirationDate: "2025-12-15T10:00:00Z",
        credentialId: "NSA-ACT-2023-1234",
        description:
          "This certificate validates proficiency in fundamental actuarial concepts, including probability theory, financial mathematics, and basic modeling techniques.",
        skills: [
          "Probability Theory",
          "Financial Mathematics",
          "Statistical Modeling",
          "Risk Assessment",
          "Actuarial Notation",
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        title: "Python for Actuarial Analysis",
        issuer: "Nexus Academy",
        category: "technical",
        status: "completed",
        completionDate: "2023-10-20T14:30:00Z",
        expirationDate: "2025-10-20T14:30:00Z",
        credentialId: "NSA-PYT-2023-5678",
        description:
          "This certificate demonstrates proficiency in using Python programming for actuarial analysis, including data manipulation, statistical analysis, and visualization.",
        skills: [
          "Python Programming",
          "Data Analysis with Pandas",
          "Statistical Modeling with NumPy",
          "Data Visualization",
          "Actuarial Calculations",
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        title: "Advanced Statistical Methods",
        issuer: "Nexus Academy",
        category: "data",
        status: "in-progress",
        progress: 65,
        estimatedCompletionDate: "2024-03-15T00:00:00Z",
        description:
          "This certificate covers advanced statistical methods used in actuarial science, including regression analysis, time series analysis, and predictive modeling.",
        requiredCourses: [
          { id: 101, title: "Regression Analysis", completed: true },
          { id: 102, title: "Time Series Analysis", completed: true },
          { id: 103, title: "Predictive Modeling", completed: false },
          { id: 104, title: "Multivariate Analysis", completed: false },
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 4,
        title: "Professional Ethics in Actuarial Practice",
        issuer: "Actuarial Standards Board",
        category: "professional",
        status: "completed",
        completionDate: "2023-08-05T09:15:00Z",
        expirationDate: "2024-08-05T09:15:00Z",
        credentialId: "ASB-ETH-2023-9012",
        description:
          "This certificate validates understanding of ethical principles and professional standards in actuarial practice, including confidentiality, integrity, and professional responsibility.",
        skills: [
          "Ethical Decision Making",
          "Professional Standards",
          "Regulatory Compliance",
          "Conflict of Interest Management",
          "Client Communication",
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 5,
        title: "Machine Learning for Insurance",
        issuer: "Data Science Institute",
        category: "data",
        status: "in-progress",
        progress: 30,
        estimatedCompletionDate: "2024-05-20T00:00:00Z",
        description:
          "This certificate covers the application of machine learning techniques to insurance problems, including pricing, claims prediction, and customer segmentation.",
        requiredCourses: [
          { id: 201, title: "Introduction to Machine Learning", completed: true },
          { id: 202, title: "Supervised Learning Techniques", completed: false },
          { id: 203, title: "Unsupervised Learning Techniques", completed: false },
          { id: 204, title: "ML Applications in Insurance", completed: false },
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 6,
        title: "Risk Management Principles",
        issuer: "Global Risk Management Institute",
        category: "actuarial",
        status: "expired",
        completionDate: "2022-05-10T11:30:00Z",
        expirationDate: "2023-05-10T11:30:00Z",
        credentialId: "GRMI-RMP-2022-3456",
        description:
          "This certificate validates understanding of risk management principles and practices, including risk identification, assessment, mitigation, and monitoring.",
        skills: [
          "Risk Identification",
          "Risk Assessment",
          "Risk Mitigation Strategies",
          "Risk Monitoring",
          "Enterprise Risk Management",
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    setCertificates(mockCertificates)
    setFilteredCertificates(mockCertificates)
  }

  const fetchUpcomingExams = async () => {
    // Simulate API call
    const mockExams = [
      {
        id: 1,
        title: "SOA Exam P: Probability",
        date: "2024-03-15T09:00:00Z",
        location: "Online",
        registrationDeadline: "2024-02-15T00:00:00Z",
        status: "registered",
        preparationStatus: 65,
      },
      {
        id: 2,
        title: "SOA Exam FM: Financial Mathematics",
        date: "2024-04-20T09:00:00Z",
        location: "Testing Center - New York",
        registrationDeadline: "2024-03-20T00:00:00Z",
        status: "not-registered",
        preparationStatus: 40,
      },
      {
        id: 3,
        title: "Python Certification Exam",
        date: "2024-02-28T14:00:00Z",
        location: "Online",
        registrationDeadline: "2024-02-15T00:00:00Z",
        status: "registered",
        preparationStatus: 80,
      },
    ]

    setUpcomingExams(mockExams)
  }

  const fetchRecommendedCertifications = async () => {
    // Simulate API call
    const mockRecommendations = [
      {
        id: 101,
        title: "Certified Actuarial Analyst (CAA)",
        issuer: "CAA Global",
        category: "actuarial",
        difficulty: "Intermediate",
        duration: "1-2 years",
        description:
          "The CAA is designed for those working in analytical or technical roles in insurance and financial services who want to develop their careers with an internationally recognized qualification.",
        relevance: "High match based on your profile",
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 102,
        title: "Associate of the Society of Actuaries (ASA)",
        issuer: "Society of Actuaries",
        category: "actuarial",
        difficulty: "Advanced",
        duration: "3-5 years",
        description:
          "The ASA designation is a significant milestone toward fellowship in the SOA and demonstrates a mastery of the fundamental concepts and techniques for modeling and managing risk.",
        relevance: "Career advancement opportunity",
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 103,
        title: "Data Science for Actuaries",
        issuer: "Nexus Academy",
        category: "data",
        difficulty: "Intermediate",
        duration: "6 months",
        description:
          "This certification combines actuarial principles with modern data science techniques, preparing actuaries for the evolving landscape of data-driven decision making.",
        relevance: "Complements your current skills",
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 104,
        title: "Chartered Enterprise Risk Analyst (CERA)",
        issuer: "Society of Actuaries",
        category: "actuarial",
        difficulty: "Advanced",
        duration: "2-3 years",
        description:
          "The CERA credential equips risk professionals to identify, measure, and manage risk within complex business environments across all industries and sectors.",
        relevance: "Expanding career opportunities",
        image: "/placeholder.svg?height=150&width=150",
      },
    ]

    setRecommendedCertifications(mockRecommendations)
  }

  const filterCertificates = () => {
    let filtered = certificates

    if (selectedCategory !== "all") {
      filtered = filtered.filter((cert) => cert.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((cert) => cert.status === selectedStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(query) ||
          cert.issuer.toLowerCase().includes(query) ||
          cert.description.toLowerCase().includes(query),
      )
    }

    setFilteredCertificates(filtered)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateDaysRemaining = (dateString) => {
    const targetDate = new Date(dateString)
    const currentDate = new Date()
    const diffTime = targetDate - currentDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate)
  }

  const handleBackToCertificates = () => {
    setSelectedCertificate(null)
  }

  return (
    <div className="certificates-page">
      <div className="certificates-header">
        <h1>My Certificates</h1>
        <p>Track your professional certifications and credentials</p>
      </div>

      <div className="certificates-tabs">
        <button
          className={`tab-btn ${activeTab === "certificates" ? "active" : ""}`}
          onClick={() => setActiveTab("certificates")}
        >
          <Award size={16} />
          My Certificates
        </button>
        <button className={`tab-btn ${activeTab === "exams" ? "active" : ""}`} onClick={() => setActiveTab("exams")}>
          <Calendar size={16} />
          Upcoming Exams
        </button>
        <button
          className={`tab-btn ${activeTab === "recommended" ? "active" : ""}`}
          onClick={() => setActiveTab("recommended")}
        >
          <BookOpen size={16} />
          Recommended Certifications
        </button>
      </div>

      {activeTab === "certificates" && (
        <div className="certificates-tab">
          {!selectedCertificate ? (
            <>
              <div className="certificates-filters">
                <div className="search-container">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-container">
                  <Filter size={18} />
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {certificateCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-container">
                  <Award size={18} />
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    {certificateStatuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="certificates-grid">
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className={`certificate-card ${certificate.status}`}
                      onClick={() => handleCertificateClick(certificate)}
                    >
                      <div className="certificate-image">
                        <img src={certificate.image || "/placeholder.svg"} alt={certificate.title} />
                        <div className={`certificate-status ${certificate.status}`}>
                          {certificate.status === "completed" && "Completed"}
                          {certificate.status === "in-progress" && "In Progress"}
                          {certificate.status === "expired" && "Expired"}
                        </div>
                      </div>
                      <div className="certificate-info">
                        <h3>{certificate.title}</h3>
                        <p className="certificate-issuer">Issued by {certificate.issuer}</p>

                        {certificate.status === "completed" && (
                          <div className="certificate-dates">
                            <div className="date-item">
                              <span className="date-label">Completed:</span>
                              <span className="date-value">{formatDate(certificate.completionDate)}</span>
                            </div>
                            <div className="date-item">
                              <span className="date-label">Expires:</span>
                              <span className="date-value">{formatDate(certificate.expirationDate)}</span>
                            </div>
                          </div>
                        )}

                        {certificate.status === "in-progress" && (
                          <div className="certificate-progress">
                            <div className="progress-text">
                              <span>{certificate.progress}% Complete</span>
                              <span>Est. completion: {formatDate(certificate.estimatedCompletionDate)}</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${certificate.progress}%` }}></div>
                            </div>
                          </div>
                        )}

                        {certificate.status === "expired" && (
                          <div className="certificate-expired">
                            <p>Expired on {formatDate(certificate.expirationDate)}</p>
                            <button className="renew-btn">Renew Certificate</button>
                          </div>
                        )}
                      </div>
                      <button className="view-certificate-btn">View Details</button>
                    </div>
                  ))
                ) : (
                  <div className="no-certificates">
                    <p>No certificates found matching your criteria.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="certificate-detail-view">
              <button className="back-to-certificates" onClick={handleBackToCertificates}>
                <ArrowLeft size={16} /> Back to Certificates
              </button>

              <div className="certificate-detail-header">
                <div className="certificate-detail-image">
                  <img src={selectedCertificate.image || "/placeholder.svg"} alt={selectedCertificate.title} />
                </div>
                <div className="certificate-detail-info">
                  <h2>{selectedCertificate.title}</h2>
                  <p className="certificate-issuer">Issued by {selectedCertificate.issuer}</p>

                  {selectedCertificate.status === "completed" && (
                    <div className="certificate-meta">
                      <div className="meta-item">
                        <span className="meta-label">Credential ID:</span>
                        <span className="meta-value">{selectedCertificate.credentialId}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Issued Date:</span>
                        <span className="meta-value">{formatDate(selectedCertificate.completionDate)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Expiration Date:</span>
                        <span className="meta-value">{formatDate(selectedCertificate.expirationDate)}</span>
                      </div>
                    </div>
                  )}

                  {selectedCertificate.status === "in-progress" && (
                    <div className="certificate-progress-detail">
                      <div className="progress-header">
                        <span>Progress: {selectedCertificate.progress}%</span>
                        <span>Est. completion: {formatDate(selectedCertificate.estimatedCompletionDate)}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${selectedCertificate.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="certificate-actions">
                  {selectedCertificate.status === "completed" && (
                    <>
                      <button className="download-btn">
                        <Download size={16} /> Download
                      </button>
                      <button className="share-btn">
                        <Share2 size={16} /> Share
                      </button>
                    </>
                  )}
                  {selectedCertificate.status === "expired" && (
                    <button className="renew-btn-large">Renew Certificate</button>
                  )}
                </div>
              </div>

              <div className="certificate-detail-content">
                <div className="certificate-section">
                  <h3>Description</h3>
                  <p>{selectedCertificate.description}</p>
                </div>

                {selectedCertificate.skills && (
                  <div className="certificate-section">
                    <h3>Skills Certified</h3>
                    <div className="skills-list">
                      {selectedCertificate.skills.map((skill, index) => (
                        <div key={index} className="skill-tag">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCertificate.requiredCourses && (
                  <div className="certificate-section">
                    <h3>Required Courses</h3>
                    <div className="courses-list">
                      {selectedCertificate.requiredCourses.map((course) => (
                        <div key={course.id} className={`course-item ${course.completed ? "completed" : ""}`}>
                          <div className="course-status">
                            {course.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                          </div>
                          <div className="course-title">{course.title}</div>
                          <div className="course-action">
                            {course.completed ? (
                              <span className="completed-text">Completed</span>
                            ) : (
                              <button className="start-course-btn">Start</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCertificate.status === "completed" && (
                  <div className="certificate-section">
                    <h3>Verification</h3>
                    <p>
                      This certificate can be verified using the credential ID:
                      <strong>{selectedCertificate.credentialId}</strong>
                    </p>
                    <button className="verify-btn">Verify Certificate</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "exams" && (
        <div className="exams-tab">
          <div className="exams-intro">
            <h2>Upcoming Certification Exams</h2>
            <p>Track your exam schedule and preparation progress</p>
          </div>

          <div className="exams-list">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <div className="exam-header">
                  <h3>{exam.title}</h3>
                  <div className={`exam-status ${exam.status}`}>
                    {exam.status === "registered" ? "Registered" : "Not Registered"}
                  </div>
                </div>

                <div className="exam-details">
                  <div className="exam-detail">
                    <Calendar size={16} />
                    <div>
                      <strong>Exam Date:</strong>
                      <p>{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <div className="exam-detail">
                    <MapPin size={16} />
                    <div>
                      <strong>Location:</strong>
                      <p>{exam.location}</p>
                    </div>
                  </div>
                </div>

                <div className="exam-preparation">
                  <div className="preparation-header">
                    <span>Preparation Progress</span>
                    <span>{exam.preparationStatus}%</span>
                  </div>
                  <div className="preparation-bar">
                    <div className="preparation-fill" style={{ width: `${exam.preparationStatus}%` }}></div>
                  </div>
                </div>

                <div className="exam-countdown">
                  <div className="countdown-value">{calculateDaysRemaining(exam.date)}</div>
                  <div className="countdown-label">Days Remaining</div>
                </div>

                <div className="exam-actions">
                  {exam.status === "registered" ? (
                    <>
                      <button className="study-materials-btn">Study Materials</button>
                      <button className="schedule-btn">View Details</button>
                    </>
                  ) : (
                    <button className="register-btn">Register Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="schedule-exam-section">
            <h3>Need to schedule more exams?</h3>
            <button className="schedule-exam-btn">Browse Available Exams</button>
          </div>
        </div>
      )}

      {activeTab === "recommended" && (
        <div className="recommended-tab">
          <div className="recommended-intro">
            <h2>Recommended Certifications</h2>
            <p>
              Based on your profile, skills, and career goals, we've identified these certifications that could help
              advance your career
            </p>
          </div>

          <div className="recommended-grid">
            {recommendedCertifications.map((cert) => (
              <div key={cert.id} className="recommended-card">
                <div className="recommended-header">
                  <div className="recommended-image">
                    <img src={cert.image || "/placeholder.svg"} alt={cert.title} />
                  </div>
                  <div className="recommended-info">
                    <h3>{cert.title}</h3>
                    <p className="recommended-issuer">Issued by {cert.issuer}</p>
                    <div className="recommended-meta">
                      <span className="meta-difficulty">{cert.difficulty}</span>
                      <span className="meta-duration">{cert.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="recommended-description">{cert.description}</p>

                <div className="recommended-relevance">
                  <div className="relevance-badge">{cert.relevance}</div>
                </div>

                <div className="recommended-actions">
                  <button className="explore-btn">Explore Certification</button>
                  <button className="add-goal-btn">Add to Goals</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCertificates
