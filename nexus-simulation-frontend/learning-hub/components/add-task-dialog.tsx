"use client"

import type React from "react"

import { useState } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface AddTaskDialogProps {
  children: React.ReactNode
}

export function AddTaskDialog({ children }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    assignee: "",
    priority: "",
    status: "Not Started",
  })

  const teamMembers = [
    { id: "1", name: "Sarah Chen", role: "Project Lead" },
    { id: "2", name: "Michael Johnson", role: "Senior Actuary" },
    { id: "3", name: "Emily Rodriguez", role: "Data Scientist" },
    { id: "4", name: "David Kim", role: "Actuary" },
    { id: "5", name: "Lisa Wong", role: "Compliance Officer" },
  ]

  const handleCreateTask = () => {
    const newTask = {
      ...taskData,
      dueDate: dueDate ? format(dueDate, "MMM dd, yyyy") : "",
      id: Date.now().toString(),
    }
    console.log("Creating task:", newTask)
    setOpen(false)
    // Reset form
    setTaskData({
      name: "",
      description: "",
      assignee: "",
      priority: "",
      status: "Not Started",
    })
    setDueDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to the project and assign it to a team member.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-name">Task Name *</Label>
            <Input
              id="task-name"
              placeholder="Enter task name"
              value={taskData.name}
              onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Describe the task objectives and requirements"
              rows={3}
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Assign To</Label>
              <Select
                value={taskData.assignee}
                onValueChange={(value) => setTaskData({ ...taskData, assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Select
                value={taskData.priority}
                onValueChange={(value) => setTaskData({ ...taskData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={taskData.status} onValueChange={(value) => setTaskData({ ...taskData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-4">
            <h4 className="font-medium mb-2">Task Summary</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Name:</span> {taskData.name || "Not specified"}
              </p>
              <p>
                <span className="text-muted-foreground">Assignee:</span> {taskData.assignee || "Not assigned"}
              </p>
              <p>
                <span className="text-muted-foreground">Priority:</span> {taskData.priority || "Not set"}
              </p>
              <p>
                <span className="text-muted-foreground">Due Date:</span> {dueDate ? format(dueDate, "PPP") : "Not set"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} disabled={!taskData.name}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
