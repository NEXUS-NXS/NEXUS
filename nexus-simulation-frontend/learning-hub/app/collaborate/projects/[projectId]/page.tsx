import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  BarChart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  Share2,
} from "lucide-react"

import { AddTeamMemberDialog } from "@/components/add-team-member-dialog"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { UploadFileDialog } from "@/components/upload-file-dialog"
import { NewDiscussionDialog } from "@/components/new-discussion-dialog"

export const metadata: Metadata = {
  title: "Project Details | Nexus Learning Hub",
  description: "Detailed information and collaboration tools for the selected project.",
}

interface PageProps {
  params: {
    projectId: string
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = projects.find((p) => p.id === params.projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/collaborate" className="text-sm text-muted-foreground hover:text-foreground">
              Collaborate
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <Link href="/collaborate" className="text-sm text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{project.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <AddTaskDialog>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </AddTaskDialog>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <Badge
                variant={
                  project.status === "Active" ? "default" : project.status === "Completed" ? "success" : "secondary"
                }
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Progress</CardTitle>
                      <CardDescription>Overall completion and milestone status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-6">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="mt-2 h-2" />
                        </div>
                        <div className="grid gap-4">
                          {project.milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {milestone.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                                )}
                                <span>{milestone.name}</span>
                              </div>
                              <Badge variant="outline">{milestone.dueDate}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest updates and changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        {project.recentActivity.map((activity, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <Avatar className="mt-1 h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={activity.user} />
                              <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{activity.user}</span>
                                <span className="text-sm text-muted-foreground">{activity.time}</span>
                              </div>
                              <p className="text-sm">{activity.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{project.fullDescription}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="tasks" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>Manage and track project tasks</CardDescription>
                    </div>
                    <AddTaskDialog>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                      </Button>
                    </AddTaskDialog>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-md border p-4">
                          <div className="flex items-center gap-3">
                            {task.status === "Completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : task.status === "In Progress" ? (
                              <Clock className="h-5 w-5 text-blue-500" />
                            ) : task.priority === "High" ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                            )}
                            <div>
                              <div className="font-medium">{task.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Assigned to {task.assignee} • Due {task.dueDate}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              task.status === "Completed"
                                ? "success"
                                : task.status === "In Progress"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="files" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Files</CardTitle>
                      <CardDescription>Project documents and resources</CardDescription>
                    </div>
                    <UploadFileDialog>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload File
                      </Button>
                    </UploadFileDialog>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {project.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between rounded-md border p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Uploaded by {file.uploadedBy} • {file.uploadDate}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="discussions" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Discussions</CardTitle>
                      <CardDescription>Project conversations and threads</CardDescription>
                    </div>
                    <NewDiscussionDialog>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Discussion
                      </Button>
                    </NewDiscussionDialog>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {project.discussions.map((discussion) => (
                        <Link
                          key={discussion.id}
                          href={`/collaborate/projects/${params.projectId}/discussions/${discussion.id}`}
                          className="flex flex-col gap-2 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{discussion.title}</div>
                            <Badge variant="outline">{discussion.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src="/placeholder.svg?height=16&width=16" alt={discussion.startedBy} />
                                <AvatarFallback>{discussion.startedBy.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{discussion.startedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{discussion.lastActivity}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="models" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Models</CardTitle>
                      <CardDescription>Project simulation models and results</CardDescription>
                    </div>
                    <Button size="sm" asChild>
                      <Link href="/create">
                        <Plus className="mr-2 h-4 w-4" />
                        New Model
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {project.models.map((model) => (
                        <div key={model.id} className="flex items-center justify-between rounded-md border p-4">
                          <div className="flex items-center gap-3">
                            <BarChart className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Created by {model.createdBy} • Last run {model.lastRun}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/models/${model.id}`}>View Model</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span>{project.status}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Start Date</span>
                      <span>{project.startDate}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Target Completion</span>
                      <span>{project.targetCompletion}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Project Lead</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={project.lead} />
                          <AvatarFallback>{project.lead.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{project.lead}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">Team Members</span>
                      <div className="flex flex-wrap gap-2">
                        {project.members.map((member) => (
                          <Avatar key={member.id} className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        <AddTeamMemberDialog>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </AddTeamMemberDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {project.meetings.map((meeting) => (
                      <div key={meeting.id} className="flex flex-col gap-2 rounded-md border p-3">
                        <div className="font-medium">{meeting.title}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.attendees} attendees</span>
                        </div>
                        <Button size="sm" className="mt-2">
                          Join Meeting
                        </Button>
                      </div>
                    ))}
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

interface Project {
  id: string
  name: string
  description: string
  fullDescription: string
  status: "Active" | "Completed" | "On Hold"
  progress: number
  startDate: string
  targetCompletion: string
  lead: string
  members: {
    id: string
    name: string
    role: string
  }[]
  milestones: {
    id: string
    name: string
    dueDate: string
    completed: boolean
  }[]
  tasks: {
    id: string
    name: string
    description: string
    assignee: string
    dueDate: string
    status: "Not Started" | "In Progress" | "Completed"
    priority: "Low" | "Medium" | "High"
  }[]
  files: {
    id: string
    name: string
    type: string
    size: string
    uploadedBy: string
    uploadDate: string
  }[]
  discussions: {
    id: string
    title: string
    category: string
    startedBy: string
    replies: number
    lastActivity: string
  }[]
  models: {
    id: string
    name: string
    description: string
    createdBy: string
    lastRun: string
  }[]
  meetings: {
    id: string
    title: string
    date: string
    time: string
    attendees: number
  }[]
  recentActivity: {
    user: string
    action: string
    time: string
  }[]
}

const projects: Project[] = [
  {
    id: "1",
    name: "IFRS 17 Implementation",
    description: "Collaborative project for implementing IFRS 17 standards in insurance reporting",
    fullDescription:
      "This project aims to develop and implement a comprehensive framework for IFRS 17 compliance across all insurance product lines. The implementation includes building calculation engines, data transformation pipelines, reporting templates, and validation tools. The project will also include training sessions for stakeholders and documentation of all processes and methodologies.",
    status: "Active",
    progress: 65,
    startDate: "Jan 15, 2023",
    targetCompletion: "Nov 30, 2023",
    lead: "Sarah Chen",
    members: [
      {
        id: "1",
        name: "Sarah Chen",
        role: "Project Lead",
      },
      {
        id: "2",
        name: "Michael Johnson",
        role: "Senior Actuary",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        role: "Data Scientist",
      },
      {
        id: "4",
        name: "David Kim",
        role: "Actuary",
      },
      {
        id: "5",
        name: "Lisa Wong",
        role: "Compliance Officer",
      },
      {
        id: "6",
        name: "Robert Taylor",
        role: "Legal Advisor",
      },
      {
        id: "7",
        name: "Jennifer Martinez",
        role: "Regulatory Specialist",
      },
      {
        id: "8",
        name: "James Wilson",
        role: "IT Specialist",
      },
    ],
    milestones: [
      {
        id: "1",
        name: "Requirements Analysis",
        dueDate: "Feb 28, 2023",
        completed: true,
      },
      {
        id: "2",
        name: "Data Mapping and Transformation",
        dueDate: "Apr 30, 2023",
        completed: true,
      },
      {
        id: "3",
        name: "Calculation Engine Development",
        dueDate: "Jul 31, 2023",
        completed: false,
      },
      {
        id: "4",
        name: "Reporting Framework",
        dueDate: "Sep 30, 2023",
        completed: false,
      },
      {
        id: "5",
        name: "User Acceptance Testing",
        dueDate: "Oct 31, 2023",
        completed: false,
      },
      {
        id: "6",
        name: "Final Implementation",
        dueDate: "Nov 30, 2023",
        completed: false,
      },
    ],
    tasks: [
      {
        id: "1",
        name: "Define contract groups for life insurance products",
        description:
          "Analyze and define appropriate contract groups for life insurance products according to IFRS 17 guidelines",
        assignee: "Michael Johnson",
        dueDate: "Jun 15, 2023",
        status: "Completed",
        priority: "High",
      },
      {
        id: "2",
        name: "Develop CSM calculation methodology",
        description: "Create and document the methodology for calculating the Contractual Service Margin",
        assignee: "Sarah Chen",
        dueDate: "Jun 30, 2023",
        status: "In Progress",
        priority: "High",
      },
      {
        id: "3",
        name: "Build data transformation pipeline for claims data",
        description: "Develop ETL processes to transform claims data into the required format for IFRS 17 calculations",
        assignee: "Emily Rodriguez",
        dueDate: "Jul 15, 2023",
        status: "In Progress",
        priority: "Medium",
      },
      {
        id: "4",
        name: "Create validation rules for calculation outputs",
        description: "Define and implement validation rules to ensure the accuracy of calculation outputs",
        assignee: "David Kim",
        dueDate: "Jul 31, 2023",
        status: "Not Started",
        priority: "Medium",
      },
      {
        id: "5",
        name: "Review regulatory compliance of implementation approach",
        description: "Conduct a comprehensive review of the implementation approach for regulatory compliance",
        assignee: "Lisa Wong",
        dueDate: "Aug 15, 2023",
        status: "Not Started",
        priority: "High",
      },
    ],
    files: [
      {
        id: "1",
        name: "IFRS 17 Requirements Document.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedBy: "Sarah Chen",
        uploadDate: "Jan 20, 2023",
      },
      {
        id: "2",
        name: "Data Mapping Specification.xlsx",
        type: "Excel",
        size: "1.8 MB",
        uploadedBy: "Emily Rodriguez",
        uploadDate: "Mar 15, 2023",
      },
      {
        id: "3",
        name: "Contract Groups Analysis.pptx",
        type: "PowerPoint",
        size: "5.2 MB",
        uploadedBy: "Michael Johnson",
        uploadDate: "Apr 10, 2023",
      },
      {
        id: "4",
        name: "CSM Calculation Methodology.docx",
        type: "Word",
        size: "1.2 MB",
        uploadedBy: "Sarah Chen",
        uploadDate: "May 5, 2023",
      },
      {
        id: "5",
        name: "Validation Rules Documentation.pdf",
        type: "PDF",
        size: "3.5 MB",
        uploadedBy: "David Kim",
        uploadDate: "Jun 1, 2023",
      },
    ],
    discussions: [
      {
        id: "1",
        title: "Contract Boundary Definition for Health Insurance Products",
        category: "Methodology",
        startedBy: "Michael Johnson",
        replies: 12,
        lastActivity: "2 days ago",
      },
      {
        id: "2",
        title: "Risk Adjustment Calculation Approach",
        category: "Methodology",
        startedBy: "Sarah Chen",
        replies: 8,
        lastActivity: "1 week ago",
      },
      {
        id: "3",
        title: "Data Quality Issues in Claims History",
        category: "Data",
        startedBy: "Emily Rodriguez",
        replies: 15,
        lastActivity: "3 days ago",
      },
      {
        id: "4",
        title: "Transition Approach for Existing Contracts",
        category: "Implementation",
        startedBy: "Lisa Wong",
        replies: 10,
        lastActivity: "Yesterday",
      },
    ],
    models: [
      {
        id: "ifrs17-csm",
        name: "IFRS 17 CSM Calculation Engine",
        description: "Engine for calculating Contractual Service Margin for insurance contracts",
        createdBy: "Sarah Chen",
        lastRun: "2 days ago",
      },
      {
        id: "risk-adjustment",
        name: "Risk Adjustment Model",
        description: "Stochastic model for calculating risk adjustment under IFRS 17",
        createdBy: "Michael Johnson",
        lastRun: "1 week ago",
      },
      {
        id: "transition-impact",
        name: "Transition Impact Analysis",
        description: "Model for analyzing the financial impact of transitioning to IFRS 17",
        createdBy: "David Kim",
        lastRun: "3 days ago",
      },
    ],
    meetings: [
      {
        id: "1",
        title: "Weekly Progress Review",
        date: "Tomorrow",
        time: "10:00 AM - 11:00 AM",
        attendees: 8,
      },
      {
        id: "2",
        title: "CSM Methodology Workshop",
        date: "Jun 15, 2023",
        time: "2:00 PM - 4:00 PM",
        attendees: 6,
      },
      {
        id: "3",
        title: "Data Quality Review",
        date: "Jun 20, 2023",
        time: "11:00 AM - 12:00 PM",
        attendees: 5,
      },
    ],
    recentActivity: [
      {
        user: "Sarah Chen",
        action: "Updated the CSM calculation methodology document",
        time: "2 hours ago",
      },
      {
        user: "Michael Johnson",
        action: "Completed the task 'Define contract groups for life insurance products'",
        time: "1 day ago",
      },
      {
        user: "Emily Rodriguez",
        action: "Uploaded new data transformation pipeline documentation",
        time: "2 days ago",
      },
      {
        user: "David Kim",
        action: "Started working on validation rules for calculation outputs",
        time: "3 days ago",
      },
      {
        user: "Lisa Wong",
        action: "Added comments to the regulatory compliance discussion",
        time: "1 week ago",
      },
    ],
  },
]
