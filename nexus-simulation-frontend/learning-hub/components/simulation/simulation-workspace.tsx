"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Square,
  Download,
  Share2,
  Settings,
  BarChart3,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { SimulationProgress } from "@/components/simulation-progress"
import { ResultsVisualization } from "@/components/results-visualization"
import { ParameterForm } from "@/components/parameter-form"
import { Dataset } from "@/lib/api"

interface SimulationWorkspaceProps {
  selectedModel: any
  currentSession: any
  datasets: Dataset[]
  onRunSimulation: (modelId: string, parameters: any, datasetId?: string) => void
  onSessionUpdate: (session: any) => void
}

export function SimulationWorkspace({ 
  selectedModel, 
  currentSession, 
  datasets, 
  onRunSimulation, 
  onSessionUpdate 
}: SimulationWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("parameters")
  const [parameters, setParameters] = useState({
    initial_value: 100000,
    growth_rate: 0.08,
    volatility: 0.15,
    time_horizon: 10,
    simulations: 10000,
  })

  const [collaborators] = useState([
    { id: "1", name: "Alice Chen", status: "active", avatar: "/placeholder.svg" },
    { id: "2", name: "Bob Smith", status: "viewing", avatar: "/placeholder.svg" },
  ])

  useEffect(() => {
    if (currentSession?.status === "completed") {
      setActiveTab("results")
    }
  }, [currentSession?.status])

  const stopSimulation = () => {
    onSessionUpdate({
      ...currentSession,
      status: "idle",
      progress: 0,
    })
  }

  const handleRunSimulation = () => {
    if (selectedModel) {
      onRunSimulation(selectedModel.id, parameters)
    }
  }

  const exportResults = () => {
    // Export logic
    console.log("Exporting results...")
  }

  if (!selectedModel && !currentSession) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Model Selected</h3>
        <p className="text-gray-500">Select a model from the library or create a new one to start simulating</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{selectedModel?.title || "Custom Model"}</span>
                {selectedModel?.category && <Badge variant="outline">{selectedModel.category}</Badge>}
                {selectedModel?.language && <Badge variant="secondary">{selectedModel.language}</Badge>}
              </CardTitle>
              <CardDescription>{selectedModel?.description || "Custom simulation model"}</CardDescription>
            </div>
            <div className="flex space-x-2">
              {currentSession?.status === "running" ? (
                <Button variant="outline" onClick={stopSimulation}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button onClick={handleRunSimulation} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </Button>
              )}
              {currentSession?.results && (
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
        </CardHeader>
      </Card>

      {/* Collaboration Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Live Collaboration</span>
                <Badge variant="secondary">{collaborators.length}/4 users</Badge>
              </div>
              <div className="flex items-center space-x-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center space-x-1 bg-white rounded-full px-2 py-1 text-xs"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        collaborator.status === "active" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <span>{collaborator.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Invite
              </Button>
              <Button variant="outline" size="sm">
                Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Progress */}
      {(currentSession?.status === "running" || currentSession?.status === "validating") && (
        <SimulationProgress
          progress={currentSession.progress}
          currentStep={currentSession.status === "validating" ? "Validating model and parameters" : "Running simulation"}
          status={currentSession.status}
          startTime={new Date()}
        />
      )}

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
              <TabsTrigger value="datasets">
                <FileText className="mr-2 h-4 w-4" />
                Datasets
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!currentSession?.results}>
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
                disabled={session?.status === "running"}
              />
            </TabsContent>

            <TabsContent value="datasets">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Configuration</CardTitle>
                  <CardDescription>Upload or select datasets for your simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Dataset</h3>
                      <p className="text-gray-500 mb-4">Drag and drop your CSV, Excel, or JSON files here</p>
                      <Button>Choose Files</Button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Available Datasets</h4>
                      {datasets.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No datasets available. Upload some datasets to get started.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {datasets.map((dataset) => (
                            <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <span className="font-medium">{dataset.name}</span>
                                <p className="text-sm text-gray-500">{dataset.description || "No description available"}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Use Dataset
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              {session?.results && <ResultsVisualization results={session.results} parameters={parameters} />}
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Logs</CardTitle>
                  <CardDescription>Real-time execution logs and system messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div>[2023-12-15 14:30:15] INFO: Simulation session started</div>
                      <div>[2023-12-15 14:30:15] INFO: Model: {model?.title || "Custom Model"}</div>
                      <div>[2023-12-15 14:30:16] INFO: Validating parameters...</div>
                      <div>[2023-12-15 14:30:16] INFO: ✓ All parameters valid</div>
                      <div>[2023-12-15 14:30:17] INFO: Loading datasets...</div>
                      <div>[2023-12-15 14:30:18] INFO: Starting simulation engine</div>
                      {session?.status === "running" && (
                        <>
                          <div>[2023-12-15 14:30:20] INFO: Progress: {session.progress}% completed</div>
                          <div>[2023-12-15 14:30:22] INFO: Running Monte Carlo iterations...</div>
                        </>
                      )}
                      {session?.status === "completed" && (
                        <>
                          <div>[2023-12-15 14:30:29] INFO: ✓ Simulation completed successfully</div>
                          <div>[2023-12-15 14:30:29] INFO: Generating results and visualizations</div>
                          <div>[2023-12-15 14:30:30] INFO: Results ready for export</div>
                        </>
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
          {/* Simulation Status */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {session?.status === "idle" && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                  {session?.status === "running" && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                  {session?.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {session?.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-sm font-medium capitalize">{session?.status || "Ready"}</span>
                </div>

                {session?.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{session.progress}%</span>
                    </div>
                    <Progress value={session.progress} className="h-2" />
                  </div>
                )}

                {session?.results && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Quick Results:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Expected Return:</span>
                        <span>{(session.results.metrics.expectedReturn * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatility:</span>
                        <span>{(session.results.metrics.volatility * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sharpe Ratio:</span>
                        <span>{session.results.metrics.sharpeRatio.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Model Info */}
          {model && (
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Author:</span>
                    <span>{model.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <Badge variant="outline">{model.language}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{model.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Modified:</span>
                    <span>{model.lastModified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Runs:</span>
                    <span>{model.runs}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                Share Session
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Invite Collaborator
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
