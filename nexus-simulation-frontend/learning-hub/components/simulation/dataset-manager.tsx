"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Database, Search, Download, Eye, Share2, Trash2, Loader2 } from "lucide-react"
import { Dataset } from "@/lib/api"

interface DatasetManagerProps {
  datasets: Dataset[]
  onDatasetUpload: () => void
  isLoading: boolean
}

export function DatasetManager({ datasets, onDatasetUpload, isLoading }: DatasetManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dataset.description && dataset.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getUserDatasets = () => {
    // Filter datasets owned by current user
    return datasets.filter(dataset => dataset.owner === 'current_user') // TODO: Replace with actual user check
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dataset Manager</CardTitle>
              <CardDescription>Upload, manage, and share datasets for your simulation models</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Dataset
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="library">
        <TabsList className="mb-6">
          <TabsTrigger value="library">
            <Database className="mr-2 h-4 w-4" />
            Dataset Library
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Data
          </TabsTrigger>
          <TabsTrigger value="my-datasets">
            <Database className="mr-2 h-4 w-4" />
            My Datasets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading datasets...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredDatasets.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                  <p>Try adjusting your search criteria or upload a new dataset.</p>
                </div>
              </div>
            )}

            {/* Dataset Grid */}
            {!isLoading && filteredDatasets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDatasets.map((dataset) => {
                  const category = getCategoryInfo(dataset.name.toLowerCase().includes('mortality') ? 'actuarial' : 
                                                  dataset.name.toLowerCase().includes('climate') ? 'climate' :
                                                  dataset.name.toLowerCase().includes('market') || dataset.name.toLowerCase().includes('financial') ? 'financial' :
                                                  dataset.name.toLowerCase().includes('insurance') ? 'insurance' : 'actuarial')
                  const fileExtension = dataset.file ? dataset.file.split('.').pop()?.toUpperCase() || 'FILE' : 'FILE'
                  
                  return (
                    <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className={`${category.color} text-white`}>
                            {category.icon} {category.name}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Badge variant="outline">{fileExtension}</Badge>
                            {!dataset.is_public && <Badge variant="secondary">Private</Badge>}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{dataset.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {dataset.description || "No description available"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Size:</span> {formatFileSize(dataset.size || 0)}
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span> {dataset.owner}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Created:</span> {new Date(dataset.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Download className="mr-1 h-3 w-3" />
                            Use Dataset
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Dataset</CardTitle>
              <CardDescription>
                Upload your own datasets to use in simulations or share with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Your Dataset</h3>
                  <p className="text-gray-500 mb-4">Drag and drop files here, or click to browse</p>
                  <Button>Choose Files</Button>
                  <p className="text-xs text-gray-400 mt-2">Supported formats: CSV, Excel, JSON, Parquet (Max 100MB)</p>
                </div>

                {/* Dataset Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Dataset Name</label>
                    <Input placeholder="Enter dataset name..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">Select category...</option>
                      <option value="actuarial">📊 Actuarial Models</option>
                      <option value="climate">🌍 Climate & Environmental</option>
                      <option value="financial">💰 Financial Models</option>
                      <option value="health">🏥 Health & Demographic</option>
                      <option value="ml">🤖 AI & Machine Learning</option>
                      <option value="insurance">🛡️ Insurance Products</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Describe your dataset..." />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="makePublic" />
                  <label htmlFor="makePublic" className="text-sm">
                    Make this dataset public for other users
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={onDatasetUpload}
                  >
                    Upload Dataset
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-datasets">
          <div className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your datasets...</p>
                </div>
              </div>
            )}

            {!isLoading && getUserDatasets().length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                  <p>You haven't uploaded any datasets yet. Upload your first dataset to get started.</p>
                </div>
              </div>
            )}

            {!isLoading && getUserDatasets().map((dataset) => {
              const category = getCategoryInfo(dataset.name.toLowerCase().includes('mortality') ? 'actuarial' : 
                                            dataset.name.toLowerCase().includes('climate') ? 'climate' :
                                            dataset.name.toLowerCase().includes('market') || dataset.name.toLowerCase().includes('financial') ? 'financial' :
                                            dataset.name.toLowerCase().includes('insurance') ? 'insurance' : 'actuarial')
              return (
                <Card key={dataset.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${category.color} text-white`}>{category.icon}</div>
                        <div>
                          <h4 className="font-medium">{dataset.name}</h4>
                          <p className="text-sm text-gray-500">{dataset.description || "No description available"}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                            <span>{formatFileSize(dataset.size || 0)}</span>
                            <span>Created {new Date(dataset.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-1 h-3 w-3" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
