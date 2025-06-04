"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileSpreadsheet, Database, BarChart, CheckCircle2, AlertCircle, X, Plus } from "lucide-react"

interface UploadDatasetDialogProps {
  children: React.ReactNode
}

export function UploadDatasetDialog({ children }: UploadDatasetDialogProps) {
  const [open, setOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentTab, setCurrentTab] = useState("upload")
  const [datasetInfo, setDatasetInfo] = useState({
    name: "",
    description: "",
    category: "",
    tags: [] as string[],
    isPublic: false,
    license: "",
  })
  const [currentTag, setCurrentTag] = useState("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCurrentTab("details")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          setCurrentTab("preview")
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const addTag = () => {
    if (currentTag && !datasetInfo.tags.includes(currentTag)) {
      setDatasetInfo({
        ...datasetInfo,
        tags: [...datasetInfo.tags, currentTag],
      })
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setDatasetInfo({
      ...datasetInfo,
      tags: datasetInfo.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".csv")) return FileSpreadsheet
    if (fileName.endsWith(".db") || fileName.endsWith(".sql")) return Database
    return BarChart
  }

  const handlePublish = () => {
    // Handle dataset publishing logic here
    console.log("Publishing dataset:", { selectedFile, datasetInfo })
    setOpen(false)
    // Reset form
    setSelectedFile(null)
    setDatasetInfo({
      name: "",
      description: "",
      category: "",
      tags: [],
      isPublic: false,
      license: "",
    })
    setUploadProgress(0)
    setIsUploading(false)
    setUploadComplete(false)
    setCurrentTab("upload")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Dataset</DialogTitle>
          <DialogDescription>Share your data with the community or keep it private for your projects</DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedFile}>
                Dataset Details
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!uploadComplete}>
                Preview & Publish
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div className="flex flex-col gap-6">
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Drop your file here or click to browse</p>
                        <p className="text-sm text-muted-foreground">
                          Maximum file size: 100MB • Supported: CSV, XLSX, JSON, SQL
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.json,.sql,.db"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload-dialog"
                      />
                      <Label htmlFor="file-upload-dialog" className="cursor-pointer">
                        <Button variant="outline">Choose File</Button>
                      </Label>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {React.createElement(getFileIcon(selectedFile.name), {
                          className: "h-8 w-8 text-blue-500",
                        })}
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Uploading...</span>
                          <span className="text-sm">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    {uploadComplete && (
                      <div className="mt-4 flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Upload complete!</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedFile && !isUploading && !uploadComplete && (
                  <Button onClick={handleUpload} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Dataset
                  </Button>
                )}

                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Supported Formats</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>CSV (.csv)</li>
                      <li>Excel (.xlsx, .xls)</li>
                      <li>JSON (.json)</li>
                      <li>SQL Database (.sql, .db)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Best Practices</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Include column headers</li>
                      <li>Use consistent data formats</li>
                      <li>Remove PII data</li>
                      <li>Provide clear descriptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Dataset Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter dataset name"
                      value={datasetInfo.name}
                      onChange={(e) => setDatasetInfo({ ...datasetInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={datasetInfo.category}
                      onValueChange={(value) => setDatasetInfo({ ...datasetInfo, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mortality">Mortality Tables</SelectItem>
                        <SelectItem value="claims">Claims Data</SelectItem>
                        <SelectItem value="financial">Financial Data</SelectItem>
                        <SelectItem value="economic">Economic Indicators</SelectItem>
                        <SelectItem value="demographic">Demographics</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your dataset, its source, and potential use cases"
                    rows={3}
                    value={datasetInfo.description}
                    onChange={(e) => setDatasetInfo({ ...datasetInfo, description: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tags (e.g., life-insurance, mortality)"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {datasetInfo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {datasetInfo.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="license">License</Label>
                    <Select
                      value={datasetInfo.license}
                      onValueChange={(value) => setDatasetInfo({ ...datasetInfo, license: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select license" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cc0">CC0 (Public Domain)</SelectItem>
                        <SelectItem value="cc-by">CC BY (Attribution)</SelectItem>
                        <SelectItem value="cc-by-sa">CC BY-SA (Attribution-ShareAlike)</SelectItem>
                        <SelectItem value="mit">MIT License</SelectItem>
                        <SelectItem value="proprietary">Proprietary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="public">Make dataset public</Label>
                      <p className="text-xs text-muted-foreground">Public datasets can be discovered by others</p>
                    </div>
                    <Switch
                      id="public"
                      checked={datasetInfo.isPublic}
                      onCheckedChange={(checked) => setDatasetInfo({ ...datasetInfo, isPublic: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleUpload} disabled={!datasetInfo.name || !datasetInfo.description}>
                    Continue to Preview
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Dataset Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {datasetInfo.name}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {datasetInfo.category}
                      </div>
                      <div>
                        <span className="font-medium">File:</span> {selectedFile?.name}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>{" "}
                        {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB
                      </div>
                      <div>
                        <span className="font-medium">Visibility:</span> {datasetInfo.isPublic ? "Public" : "Private"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Validation Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">File format validated</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Data types detected</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">No missing headers</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">5% missing values detected</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                    <CardDescription>First few rows of your dataset</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-2 text-left text-sm font-medium">Column 1</th>
                            <th className="px-4 py-2 text-left text-sm font-medium">Column 2</th>
                            <th className="px-4 py-2 text-left text-sm font-medium">Column 3</th>
                            <th className="px-4 py-2 text-left text-sm font-medium">Column 4</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4 py-2 text-sm">Sample data</td>
                            <td className="px-4 py-2 text-sm">123.45</td>
                            <td className="px-4 py-2 text-sm">2023-01-01</td>
                            <td className="px-4 py-2 text-sm">Category A</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-2 text-sm">Sample data</td>
                            <td className="px-4 py-2 text-sm">678.90</td>
                            <td className="px-4 py-2 text-sm">2023-01-02</td>
                            <td className="px-4 py-2 text-sm">Category B</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Sample data</td>
                            <td className="px-4 py-2 text-sm">234.56</td>
                            <td className="px-4 py-2 text-sm">2023-01-03</td>
                            <td className="px-4 py-2 text-sm">Category C</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCurrentTab("details")}>
                    Back to Details
                  </Button>
                  <Button onClick={handlePublish} size="lg">
                    Publish Dataset
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
