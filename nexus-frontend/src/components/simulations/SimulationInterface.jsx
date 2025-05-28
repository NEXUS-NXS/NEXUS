"use client"

import { useState } from "react"
import { Play, RefreshCw, Info } from "lucide-react"
import "./SimulationInterface.css"

const SimulationInterface = ({ simulation, onRun, isRunning }) => {
  const [parameters, setParameters] = useState(() => {
    // Initialize parameters with default values
    const initialParams = {}
    simulation.parameters.forEach((param) => {
      initialParams[param.id] = param.default
    })
    return initialParams
  })

  const handleParameterChange = (paramId, value) => {
    setParameters((prev) => ({
      ...prev,
      [paramId]: value,
    }))
  }

  const handleResetParameters = () => {
    const resetParams = {}
    simulation.parameters.forEach((param) => {
      resetParams[param.id] = param.default
    })
    setParameters(resetParams)
  }

  const handleRunSimulation = () => {
    onRun(parameters)
  }

  return (
    <div className="simulation-interface">
      <div className="simulation-parameters">
        <div className="parameters-header">
          <h3>Simulation Parameters</h3>
          <button className="reset-params-btn" onClick={handleResetParameters}>
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className="parameters-form">
          {simulation.parameters.map((param) => (
            <div key={param.id} className="parameter-field">
              <label htmlFor={param.id}>
                {param.name}
                <span className="parameter-info-icon">
                  <Info size={14} />
                  <span className="parameter-tooltip">
                    {param.min && param.max
                      ? `Range: ${param.min} to ${param.max}`
                      : param.options
                        ? "Select from available options"
                        : "Toggle this parameter"}
                  </span>
                </span>
              </label>

              {param.type === "number" ? (
                <div className="number-input-container">
                  <input
                    type="range"
                    id={`${param.id}-range`}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={parameters[param.id]}
                    onChange={(e) => handleParameterChange(param.id, Number.parseFloat(e.target.value))}
                  />
                  <input
                    type="number"
                    id={param.id}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={parameters[param.id]}
                    onChange={(e) => handleParameterChange(param.id, Number.parseFloat(e.target.value))}
                  />
                </div>
              ) : param.type === "select" ? (
                <select
                  id={param.id}
                  value={parameters[param.id]}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                >
                  {param.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : param.type === "boolean" ? (
                <div className="toggle-container">
                  <input
                    type="checkbox"
                    id={param.id}
                    checked={parameters[param.id]}
                    onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                  />
                  <label htmlFor={param.id} className="toggle-label">
                    <span className="toggle-on">Yes</span>
                    <span className="toggle-off">No</span>
                  </label>
                </div>
              ) : (
                <input
                  type="text"
                  id={param.id}
                  value={parameters[param.id]}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="simulation-run">
        <button className="run-btn" onClick={handleRunSimulation} disabled={isRunning}>
          {isRunning ? (
            <>
              <RefreshCw className="spin-icon" size={20} />
              Running Simulation...
            </>
          ) : (
            <>
              <Play size={20} />
              Run Simulation
            </>
          )}
        </button>
        <p className="simulation-note">
          This simulation may take a few moments to complete depending on the parameters.
        </p>
      </div>
    </div>
  )
}

export default SimulationInterface
