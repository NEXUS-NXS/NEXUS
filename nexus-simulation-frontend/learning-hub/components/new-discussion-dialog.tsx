"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface NewDiscussionDialogProps {
  children: React.ReactNode
}

export function NewDiscussionDialog({ children }: NewDiscussionDialogProps) {
  const [open, setOpen] = useState(false)
  const [discussionData, setDiscussionData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "Medium",
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleCreateDiscussion = () => {
    const newDiscussion = {
      ...discussionData,
      tags,
      id: Date.now().toString(),
      startedBy: "Current User", // This would come from auth context
      replies: 0,
      lastActivity: "Just now",
    }
    console.log("Creating discussion:", newDiscussion)
    setOpen(false)
    // Reset form
    setDiscussionData({
      title: "",
      content: "",
      category: "",
      priority: "Medium",
    })
    setTags([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogDescription>Create a new discussion thread for the project team.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="discussion-title">Discussion Title *</Label>
            <Input
              id="discussion-title"
              placeholder="Enter discussion title"
              value={discussionData.title}
              onChange={(e) => setDiscussionData({ ...discussionData, title: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select
                value={discussionData.category}
                onValueChange={(value) => setDiscussionData({ ...discussionData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Methodology">Methodology</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                  <SelectItem value="Implementation">Implementation</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Question">Question</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Select
                value={discussionData.priority}
                onValueChange={(value) => setDiscussionData({ ...discussionData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="discussion-content">Content *</Label>
            <Textarea
              id="discussion-content"
              placeholder="Start the discussion..."
              rows={6}
              value={discussionData.content}
              onChange={(e) => setDiscussionData({ ...discussionData, content: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="outline" onClick={addTag} disabled={!newTag.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-md bg-muted/50 p-4">
            <h4 className="font-medium mb-2">Discussion Preview</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Title:</span> {discussionData.title || "Not specified"}
              </p>
              <p>
                <span className="text-muted-foreground">Category:</span> {discussionData.category || "Not selected"}
              </p>
              <p>
                <span className="text-muted-foreground">Priority:</span> {discussionData.priority}
              </p>
              <p>
                <span className="text-muted-foreground">Tags:</span> {tags.length > 0 ? tags.join(", ") : "None"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateDiscussion} disabled={!discussionData.title || !discussionData.content}>
            Start Discussion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
