"use client"

import { useState } from "react"
import "./MentorMatch.css"
import MentorProfile from "./MentorProfile"
import ScheduleMeeting from "./ScheduleMeeting"

const MentorMatch = () => {
  const [currentView, setCurrentView] = useState("matches") // "matches", "profile", "schedule"
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [mentors] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=80&width=80",
      available: true,
      matchPercentage: 95,
      fields: ["Data Science", "Machine Learning", "AI"],
      experience: "8 years",
      about:
        "Experienced professional specializing in Data Science, Machine Learning, AI. Ready to help students navigate their career path and develop essential skills.",
      rating: 4.9,
      location: "San Francisco, CA",
      responseTime: "Usually responds within 2 hours",
      totalMentees: 150,
      completedSessions: 500,
      specialties: [
        "Machine Learning Model Development",
        "Data Pipeline Architecture",
        "Career Transition Guidance",
        "Technical Interview Preparation",
        "Research Paper Writing",
      ],
      education: [
        {
          degree: "PhD in Computer Science",
          school: "Stanford University",
          year: "2016",
        },
        {
          degree: "MS in Statistics",
          school: "UC Berkeley",
          year: "2012",
        },
      ],
      certifications: [
        "Google Cloud Professional ML Engineer",
        "AWS Certified Machine Learning",
        "TensorFlow Developer Certificate",
      ],
      reviews: [
        {
          name: "Alex Chen",
          rating: 5,
          comment: "Sarah helped me transition from software engineering to data science. Her guidance was invaluable!",
          date: "2 weeks ago",
        },
        {
          name: "Maria Rodriguez",
          rating: 5,
          comment: "Excellent mentor! Very knowledgeable and patient. Highly recommend for anyone in ML.",
          date: "1 month ago",
        },
      ],
    },
    {
      id: 2,
      name: "John Doe",
      avatar: "/placeholder.svg?height=80&width=80",
      available: true,
      matchPercentage: 87,
      fields: ["Data Science", "Machine Learning", "AI"],
      experience: "5 years",
      about:
        "Experienced professional specializing in Data Science, Machine Learning, AI. Ready to help students navigate their career path and develop essential skills.",
      rating: 4.7,
      location: "New York, NY",
      responseTime: "Usually responds within 4 hours",
      totalMentees: 89,
      completedSessions: 320,
      specialties: [
        "Python Programming",
        "Statistical Analysis",
        "Data Visualization",
        "Machine Learning Algorithms",
        "Career Development",
      ],
      education: [
        {
          degree: "MS in Data Science",
          school: "NYU",
          year: "2018",
        },
        {
          degree: "BS in Mathematics",
          school: "Columbia University",
          year: "2016",
        },
      ],
      certifications: [
        "Certified Analytics Professional",
        "Google Data Analytics Certificate",
        "Microsoft Azure Data Scientist",
      ],
      reviews: [
        {
          name: "Jennifer Kim",
          rating: 5,
          comment: "John is an amazing mentor who really cares about his mentees' success.",
          date: "1 week ago",
        },
        {
          name: "David Park",
          rating: 4,
          comment: "Great insights into the data science field. Very helpful for career planning.",
          date: "3 weeks ago",
        },
      ],
    },
    {
      id: 3,
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=80&width=80",
      available: false,
      matchPercentage: 92,
      fields: ["Software Engineering", "React", "Node.js"],
      experience: "6 years",
      about:
        "Full-stack developer with expertise in modern web technologies. Passionate about helping junior developers build scalable applications and advance their careers.",
      rating: 4.8,
      location: "Seattle, WA",
      responseTime: "Usually responds within 6 hours",
      totalMentees: 120,
      completedSessions: 400,
      specialties: [
        "Full-Stack Development",
        "React & Redux",
        "Node.js & Express",
        "Database Design",
        "System Architecture",
      ],
      education: [
        {
          degree: "BS in Computer Science",
          school: "University of Washington",
          year: "2017",
        },
      ],
      certifications: [
        "AWS Certified Solutions Architect",
        "React Developer Certification",
        "MongoDB Certified Developer",
      ],
      reviews: [
        {
          name: "Mike Johnson",
          rating: 5,
          comment: "Emily helped me land my first full-stack developer role. Excellent technical guidance!",
          date: "5 days ago",
        },
        {
          name: "Sarah Wilson",
          rating: 5,
          comment: "Very patient and knowledgeable. Great at explaining complex concepts simply.",
          date: "2 weeks ago",
        },
      ],
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=80&width=80",
      available: true,
      matchPercentage: 89,
      fields: ["Product Management", "Strategy", "Leadership"],
      experience: "10 years",
      about:
        "Senior Product Manager with a track record of launching successful products. Experienced in leading cross-functional teams and driving product strategy.",
      rating: 4.9,
      location: "Austin, TX",
      responseTime: "Usually responds within 3 hours",
      totalMentees: 200,
      completedSessions: 600,
      specialties: ["Product Strategy", "Agile Methodologies", "Team Leadership", "Market Research", "Product Launch"],
      education: [
        {
          degree: "MBA",
          school: "UT Austin McCombs",
          year: "2015",
        },
        {
          degree: "BS in Engineering",
          school: "Rice University",
          year: "2013",
        },
      ],
      certifications: ["Certified Scrum Product Owner", "Google Analytics Certified", "Lean Six Sigma Green Belt"],
      reviews: [
        {
          name: "Lisa Chang",
          rating: 5,
          comment: "Michael's product management insights are invaluable. Helped me transition into PM role.",
          date: "1 week ago",
        },
        {
          name: "Robert Taylor",
          rating: 5,
          comment: "Excellent strategic thinking and leadership advice. Highly recommend!",
          date: "10 days ago",
        },
      ],
    },
  ])

  const handleDMMentor = (mentorName) => {
    alert(`Opening chat with ${mentorName}...`)
  }

  const handleViewProfile = (mentor) => {
    setSelectedMentor(mentor)
    setCurrentView("profile")
  }

  const handleScheduleMeeting = (mentor) => {
    setSelectedMentor(mentor)
    setCurrentView("schedule")
  }

  const handleBackToMatches = () => {
    setCurrentView("matches")
    setSelectedMentor(null)
  }

  if (currentView === "profile") {
    return <MentorProfile mentor={selectedMentor} onBack={handleBackToMatches} />
  }

  if (currentView === "schedule") {
    return <ScheduleMeeting mentorName={selectedMentor?.name} onBack={handleBackToMatches} />
  }

  return (
    <div className="mt-container">
      <div className="mt-header">
        <h1>Top Mentor Matches For You</h1>
        <p>AI-powered recommendations based on your learning goals and preferences</p>
      </div>

      <div className="mt-content">
        <div className="mt-grid">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="mt-card">
              {/* Left side - Avatar and basic info */}
              <div className="mt-card-left">
                <div className="mt-avatar">
                  <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                  <div className="mt-ai-badge">AI</div>
                </div>
                <h3 className="mt-name">{mentor.name}</h3>
                <div className="mt-availability">
                  <div className="mt-status-indicator"></div>
                  <span>Available</span>
                </div>
                <div className="mt-match-badge">{mentor.matchPercentage}% Match</div>
              </div>

              {/* Right side - Details and actions */}
              <div className="mt-card-right">
                <div className="mt-section">
                  <div className="mt-section-title">Fields</div>
                  <div className="mt-fields-tags">
                    {mentor.fields.map((field, index) => (
                      <span key={index} className="mt-field-tag">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-section">
                  <div className="mt-section-title">Experience</div>
                  <p className="mt-experience-text">{mentor.experience}</p>
                </div>

                <div className="mt-section">
                  <div className="mt-section-title">About</div>
                  <p className="mt-about-text">{mentor.about}</p>
                </div>

                <div className="mt-actions">
                  <button
                    className="mt-btn-primary"
                    onClick={() => handleDMMentor(mentor.name)}
                    disabled={!mentor.available}
                  >
                    DM Mentor
                  </button>
                  <button className="mt-btn-secondary" onClick={() => handleViewProfile(mentor)}>
                    View Full Profile
                  </button>
                  <button
                    className="mt-btn-secondary"
                    onClick={() => handleScheduleMeeting(mentor)}
                    disabled={!mentor.available}
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MentorMatch
