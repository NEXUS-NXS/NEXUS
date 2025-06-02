"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Plus, Search, Users, Code, Database, BarChart3, FileText, Upload } from "lucide-react"
import { ModelLibrary } from "@/components/simulation/model-library"
import { ModelCreator } from "@/components/simulation/model-creator"
import { SimulationWorkspace } from "@/components/simulation/simulation-workspace"
import { CollaborationHub } from "@/components/simulation/collaboration-hub"
import { DatasetManager } from "@/components/simulation/dataset-manager"

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
  const [activeTab, setActiveTab] = useState("library")
  const [selectedModel, setSelectedModel] = useState<SimulationModel | null>(null)
  const [currentSession, setCurrentSession] = useState<SimulationSession | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")

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

  const mockModels: SimulationModel[] = [
    {
      id: "1",
      title: "Monte Carlo Portfolio Risk",
      description: "Simulate portfolio risk using Monte Carlo methods with multiple asset classes",
      category: "financial",
      language: "python",
      author: "Dr. Sarah Chen",
      lastModified: "2023-12-15",
      isPublic: true,
      collaborators: 3,
      runs: 1247,
      rating: 4.8,
    },
    {
      id: "2",
      title: "Climate Risk Assessment",
      description: "Assess climate-related financial risks using scenario analysis",
      category: "climate",
      language: "r",
      author: "Prof. Michael Torres",
      lastModified: "2023-12-14",
      isPublic: true,
      collaborators: 2,
      runs: 892,
      rating: 4.6,
    },
    {
      id: "3",
      title: "Mortality Rate Projection",
      description: "Project future mortality rates using Lee-Carter model",
      category: "actuarial",
      language: "python",
      author: "Dr. Emma Wilson",
      lastModified: "2023-12-13",
      isPublic: true,
      collaborators: 4,
      runs: 634,
      rating: 4.7,
    },
    {
      id: "4",
      title: "Epidemic Spread Model",
      description: "SEIR model for disease spread with intervention scenarios",
      category: "health",
      language: "fel",
      author: "Dr. James Park",
      lastModified: "2023-12-12",
      isPublic: true,
      collaborators: 2,
      runs: 445,
      rating: 4.5,
    },
    {
      id: "5",
      title: "Neural Network Pricing",
      description: "Deep learning model for insurance premium calculation",
      category: "ml",
      language: "python",
      author: "Lisa Zhang",
      lastModified: "2023-12-11",
      isPublic: true,
      collaborators: 3,
      runs: 789,
      rating: 4.9,
    },
    {
      id: "6",
      title: "Life Insurance Valuation",
      description: "Comprehensive life insurance product valuation model",
      category: "insurance",
      language: "r",
      author: "Robert Kim",
      lastModified: "2023-12-10",
      isPublic: true,
      collaborators: 2,
      runs: 356,
      rating: 4.4,
    },
  ]

  const filteredModels = mockModels.filter((model) => {
    const matchesSearch =
      model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory
    const matchesLanguage = selectedLanguage === "all" || model.language === selectedLanguage
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const handleModelSelect = (model: SimulationModel) => {
    setSelectedModel(model)
    setActiveTab("workspace")
    setCurrentSession({
      id: `session_${Date.now()}`,
      modelId: model.id,
      status: "idle",
      progress: 0,
      collaborators: ["current_user"],
    })
  }

  const handleCreateNew = () => {
    setSelectedModel(null)
    setActiveTab("creator")
  }

  const handleRunSimulation = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: "running",
        progress: 0,
      })
      // Simulate progress
      simulateProgress()
    }
  }

  const simulateProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                progress: 100,
                results: generateMockResults(),
              }
            : null,
        )
      } else {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                progress: Math.min(progress, 100),
              }
            : null,
        )
      }
    }, 800)
  }

  const generateMockResults = () => {
    return {
      summary:
        "Simulation completed successfully with 10,000 iterations. Portfolio shows expected annual return of 8.2% with volatility of 15.3%.",
      metrics: {
        expectedReturn: 0.082,
        volatility: 0.153,
        sharpeRatio: 1.24,
        var95: -0.18,
        maxDrawdown: 0.22,
      },
      charts: [
        { type: "line", title: "Portfolio Value Over Time" },
        { type: "histogram", title: "Return Distribution" },
        { type: "scatter", title: "Risk-Return Analysis" },
      ],
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simulation Platform</h1>
              <p className="mt-2 text-gray-600">
                Create, run, and collaborate on simulation models across multiple domains
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create New Model
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Model
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Code className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Models</p>
                    <p className="text-2xl font-bold text-gray-900">{mockModels.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Active Collaborations</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Simulations Run</p>
                    <p className="text-2xl font-bold text-gray-900">4,363</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Datasets Available</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="library">
              <Database className="mr-2 h-4 w-4" />
              Model Library
            </TabsTrigger>
            <TabsTrigger value="creator">
              <Code className="mr-2 h-4 w-4" />
              Model Creator
            </TabsTrigger>
            <TabsTrigger value="workspace" disabled={!selectedModel && !currentSession}>
              <Play className="mr-2 h-4 w-4" />
              Simulation Workspace
            </TabsTrigger>
            <TabsTrigger value="collaboration">
              <Users className="mr-2 h-4 w-4" />
              Collaboration Hub
            </TabsTrigger>
            <TabsTrigger value="datasets">
              <FileText className="mr-2 h-4 w-4" />
              Dataset Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search models..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-48">
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
                      <SelectTrigger className="w-full md:w-48">
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
                </CardContent>
              </Card>

              {/* Category Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {categories.map((category) => {
                  const categoryModels = mockModels.filter((m) => m.category === category.id)
                  return (
                    <Card
                      key={category.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg ${category.color} text-white text-xl`}>{category.icon}</div>
                          <div className="ml-3">
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-500">{categoryModels.length} models</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Model Grid */}
              <ModelLibrary
                models={filteredModels}
                onModelSelect={handleModelSelect}
                categories={categories}
                languages={languages}
              />
            </div>
          </TabsContent>

          <TabsContent value="creator">
            <ModelCreator
              categories={categories}
              languages={languages}
              onModelCreated={(model) => {
                setSelectedModel(model)
                setActiveTab("workspace")
              }}
            />
          </TabsContent>

          <TabsContent value="workspace">
            {(selectedModel || currentSession) && (
              <SimulationWorkspace
                model={selectedModel}
                session={currentSession}
                onRunSimulation={handleRunSimulation}
                onSessionUpdate={setCurrentSession}
              />
            )}
          </TabsContent>

          <TabsContent value="collaboration">
            <CollaborationHub />
          </TabsContent>

          <TabsContent value="datasets">
            <DatasetManager categories={categories} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
