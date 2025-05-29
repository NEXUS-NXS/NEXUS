"use client"

import { Play, Clock, BarChart2 } from "lucide-react"
import "./SimulationCard.css"

const SimulationCard = ({ simulation, onSelect, isActive }) => {
  const getCategoryLabel = (category) => {
    const categories = {
      risk: "Risk Modeling",
      life: "Life Insurance",
      property: "Property & Casualty",
      health: "Health Insurance",
      pension: "Pension & Retirement",
      financial: "Financial Modeling",
    }
    return categories[category] || category
  }

  const getLevelLabel = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  const getStatusClass = (status) => {
    return `nexus-sim-status-${status || "default"}`
  }

  return (
    <div className={`nexus-sim-card ${isActive ? "nexus-sim-card-active" : ""}`} onClick={onSelect}>
      <div className="nexus-sim-card-image">
        <img src={simulation.image || "/placeholder.svg"} alt={simulation.title} />
        <div className="nexus-sim-card-level">{getLevelLabel(simulation.level)}</div>
        {simulation.status && <div className={`nexus-sim-card-status ${getStatusClass(simulation.status)}`}></div>}
      </div>
      <div className="nexus-sim-card-content">
        <h3>{simulation.title}</h3>
        <p className="nexus-sim-card-category">{getCategoryLabel(simulation.category)}</p>
        <p className="nexus-sim-card-description">{simulation.description}</p>
        <div className="nexus-sim-card-meta">
          <div className="nexus-sim-card-time">
            <Clock size={16} />
            <span>{simulation.duration}</span>
          </div>
          <div className="nexus-sim-card-popularity">
            <BarChart2 size={16} />
            <span>{simulation.popularity}% popularity</span>
          </div>
        </div>
        <button className="nexus-sim-card-run-btn">
          <Play size={16} />
          Run Simulation
        </button>
      </div>
    </div>
  )
}

export default SimulationCard
