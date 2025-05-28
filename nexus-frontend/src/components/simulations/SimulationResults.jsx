"use client"

import { useState } from "react"
import { TrendingUp, BarChart3, ScatterChartIcon as Scatter3D, Settings } from "lucide-react"
import "./SimulationResults.css"

const SimulationResults = ({ results, validation, isRunning, progress }) => {
  const [activeChart, setActiveChart] = useState("line")
  const [selectedMetric, setSelectedMetric] = useState("PnL")

  if (isRunning) {
    return (
      <div className="simulation-loading">
        <div className="loading-content">
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>

          <p className="loading-message">
            Simulations usually take a few minutes or more. Click <span className="cancel-link">here</span> to cancel
            the simulation.
          </p>

          <div className="tip-container">
            <h4>TIP</h4>
            <p>
              Experiment with Neutralization Settings. Check out this <span className="forum-link">Forum post</span>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="no-results">
        <p>Run a simulation to see results</p>
      </div>
    )
  }

  return (
    <div className="simulation-results">
      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-title">
            <TrendingUp className="chart-icon" size={20} />
            <span>Chart</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="metric-selector"
            >
              <option value="PnL">PnL</option>
              <option value="Returns">Returns</option>
              <option value="Drawdown">Drawdown</option>
              <option value="Volatility">Volatility</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-placeholder">
            <svg viewBox="0 0 600 300" className="chart-svg">
              {/* Chart grid */}
              <defs>
                <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Sample chart line */}
              <path d="M 50 250 Q 150 200 250 150 T 450 100 T 550 80" fill="none" stroke="#00d4ff" strokeWidth="2" />

              {/* Data point */}
              <circle cx="350" cy="120" r="4" fill="#00d4ff" />

              {/* Tooltip */}
              <rect x="300" y="80" width="120" height="40" fill="rgba(0,0,0,0.8)" rx="4" />
              <text x="310" y="95" fill="white" fontSize="10">
                08/31/2021
              </text>
              <text x="310" y="110" fill="#00d4ff" fontSize="12" fontWeight="bold">
                Train PnL: 981.95K
              </text>
            </svg>
          </div>

          <div className="chart-controls">
            <div className="time-range-slider">
              <input type="range" min="0" max="100" defaultValue="20" />
              <input type="range" min="0" max="100" defaultValue="80" />
            </div>
          </div>
        </div>

        <div className="chart-type-selector">
          <button
            className={`chart-type-btn ${activeChart === "line" ? "active" : ""}`}
            onClick={() => setActiveChart("line")}
          >
            <TrendingUp size={16} />
          </button>
          <button
            className={`chart-type-btn ${activeChart === "bar" ? "active" : ""}`}
            onClick={() => setActiveChart("bar")}
          >
            <BarChart3 size={16} />
          </button>
          <button
            className={`chart-type-btn ${activeChart === "scatter" ? "active" : ""}`}
            onClick={() => setActiveChart("scatter")}
          >
            <Scatter3D size={16} />
          </button>
          <button className="chart-type-btn">
            <Settings size={16} />
          </button>
        </div>

        <div className="action-buttons">
          <button className="test-period-btn">Show test period</button>
          <button className="submit-btn">Submit Alpha</button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <div className="summary-header">
          <BarChart3 size={20} />
          <span>IS Summary</span>
        </div>

        <div className="period-selector">
          <span>Period</span>
          <div className="period-buttons">
            <button className="period-btn active">TRAIN</button>
            <button className="period-btn">TEST</button>
            <button className="period-btn">IS</button>
            <button className="period-btn">OS</button>
          </div>
        </div>

        <div className="status-indicator">
          <span className="status-badge needs-improvement">✕ Needs Improvement</span>
        </div>

        <div className="aggregate-data">
          <h4>Aggregate Data</h4>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">Sharpe</span>
              <span className="metric-value">0.28</span>
            </div>
            <div className="metric">
              <span className="metric-label">Turnover</span>
              <span className="metric-value">7.81%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Fitness</span>
              <span className="metric-value">0.08</span>
            </div>
            <div className="metric">
              <span className="metric-label">Returns</span>
              <span className="metric-value">1.10%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Drawdown</span>
              <span className="metric-value">9.24%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Margin</span>
              <span className="metric-value">2.82%∞</span>
            </div>
          </div>
        </div>

        <div className="detailed-table">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Sharpe</th>
                <th>Turnover</th>
                <th>Fitness</th>
                <th>Returns</th>
                <th>Drawdown</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2018</td>
                <td>-0.39</td>
                <td>7.93%</td>
                <td>-0.10</td>
                <td>-0.88%</td>
                <td>12.45%</td>
              </tr>
              <tr>
                <td>2019</td>
                <td>0.52</td>
                <td>7.68%</td>
                <td>0.15</td>
                <td>2.34%</td>
                <td>8.92%</td>
              </tr>
              <tr>
                <td>2020</td>
                <td>0.71</td>
                <td>7.82%</td>
                <td>0.19</td>
                <td>1.87%</td>
                <td>6.73%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Results */}
      {validation && (
        <div className="validation-section">
          <div className="validation-header">
            <span className="pass-count">4 PASS</span>
            <span className="fail-count">3 FAIL</span>
          </div>

          <div className="validation-results">
            <div className="passed-items">
              {validation.passed.map((item, index) => (
                <div key={index} className="validation-item passed">
                  <span className="validation-icon">●</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="failed-items">
              {validation.failed.map((item, index) => (
                <div key={index} className="validation-item failed">
                  <span className="validation-icon">●</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {validation.pending && validation.pending.length > 0 && (
              <div className="pending-items">
                <div className="pending-header">1 PENDING</div>
                {validation.pending.map((item, index) => (
                  <div key={index} className="validation-item pending">
                    <span className="validation-icon">●</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="performance-comparison">
            <div className="comparison-header">
              <span className="toggle-switch">●</span>
              <span>Performance Comparison</span>
            </div>
            <div className="comparison-content">
              <span>Last Run: -</span>
              <button className="refresh-btn">↻</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulationResults
