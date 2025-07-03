'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Play, 
  Plus,
  Loader2
} from "lucide-react"
import { fetchModels, SimulationModel } from '@/lib/api' // <-- use fetchModels instead of getModel

export default function ModelsPage() {
  const [models, setModels] = useState<SimulationModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchAllModels = async () => {
      try {
        const response = await fetchModels() // <-- fetchModels gets all models
        if (Array.isArray(response)) {
          setModels(response)
        } else if (response && response.results) {
          setModels(response.results)
        } else {
          setModels([])
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        setModels([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllModels()
  }, [])

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || model.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const featuredModels = filteredModels.slice(0, 3) // Since we don't have featured flag in API, take first 3

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
    return colors[category.toLowerCase()] || 'bg-gray-500'
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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Simulation Models</h1>
            <p className="mt-2 text-gray-500">Explore and run pre-built models or create your own</p>
          </div>
          <Link href="/create" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Model
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search models..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Featured Models */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Featured Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredModels.map((model) => (
              <Card key={model.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getCategoryColor(model.category)} text-white`}>
                      {model.category}
                    </Badge>
                    <Badge variant="outline">{model.language}</Badge>
                  </div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription>{model.description || 'No description available'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{model.owner.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{model.owner}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(model.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>~2 min</span>
                    </div>
                    <Link href={`/models/${model.id}`} passHref>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play className="mr-1 h-3 w-3" />
                        Run
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="all">All Models</TabsTrigger>
            <TabsTrigger value="actuarial">Actuarial</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="climate">Climate</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} getCategoryColor={getCategoryColor} />
              ))}
            </div>
          </TabsContent>

          {["actuarial", "financial", "climate", "health", "insurance"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels
                  .filter((model) => model.category.toLowerCase() === category)
                  .map((model) => (
                    <ModelCard key={model.id} model={model} getCategoryColor={getCategoryColor} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

interface ModelCardProps {
  model: SimulationModel
  getCategoryColor: (category: string) => string
}

function ModelCard({ model, getCategoryColor }: ModelCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={`${getCategoryColor(model.category)} text-white`}>
            {model.category}
          </Badge>
          <Badge variant="outline">{model.language}</Badge>
        </div>
        <CardTitle className="text-lg">{model.name}</CardTitle>
        <CardDescription>{model.description || 'No description available'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{model.owner.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{model.owner}</span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(model.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>~2 min</span>
          </div>
          <Link href={`/models/${model.id}`} passHref>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Play className="mr-1 h-3 w-3" />
              Run
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}