"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Code, Database, Settings, Users, Save, Play } from "lucide-react"
import Link from "next/link"
import { CodeEditor } from "@/components/code-editor"
import { ParameterBuilder } from "@/components/parameter-builder"
import { DatasetSelector } from "@/components/dataset-selector"
import { fetchDatasets, Dataset } from "@/lib/api"
import { useAuth } from "@/components/auth/AuthProvider"

interface ModelConfig {
  title: string
  description: string
  category: string
  language: string
  code: string
  parameters: any[]
  datasets: string[]
  collaborators: string[]
}

export default function CreateModelPage() {
  const { isAuthenticated } = useAuth()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loadingDatasets, setLoadingDatasets] = useState(false)
  
  const [config, setConfig] = useState<ModelConfig>({
    title: "",
    description: "",
    category: "",
    language: "python",
    code: "",
    parameters: [],
    datasets: [],
    collaborators: [],
  })

  const [activeTab, setActiveTab] = useState("basic")

  // Load datasets when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadDatasets()
    }
  }, [isAuthenticated])

  const loadDatasets = async () => {
    setLoadingDatasets(true)
    try {
      const datasetsData = await fetchDatasets()
      setDatasets(datasetsData)
    } catch (error) {
      console.error('Failed to load datasets:', error)
    } finally {
      setLoadingDatasets(false)
    }
  }

  const handleSave = () => {
    // Save model logic
    console.log("Saving model:", config)
  }

  const handleTest = () => {
    // Test model logic
    console.log("Testing model:", config)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/models" passHref>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Models
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Create New Model</h1>
              <p className="text-gray-500 mt-1">Build a custom simulation model with collaborative features</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleTest}>
                <Play className="mr-2 h-4 w-4" />
                Test Model
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Save Model
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="code">Code Editor</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="data">Data Sources</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Information</CardTitle>
                    <CardDescription>Define the basic properties of your simulation model</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title">Model Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter model title..."
                        value={config.title}
                        onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what your model does..."
                        value={config.description}
                        onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={config.category}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="actuarial">Actuarial Models</SelectItem>
                            <SelectItem value="climate">Climate & Environmental</SelectItem>
                            <SelectItem value="financial">Financial & Investment</SelectItem>
                            <SelectItem value="health">Health & Demographic</SelectItem>
                            <SelectItem value="ml">Machine Learning</SelectItem>
                            <SelectItem value="insurance">Insurance Products</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="language">Programming Language</Label>
                        <Select
                          value={config.language}
                          onValueChange={(value) => setConfig((prev) => ({ ...prev, language: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="r">R</SelectItem>
                            <SelectItem value="fel">Fast Expression Language</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2 h-5 w-5" />
                      Code Editor
                    </CardTitle>
                    <CardDescription>
                      Write your simulation logic in {config.language || "your chosen language"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeEditor
                      language={config.language}
                      value={config.code}
                      onChange={(value) => setConfig((prev) => ({ ...prev, code: value }))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parameters">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Input Parameters
                    </CardTitle>
                    <CardDescription>Define the input parameters for your model</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParameterBuilder
                      parameters={config.parameters}
                      onChange={(parameters) => setConfig((prev) => ({ ...prev, parameters }))}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="mr-2 h-5 w-5" />
                      Data Sources
                    </CardTitle>
                    <CardDescription>Select or upload datasets for your model</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetSelector
                      selectedDatasets={config.datasets}
                      onChange={(datasets) => setConfig((prev) => ({ ...prev, datasets }))}
                      availableDatasets={datasets}
                    />
                    {loadingDatasets && (
                      <p className="text-sm text-gray-500 mt-2">Loading available datasets...</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collaboration">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Collaboration Settings
                    </CardTitle>
                    <CardDescription>Invite collaborators to work on this model (2-4 people max)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="collaborator-email">Invite by Email</Label>
                        <div className="flex space-x-2">
                          <Input id="collaborator-email" placeholder="colleague@university.edu" type="email" />
                          <Button variant="outline">Invite</Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Current Collaborators</h4>
                        <div className="space-y-2">
                          {config.collaborators.length === 0 ? (
                            <p className="text-gray-500 text-sm">No collaborators yet</p>
                          ) : (
                            config.collaborators.map((collaborator, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span>{collaborator}</span>
                                <Button variant="ghost" size="sm">
                                  Remove
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Model Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Basic Info</span>
                    <Badge variant={config.title && config.category ? "default" : "secondary"}>
                      {config.title && config.category ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Code</span>
                    <Badge variant={config.code ? "default" : "secondary"}>
                      {config.code ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Parameters</span>
                    <Badge variant={config.parameters.length > 0 ? "default" : "secondary"}>
                      {config.parameters.length > 0 ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-gray-500">
                  <p>
                    <strong>Language:</strong> {config.language || "Not selected"}
                  </p>
                  <p>
                    <strong>Category:</strong> {config.category || "Not selected"}
                  </p>
                  <p>
                    <strong>Collaborators:</strong> {config.collaborators.length}/4
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
