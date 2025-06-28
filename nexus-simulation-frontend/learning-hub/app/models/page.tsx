import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Plus, Users, Clock, Play, Star } from "lucide-react"
import Link from "next/link"
import { simulationModels } from "@/lib/simulation-models"

export default function ModelsPage() {
  const featuredModels = simulationModels.filter((model) => model.featured).slice(0, 3)
  const recentModels = simulationModels.slice(0, 6)

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
              <Input placeholder="Search models..." className="pl-10" />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="all">All Models</TabsTrigger>
            <TabsTrigger value="actuarial">Actuarial</TabsTrigger>
            <TabsTrigger value="climate">Climate</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="ml">Machine Learning</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
          </TabsList>

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
                      <Badge className={`${model.categoryColor} text-white`}>{model.category}</Badge>
                      <Badge variant="outline">{model.language}</Badge>
                    </div>
                    <CardTitle className="text-lg">{model.title}</CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={model.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{model.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{model.author.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{model.collaborators}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{model.runtime}</span>
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

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actuarial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulationModels
                .filter((model) => model.category === "Actuarial")
                .map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulationModels
                .filter((model) => model.category === "Financial")
                .map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
            </div>
          </TabsContent>

          {/* Add other category tabs as needed */}
        </Tabs>
      </div>
    </div>
  )
}

interface ModelCardProps {
  model: (typeof simulationModels)[0]
}

function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={`${model.categoryColor} text-white`}>{model.category}</Badge>
          <Badge variant="outline">{model.language}</Badge>
        </div>
        <CardTitle className="text-lg">{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={model.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{model.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{model.author.name}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{model.collaborators}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{model.runtime}</span>
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
