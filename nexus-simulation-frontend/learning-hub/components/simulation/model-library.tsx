"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Users, Play, Eye, Share2, Loader2 } from "lucide-react"
import { runSimulation } from "@/lib/api"

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

interface ModelLibraryProps {
  models: SimulationModel[]
  onModelSelect: (model: SimulationModel) => void
  searchTerm: string
  selectedCategory: string
  selectedLanguage: string
  isLoading: boolean
}

export function ModelLibrary({ 
  models, 
  onModelSelect, 
  searchTerm, 
  selectedCategory, 
  selectedLanguage, 
  isLoading 
}: ModelLibraryProps) {
  const [selectedModel, setSelectedModel] = useState<SimulationModel | null>(null)
  const [datasetId, setDatasetId] = useState("")
  const [runningSimulation, setRunningSimulation] = useState(false)
  const router = useRouter()

  const getCategoryInfo = (categoryId: string) => {
    const categories = [
      { id: "actuarial", name: "Actuarial Models", icon: "📊", color: "bg-blue-500" },
      { id: "climate", name: "Climate & Environmental", icon: "🌍", color: "bg-green-500" },
      { id: "financial", name: "Financial Models", icon: "💰", color: "bg-emerald-500" },
      { id: "health", name: "Health & Demographic", icon: "🏥", color: "bg-red-500" },
      { id: "ml", name: "AI & Machine Learning", icon: "🤖", color: "bg-purple-500" },
      { id: "insurance", name: "Insurance Products", icon: "🛡️", color: "bg-orange-500" },
    ]
    return categories.find((c) => c.id === categoryId) || { name: categoryId, icon: "📊", color: "bg-gray-500" }
  }

  const getLanguageInfo = (languageId: string) => {
    const languages = [
      { id: "python", name: "Python", icon: "🐍" },
      { id: "r", name: "R", icon: "📈" },
      { id: "fel", name: "Fast Expression Language", icon: "⚡" },
    ]
    return languages.find((l) => l.id === languageId) || { name: languageId, icon: "💻" }
  }

  const handleRunModel = async () => {
    if (!selectedModel) return
    
    setRunningSimulation(true)
    try {
      const payload = {
        model_id: selectedModel.id,
        parameters: {},
        ...(datasetId && { dataset_id: datasetId }),
      }
      const response = await runSimulation(payload)
      
      // Close dialog and notify parent
      setSelectedModel(null)
      onModelSelect(selectedModel)
      
      console.log('Simulation started:', response)
      
    } catch (err) {
      console.error("Failed to run simulation:", err)
      alert("Failed to start simulation. Please try again.")
    } finally {
      setRunningSimulation(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading models...</p>
        </div>
      </div>
    )
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">No models found</h3>
          <p>Try adjusting your search or filter criteria, or create a new model.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => {
          const category = getCategoryInfo(model.category)
          const language = getLanguageInfo(model.language)

          return (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={`${category.color} text-white`}>
                    {category.icon} {category.name}
                  </Badge>
                  <Badge variant="outline">
                    {language.icon} {language.name}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{model.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {model.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{model.author?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-600">{model.author || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{model.rating || 0}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{model.collaborators || 0} collaborators</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-3 w-3" />
                    <span>{model.runs || 0} runs</span>
                  </div>
                  <span>Updated {new Date(model.lastModified).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setSelectedModel(model)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Run Model
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onModelSelect(model)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Model: {selectedModel?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataset">Dataset ID (Optional)</Label>
              <Input
                id="dataset"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="Enter dataset ID or leave blank"
              />
            </div>
            <Button 
              onClick={handleRunModel} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={runningSimulation}
            >
              {runningSimulation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Simulation...
                </>
              ) : (
                'Run Simulation'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}