"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Database, Search, Download, Eye } from "lucide-react"

interface Dataset {
  id: string
  name: string
  description: string
  size: string
  format: string
  category: string
  lastUpdated: string
}

interface DatasetSelectorProps {
  selectedDatasets: string[]
  onChange: (datasets: string[]) => void
}

const availableDatasets: Dataset[] = [
  {
    id: "mortality-2023",
    name: "US Mortality Tables 2023",
    description: "Latest mortality rates by age and gender",
    size: "2.3 MB",
    format: "CSV",
    category: "Actuarial",
    lastUpdated: "2023-12-01",
  },
  {
    id: "climate-risk-data",
    name: "Global Climate Risk Indicators",
    description: "Climate risk metrics by region and scenario",
    size: "15.7 MB",
    format: "CSV",
    category: "Climate",
    lastUpdated: "2023-11-15",
  },
  {
    id: "market-data-sp500",
    name: "S&P 500 Historical Data",
    description: "Daily prices and returns for S&P 500 components",
    size: "45.2 MB",
    format: "CSV",
    category: "Financial",
    lastUpdated: "2023-12-15",
  },
  {
    id: "insurance-claims",
    name: "Property Insurance Claims",
    description: "Anonymized property insurance claims data",
    size: "8.9 MB",
    format: "CSV",
    category: "Insurance",
    lastUpdated: "2023-10-30",
  },
]

export function DatasetSelector({ selectedDatasets, onChange }: DatasetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const filteredDatasets = availableDatasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleDataset = (datasetId: string) => {
    if (selectedDatasets.includes(datasetId)) {
      onChange(selectedDatasets.filter((id) => id !== datasetId))
    } else {
      onChange([...selectedDatasets, datasetId])
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Dataset Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
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
            {filteredDatasets.map((dataset) => (
              <Card
                key={dataset.id}
                className={`cursor-pointer transition-all ${
                  selectedDatasets.includes(dataset.id) ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => toggleDataset(dataset.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{dataset.category}</Badge>
                    <Badge variant="secondary">{dataset.format}</Badge>
                  </div>
                  <CardTitle className="text-lg">{dataset.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{dataset.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{dataset.size}</span>
                    <span>Updated: {dataset.lastUpdated}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          {/* Upload Area */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Your Dataset</h3>
              <p className="text-gray-500 mb-4">Drag and drop files here, or click to browse</p>
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  Choose Files
                </Button>
              </label>
              <p className="text-xs text-gray-400 mt-2">Supported formats: CSV, Excel, JSON (Max 100MB)</p>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Uploaded Files</h4>
              {uploadedFiles.map((file, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selected Datasets Summary */}
      {selectedDatasets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Selected Datasets ({selectedDatasets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedDatasets.map((datasetId) => {
                const dataset = availableDatasets.find((d) => d.id === datasetId)
                return dataset ? (
                  <Badge key={datasetId} variant="default" className="flex items-center">
                    {dataset.name}
                    <button
                      onClick={() => toggleDataset(datasetId)}
                      className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
