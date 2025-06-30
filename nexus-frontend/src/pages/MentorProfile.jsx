"use client"
import { ArrowLeft, Star, MapPin, Clock, User, Calendar, MessageCircle, Award } from "lucide-react"
import "./MentorProfile.css"

const MentorProfile = ({ mentor, onBack }) => {
  // Remove the useState for mentor data and use the prop instead

  const handleScheduleMeeting = () => {
    alert("Opening calendar to schedule meeting...")
  }

  const handleDMMentor = () => {
    alert("Opening chat with mentor...")
  }

  return (
    <div className="mentor-profile-container">
      <div className="mentor-profile-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Matches
        </button>
        <h1>Mentor Profile</h1>
      </div>

      <div className="mentor-profile-content">
        <div className="profile-main">
          <div className="profile-hero">
            <div className="hero-left">
              <div className="mentor-avatar-large">
                <img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                <div className="match-badge-large">{mentor.matchPercentage}% Match</div>
              </div>
            </div>
            <div className="hero-right">
              <h2>{mentor.name}</h2>
              <p className="mentor-title">Senior Data Scientist at Google</p>
              <div className="mentor-stats">
                <div className="stat-item">
                  <Star size={16} className="star-icon" />
                  <span>
                    {mentor.rating} ({mentor.totalMentees} reviews)
                  </span>
                </div>
                <div className="stat-item">
                  <MapPin size={16} />
                  <span>{mentor.location}</span>
                </div>
                <div className="stat-item">
                  <Clock size={16} />
                  <span>{mentor.responseTime}</span>
                </div>
                <div className="stat-item">
                  <User size={16} />
                  <span>{mentor.completedSessions} sessions completed</span>
                </div>
              </div>
              <div className="availability-status-large">
                <div className={`status-indicator ${mentor.available ? "available" : "busy"}`}></div>
                <span>{mentor.available ? "Available for mentoring" : "Currently busy"}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary-large" onClick={handleDMMentor}>
              <MessageCircle size={18} />
              Message Mentor
            </button>
            <button className="btn-secondary-large" onClick={handleScheduleMeeting}>
              <Calendar size={18} />
              Schedule Meeting
            </button>
          </div>

          <div className="profile-sections">
            <section className="profile-section">
              <h3>About</h3>
              <p>{mentor.about}</p>
            </section>

            <section className="profile-section">
              <h3>Areas of Expertise</h3>
              <div className="expertise-tags">
                {mentor.fields.map((field, index) => (
                  <span key={index} className="expertise-tag">
                    {field}
                  </span>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <h3>Specialties</h3>
              <ul className="specialties-list">
                {(mentor.specialties || []).map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </section>

            <section className="profile-section">
              <h3>Education</h3>
              <div className="education-list">
                {(mentor.education || []).map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.degree}</h4>
                    <p>
                      {edu.school} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <h3>Certifications</h3>
              <div className="certifications-list">
                {(mentor.certifications || []).map((cert, index) => (
                  <div key={index} className="certification-item">
                    <Award size={16} />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-section">
              <h3>Recent Reviews</h3>
              <div className="reviews-list">
                {(mentor.reviews || []).map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.name}</span>
                      <div className="review-rating">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={14} className="star-filled" />
                        ))}
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
