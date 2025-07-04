"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { 
  getModel, 
  SimulationModel, 
  fetchModelCollaborators,
  fetchModelSessions,
  fetchModelParameters,
  updateModelSession,
  runSimulation,
  fetchSimulationProgressWithPolling,
  fetchSimulationResults,
  ModelSession,
  ModelParameterTemplate,
  SimulationProgressData
} from '@/lib/api'
import { SimulationProgress } from "@/components/simulation-progress"
import { CollaborationPanel } from "@/components/collaboration-panel"
import { ResultsVisualization } from "@/components/results-visualization"
import { ParameterForm } from "@/components/parameter-form"
import { ValidationPanel } from "@/components/validation-panel"

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

export default function SimulationPage() {
  const params = useParams()
  const modelId = params.modelId as string
  const [model, setModel] = useState<SimulationModel | null>(null)
  const [loading, setLoading] = useState(true)
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
  const [collaborators, setCollaborators] = useState<ModelSession[]>([])
  const [parameterTemplates, setParameterTemplates] = useState<ModelParameterTemplate[]>([])
  const [activeTab, setActiveTab] = useState("parameters")
  const progressCleanup = useRef<(() => void) | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [simulationLogs, setSimulationLogs] = useState<Array<{
    timestamp: string;
    level: string;
    message: string;
  }>>([])

  // Transform ModelSession data to Collaborator format for the UI
  const transformedCollaborators = collaborators.map(session => ({
    id: session.id.toString(),
    name: `${session.user.first_name} ${session.user.last_name}`.trim() || session.user.username,
    avatar: session.user.avatar,
    status: session.status === 'idle' ? 'away' as const : session.status,
    cursor: session.cursor_position && session.cursor_position.x !== undefined && session.cursor_position.y !== undefined 
      ? { x: session.cursor_position.x, y: session.cursor_position.y } 
      : null
  }))

  useEffect(() => {
    let isMounted = true
    const loadModel = async () => {
      try {
        setLoading(true)
        const data = await getModel(modelId)
        if (!isMounted) return
        setModel(data)
        
        // Load collaborators/active sessions
        const sessions = await fetchModelSessions(modelId)
        if (!isMounted) return
        setCollaborators(sessions)
        
        // Load parameter templates
        const templates = await fetchModelParameters(modelId)
        if (!isMounted) return
        setParameterTemplates(templates)
        
        // Set default parameters if available
        const defaultTemplate = templates.find(t => t.is_default)
        if (defaultTemplate) {
          setParameters(defaultTemplate.parameters)
        }
      } catch (error) {
        console.error("Failed to load model:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    if (modelId) {
      loadModel()
      // Update user session status
      updateModelSession(modelId, { status: 'viewing' }).catch(console.error)
    }
    
    return () => {
      isMounted = false
      // Cleanup progress polling when component unmounts
      if (progressCleanup.current) {
        progressCleanup.current()
        progressCleanup.current = null
      }
    }
  }, [modelId])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'actuarial': 'bg-blue-500',
      'financial': 'bg-emerald-500',
      'climate': 'bg-green-500',
      'health': 'bg-purple-500',
      'insurance': 'bg-orange-500',
      'ml': 'bg-pink-500',
      'machine learning': 'bg-pink-500',
    }
    return colors[category?.toLowerCase?.()] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

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

  // Helper functions for simulation
  const runSimulationHandler = async () => {
    if (!model) return
    try {
      setSimulation((prev) => ({ 
        ...prev, 
        status: "validating", 
        progress: 0, 
        errors: [], 
        warnings: [] 
      }))
      // Update session status to editing
      await updateModelSession(modelId, { status: 'editing' })
      // Start simulation
      const simulationData = await runSimulation({
        model_id: model.id,
        parameters: parameters
      })
      const sessionId = simulationData.session_id
      setCurrentSessionId(sessionId)
      setSimulation((prev) => ({
        ...prev,
        status: "running",
        progress: 5,
        currentStep: "Simulation started",
        startTime: new Date(),
      }))
      // Start polling for progress
      const cleanup = await fetchSimulationProgressWithPolling(
        sessionId,
        async (progress: SimulationProgressData) => {
          setSimulation((prev) => ({
            ...prev,
            progress: progress.progress_percentage,
            currentStep: progress.current_step,
          }))
          // Update logs from detailed log
          if (progress.detailed_log && Array.isArray(progress.detailed_log)) {
            setSimulationLogs(progress.detailed_log)
          }
          // Check if simulation is complete
          if (progress.progress_percentage >= 100) {
            setSimulation((prev) => ({
              ...prev,
              status: "completed",
              endTime: new Date(),
              currentStep: "Simulation completed successfully",
            }))
            // Fetch simulation results
            try {
              const results = await fetchSimulationResults(sessionId)
              setSimulation((prev) => ({
                ...prev,
                results: results,
              }))
            } catch (error) {
              console.error("Failed to fetch simulation results:", error)
            }
            setActiveTab("results")
            // Update session status back to viewing
            updateModelSession(modelId, { status: 'viewing' }).catch(console.error)
            // Stop polling
            if (progressCleanup.current) {
              progressCleanup.current()
              progressCleanup.current = null
            }
          }
        },
        2000 // Poll every 2 seconds
      )
      if (progressCleanup.current) progressCleanup.current()
      progressCleanup.current = cleanup
    } catch (error) {
      console.error("Simulation failed:", error)
      setSimulation((prev) => ({
        ...prev,
        status: "error",
        errors: [error instanceof Error ? error.message : "Simulation failed"],
      }))
    }
  }

  const stopSimulation = () => {
    if (progressCleanup.current) {
      progressCleanup.current()
      progressCleanup.current = null
    }
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
                <h1 className="text-3xl font-bold">{model.name}</h1>
                <Badge className={`${getCategoryColor(model.category)} text-white`}>{model.category}</Badge>
                <Badge variant="outline">{model.language}</Badge>
              </div>
              <p className="text-gray-600">{model.description || 'No description available'}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Est. runtime: ~2 min</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>By {model.owner?.name || model.owner || "Unknown"}</span>
                </div>
                <div className="flex items-center">
                  <span>Created: {model.created_at ? new Date(model.created_at).toLocaleDateString() : "-"}</span>
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
                  onClick={runSimulationHandler}
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
        <CollaborationPanel collaborators={transformedCollaborators} />
        {/* Simulation Progress */}
        {(simulation.status === "validating" || simulation.status === "running") && currentSessionId && (
          <SimulationProgress
            sessionId={currentSessionId}
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
                      <pre>{model.code || `# Monte Carlo Portfolio Simulation
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
                        {simulationLogs.length > 0 ? (
                          simulationLogs.map((log, index) => (
                            <div key={index} className={`${
                              log.level === 'ERROR' ? 'text-red-400' :
                              log.level === 'WARNING' ? 'text-yellow-400' :
                              log.level === 'INFO' ? 'text-green-400' :
                              'text-gray-400'
                            }`}>
                              [{log.timestamp}] {log.level}: {log.message}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 italic">
                            {simulation.status === "idle" ? "Run a simulation to see logs here" : "Loading logs..."}
                          </div>
                        )}
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
                    <AvatarImage src={model.owner?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{model.owner?.name ? model.owner.name.charAt(0) : "A"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{model.owner?.name || "Unknown"}</p>
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
                    <span>{model.lastRun || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Popularity:</span>
                    <span>{model.popularity ? `${model.popularity}%` : "-"}</span>
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