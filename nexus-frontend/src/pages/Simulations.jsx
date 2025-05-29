"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BarChart2, Clock, BookOpen, Save, Share2, Download } from "lucide-react"

import { useUser } from "../context/UserContext"
import CodeEditor from "../components/simulations/CodeEditor"
import SimulationSettings from "../components/simulations/SimulationSettings"
import SimulationResults from "../components/simulations/SimulationResults"
import ModelValidation from "../components/simulations/ModelValidation"
import SimulationCard from "../components/simulations/SimulationCard"
import ResultsVisualization from "../components/simulations/ResultsVisualization"
import "./Simulations.css"

const simulationCategories = [
  { id: "all", name: "All Simulations" },
  { id: "risk", name: "Risk Modeling" },
  { id: "life", name: "Life Insurance" },
  { id: "property", name: "Property & Casualty" },
  { id: "health", name: "Health Insurance" },
  { id: "pension", name: "Pension & Retirement" },
  { id: "financial", name: "Financial Modeling" },
]

const simulationLevels = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
]

const Simulations = () => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("CODE")
  const [activeSimulation, setActiveSimulation] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [simulationResults, setSimulationResults] = useState(null)
  const [validationResults, setValidationResults] = useState(null)
  const [showNewSimulation, setShowNewSimulation] = useState(false)
  const [simulations, setSimulations] = useState([])
  const [filteredSimulations, setFilteredSimulations] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSimulations, setRecentSimulations] = useState([])

  useEffect(() => {
    fetchSimulations()
    fetchRecentSimulations()
  }, [])

  useEffect(() => {
    filterSimulations()
  }, [selectedCategory, selectedLevel, searchQuery, simulations])

  const fetchSimulations = async () => {
    // Mock data
    const mockSimulations = [
      {
        id: 1,
        title: "Monte Carlo Risk Analysis",
        category: "risk",
        level: "intermediate",
        description:
          "Run Monte Carlo simulations to analyze the distribution of potential outcomes and assess risk factors in various scenarios.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 89,
        language: "python",
        status: "active",
      },
      {
        id: 2,
        title: "Life Insurance Premium Calculator",
        category: "life",
        level: "beginner",
        description:
          "Calculate life insurance premiums based on mortality tables, interest rates, and policy characteristics.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "2-5 minutes",
        popularity: 95,
        language: "r",
        status: "completed",
      },
      {
        id: 3,
        title: "Property Insurance Loss Simulation",
        category: "property",
        level: "advanced",
        description:
          "Simulate property insurance losses using probability distributions for frequency and severity to analyze risk exposure.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "10-15 minutes",
        popularity: 82,
        language: "fel",
        status: "failed",
      },
      {
        id: 4,
        title: "Pension Fund Valuation",
        category: "pension",
        level: "intermediate",
        description:
          "Value pension funds and project future liabilities based on demographic and economic assumptions.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 78,
        language: "python",
        status: "active",
      },
      {
        id: 5,
        title: "Health Insurance Claims Modeling",
        category: "health",
        level: "advanced",
        description:
          "Model health insurance claims using demographic data, utilization patterns, and cost trends to predict future claims expenses.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "10-15 minutes",
        popularity: 75,
        language: "r",
        status: "completed",
      },
      {
        id: 6,
        title: "Financial Asset Pricing",
        category: "financial",
        level: "beginner",
        description:
          "Apply financial models to price assets including stocks, bonds, and derivatives using modern pricing theories.",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 85,
        language: "fel",
        status: "failed",
      },
      {
        id: 7,
        title: "Simulation 7",
        category: "actuarial",
        level: "beginner",
        description: "New simulation description",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 85,
        language: "python",
        status: "active",
      },
      {
        id: 8,
        title: "Simulation 8",
        category: "actuarial",
        level: "beginner",
        description: "New simulation description",
        image: "/placeholder.svg?height=150&width=250",
        duration: "5-10 minutes",
        popularity: 85,
        language: "python",
        status: "active",
      },
    ]

    setSimulations(mockSimulations)
    setFilteredSimulations(mockSimulations)
  }

  const fetchRecentSimulations = async () => {
    const mockRecentSimulations = [
      {
        id: 1,
        simulationId: 1,
        title: "Monte Carlo Risk Analysis",
        date: "2024-01-12T10:30:00Z",
      },
      {
        id: 2,
        simulationId: 4,
        title: "Pension Fund Valuation",
        date: "2024-01-10T14:45:00Z",
      },
      {
        id: 3,
        simulationId: 2,
        title: "Life Insurance Premium Calculator",
        date: "2024-01-08T09:15:00Z",
      },
    ]

    setRecentSimulations(mockRecentSimulations)
  }

  const filterSimulations = () => {
    let filtered = simulations

    if (selectedCategory !== "all") {
      filtered = filtered.filter((simulation) => simulation.category === selectedCategory)
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((simulation) => simulation.level === selectedLevel)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (simulation) =>
          simulation.title.toLowerCase().includes(query) || simulation.description.toLowerCase().includes(query),
      )
    }

    setFilteredSimulations(filtered)
  }

  const handleSimulationSelect = (simulation) => {
    setActiveSimulation(simulation)
    setSimulationResults(null)
    setValidationResults(null)
    setActiveTab("CODE")
  }

  const handleBackToList = () => {
    setActiveSimulation(null)
    setSimulationResults(null)
    setValidationResults(null)
    setActiveTab("CODE")
  }

  const handleRunSimulation = (parameters) => {
    setIsRunning(true)
    setProgress(0)
    setActiveTab("RESULTS")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          generateMockResults(parameters)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const generateMockResults = (parameters) => {
    const mockResults = {
      chartData: {
        pnl: Array.from({ length: 100 }, (_, i) => ({
          date: new Date(2019, 0, 1 + i * 10).toISOString(),
          value: Math.random() * 1000000 - 250000 + i * 5000,
        })),
        performance: {
          sharpe: 0.28,
          turnover: 7.81,
          fitness: 0.08,
          returns: 1.1,
          drawdown: 9.24,
          margin: 2.82,
        },
      },
      validation: {
        passed: [
          "Turnover of 7.59% is above cutoff of 1%",
          "Turnover of 7.59% is below cutoff of 70%",
          "Weight is well distributed over instruments",
          "These competitions match: Challenge, International Quant Championship 2025 Stage 2",
        ],
        failed: [
          "Sharpe of -0.10 is below cutoff of 1.25",
          "Fitness of -0.02 is below cutoff of 1",
          "Sub-universe Sharpe of -0.62 is below cutoff of -0.04",
        ],
        pending: ["Performance validation in progress"],
      },
    }

    setSimulationResults(mockResults)
    setValidationResults(mockResults.validation)
  }

  const handleCreateNewSimulation = () => {
    const newId = Math.max(...simulations.map((s) => s.id)) + 1
    const newSim = {
      id: newId,
      title: `Simulation ${newId}`,
      category: "actuarial",
      level: "beginner",
      description: "New simulation description",
      image: "/placeholder.svg?height=150&width=250",
      duration: "5-10 minutes",
      popularity: 85,
      language: "python",
      status: "active",
    }
    setSimulations([...simulations, newSim])
    setActiveSimulation(newSim)
    setShowNewSimulation(true)
    setActiveTab("CODE")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSaveResults = () => {
    alert("Results saved successfully!")
  }

  const handleShareResults = () => {
    alert("Share functionality would be implemented here")
  }

  const handleDownloadResults = () => {
    alert("Download functionality would be implemented here")
  }

  return (
    <div className="nexus-sim-container">
      {/* Header */}
      
      {/* Content Area */}
      <div className="nexus-sim-content">
        {/* Simulation Browser Section - Always Visible */}
        <div className="nexus-sim-browse-section">
          <div className="nexus-sim-filters">
            <div className="nexus-sim-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search simulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="nexus-sim-filter">
              <Filter size={18} />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {simulationCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="nexus-sim-filter">
              <BarChart2 size={18} />
              <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                {simulationLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="nexus-sim-browse-content">
            <div className="nexus-sim-list-section">
              <h2 className="nexus-sim-section-title">Available Simulations</h2>
              <div className="nexus-sim-grid">
                {filteredSimulations.length > 0 ? (
                  filteredSimulations.map((simulation) => (
                    <SimulationCard
                      key={simulation.id}
                      simulation={simulation}
                      onSelect={() => handleSimulationSelect(simulation)}
                      isActive={activeSimulation?.id === simulation.id}
                    />
                  ))
                ) : (
                  <div className="nexus-sim-empty">
                    <p>No simulations found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="nexus-sim-sidebar">
              <div className="nexus-sim-recent">
                <h3 className="nexus-sim-sidebar-title">Recently Run Simulations</h3>
                {recentSimulations.length > 0 ? (
                  <div className="nexus-sim-recent-list">
                    {recentSimulations.map((recent) => (
                      <div key={recent.id} className="nexus-sim-recent-item">
                        <div className="nexus-sim-recent-info">
                          <h4>{recent.title}</h4>
                          <p>
                            <Clock size={14} />
                            <span>{formatDate(recent.date)}</span>
                          </p>
                        </div>
                        <button
                          className="nexus-sim-view-btn"
                          onClick={() => {
                            const sim = simulations.find((s) => s.id === recent.simulationId)
                            if (sim) {
                              setActiveSimulation(sim)
                            }
                          }}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="nexus-sim-empty-text">No recent simulations found.</p>
                )}
              </div>

              <div className="nexus-sim-resources">
                <h3 className="nexus-sim-sidebar-title">Learning Resources</h3>
                <div className="nexus-sim-resources-list">
                  <a href="#" className="nexus-sim-resource-link">
                    <BookOpen size={16} />
                    <span>Introduction to Monte Carlo Methods</span>
                  </a>
                  <a href="#" className="nexus-sim-resource-link">
                    <BookOpen size={16} />
                    <span>Understanding Mortality Tables</span>
                  </a>
                  <a href="#" className="nexus-sim-resource-link">
                    <BookOpen size={16} />
                    <span>Financial Modeling Techniques</span>
                  </a>
                  <a href="#" className="nexus-sim-resource-link">
                    <BookOpen size={16} />
                    <span>Insurance Risk Assessment</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Section - Only when simulation is selected */}
        {activeSimulation && (
          <div className="nexus-sim-workspace">
            <div className="nexus-sim-workspace-header">
              <h2 className="nexus-sim-workspace-title">{activeSimulation.title}</h2>
              <p className="nexus-sim-workspace-desc">{activeSimulation.description}</p>
            </div>

            <div className="nexus-sim-workspace-content">
              {/* Code Editor Tab */}
              {activeTab === "CODE" && (
                <div className="nexus-sim-code-section">
                  {/* <CodeEditor simulation={activeSimulation} onRun={handleRunSimulation} isRunning={isRunning} /> */}
                  <CodeEditor
                    simulation={activeSimulation}
                    onRun={handleRunSimulation}
                    isRunning={isRunning}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onBackToList={handleBackToList}
                    onNewSimulation={() => setShowNewSimulation(true)}
                  />
                </div>
              )}

              {/* Results Tab */}
              {activeTab === "RESULTS" && (
                <div className="nexus-sim-results-section">
                  <SimulationResults
                    results={simulationResults}
                    validation={validationResults}
                    isRunning={isRunning}
                    progress={progress}
                  />

                  {simulationResults && (
                    <div className="nexus-sim-results">
                      <div className="nexus-sim-results-header">
                        <h3 className="nexus-sim-results-title">Simulation Results</h3>
                        <div className="nexus-sim-results-actions">
                          <button className="nexus-sim-action-btn nexus-sim-save-btn" onClick={handleSaveResults}>
                            <Save size={16} />
                            Save
                          </button>
                          <button className="nexus-sim-action-btn nexus-sim-share-btn" onClick={handleShareResults}>
                            <Share2 size={16} />
                            Share
                          </button>
                          <button
                            className="nexus-sim-action-btn nexus-sim-download-btn"
                            onClick={handleDownloadResults}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                      <ResultsVisualization simulation={activeSimulation} results={simulationResults} />
                      <ModelValidation validation={validationResults} />
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "SETTINGS" && (
                <div className="nexus-sim-settings-section">
                  <SimulationSettings simulation={activeSimulation} onUpdate={setActiveSimulation} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Simulation Modal */}
      {showNewSimulation && (
        <div className="nexus-sim-modal-overlay">
          <div className="nexus-sim-modal">
            <h3 className="nexus-sim-modal-title">Create New Simulation</h3>
            <div className="nexus-sim-form-group">
              <label>Simulation Name</label>
              <input type="text" placeholder="Enter simulation name" />
            </div>
            <div className="nexus-sim-form-group">
              <label>Language</label>
              <select>
                <option value="python">Python</option>
                <option value="r">R</option>
                <option value="fel">Fast Expression Language</option>
              </select>
            </div>
            <div className="nexus-sim-form-group">
              <label>Category</label>
              <select>
                <option value="actuarial">Actuarial Models</option>
                <option value="financial">Financial Models</option>
                <option value="risk">Risk Models</option>
                <option value="ml">Machine Learning</option>
              </select>
            </div>
            <div className="nexus-sim-modal-actions">
              <button className="nexus-sim-cancel-btn" onClick={() => setShowNewSimulation(false)}>
                Cancel
              </button>
              <button className="nexus-sim-create-btn" onClick={handleCreateNewSimulation}>
                Create Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Simulations
