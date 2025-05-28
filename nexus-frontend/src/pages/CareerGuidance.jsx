"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  ChevronRight,
  BookOpen,
  Users,
  Award,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import "./CareerGuidance.css"

const jobCategories = [
  { id: "all", name: "All Categories" },
  { id: "actuary", name: "Actuarial" },
  { id: "data", name: "Data Science" },
  { id: "risk", name: "Risk Management" },
  { id: "insurance", name: "Insurance" },
  { id: "finance", name: "Finance" },
  { id: "consulting", name: "Consulting" },
]

const jobLocations = [
  { id: "all", name: "All Locations" },
  { id: "remote", name: "Remote" },
  { id: "us", name: "United States" },
  { id: "canada", name: "Canada" },
  { id: "uk", name: "United Kingdom" },
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia" },
]

const experienceLevels = [
  { id: "all", name: "All Levels" },
  { id: "entry", name: "Entry Level" },
  { id: "mid", name: "Mid Level" },
  { id: "senior", name: "Senior Level" },
  { id: "executive", name: "Executive" },
]

const CareerGuidance = () => {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [activeTab, setActiveTab] = useState("jobs")
  const [selectedJob, setSelectedJob] = useState(null)
  const [careerPaths, setCareerPaths] = useState([])
  const [mentors, setMentors] = useState([])

  useEffect(() => {
    fetchJobs()
    fetchCareerPaths()
    fetchMentors()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [selectedCategory, selectedLocation, selectedExperience, searchQuery, jobs])

  const fetchJobs = async () => {
    // Simulate API call
    const mockJobs = [
      {
        id: 1,
        title: "Actuarial Analyst",
        company: "Global Insurance Co.",
        location: "New York, NY",
        locationType: "us",
        category: "actuary",
        experience: "entry",
        salary: "$70,000 - $90,000",
        description:
          "We are seeking an Actuarial Analyst to join our team. The ideal candidate will have passed at least two actuarial exams and have strong analytical skills.",
        requirements: [
          "Bachelor's degree in Actuarial Science, Mathematics, Statistics, or related field",
          "Passed at least 2 actuarial exams (SOA or CAS)",
          "Proficiency in Excel and programming languages (R, Python)",
          "Strong analytical and problem-solving skills",
          "Excellent communication skills",
        ],
        responsibilities: [
          "Analyze statistical data to calculate insurance risks and premiums",
          "Develop and maintain actuarial models",
          "Prepare reports and presentations for management",
          "Support pricing and reserving activities",
          "Collaborate with underwriting and claims departments",
        ],
        postedDate: "2024-01-05T10:00:00Z",
        logo: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 2,
        title: "Senior Actuarial Consultant",
        company: "Deloitte",
        location: "Remote",
        locationType: "remote",
        category: "consulting",
        experience: "senior",
        salary: "$120,000 - $150,000",
        description:
          "Deloitte's Actuarial & Insurance Solutions practice is seeking a Senior Actuarial Consultant to join our growing team. The ideal candidate will have a strong background in life insurance and experience with actuarial modeling software.",
        requirements: [
          "Bachelor's degree in Actuarial Science, Mathematics, Statistics, or related field",
          "ASA or FSA designation",
          "5+ years of actuarial experience in life insurance",
          "Experience with actuarial modeling software (Prophet, MG-ALFA, etc.)",
          "Strong project management skills",
        ],
        responsibilities: [
          "Lead actuarial projects for clients in the life insurance industry",
          "Develop and review actuarial models",
          "Provide technical guidance to junior team members",
          "Prepare client deliverables and presentations",
          "Contribute to business development activities",
        ],
        postedDate: "2024-01-08T14:30:00Z",
        logo: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 3,
        title: "Data Scientist - Actuarial",
        company: "Progressive Insurance",
        location: "Columbus, OH",
        locationType: "us",
        category: "data",
        experience: "mid",
        salary: "$95,000 - $115,000",
        description:
          "Progressive is looking for a Data Scientist with actuarial knowledge to join our advanced analytics team. The ideal candidate will have experience applying machine learning techniques to insurance problems.",
        requirements: [
          "Master's degree in Data Science, Statistics, Actuarial Science, or related field",
          "3+ years of experience in data science or actuarial work",
          "Proficiency in Python, R, and SQL",
          "Experience with machine learning frameworks (TensorFlow, PyTorch, etc.)",
          "Knowledge of insurance pricing and risk assessment",
        ],
        responsibilities: [
          "Develop predictive models for insurance pricing and risk assessment",
          "Analyze large datasets to identify patterns and trends",
          "Collaborate with actuarial and product teams",
          "Implement machine learning solutions in production environments",
          "Present findings to technical and non-technical stakeholders",
        ],
        postedDate: "2024-01-10T09:15:00Z",
        logo: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 4,
        title: "Risk Management Analyst",
        company: "JP Morgan Chase",
        location: "London, UK",
        locationType: "uk",
        category: "risk",
        experience: "entry",
        salary: "£45,000 - £55,000",
        description:
          "JP Morgan Chase is seeking a Risk Management Analyst to join our team in London. The ideal candidate will have a strong quantitative background and interest in financial risk management.",
        requirements: [
          "Bachelor's degree in Finance, Economics, Mathematics, or related field",
          "0-2 years of experience in risk management or related field",
          "Strong analytical and quantitative skills",
          "Knowledge of financial markets and products",
          "Excellent communication and presentation skills",
        ],
        responsibilities: [
          "Analyze financial data to identify and assess risks",
          "Develop and maintain risk models",
          "Prepare risk reports for management",
          "Monitor compliance with risk policies and regulations",
          "Collaborate with other departments to implement risk mitigation strategies",
        ],
        postedDate: "2024-01-12T11:45:00Z",
        logo: "/placeholder.svg?height=60&width=60",
      },
      {
        id: 5,
        title: "Actuarial Manager",
        company: "Prudential Financial",
        location: "Newark, NJ",
        locationType: "us",
        category: "actuary",
        experience: "senior",
        salary: "$130,000 - $160,000",
        description:
          "Prudential Financial is seeking an Actuarial Manager to lead our pricing team. The ideal candidate will have a strong background in life insurance pricing and experience managing a team of actuaries.",
        requirements: [
          "Bachelor's degree in Actuarial Science, Mathematics, Statistics, or related field",
          "FSA designation",
          "7+ years of actuarial experience in life insurance",
          "Experience managing a team of actuaries",
          "Strong leadership and communication skills",
        ],
        responsibilities: [
          "Lead a team of actuaries in developing and maintaining pricing models",
          "Review and approve pricing assumptions and methodologies",
          "Collaborate with product development and marketing teams",
          "Present pricing recommendations to senior management",
          "Mentor and develop junior actuaries",
        ],
        postedDate: "2024-01-07T13:20:00Z",
        logo: "/placeholder.svg?height=60&width=60",
      },
    ]

    setJobs(mockJobs)
    setFilteredJobs(mockJobs)
  }

  const fetchCareerPaths = async () => {
    // Simulate API call
    const mockCareerPaths = [
      {
        id: 1,
        title: "Traditional Actuarial Path",
        description:
          "Follow the traditional path to becoming a fully qualified actuary through professional exams and work experience.",
        steps: [
          {
            title: "Entry Level Actuarial Analyst",
            description: "Start as an actuarial analyst while passing initial exams (P/1, FM/2).",
            duration: "1-2 years",
            skills: ["Basic Statistics", "Financial Mathematics", "Excel", "VBA"],
            certifications: ["SOA Exam P/CAS Exam 1", "SOA Exam FM/CAS Exam 2"],
          },
          {
            title: "Actuarial Associate",
            description: "Progress to associate level while continuing to pass exams.",
            duration: "3-5 years",
            skills: ["Advanced Statistics", "Life Contingencies", "Pricing", "Reserving", "R or Python"],
            certifications: ["ASA (SOA) or ACAS (CAS)"],
          },
          {
            title: "Actuarial Manager",
            description: "Move into management roles while completing fellowship exams.",
            duration: "5-8 years",
            skills: ["Team Leadership", "Project Management", "Business Acumen", "Communication"],
            certifications: ["FSA (SOA) or FCAS (CAS)"],
          },
          {
            title: "Actuarial Director/VP",
            description: "Senior leadership role overseeing actuarial functions.",
            duration: "10+ years",
            skills: ["Strategic Planning", "Executive Communication", "Business Development"],
            certifications: ["FSA/FCAS with 10+ years experience"],
          },
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 2,
        title: "Data Science in Insurance",
        description: "Combine actuarial knowledge with data science skills to work on advanced analytics in insurance.",
        steps: [
          {
            title: "Actuarial Analyst with Data Focus",
            description: "Start with a focus on data analysis while passing initial exams.",
            duration: "1-2 years",
            skills: ["Python", "R", "SQL", "Basic Machine Learning", "Statistical Modeling"],
            certifications: ["1-2 Actuarial Exams", "Data Science Certifications"],
          },
          {
            title: "Insurance Data Scientist",
            description: "Transition to a dedicated data science role within insurance.",
            duration: "3-5 years",
            skills: ["Advanced Machine Learning", "Predictive Modeling", "Big Data Technologies", "Cloud Platforms"],
            certifications: ["ASA/ACAS (optional)", "Machine Learning Certifications"],
          },
          {
            title: "Lead Data Scientist",
            description: "Lead data science projects and teams in insurance.",
            duration: "5-8 years",
            skills: ["Team Leadership", "Advanced AI Techniques", "MLOps", "Business Strategy"],
            certifications: ["Advanced Data Science Certifications"],
          },
          {
            title: "Chief Data Officer/Analytics Executive",
            description: "Executive role overseeing data strategy and analytics.",
            duration: "10+ years",
            skills: ["Executive Leadership", "Strategic Planning", "Digital Transformation"],
            certifications: ["Executive Education in Data Strategy"],
          },
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: 3,
        title: "Risk Management Specialist",
        description: "Focus on enterprise risk management and regulatory compliance in financial institutions.",
        steps: [
          {
            title: "Risk Analyst",
            description: "Entry-level role focusing on risk identification and assessment.",
            duration: "1-2 years",
            skills: ["Risk Analysis", "Regulatory Knowledge", "Financial Modeling", "Excel"],
            certifications: ["1-2 Actuarial Exams", "FRM Part I"],
          },
          {
            title: "Senior Risk Analyst",
            description: "Advanced risk analysis and modeling.",
            duration: "3-5 years",
            skills: ["Advanced Risk Modeling", "Stress Testing", "Regulatory Reporting", "Programming Skills"],
            certifications: ["FRM", "PRM", "ASA/ACAS (optional)"],
          },
          {
            title: "Risk Manager",
            description: "Manage risk functions and develop risk frameworks.",
            duration: "5-8 years",
            skills: ["Enterprise Risk Management", "Team Leadership", "Regulatory Relations", "Strategic Planning"],
            certifications: ["CERA", "FRM with experience"],
          },
          {
            title: "Chief Risk Officer",
            description: "Executive role overseeing all risk management activities.",
            duration: "10+ years",
            skills: ["Executive Leadership", "Corporate Governance", "Strategic Risk Management"],
            certifications: ["CERA/FRM with extensive experience"],
          },
        ],
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    setCareerPaths(mockCareerPaths)
  }

  const fetchMentors = async () => {
    // Simulate API call
    const mockMentors = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Chief Actuary",
        company: "Global Insurance Co.",
        experience: "20+ years",
        specialties: ["Life Insurance", "Pricing", "Product Development"],
        bio: "Dr. Johnson is a Fellow of the Society of Actuaries with over 20 years of experience in the life insurance industry. She has led pricing and product development teams at several major insurers and is passionate about mentoring the next generation of actuaries.",
        availability: "2 hours/week",
        rating: 4.9,
        reviews: 45,
        image: "/placeholder.svg?height=120&width=120",
      },
      {
        id: 2,
        name: "Michael Chen",
        title: "Director of Data Science",
        company: "Progressive Insurance",
        experience: "15+ years",
        specialties: ["Predictive Modeling", "Machine Learning", "Telematics"],
        bio: "Michael began his career as an actuary and transitioned to data science, where he now leads a team of data scientists developing cutting-edge predictive models for auto insurance. He specializes in helping actuaries develop their data science skills.",
        availability: "1 hour/week",
        rating: 4.8,
        reviews: 32,
        image: "/placeholder.svg?height=120&width=120",
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        title: "Risk Management Partner",
        company: "Deloitte",
        experience: "18+ years",
        specialties: ["Enterprise Risk Management", "Regulatory Compliance", "IFRS 17"],
        bio: "Emily is a Partner at Deloitte specializing in risk management consulting for insurance companies. She has helped numerous organizations implement ERM frameworks and navigate complex regulatory requirements. Emily is dedicated to helping professionals advance their careers in risk management.",
        availability: "3 hours/month",
        rating: 4.7,
        reviews: 28,
        image: "/placeholder.svg?height=120&width=120",
      },
      {
        id: 4,
        name: "David Kim",
        title: "VP of Actuarial Services",
        company: "Prudential Financial",
        experience: "22+ years",
        specialties: ["Pension", "Retirement Planning", "Leadership Development"],
        bio: "David is a Fellow of the Society of Actuaries with extensive experience in pension and retirement planning. He has held leadership positions at several major financial institutions and enjoys mentoring actuaries who aspire to leadership roles.",
        availability: "2 hours/month",
        rating: 4.9,
        reviews: 37,
        image: "/placeholder.svg?height=120&width=120",
      },
    ]

    setMentors(mockMentors)
  }

  const filterJobs = () => {
    let filtered = jobs

    if (selectedCategory !== "all") {
      filtered = filtered.filter((job) => job.category === selectedCategory)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((job) => job.locationType === selectedLocation)
    }

    if (selectedExperience !== "all") {
      filtered = filtered.filter((job) => job.experience === selectedExperience)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query),
      )
    }

    setFilteredJobs(filtered)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleJobClick = (job) => {
    setSelectedJob(job)
  }

  const handleBackToJobs = () => {
    setSelectedJob(null)
  }

  return (
    <div className="career-guidance-page">
      <div className="career-header">
        <h1>Career Guidance</h1>
        <p>Explore opportunities, plan your career path, and connect with mentors</p>
      </div>

      <div className="career-tabs">
        <button className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>
          <Briefcase size={16} />
          Job Opportunities
        </button>
        <button className={`tab-btn ${activeTab === "paths" ? "active" : ""}`} onClick={() => setActiveTab("paths")}>
          <ChevronRight size={16} />
          Career Paths
        </button>
        <button
          className={`tab-btn ${activeTab === "mentors" ? "active" : ""}`}
          onClick={() => setActiveTab("mentors")}
        >
          <Users size={16} />
          Find a Mentor
        </button>
        <button
          className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          <BookOpen size={16} />
          Resources
        </button>
      </div>

      {activeTab === "jobs" && (
        <div className="jobs-tab">
          {!selectedJob ? (
            <>
              <div className="jobs-filters">
                <div className="search-container">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-container">
                  <Filter size={18} />
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {jobCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-container">
                  <MapPin size={18} />
                  <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                    {jobLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-container">
                  <Briefcase size={18} />
                  <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
                    {experienceLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="jobs-list">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div key={job.id} className="job-card" onClick={() => handleJobClick(job)}>
                      <div className="job-card-header">
                        <div className="company-logo">
                          <img src={job.logo || "/placeholder.svg"} alt={job.company} />
                        </div>
                        <div className="job-info">
                          <h3 className="job-title">{job.title}</h3>
                          <p className="company-name">{job.company}</p>
                        </div>
                      </div>
                      <div className="job-details">
                        <div className="job-detail">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="job-detail">
                          <DollarSign size={16} />
                          <span>{job.salary}</span>
                        </div>
                        <div className="job-detail">
                          <Calendar size={16} />
                          <span>Posted {formatDate(job.postedDate)}</span>
                        </div>
                      </div>
                      <p className="job-description">{job.description}</p>
                      <button className="view-job-btn">View Details</button>
                    </div>
                  ))
                ) : (
                  <div className="no-jobs">
                    <p>No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="job-detail-view">
              <button className="back-to-jobs" onClick={handleBackToJobs}>
                ← Back to Jobs
              </button>

              <div className="job-detail-header">
                <div className="company-logo-large">
                  <img src={selectedJob.logo || "/placeholder.svg"} alt={selectedJob.company} />
                </div>
                <div className="job-header-info">
                  <h2>{selectedJob.title}</h2>
                  <p className="company-name">{selectedJob.company}</p>
                  <div className="job-meta">
                    <div className="job-meta-item">
                      <MapPin size={16} />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="job-meta-item">
                      <DollarSign size={16} />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="job-meta-item">
                      <Calendar size={16} />
                      <span>Posted {formatDate(selectedJob.postedDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="job-actions">
                  <button className="apply-btn">Apply Now</button>
                  <button className="save-job-btn">Save Job</button>
                </div>
              </div>

              <div className="job-detail-content">
                <div className="job-section">
                  <h3>Job Description</h3>
                  <p>{selectedJob.description}</p>
                </div>

                <div className="job-section">
                  <h3>Requirements</h3>
                  <ul className="job-list">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="job-section">
                  <h3>Responsibilities</h3>
                  <ul className="job-list">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div className="job-section">
                  <h3>About the Company</h3>
                  <p>
                    {selectedJob.company} is a leading company in the {selectedJob.category} industry. They offer
                    competitive benefits including health insurance, retirement plans, professional development
                    opportunities, and a supportive work environment.
                  </p>
                </div>

                <div className="job-apply-section">
                  <button className="apply-btn-large">Apply for this Position</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "paths" && (
        <div className="career-paths-tab">
          <div className="career-paths-intro">
            <h2>Explore Career Paths</h2>
            <p>
              Discover different career paths in the actuarial and related fields. Each path outlines the typical
              progression, skills required, and certifications that can help you advance.
            </p>
          </div>

          <div className="career-paths-grid">
            {careerPaths.map((path) => (
              <div key={path.id} className="career-path-card">
                <div className="path-header">
                  <h3>{path.title}</h3>
                  <p>{path.description}</p>
                </div>
                <div className="path-timeline">
                  {path.steps.map((step, index) => (
                    <div key={index} className="path-step">
                      <div className="step-marker">{index + 1}</div>
                      <div className="step-content">
                        <h4>{step.title}</h4>
                        <p className="step-duration">{step.duration}</p>
                        <p className="step-description">{step.description}</p>
                        <div className="step-details">
                          <div className="step-skills">
                            <h5>Key Skills:</h5>
                            <ul>
                              {step.skills.map((skill, i) => (
                                <li key={i}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="step-certifications">
                            <h5>Recommended Certifications:</h5>
                            <ul>
                              {step.certifications.map((cert, i) => (
                                <li key={i}>{cert}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="path-actions">
                  <button className="explore-path-btn">Explore Resources</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "mentors" && (
        <div className="mentors-tab">
          <div className="mentors-intro">
            <h2>Connect with Industry Mentors</h2>
            <p>
              Find experienced professionals who can provide guidance, advice, and support as you navigate your
              actuarial career. Our mentors are industry experts willing to share their knowledge and experience.
            </p>
          </div>

          <div className="mentors-grid">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="mentor-card">
                <div className="mentor-header">
                  <div className="mentor-avatar">
                    <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} />
                  </div>
                  <div className="mentor-info">
                    <h3>{mentor.name}</h3>
                    <p className="mentor-title">{mentor.title}</p>
                    <p className="mentor-company">{mentor.company}</p>
                    <div className="mentor-rating">
                      <Star size={16} className="star-icon" />
                      <span>
                        {mentor.rating} ({mentor.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mentor-specialties">
                  {mentor.specialties.map((specialty, index) => (
                    <span key={index} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="mentor-bio">{mentor.bio}</p>
                <div className="mentor-availability">
                  <span>Availability: {mentor.availability}</span>
                  <span>Experience: {mentor.experience}</span>
                </div>
                <div className="mentor-actions">
                  <button className="request-mentor-btn">Request Mentorship</button>
                  <button className="view-profile-btn">View Full Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "resources" && (
        <div className="resources-tab">
          <div className="resources-intro">
            <h2>Career Development Resources</h2>
            <p>
              Access tools and resources to help you advance in your actuarial career, from resume building to interview
              preparation and salary negotiation.
            </p>
          </div>

          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon resume-icon">
                <Briefcase size={24} />
              </div>
              <div className="resource-content">
                <h3>Resume Builder</h3>
                <p>
                  Create a professional resume tailored for actuarial positions. Our templates highlight the skills and
                  certifications that employers are looking for.
                </p>
                <button className="resource-btn">Build Resume</button>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon interview-icon">
                <Users size={24} />
              </div>
              <div className="resource-content">
                <h3>Interview Preparation</h3>
                <p>
                  Practice with common actuarial interview questions, technical assessments, and case studies. Get
                  feedback and tips from industry professionals.
                </p>
                <button className="resource-btn">Practice Interviews</button>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon salary-icon">
                <DollarSign size={24} />
              </div>
              <div className="resource-content">
                <h3>Salary Guide</h3>
                <p>
                  Access up-to-date salary information for actuarial positions across different industries, experience
                  levels, and geographic locations.
                </p>
                <button className="resource-btn">View Salary Guide</button>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon networking-icon">
                <Users size={24} />
              </div>
              <div className="resource-content">
                <h3>Networking Events</h3>
                <p>
                  Find virtual and in-person networking events, conferences, and webinars to connect with other
                  professionals in the actuarial field.
                </p>
                <button className="resource-btn">Browse Events</button>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon assessment-icon">
                <Award size={24} />
              </div>
              <div className="resource-content">
                <h3>Skills Assessment</h3>
                <p>
                  Take assessments to identify your strengths and areas for improvement. Get personalized
                  recommendations for courses and resources.
                </p>
                <button className="resource-btn">Start Assessment</button>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon trends-icon">
                <ChevronRight size={24} />
              </div>
              <div className="resource-content">
                <h3>Industry Trends</h3>
                <p>
                  Stay informed about the latest trends and developments in the actuarial field, including emerging
                  technologies and changing regulations.
                </p>
                <button className="resource-btn">Explore Trends</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CareerGuidance
