"use client"

import { useState } from "react"
import "./WeeklyGoalTracker.css"

const WeeklyGoalTracker = () => {
  const [daysCompleted, setDaysCompleted] = useState(3)
  const [goalDays, setGoalDays] = useState(7)
  const [isEditing, setIsEditing] = useState(false)
  const [newGoal, setNewGoal] = useState(goalDays)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const handleEditGoal = () => {
    setIsEditing(true)
  }

  const handleSaveGoal = () => {
    setGoalDays(newGoal)
    setIsEditing(false)
  }

  const currentDate = new Date()
  const startDate = new Date(currentDate)
  startDate.setDate(currentDate.getDate() - 3) // Assuming we're 3 days into the week

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)

  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`
  }

  return (
    <div className="weekly-goal-tracker">
      <h2>Weekly Goal Tracker</h2>
      <p className="date-range">
        {formatDate(startDate)} - {formatDate(endDate)} | Learn {goalDays} days a week
      </p>

      <div className="progress-text">
        <span>
          {daysCompleted} / {goalDays} days
        </span>
      </div>

      <div className="day-circles">
        {days.map((day, index) => (
          <div key={day} className="day-item">
            <div className={`day-circle ${index < daysCompleted ? "completed" : ""}`}></div>
            <span className="day-label">{day}</span>
          </div>
        ))}
      </div>

      {isEditing ? (
        <div className="edit-goal">
          <input
            type="number"
            min="1"
            max="7"
            value={newGoal}
            onChange={(e) => setNewGoal(Number.parseInt(e.target.value))}
          />
          <button onClick={handleSaveGoal}>Save</button>
        </div>
      ) : (
        <button className="edit-goal-btn" onClick={handleEditGoal}>
          Edit goal
        </button>
      )}
    </div>
  )
}

export default WeeklyGoalTracker
