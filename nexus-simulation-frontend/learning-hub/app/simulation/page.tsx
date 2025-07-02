"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Plus, Search, Users, Code, Database, BarChart3, FileText, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ModelLibrary } from "@/components/simulation/model-library"
import { ModelCreator } from "@/components/simulation/model-creator"
import { SimulationWorkspace } from "@/components/simulation/simulation-workspace"
import { CollaborationHub } from "@/components/simulation/collaboration-hub"
import { DatasetManager } from "@/components/simulation/dataset-manager"
import { useAuth } from "@/components/auth/AuthProvider"
import { 
  fetchModels, 
  fetchDatasets, 
  runSimulation,
  fetchSimulationSessions,
  SimulationModel as APIModel,
  Dataset,
  SimulationSession as APISession
} from "@/lib/api"

interface SimulationModel {
  id: string
  title: string
  description: string
  category: string
  language: string
  author: string
  lastModified: string
  isPublic: boolean
  collaborators: number
  runs: number
  rating: number
}

interface SimulationSession {
  id: string
  modelId: string
  status: "idle" | "running" | "completed" | "error"
  progress: number
  collaborators: string[]
  results?: any
}

export default function SimulationPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("library")
  const [selectedModel, setSelectedModel] = useState<SimulationModel | null>(null)
  const [currentSession, setCurrentSession] = useState<SimulationSession | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  
  // API state
  const [models, setModels] = useState<SimulationModel[]>([])
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [sessions, setSessions] = useState<APISession[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(false)

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData()
    }
  }, [isAuthenticated, user, selectedCategory, selectedLanguage])

  const loadData = async () => {
    setDataLoading(true)
    setApiError(null)
    
    try {
      // Fetch models with filters
      const modelsData = await fetchModels({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedLanguage !== 'all' && { language: selectedLanguage })
      })
      
      // Transform API models to frontend format
      const transformedModels: SimulationModel[] = modelsData.map((model: APIModel) => ({
        id: model.id,
        title: model.name,
        description: model.description || '',
        category: model.category,
        language: model.language,
        author: model.owner,
        lastModified: model.updated_at,
        isPublic: model.isPublic || false,
        collaborators: 0, // TODO: Add to backend
        runs: 0, // TODO: Add to backend  
        rating: 0, // TODO: Add to backend
      }))
      
      setModels(transformedModels)
      
      // Fetch datasets and sessions in parallel
      const [datasetsData, sessionsData] = await Promise.all([
        fetchDatasets(),
        fetchSimulationSessions()
      ])
      
      setDatasets(datasetsData)
      setSessions(sessionsData)
      
    } catch (error) {
      console.error('Failed to load data:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      setDataLoading(false)
    }
  }

  const handleModelSelect = (model: SimulationModel) => {
    setSelectedModel(model)
    setActiveTab("workspace")
  }

  const handleRunSimulation = async (modelId: string, parameters: any, datasetId?: string) => {
    try {
      const response = await runSimulation({
        model_id: modelId,
        parameters,
        dataset_id: datasetId
      })
      
      // Create session object
      const newSession: SimulationSession = {
        id: response.session_id,
        modelId,
        status: 'running',
        progress: 0,
        collaborators: [user?.full_name || 'You'],
        results: null
      }
      
      setCurrentSession(newSession)
      setActiveTab("workspace")
      
      // Refresh sessions list
      loadData()
      
    } catch (error) {
      console.error('Failed to run simulation:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to run simulation')
    }
  }

  // Show loading spinner during auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the Nexus Simulation Platform.
          </p>
          <Button onClick={() => window.location.href = 'https://127.0.0.1:5173/login?from_simulation=true'}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const categories = [
    { id: "actuarial", name: "Actuarial Models", icon: "📊", color: "bg-blue-500" },
    { id: "climate", name: "Climate & Environmental", icon: "🌍", color: "bg-green-500" },
    { id: "financial", name: "Financial Models", icon: "💰", color: "bg-emerald-500" },
    { id: "health", name: "Health & Demographic", icon: "🏥", color: "bg-red-500" },
    { id: "ml", name: "AI & Machine Learning", icon: "🤖", color: "bg-purple-500" },
    { id: "insurance", name: "Insurance Products", icon: "🛡️", color: "bg-orange-500" },
  ]

  const languages = [
    { id: "python", name: "Python", icon: "🐍" },
    { id: "r", name: "R", icon: "📈" },
    { id: "fel", name: "Fast Expression Language", icon: "⚡" },
  ]

  // Filter models based on search and selections
  const filteredModels = models.filter((model) => {
    const matchesSearch = model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory
    const matchesLanguage = selectedLanguage === "all" || model.language === selectedLanguage
    return matchesSearch && matchesCategory && matchesLanguage
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Simulation Platform</h1>
              <p className="text-muted-foreground">
                Build, run, and collaborate on advanced simulations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("collaborate")}>
                <Users className="mr-2 h-4 w-4" />
                Collaborate
              </Button>
              <Button size="sm" onClick={() => setActiveTab("create")}>
                <Plus className="mr-2 h-4 w-4" />
                New Model
              </Button>
            </div>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {apiError}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => {
                    setApiError(null)
                    loadData()
                  }}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Search and filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models, datasets, or sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language.id} value={language.id}>
                    {language.icon} {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Model Library
            </TabsTrigger>
            <TabsTrigger value="datasets" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Datasets
            </TabsTrigger>
            <TabsTrigger value="workspace" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="collaborate" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Collaborate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <ModelLibrary
              models={filteredModels}
              onModelSelect={handleModelSelect}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedLanguage={selectedLanguage}
              isLoading={dataLoading}
            />
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <DatasetManager
              datasets={datasets}
              onDatasetUpload={loadData}
              isLoading={dataLoading}
            />
          </TabsContent>

          <TabsContent value="workspace" className="space-y-4">
            <SimulationWorkspace
              selectedModel={selectedModel}
              currentSession={currentSession}
              datasets={datasets}
              onRunSimulation={handleRunSimulation}
              onSessionUpdate={setCurrentSession}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <ModelCreator
              onModelCreated={loadData}
              categories={categories}
              languages={languages}
            />
          </TabsContent>

          <TabsContent value="collaborate" className="space-y-4">
            <CollaborationHub
              sessions={sessions}
              onSessionSelect={(session) => {
                setCurrentSession(session)
                setActiveTab("workspace")
              }}
              isLoading={dataLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
