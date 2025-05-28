"use client"

import { Play, Clock, BarChart2 } from "lucide-react"
import "./SimulationCard.css"

const SimulationCard = ({ simulation, onSelect }) => {
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

  return (
    <div className="simulation-card" onClick={onSelect}>
      <div className="simulation-image">
        <img src={simulation.image || "/placeholder.svg"} alt={simulation.title} />
        <div className="simulation-level">{getLevelLabel(simulation.level)}</div>
      </div>
      <div className="simulation-content">
        <h3>{simulation.title}</h3>
        <p className="simulation-category">{getCategoryLabel(simulation.category)}</p>
        <p className="simulation-description">{simulation.description}</p>
        <div className="simulation-meta">
          <div className="simulation-time">
            <Clock size={16} />
            <span>{simulation.duration}</span>
          </div>
          <div className="simulation-popularity">
            <BarChart2 size={16} />
            <span>{simulation.popularity}% popularity</span>
          </div>
        </div>
        <button className="run-simulation-btn">
          <Play size={16} />
          Run Simulation
        </button>
      </div>
    </div>
  )
}

export default SimulationCard
