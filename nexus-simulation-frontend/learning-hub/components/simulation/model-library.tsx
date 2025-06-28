"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Play, Eye, Share2 } from "lucide-react"

interface ModelLibraryProps {
  models: any[]
  onModelSelect: (model: any) => void
  categories: any[]
  languages: any[]
}

export function ModelLibrary({ models, onModelSelect, categories, languages }: ModelLibraryProps) {
  const getCategoryInfo = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || { name: categoryId, icon: "📊", color: "bg-gray-500" }
  }

  const getLanguageInfo = (languageId: string) => {
    return languages.find((l) => l.id === languageId) || { name: languageId, icon: "💻" }
  }

  return (
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
              <CardDescription className="line-clamp-2">{model.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Author & Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{model.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-600">{model.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{model.rating}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{model.collaborators} collaborators</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="h-3 w-3" />
                  <span>{model.runs} runs</span>
                </div>
                <span>Updated {model.lastModified}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button onClick={() => onModelSelect(model)} className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
                  <Play className="mr-1 h-3 w-3" />
                  Run Model
                </Button>
                <Button variant="outline" size="sm">
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
  )
}
