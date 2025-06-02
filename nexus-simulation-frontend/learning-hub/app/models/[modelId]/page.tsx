"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Play,
  Square,
  Download,
  Share2,
  Users,
  Clock,
  Code,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { simulationModels } from "@/lib/simulation-models"
import { SimulationProgress } from "@/components/simulation-progress"
import { CollaborationPanel } from "@/components/collaboration-panel"
import { ResultsVisualization } from "@/components/results-visualization"
import { ParameterForm } from "@/components/parameter-form"
import { ValidationPanel } from "@/components/validation-panel"

interface SimulationPageProps {
  params: {
    modelId: string
  }
}

interface SimulationState {
  status: "idle" | "validating" | "running" | "completed" | "error"
  progress: number
  currentStep: string
  results: any
  errors: string[]
  warnings: string[]
  startTime?: Date
  endTime?: Date
}

export default function SimulationPage({ params }: SimulationPageProps) {
  const model = simulationModels.find((m) => m.id === params.modelId)

  const [simulation, setSimulation] = useState<SimulationState>({
    status: "idle",
    progress: 0,
    currentStep: "",
    results: null,
    errors: [],
    warnings: [],
  })

  const [parameters, setParameters] = useState({
    initial_value: 100000,
    growth_rate: 0.08,
    volatility: 0.15,
    time_horizon: 10,
    simulations: 10000,
    confidence_level: 0.95,
  })

  const [collaborators] = useState([
    { id: "1", name: "Alice Chen", avatar: "/placeholder.svg", status: "active", cursor: { x: 45, y: 23 } },
    { id: "2", name: "Bob Smith", avatar: "/placeholder.svg", status: "viewing", cursor: null },
    { id: "3", name: "Carol Davis", avatar: "/placeholder.svg", status: "editing", cursor: { x: 78, y: 56 } },
  ])

  const [activeTab, setActiveTab] = useState("parameters")

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Model not found</h1>
          <p className="mt-2">The simulation model you're looking for doesn't exist.</p>
          <Link href="/models" passHref>
            <Button className="mt-4">Back to Models</Button>
          </Link>
        </div>
      </div>
    )
  }

  const runSimulation = async () => {
    setSimulation((prev) => ({ ...prev, status: "validating", progress: 0, errors: [], warnings: [] }))

    // Validation phase
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSimulation((prev) => ({
      ...prev,
      status: "running",
      progress: 5,
      currentStep: "Initializing simulation environment",
      startTime: new Date(),
    }))

    // Simulation steps with progress updates
    const steps = [
      { progress: 15, step: "Loading datasets and parameters" },
      { progress: 25, step: "Validating input parameters" },
      { progress: 35, step: "Setting up Monte Carlo framework" },
      { progress: 50, step: "Running simulation iterations (5,000/10,000)" },
      { progress: 70, step: "Running simulation iterations (8,000/10,000)" },
      { progress: 85, step: "Calculating statistics and risk metrics" },
      { progress: 95, step: "Generating visualizations" },
      { progress: 100, step: "Simulation completed successfully" },
    ]

    for (const { progress, step } of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSimulation((prev) => ({ ...prev, progress, currentStep: step }))
    }

    // Generate mock results
    const mockResults = generateMockResults()
    setSimulation((prev) => ({
      ...prev,
      status: "completed",
      results: mockResults,
      endTime: new Date(),
      currentStep: "Simulation completed successfully",
    }))
    setActiveTab("results")
  }

  const generateMockResults = () => {
    // Generate realistic simulation results
    const finalValues = Array.from({ length: 10000 }, () => {
      const returns = Array.from({ length: 10 }, () => (Math.random() - 0.5) * 0.4 + 0.08)
      return parameters.initial_value * returns.reduce((acc, r) => acc * (1 + r), 1)
    })

    const sortedValues = finalValues.sort((a, b) => a - b)
    const mean = finalValues.reduce((sum, val) => sum + val, 0) / finalValues.length
    const var95 = sortedValues[Math.floor(0.05 * sortedValues.length)]
    const var99 = sortedValues[Math.floor(0.01 * sortedValues.length)]

    return {
      summary: {
        mean: mean,
        median: sortedValues[Math.floor(sortedValues.length / 2)],
        stdDev: Math.sqrt(finalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / finalValues.length),
        var95: var95,
        var99: var99,
        min: Math.min(...finalValues),
        max: Math.max(...finalValues),
        probLoss: finalValues.filter((v) => v < parameters.initial_value).length / finalValues.length,
      },
      timeSeries: generateTimeSeriesData(),
      histogram: generateHistogramData(finalValues),
      riskMetrics: {
        sharpeRatio: 1.2,
        maxDrawdown: 0.18,
        volatility: 0.15,
        beta: 1.05,
      },
    }
  }

  const generateTimeSeriesData = () => {
    const paths = []
    for (let i = 0; i < 20; i++) {
      const path = []
      let value = parameters.initial_value
      for (let t = 0; t <= parameters.time_horizon; t++) {
        const return_ = (Math.random() - 0.5) * 0.3 + 0.08
        value *= 1 + return_ / parameters.time_horizon
        path.push({ time: t, value, path: i })
      }
      paths.push(path)
    }
    return paths
  }

  const generateHistogramData = (values: number[]) => {
    const bins = 25
    const min = Math.min(...values)
    const max = Math.max(...values)
    const binWidth = (max - min) / bins

    const histogram = Array.from({ length: bins }, (_, i) => ({
      bin: `${((min + i * binWidth) / 1000).toFixed(0)}k`,
      count: 0,
      range: [min + i * binWidth, min + (i + 1) * binWidth],
    }))

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1)
      histogram[binIndex].count++
    })

    return histogram
  }

  const stopSimulation = () => {
    setSimulation((prev) => ({ ...prev, status: "idle", progress: 0, currentStep: "" }))
  }

  const exportResults = () => {
    // Export logic would go here
    console.log("Exporting results as PDF...")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/models" passHref>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Models
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{model.title}</h1>
                <Badge className={`${model.categoryColor} text-white`}>{model.category}</Badge>
                <Badge variant="outline">{model.language}</Badge>
              </div>
              <p className="text-gray-600">{model.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Est. runtime: {model.runtime}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{collaborators.length} collaborators</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {simulation.status === "running" ? (
                <Button variant="outline" onClick={stopSimulation}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={runSimulation}
                  disabled={simulation.status === "validating"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </Button>
              )}

              {simulation.results && (
                <Button variant="outline" onClick={exportResults}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              )}

              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Collaboration Bar */}
        <CollaborationPanel collaborators={collaborators} />

        {/* Simulation Progress */}
        {(simulation.status === "validating" || simulation.status === "running") && (
          <SimulationProgress
            progress={simulation.progress}
            currentStep={simulation.currentStep}
            status={simulation.status}
            startTime={simulation.startTime}
          />
        )}

        {/* Validation Errors/Warnings */}
        <ValidationPanel errors={simulation.errors} warnings={simulation.warnings} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="parameters">
                  <Settings className="mr-2 h-4 w-4" />
                  Parameters
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="mr-2 h-4 w-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="results" disabled={!simulation.results}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="logs">
                  <FileText className="mr-2 h-4 w-4" />
                  Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="parameters">
                <ParameterForm
                  parameters={parameters}
                  onChange={setParameters}
                  disabled={simulation.status === "running"}
                />
              </TabsContent>

              <TabsContent value="code">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Code</CardTitle>
                    <CardDescription>View the simulation implementation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`# Monte Carlo Portfolio Simulation
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

def monte_carlo_simulation(initial_value, growth_rate, volatility, 
                          time_horizon, num_simulations):
    """
    Run Monte Carlo simulation for portfolio returns
    """
    results = []
    
    for i in range(num_simulations):
        # Generate random returns
        returns = np.random.normal(growth_rate, volatility, time_horizon)
        
        # Calculate cumulative portfolio value
        portfolio_value = initial_value
        for annual_return in returns:
            portfolio_value *= (1 + annual_return)
        
        results.append(portfolio_value)
    
    return np.array(results)

# Risk metrics calculation
def calculate_var(returns, confidence_level):
    return np.percentile(returns, (1 - confidence_level) * 100)

def calculate_statistics(results):
    return {
        'mean': np.mean(results),
        'std': np.std(results),
        'var_95': calculate_var(results, 0.95),
        'var_99': calculate_var(results, 0.99)
    }`}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results">
                {simulation.results && <ResultsVisualization results={simulation.results} parameters={parameters} />}
              </TabsContent>

              <TabsContent value="logs">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulation Logs</CardTitle>
                    <CardDescription>Detailed execution log and system messages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                      <div className="space-y-1">
                        <div>[2023-12-15 14:30:15] INFO: Simulation started</div>
                        <div>
                          [2023-12-15 14:30:15] INFO: Loading parameters: initial_value=100000, growth_rate=0.08
                        </div>
                        <div>[2023-12-15 14:30:16] INFO: Validating input parameters</div>
                        <div>[2023-12-15 14:30:16] INFO: ✓ All parameters within valid ranges</div>
                        <div>[2023-12-15 14:30:17] INFO: Initializing Monte Carlo framework</div>
                        <div>[2023-12-15 14:30:18] INFO: Starting simulation with 10,000 iterations</div>
                        <div>[2023-12-15 14:30:20] INFO: Progress: 2,500/10,000 iterations completed</div>
                        <div>[2023-12-15 14:30:22] INFO: Progress: 5,000/10,000 iterations completed</div>
                        <div>[2023-12-15 14:30:24] INFO: Progress: 7,500/10,000 iterations completed</div>
                        <div>[2023-12-15 14:30:26] INFO: Progress: 10,000/10,000 iterations completed</div>
                        <div>[2023-12-15 14:30:27] INFO: Calculating risk metrics and statistics</div>
                        <div>[2023-12-15 14:30:28] INFO: Generating visualization data</div>
                        <div>[2023-12-15 14:30:29] INFO: ✓ Simulation completed successfully</div>
                        <div>[2023-12-15 14:30:29] INFO: Total runtime: 14.2 seconds</div>
                        <div>[2023-12-15 14:30:29] INFO: Results exported to workspace</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Info */}
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={model.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{model.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{model.author.name}</p>
                    <p className="text-xs text-gray-500">Model Author</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <Badge variant="outline">{model.language}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{model.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Run:</span>
                    <span>{model.lastRun}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Popularity:</span>
                    <span>{model.popularity}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Status */}
            <Card>
              <CardHeader>
                <CardTitle>Simulation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {simulation.status === "idle" && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                    {simulation.status === "validating" && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                    {simulation.status === "running" && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                    {simulation.status === "completed" && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                    {simulation.status === "error" && <div className="w-2 h-2 bg-red-400 rounded-full" />}
                    <span className="text-sm font-medium capitalize">{simulation.status}</span>
                  </div>

                  {simulation.startTime && (
                    <div className="text-xs text-gray-500">Started: {simulation.startTime.toLocaleTimeString()}</div>
                  )}

                  {simulation.endTime && (
                    <div className="text-xs text-gray-500">Completed: {simulation.endTime.toLocaleTimeString()}</div>
                  )}

                  {simulation.results && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-2">Quick Stats:</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Expected Value:</span>
                          <span>${(simulation.results.summary.mean / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VaR (95%):</span>
                          <span>${(simulation.results.summary.var95 / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prob. of Loss:</span>
                          <span>{(simulation.results.summary.probLoss * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Save Parameters
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Model
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Code className="mr-2 h-4 w-4" />
                  Fork Model
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
