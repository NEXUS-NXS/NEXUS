"use client"

import { useState } from "react"
import { Play, Copy, Download, Upload, X, Minimize2, ChevronDown, Plus, Code, TrendingUp, Settings } from "lucide-react"
import "./CodeEditor.css"

const CodeEditor = ({ simulation, onRun, isRunning, activeTab, onTabChange, onBackToList, onNewSimulation }) => {
  const [code, setCode] = useState(`# Actuarial Risk Model
import numpy as np
import pandas as pd
from scipy import stats

def calculate_risk_metrics(portfolio_data):
    """
    Calculate comprehensive risk metrics for actuarial analysis
    """
    # Value at Risk calculation
    var_95 = np.percentile(portfolio_data, 5)
    var_99 = np.percentile(portfolio_data, 1)
    
    # Expected Shortfall
    es_95 = portfolio_data[portfolio_data <= var_95].mean()
    
    # Risk-adjusted returns
    sharpe_ratio = portfolio_data.mean() / portfolio_data.std()
    
    return {
        'var_95': var_95,
        'var_99': var_99,
        'expected_shortfall': es_95,
        'sharpe_ratio': sharpe_ratio
    }

# Generate sample portfolio data
np.random.seed(42)
returns = np.random.normal(0.08, 0.15, 1000)
portfolio_value = 1000000 * np.cumprod(1 + returns)

# Calculate risk metrics
risk_metrics = calculate_risk_metrics(returns)
print("Risk Analysis Results:")
print(f"95% VaR: {risk_metrics['var_95']:.4f}")
print(f"99% VaR: {risk_metrics['var_99']:.4f}")
print(f"Expected Shortfall: {risk_metrics['expected_shortfall']:.4f}")
print(f"Sharpe Ratio: {risk_metrics['sharpe_ratio']:.4f}")`)

  const [language, setLanguage] = useState(simulation?.language || "python")

  const handleCodeChange = (e) => {
    setCode(e.target.value)
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
    // Update code template based on language
    if (e.target.value === "r") {
      setCode(`# Actuarial Analysis in R
library(tidyverse)
library(VaR)

# Load portfolio data
portfolio_returns <- rnorm(1000, 0.08, 0.15)

# Calculate Value at Risk
var_95 <- quantile(portfolio_returns, 0.05)
var_99 <- quantile(portfolio_returns, 0.01)

# Expected Shortfall
es_95 <- mean(portfolio_returns[portfolio_returns <= var_95])

# Sharpe Ratio
sharpe_ratio <- mean(portfolio_returns) / sd(portfolio_returns)

# Display results
cat("Risk Analysis Results:\\n")
cat("95% VaR:", round(var_95, 4), "\\n")
cat("99% VaR:", round(var_99, 4), "\\n")
cat("Expected Shortfall:", round(es_95, 4), "\\n")
cat("Sharpe Ratio:", round(sharpe_ratio, 4), "\\n")`)
    } else if (e.target.value === "fel") {
      setCode(`// Fast Expression Language - Actuarial Model
// Portfolio risk calculation using FEL

universe = TOP3000
delay = 1
decay = 4
truncation = 0.08
neutralization = SUBINDUSTRY

// Risk factors
momentum = ts_rank(close, 20)
volatility = ts_std_dev(returns, 20)
value = book_to_price

// Alpha expression
alpha = rank(momentum) - rank(volatility) + rank(value)

// Risk adjustments
alpha = neutralize(alpha, neutralization)
alpha = winsorize(alpha, 0.025)

return alpha`)
    }
  }

  return (
    <div className="code-editor-full-container">
      {/* Header Section */}
      <div className="nexus-sim-header">
        <div className="nexus-sim-top-bar">
          <div className="nexus-sim-info">
            <div className="nexus-sim-alpha-icon">α</div>
            <span className="nexus-sim-title">{simulation ? simulation.title : "Select a Simulation"}</span>
            {simulation && <div className={`nexus-sim-status nexus-sim-status-${simulation.status}`}></div>}
          </div>
          <div className="nexus-sim-controls">
            <button className="nexus-sim-btn" onClick={onBackToList}>
              <X size={16} />
            </button>
            <button className="nexus-sim-btn">
              <Minimize2 size={16} />
            </button>
            <button className="nexus-sim-btn">
              <ChevronDown size={16} />
            </button>
            <button className="nexus-sim-btn nexus-sim-new-btn" onClick={onNewSimulation}>
              <Plus size={16} />
              New
            </button>
          </div>
        </div>

        <div className="nexus-sim-tabs">
          <button
            className={`nexus-sim-tab ${activeTab === "CODE" ? "nexus-sim-tab-active" : ""}`}
            onClick={() => onTabChange("CODE")}
          >
            <Code size={16} />
            CODE
          </button>
          <button
            className={`nexus-sim-tab ${activeTab === "RESULTS" ? "nexus-sim-tab-active" : ""}`}
            onClick={() => onTabChange("RESULTS")}
          >
            <TrendingUp size={16} />
            RESULTS
          </button>
          <button
            className={`nexus-sim-tab ${activeTab === "SETTINGS" ? "nexus-sim-tab-active" : ""}`}
            onClick={() => onTabChange("SETTINGS")}
          >
            <Settings size={16} />
            SETTINGS
          </button>
        </div>
      </div>

      {/* Code Editor Content */}
      <div className="code-editor-container">
        <div className="editor-toolbar">
          <div className="language-selector">
            <select value={language} onChange={handleLanguageChange}>
              <option value="python">Python</option>
              <option value="r">R</option>
              <option value="fel">Fast Expression Language</option>
            </select>
          </div>

          <div className="editor-actions">
            <button className="action-btn" title="Copy Code">
              <Copy size={16} />
            </button>
            <button className="action-btn" title="Upload File">
              <Upload size={16} />
            </button>
            <button className="action-btn" title="Download Code">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="code-editor">
          <div className="line-numbers">
            {code.split("\n").map((_, index) => (
              <div key={index} className="line-number">
                {index + 1}
              </div>
            ))}
          </div>

          <textarea
            value={code}
            onChange={handleCodeChange}
            className="code-textarea"
            spellCheck={false}
            placeholder="Enter your actuarial model code here..."
          />
        </div>

        <div className="editor-footer">
          <div className="execution-info">
            <span className="execution-status">{isRunning ? "Running..." : "Ready to execute"}</span>
          </div>

          <div className="action-buttons">
            <button className="example-btn">Example</button>
            <button className="clone-btn">Clone</button>
            <button className="simulate-btn" onClick={onRun} disabled={isRunning}>
              <Play size={16} />
              {isRunning ? "Running..." : "Simulate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
