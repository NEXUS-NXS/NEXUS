"use client"

import { useState } from "react"
import { BarChart2, LineChart, TableIcon, Info } from "lucide-react"
import "./ResultsVisualization.css"

const ResultsVisualization = ({ simulation, results }) => {
  const [activeView, setActiveView] = useState(simulation.resultTypes[0])

  // Function to create a simple histogram
  const renderHistogram = (data, bins = 20) => {
    const { values } = data
    const min = Math.min(...values)
    const max = Math.max(...values)
    const binWidth = (max - min) / bins

    const histogram = Array(bins).fill(0)
    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1)
      histogram[binIndex]++
    })

    const maxCount = Math.max(...histogram)
    const binLabels = Array.from({ length: bins }, (_, i) => Math.round(min + (i + 0.5) * binWidth))

    return (
      <div className="histogram-chart">
        <div className="histogram-bars">
          {histogram.map((count, i) => (
            <div
              key={i}
              className="histogram-bar"
              style={{ height: `${(count / maxCount) * 100}%` }}
              title={`${binLabels[i]}: ${count} occurrences`}
            ></div>
          ))}
        </div>
        <div className="histogram-labels">
          {[0, Math.floor(bins / 4), Math.floor(bins / 2), Math.floor((3 * bins) / 4), bins - 1].map((i) => (
            <span key={i}>{binLabels[i].toLocaleString()}</span>
          ))}
        </div>
        <div className="axis-label y-label">Frequency</div>
        <div className="axis-label x-label">Portfolio Value</div>
      </div>
    )
  }

  // Function to render a line chart
  const renderLineChart = (data) => {
    const { years, percentile5, percentile50, percentile95 } = data

    // Find max value for scaling
    const allValues = [...percentile5, ...percentile50, ...percentile95]
    const maxValue = Math.max(...allValues)

    // Create points for SVG paths
    const createPoints = (values) => {
      return years
        .map((year, i) => {
          const x = (year / years[years.length - 1]) * 100
          const y = 100 - (values[i] / maxValue) * 95
          return `${x},${y}`
        })
        .join(" ")
    }

    const points5 = createPoints(percentile5)
    const points50 = createPoints(percentile50)
    const points95 = createPoints(percentile95)

    return (
      <div className="line-chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points95} className="line line-95" />
          <polyline points={points50} className="line line-50" />
          <polyline points={points5} className="line line-5" />
        </svg>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color legend-95"></span>
            <span>95th Percentile</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-50"></span>
            <span>Median</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-5"></span>
            <span>5th Percentile</span>
          </div>
        </div>
        <div className="axis-label y-label">Portfolio Value ($)</div>
        <div className="axis-label x-label">Years</div>
      </div>
    )
  }

  // Function to render a bar chart
  const renderBarChart = (data) => {
    const { categories, values } = data
    const maxValue = Math.max(...values)

    return (
      <div className="bar-chart">
        <div className="bars-container">
          {categories.map((category, i) => (
            <div key={i} className="bar-item">
              <div className="bar-label">{category}</div>
              <div className="bar-container">
                <div
                  className="bar"
                  style={{ height: `${(values[i] / maxValue) * 100}%` }}
                  title={`${category}: ${values[i].toLocaleString()}`}
                ></div>
              </div>
              <div className="bar-value">${values[i].toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Function to render a table
  const renderTable = (data) => {
    if (!data) return <p>No table data available</p>

    if (data.yearlyBreakdown) {
      // Life insurance premium breakdown table
      return (
        <div className="result-table">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Age</th>
                <th>Premium</th>
                <th>Risk Charge</th>
                <th>Reserve</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              {data.yearlyBreakdown.map((row) => (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{row.age}</td>
                  <td>${row.premium}</td>
                  <td>${row.riskCharge}</td>
                  <td>${row.reserveContribution}</td>
                  <td>${row.interestCredit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // Generic table
    return (
      <div className="result-table">
        <p>Table data would be displayed here.</p>
      </div>
    )
  }

  // Function to render statistics
  const renderStatistics = (data) => {
    if (!data) return <p>No statistics available</p>

    if (simulation.id === 1) {
      // Monte Carlo simulation statistics
      return (
        <div className="statistics-panel">
          <h4>Monte Carlo Simulation Results</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Initial Investment</div>
              <div className="stat-value">${Number(data.statistics.initialInvestment).toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Median Final Value</div>
              <div className="stat-value">${Number(data.statistics.median).toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">5th Percentile</div>
              <div className="stat-value">${Number(data.statistics.percentile5).toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">95th Percentile</div>
              <div className="stat-value">${Number(data.statistics.percentile95).toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Minimum Value</div>
              <div className="stat-value">${Number(data.statistics.min).toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Maximum Value</div>
              <div className="stat-value">${Number(data.statistics.max).toLocaleString()}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Avg. Annual Return</div>
              <div className="stat-value">{data.statistics.averageAnnualReturn}</div>
            </div>
          </div>
        </div>
      )
    } else if (simulation.id === 2) {
      // Life insurance premium statistics
      return (
        <div className="statistics-panel">
          <h4>Life Insurance Premium Analysis</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Coverage Amount</div>
              <div className="stat-value">${data.statistics.coverageAmount}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Annual Premium</div>
              <div className="stat-value">${data.statistics.annualPremium}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Premium</div>
              <div className="stat-value">${data.statistics.totalPremiumPaid}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Premium Ratio</div>
              <div className="stat-value">{data.statistics.premiumRatio}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Effective Rate</div>
              <div className="stat-value">{data.statistics.effectiveRate}</div>
            </div>
          </div>

          <h4 className="premium-factors-title">Premium Factors</h4>
          <div className="premium-factors">
            {data.premiumFactors.map((factor, index) => (
              <div key={index} className="factor-item">
                <div className="factor-name">{factor.name}</div>
                <div className="factor-value">{factor.value}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Generic statistics
    return (
      <div className="statistics-panel">
        <p>Statistics would be displayed here.</p>
      </div>
    )
  }

  // Main render function for visualization
  const renderVisualization = () => {
    const data = results.data

    if (activeView === "histogram" && data.histogram) {
      return renderHistogram(data.histogram)
    } else if (activeView === "line" && data.timeSeries) {
      return renderLineChart(data.timeSeries)
    } else if (activeView === "bar" && data.barData) {
      return renderBarChart(data.barData)
    } else if (activeView === "table") {
      return renderTable(data)
    } else if (activeView === "statistics") {
      return renderStatistics(data)
    } else {
      // Fallback
      return <div className="visualization-placeholder">Visualization not available for this view.</div>
    }
  }

  return (
    <div className="results-visualization">
      <div className="visualization-tabs">
        {simulation.resultTypes.map((type) => (
          <button
            key={type}
            className={`viz-tab ${activeView === type ? "active" : ""}`}
            onClick={() => setActiveView(type)}
          >
            {type === "histogram" && <BarChart2 size={16} />}
            {type === "line" && <LineChart size={16} />}
            {type === "bar" && <BarChart2 size={16} />}
            {type === "table" && <TableIcon size={16} />}
            {type === "statistics" && <Info size={16} />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="visualization-content">{renderVisualization()}</div>
    </div>
  )
}

export default ResultsVisualization
