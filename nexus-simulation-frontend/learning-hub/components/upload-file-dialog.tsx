"use client"

import type React from "react"

import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, File, X } from "lucide-react"

interface UploadFileDialogProps {
  children: React.ReactNode
}

export function UploadFileDialog({ children }: UploadFileDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [fileData, setFileData] = useState({
    category: "",
    description: "",
    tags: "",
  })

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles([...selectedFiles, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setOpen(false)
          // Reset form
          setSelectedFiles([])
          setFileData({ category: "", description: "", tags: "" })
          setUploadProgress(0)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>Upload documents, spreadsheets, and other files to the project.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Select Files</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
              <Input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select
                value={fileData.category}
                onValueChange={(value) => setFileData({ ...fileData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="data">Data Files</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="presentations">Presentations</SelectItem>
                  <SelectItem value="code">Code Files</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tags</Label>
              <Input
                placeholder="Enter tags (comma separated)"
                value={fileData.tags}
                onChange={(e) => setFileData({ ...fileData, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the files and their purpose"
              rows={3}
              value={fileData.description}
              onChange={(e) => setFileData({ ...fileData, description: e.target.value })}
            />
          </div>

          {isUploading && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Upload Progress</Label>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
