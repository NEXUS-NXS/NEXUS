"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Database, Search, Download, Eye, Share2, Trash2 } from "lucide-react"

interface DatasetManagerProps {
  categories: any[]
}

export function DatasetManager({ categories }: DatasetManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const datasets = [
    {
      id: "1",
      name: "S&P 500 Historical Data",
      description: "Daily prices and returns for S&P 500 components (2000-2023)",
      category: "financial",
      format: "CSV",
      size: "45.2 MB",
      lastUpdated: "2023-12-15",
      downloads: 1247,
      isPublic: true,
      owner: "Market Data Corp",
    },
    {
      id: "2",
      name: "US Mortality Tables 2023",
      description: "Latest mortality rates by age, gender, and region",
      category: "actuarial",
      format: "Excel",
      size: "2.3 MB",
      lastUpdated: "2023-12-01",
      downloads: 892,
      isPublic: true,
      owner: "Actuarial Society",
    },
    {
      id: "3",
      name: "Climate Risk Indicators",
      description: "Global climate risk metrics by region and scenario",
      category: "climate",
      format: "JSON",
      size: "15.7 MB",
      lastUpdated: "2023-11-15",
      downloads: 634,
      isPublic: true,
      owner: "Climate Research Institute",
    },
    {
      id: "4",
      name: "Insurance Claims Database",
      description: "Anonymized property insurance claims data",
      category: "insurance",
      format: "CSV",
      size: "8.9 MB",
      lastUpdated: "2023-10-30",
      downloads: 445,
      isPublic: false,
      owner: "You",
    },
  ]

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId) || { name: categoryId, icon: "📊", color: "bg-gray-500" }
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

            {/* Dataset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDatasets.map((dataset) => {
                const category = getCategoryInfo(dataset.category)
                return (
                  <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`${category.color} text-white`}>
                          {category.icon} {category.name}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline">{dataset.format}</Badge>
                          {!dataset.isPublic && <Badge variant="secondary">Private</Badge>}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{dataset.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{dataset.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Size:</span> {dataset.size}
                        </div>
                        <div>
                          <span className="font-medium">Downloads:</span> {dataset.downloads}
                        </div>
                        <div>
                          <span className="font-medium">Owner:</span> {dataset.owner}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span> {dataset.lastUpdated}
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
                        {dataset.owner === "You" && (
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
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
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
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
                  <Button className="bg-blue-600 hover:bg-blue-700">Upload Dataset</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-datasets">
          <div className="space-y-4">
            {datasets
              .filter((d) => d.owner === "You")
              .map((dataset) => {
                const category = getCategoryInfo(dataset.category)
                return (
                  <Card key={dataset.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${category.color} text-white`}>{category.icon}</div>
                          <div>
                            <h4 className="font-medium">{dataset.name}</h4>
                            <p className="text-sm text-gray-500">{dataset.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                              <span>{dataset.size}</span>
                              <span>{dataset.downloads} downloads</span>
                              <span>Updated {dataset.lastUpdated}</span>
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
