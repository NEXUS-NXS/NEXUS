"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, User, Video, MapPin } from "lucide-react"
import "./ScheduleMeeting.css"

const ScheduleMeeting = ({ mentorName, onBack }) => {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [meetingType, setMeetingType] = useState("video")
  const [topic, setTopic] = useState("")
  const [duration, setDuration] = useState("30")

  const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

  const handleSchedule = (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !topic) {
      alert("Please fill in all required fields")
      return
    }
    alert(`Meeting scheduled with ${mentorName} on ${selectedDate} at ${selectedTime}`)
  }

  return (
    <div className="schedule-meeting-container">
      <div className="schedule-meeting-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Profile
        </button>
        <h1>Schedule Meeting</h1>
      </div>

      <div className="schedule-meeting-content">
        <div className="meeting-form-container">
          <div className="mentor-info-card">
            <div className="mentor-avatar-small">
              <img src="/placeholder.svg?height=60&width=60" alt={mentorName} />
            </div>
            <div className="mentor-details">
              <h3>{mentorName}</h3>
              <p>Senior Data Scientist at Google</p>
              <div className="availability-indicator">
                <div className="status-dot available"></div>
                <span>Available for meetings</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSchedule} className="meeting-form">
            <div className="form-section">
              <h3>Meeting Details</h3>

              <div className="form-group">
                <label htmlFor="topic">Meeting Topic *</label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Career guidance in Data Science"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="meetingType">Meeting Type</label>
                  <select id="meetingType" value={meetingType} onChange={(e) => setMeetingType(e.target.value)}>
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Select Date & Time</h3>

              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Available Time Slots *</label>
                <div className="time-slots">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock size={16} />
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="meeting-summary">
              <h3>Meeting Summary</h3>
              <div className="summary-details">
                <div className="summary-item">
                  <User size={16} />
                  <span>With {mentorName}</span>
                </div>
                <div className="summary-item">
                  <Calendar size={16} />
                  <span>{selectedDate || "Select a date"}</span>
                </div>
                <div className="summary-item">
                  <Clock size={16} />
                  <span>
                    {selectedTime || "Select a time"} ({duration} minutes)
                  </span>
                </div>
                <div className="summary-item">
                  {meetingType === "video" && <Video size={16} />}
                  {meetingType === "phone" && <Clock size={16} />}
                  {meetingType === "in-person" && <MapPin size={16} />}
                  <span>
                    {meetingType === "video" ? "Video Call" : meetingType === "phone" ? "Phone Call" : "In Person"}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onBack}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Calendar size={18} />
                Schedule Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ScheduleMeeting
