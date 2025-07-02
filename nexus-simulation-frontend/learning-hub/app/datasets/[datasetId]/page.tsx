'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, FileSpreadsheet, Database, BarChart, Loader2 } from "lucide-react"
import { getDataset, downloadDataset, shareDataset, Dataset } from "@/lib/api"

export default function DatasetDetailPage() {
  const params = useParams()
  const datasetId = params.datasetId as string
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const loadDataset = async () => {
      try {
        setLoading(true)
        const data = await getDataset(datasetId)
        setDataset(data)
      } catch (error) {
        console.error("Failed to load dataset:", error)
      } finally {
        setLoading(false)
      }
    }

    if (datasetId) {
      loadDataset()
    }
  }, [datasetId])

  const handleDownload = async () => {
    if (!dataset) return
    
    try {
      setDownloading(true)
      const response = await downloadDataset(dataset.id)
      
      // Create blob from response and trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = dataset.name || 'dataset'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!dataset) return
    
    try {
      await shareDataset(dataset.id, { make_public: true })
      // Refresh dataset data
      const updatedData = await getDataset(datasetId)
      setDataset(updatedData)
    } catch (error) {
      console.error("Share failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!dataset) {
    notFound()
  }

  const DatasetIcon = dataset.type === "CSV" ? FileSpreadsheet : dataset.type === "Database" ? Database : BarChart

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/datasets" className="text-sm text-muted-foreground hover:text-foreground">
              Datasets
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{dataset.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={downloading}>
              <Download className="mr-2 h-4 w-4" />
              {downloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <DatasetIcon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle>{dataset.name}</CardTitle>
                  </div>
                  <Badge variant={dataset.is_public ? "default" : "outline"}>
                    {dataset.is_public ? "Public" : "Private"}
                  </Badge>
                </div>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="preview">Data Preview</TabsTrigger>
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-lg font-medium">About this dataset</h3>
                        <p className="mt-2 text-muted-foreground">{dataset.long_description || dataset.description}</p>
                      </div>
                      {dataset.source && (
                        <div>
                          <h3 className="text-lg font-medium">Data Source</h3>
                          <p className="mt-2 text-muted-foreground">{dataset.source}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium">Data Quality</h3>
                        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Completeness</span>
                            <span className="text-lg font-medium">{dataset.quality.completeness}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Accuracy</span>
                            <span className="text-lg font-medium">{dataset.quality.accuracy}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Consistency</span>
                            <span className="text-lg font-medium">{dataset.quality.consistency}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Timeliness</span>
                            <span className="text-lg font-medium">{dataset.quality.timeliness}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-6">
                    {dataset.preview_data?.columns && dataset.preview_data?.rows ? (
                      <>
                        <div className="rounded-md border">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b bg-muted/50">
                                  {dataset.preview_data.columns.map((column) => (
                                    <th key={column} className="px-4 py-2 text-left text-sm font-medium">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {dataset.preview_data.rows.map((row, i) => (
                                  <tr key={i} className="border-b">
                                    {row.map((cell, j) => (
                                      <td key={j} className="px-4 py-2 text-sm">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Showing {dataset.preview_data.rows.length} of {dataset.row_count || 'N/A'} rows
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No preview data available
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="schema" className="mt-6">
                    {dataset.schema && dataset.schema.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="px-4 py-2 text-left text-sm font-medium">Column Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Nullable</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataset.schema.map((column, i) => (
                                <tr key={i} className="border-b">
                                  <td className="px-4 py-2 text-sm font-medium">{column.name}</td>
                                  <td className="px-4 py-2 text-sm">{column.type}</td>
                                  <td className="px-4 py-2 text-sm">{column.description || 'N/A'}</td>
                                  <td className="px-4 py-2 text-sm">{column.nullable ? "Yes" : "No"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No schema information available
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="usage" className="mt-6">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-lg font-medium">Usage in Models</h3>
                        <p className="mt-2 text-muted-foreground">
                          This dataset is currently used in {dataset.usage_stats?.models || 0} models.
                        </p>
                        {dataset.usage_stats?.modelNames && dataset.usage_stats.modelNames.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {dataset.usage_stats.modelNames.map((model) => (
                              <Badge key={model} variant="secondary">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Code Example</h3>
                        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-4">
                          <code className="text-sm">
                            {`# Load the dataset in Python
import pandas as pd

# Load the dataset
df = pd.read_csv("${dataset.name.toLowerCase().replace(/\s+/g, "_")}.csv")

# Display the first few rows
print(df.head())

# Get basic statistics
print(df.describe())`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <div className="flex items-center gap-2">
                        <DatasetIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{dataset.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <span>{dataset.size ? `${(dataset.size / 1024 / 1024).toFixed(1)} MB` : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Rows</span>
                      <span>{dataset.row_count?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Columns</span>
                      <span>{dataset.column_count || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span>{new Date(dataset.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span>{new Date(dataset.updated_at).toLocaleDateString()}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Owner</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{dataset.owner.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{dataset.owner}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Visibility</span>
                      <span>{dataset.is_public ? "Public" : "Private"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Shared With</span>
                      <div className="mt-2 flex -space-x-2">
                        {dataset.shared_with.slice(0, 3).map((user, i) => (
                          <Avatar key={i} className="border-2 border-background">
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                        {dataset.shared_with_count > 3 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{dataset.shared_with_count - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
