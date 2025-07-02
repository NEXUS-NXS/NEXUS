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
  Play,
  RefreshCw,
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
  const { user, getAccessToken } = useUser()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [certificates, setCertificates] = useState([])
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [activeTab, setActiveTab] = useState("certificates")
  const [recommendedCertifications, setRecommendedCertifications] = useState([])
  const [courseProgress, setCourseProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Mock course progress data for fallback
  const mockCourseProgress = {
    1: {
      progress: 65,
      completed_lessons: 13,
      total_lessons: 20,
      next_lesson: 'Advanced Probability Models',
      last_accessed: '2023-10-15T14:30:00Z'
    },
    2: {
      progress: 30,
      completed_lessons: 6,
      total_lessons: 20,
      next_lesson: 'Data Visualization with Python',
      last_accessed: '2023-10-10T09:15:00Z'
    }
  };

  const fetchWithRetry = async (url, options, retries = 2, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        error.message = 'Request timed out. Please check your connection and try again.';
        error.isNetworkError = true;
        throw error;
      }
      
      if (error instanceof TypeError) {
        error.isNetworkError = true;
        error.message = 'Unable to connect to the server. Please check your internet connection.';
        throw error;
      }

      if (retries > 0) {
        console.warn(`Request failed, ${retries} retries left. Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      
      throw error;
    }
  };

  const fetchCourseProgress = async () => {
    let errorMessage = 'Unable to fetch course progress. ';
    
    try {
      const token = getAccessToken();
      if (!token) {
        errorMessage += 'No authentication token found. Please log in again.';
        throw new Error(errorMessage);
      }

      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://127.0.0.1:8000/courses/api/enrolled-courses/'
        : '/courses/api/enrolled-courses/';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const options = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
        signal: controller.signal
      };
      
      try {
        const data = await fetchWithRetry(apiUrl, options);
        clearTimeout(timeoutId);
        
        if (!data || !Array.isArray(data)) {
          console.warn('Invalid data format received from API:', data);
          throw new Error('Received invalid data format from server');
        }
        
        const progressMap = {};
        let hasValidCourses = false;
        
        data.forEach(course => {
          if (course?.id) {
            progressMap[course.id] = {
              progress: Math.min(100, Math.max(0, course.progress || 0)), // Ensure progress is between 0-100
              completed_lessons: Math.max(0, course.completed_lessons || 0),
              total_lessons: Math.max(1, course.total_lessons || 1), // Ensure at least 1 to avoid division by zero
              next_lesson: course.next_lesson || 'Not specified'
            };
            hasValidCourses = true;
          }
        });
        
        if (!hasValidCourses) {
          console.log('No valid course data found in response');
          return {}; // Return empty object if no valid courses
        }
        
        setCourseProgress(progressMap);
        return progressMap;
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (error) {
      console.error('Error in fetchCourseProgress:', error);
      
      if (error.isNetworkError) {
        errorMessage += 'Network error - ' + error.message;
      } else if (error.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to view this content.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        errorMessage = 'The server is currently unavailable. Please try again later.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The server is taking too long to respond.';
      } else {
        errorMessage += error.message || 'An unknown error occurred.';
      }
      
      setError(errorMessage);
      setCourseProgress({});
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async (isRetry = false) => {
      if (loading && !isRetry) return; // Prevent multiple simultaneous requests
      
      setLoading(true);
      if (isRetry) {
        setError(null); // Clear error on retry
      }
      
      try {
        // Only fetch the data we need for the current view
        await Promise.all([
          fetchCertificates().catch(err => {
            if (!isRetry) console.warn('Error fetching certificates:', err);
            return null;
          }),
          fetchCourseProgress().catch(err => {
            if (!isRetry) console.warn('Error in fetchCourseProgress:', err);
            return null;
          })
        ]);
        
        // Update last successful update time
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Critical error in fetchData:', err);
        if (!error) {
          setError(isOnline 
            ? 'Unable to load certificate data. The server may be unavailable.'
            : 'You are currently offline. Please check your internet connection.'
          );
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up a refresh interval to try fetching data again every 2 minutes
    const refreshInterval = setInterval(() => {
      if (navigator.onLine) { // Only try to refresh if we're online
        console.log('Refreshing certificate data...');
        fetchData();
      }
    }, 120000); // 2 minutes
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [error, certificates.length]); // Only re-run if error state changes

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Try to refresh data when coming back online
      if (error || certificates.length === 0) {
        fetchData()
      }
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      if (!error) {
        setError('You are currently offline. Some features may be limited.')
      }
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [error, certificates.length])
  
  // Filter certificates when dependencies change
  useEffect(() => {
    filterCertificates()
  }, [selectedCategory, selectedStatus, searchQuery, certificates])

  const fetchCertificates = async () => {
    let errorMessage = 'Unable to fetch certificates. ';
    
    try {
      const token = getAccessToken();
      if (!token) {
        errorMessage += 'No authentication token found. Please log in again.';
        throw new Error(errorMessage);
      }

      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://127.0.0.1:8000/api/certificates/'
        : '/api/certificates/';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const options = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
        signal: controller.signal
      };
      
      try {
        const response = await fetchWithRetry(apiUrl, options);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          error.status = response.status;
          throw error;
        }
        
        const data = await response.json();
        const certs = Array.isArray(data.results) ? data.results : [];
        
        // Clear any previous errors if we got a successful response
        if (error) {
          setError(null);
        }
        
        setCertificates(certs);
        return certs;
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      
    } catch (err) {
      console.error('Error in fetchCertificates:', err);
      
      if (err.isNetworkError) {
        errorMessage += 'Network error - ' + err.message;
      } else if (err.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.status === 403) {
        errorMessage = 'You do not have permission to view certificates.';
      } else if (err.status === 404) {
        errorMessage = 'The certificates endpoint was not found.';
      } else if (err.status >= 500) {
        errorMessage = 'The server is currently unavailable. Please try again later.';
      } else if (err.name === 'AbortError') {
        errorMessage = 'Request timed out. The server is taking too long to respond.';
      } else {
        errorMessage += err.message || 'An unknown error occurred.';
      }
      
      setError(errorMessage);
      setCertificates([]);
      return [];
    }
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
        image: "/assets/nexus-white-logo.png",
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
        image: "/assets/nexus-white-logo.png",
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
        image: "/assets/nexus-white-logo.png",
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
        image: "/assets/nexus-white-logo.png",
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

  // Format last updated time
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    return `Last updated: ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="certificates-page">
      {/* Status Bar */}
      <div className={`status-bar ${!isOnline ? 'offline' : ''}`}>
        <div className="status-indicator">
          <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        {lastUpdated && (
          <div className="last-updated">
            {formatLastUpdated(lastUpdated)}
          </div>
        )}
        {loading && (
          <div className="status-loading">
            <RefreshCw size={14} className="spinner" />
            <span>Updating...</span>
          </div>
        )}
        {error && !loading && (
          <div className="status-error">
            <span>{error}</span>
            <button 
              className="retry-button"
              onClick={() => fetchData(true)}
              disabled={!isOnline}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="certificates-header">
        <p>Track your professional certifications and credentials</p>
      </div>

      <div className="certificates-tabs">
        <button
          className={`tab-btn ${activeTab === "certificates" ? "active" : ""}`}
          onClick={() => setActiveTab("certificates")}
          aria-selected={activeTab === "certificates"}
          aria-controls="certificates-tab"
          id="certificates-tab-button"
        >
          <Award size={16} className="tab-icon" />
          <span className="tab-text">My Certificates</span>
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
                  filteredCertificates.map((certificate) => {
                    const progress = courseProgress[certificate.course_id]
                    const isInProgress = certificate.status === 'in-progress' || (progress && progress.progress < 100)
                    
                    return (
                      <div 
                        key={certificate.id} 
                        className="certificate-card"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        <div className="certificate-image">
                          <img 
                            src={certificate.image || "/assets/nexus-white-logo.png"} 
                            alt={certificate.title} 
                          />
                        </div>
                        <div className="certificate-details">
                          <h3>{certificate.title}</h3>
                          <p className="issuer">{certificate.issuer}</p>
                          
                          {isInProgress && progress ? (
                            <div className="progress-container">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${progress.progress}%` }}
                                />
                              </div>
                              <div className="progress-stats">
                                <span>{progress.completed_lessons || 0} of {progress.total_lessons || 0} lessons</span>
                                <span>{Math.round(progress.progress || 0)}% Complete</span>
                              </div>
                              {progress.next_lesson && (
                                <div className="next-lesson">
                                  <Play size={14} /> Next: {progress.next_lesson}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="status-badge">
                              <div className={`status-dot ${certificate.status}`} />
                              <span className="status-text">
                                {certificate.status === 'completed' ? 'Completed' : 'Not Started'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : certificates.length === 0 ? (
                  <div className="no-certificates">
                    <div className="empty-state">
                      <img 
                        src="/assets/nexus-big-logo.png" 
                        alt="No certificates" 
                        className="empty-state-image"
                      />
                      <h3>No Enrolled Courses</h3>
                      <p>You haven't enrolled in any courses yet. Explore our learning hub to find courses that interest you!</p>
                      <div className="empty-state-actions">
                        <button 
                          className="primary-button"
                          onClick={() => {
                            window.location.href = '/learninghub';
                          }}
                        >
                          <BookOpen size={16} style={{ marginRight: '8px' }} />
                          Browse Courses
                        </button>
                        <button 
                          className="secondary-button"
                          onClick={() => navigate("/my-certificates")}
                        >
                          <RefreshCw size={16} style={{ marginRight: '8px' }} />
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-certificates">
                    <p>No certificates match your current filters.</p>
                    <button 
                      className="secondary-button"
                      onClick={() => {
                        // Reset all filters
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                      }}
                    >
                      Clear Filters
                    </button>
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
                    <img src={cert.image || "/public/assets/nexus (1).png"} alt={cert.title} />
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
