"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  FileText,
  Download,
  Upload,
  Plus,
  CheckCircle2,
  Circle,
  Play,
  Settings,
  Share2,
  Bell,
  ExternalLink,
} from "lucide-react"

interface PageProps {
  params: {
    meetingId: string
  }
}

export default function MeetingDetailPageClient({ params }: PageProps) {
  const meeting = meetings.find((m) => m.id === params.meetingId)

  if (!meeting) {
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
              Meetings
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{meeting.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Remind
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
              <Badge
                variant={
                  meeting.status === "Upcoming"
                    ? "default"
                    : meeting.status === "In Progress"
                      ? "secondary"
                      : meeting.status === "Completed"
                        ? "success"
                        : "destructive"
                }
              >
                {meeting.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{meeting.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {meeting.status === "Upcoming" && (
              <Button>
                <Video className="mr-2 h-4 w-4" />
                Join Meeting
              </Button>
            )}
            {meeting.status === "In Progress" && (
              <Button>
                <Video className="mr-2 h-4 w-4" />
                Join Now
              </Button>
            )}
            {meeting.status === "Completed" && (
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                View Recording
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Overview</CardTitle>
                    <CardDescription>Key information about this meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Date & Time</p>
                            <p className="text-sm text-muted-foreground">
                              {meeting.date} at {meeting.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">{meeting.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-sm text-muted-foreground">{meeting.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium">Attendees</p>
                            <p className="text-sm text-muted-foreground">{meeting.attendees.length} participants</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Meeting Type</p>
                            <p className="text-sm text-muted-foreground">{meeting.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=20&width=20" alt={meeting.organizer} />
                            <AvatarFallback>{meeting.organizer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Organizer</p>
                            <p className="text-sm text-muted-foreground">{meeting.organizer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{meeting.description}</p>
                    </div>
                    {meeting.meetingLink && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h4 className="font-medium mb-2">Meeting Link</h4>
                          <div className="flex items-center gap-2">
                            <Input value={meeting.meetingLink} readOnly className="flex-1" />
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Participants</CardTitle>
                    <CardDescription>Attendees and their RSVP status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {meeting.attendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center justify-between rounded-md border p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={attendee.name} />
                              <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{attendee.name}</div>
                              <div className="text-sm text-muted-foreground">{attendee.role}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                attendee.status === "Attending"
                                  ? "default"
                                  : attendee.status === "Declined"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {attendee.status}
                            </Badge>
                            {attendee.isOrganizer && <Badge variant="outline">Organizer</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agenda" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Agenda</CardTitle>
                    <CardDescription>Topics and timeline for this meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {meeting.agenda.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 rounded-md border p-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{item.topic}</h4>
                              <span className="text-sm text-muted-foreground">{item.duration}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            {item.presenter && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt={item.presenter} />
                                  <AvatarFallback>{item.presenter.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Presenter: {item.presenter}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Meeting Materials</CardTitle>
                        <CardDescription>Documents and resources for this meeting</CardDescription>
                      </div>
                      <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {meeting.materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{material.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {material.size} • Uploaded by {material.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Notes</CardTitle>
                    <CardDescription>Collaborative notes and key points from the meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notes">Meeting Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add your notes here..."
                          className="min-h-[200px] mt-2"
                          defaultValue={meeting.notes}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Last updated by {meeting.lastNotesUpdatedBy} • {meeting.lastNotesUpdate}
                        </p>
                        <Button size="sm">Save Notes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Action Items</CardTitle>
                        <CardDescription>Tasks and follow-ups from this meeting</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Action
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {meeting.actionItems.map((action) => (
                        <div key={action.id} className="flex items-start gap-4 rounded-md border p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mt-1 h-6 w-6"
                            onClick={() => {
                              // Toggle completion status
                            }}
                          >
                            {action.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`font-medium ${action.completed ? "line-through text-muted-foreground" : ""}`}
                              >
                                {action.task}
                              </h4>
                              <Badge
                                variant={
                                  action.priority === "High"
                                    ? "destructive"
                                    : action.priority === "Medium"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {action.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src="/placeholder.svg?height=20&width=20" alt={action.assignee} />
                                  <AvatarFallback>{action.assignee.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>Assigned to {action.assignee}</span>
                              </div>
                              <span className="text-muted-foreground">Due: {action.dueDate}</span>
                            </div>
                          </div>
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
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {meeting.status === "Upcoming" && (
                      <>
                        <Button className="w-full">
                          <Video className="mr-2 h-4 w-4" />
                          Join Meeting
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" />
                          Add to Calendar
                        </Button>
                      </>
                    )}
                    {meeting.status === "In Progress" && (
                      <Button className="w-full">
                        <Video className="mr-2 h-4 w-4" />
                        Join Now
                      </Button>
                    )}
                    {meeting.status === "Completed" && (
                      <>
                        <Button variant="outline" className="w-full">
                          <Play className="mr-2 h-4 w-4" />
                          View Recording
                        </Button>
                        <Button variant="outline" className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          Download Transcript
                        </Button>
                      </>
                    )}
                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meeting Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Attendees</span>
                      <span className="text-sm font-medium">{meeting.attendees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Attending</span>
                      <span className="text-sm font-medium text-green-600">
                        {meeting.attendees.filter((a) => a.status === "Attending").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Declined</span>
                      <span className="text-sm font-medium text-red-600">
                        {meeting.attendees.filter((a) => a.status === "Declined").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {meeting.attendees.filter((a) => a.status === "Pending").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {meeting.relatedMeetings && meeting.relatedMeetings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {meeting.relatedMeetings.map((related) => (
                        <Link
                          key={related.id}
                          href={`/collaborate/meetings/${related.id}`}
                          className="text-sm hover:underline"
                        >
                          {related.title}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: string
  type: string
  status: "Upcoming" | "In Progress" | "Completed" | "Cancelled"
  organizer: string
  meetingLink?: string
  attendees: {
    id: string
    name: string
    role: string
    status: "Attending" | "Declined" | "Pending"
    isOrganizer: boolean
  }[]
  agenda: {
    topic: string
    description: string
    duration: string
    presenter?: string
  }[]
  materials: {
    id: string
    name: string
    size: string
    uploadedBy: string
    uploadDate: string
  }[]
  notes: string
  lastNotesUpdatedBy: string
  lastNotesUpdate: string
  actionItems: {
    id: string
    task: string
    description: string
    assignee: string
    dueDate: string
    priority: "High" | "Medium" | "Low"
    completed: boolean
  }[]
  relatedMeetings?: {
    id: string
    title: string
  }[]
}

const meetings: Meeting[] = [
  {
    id: "1",
    title: "IFRS 17 Implementation Review",
    description:
      "Quarterly review of IFRS 17 implementation progress, challenges, and next steps for the actuarial team.",
    date: "June 15, 2023",
    time: "2:00 PM - 3:30 PM",
    duration: "1.5 hours",
    location: "Conference Room A / Zoom",
    type: "Hybrid Meeting",
    status: "Upcoming",
    organizer: "Sarah Chen",
    meetingLink: "https://zoom.us/j/123456789",
    attendees: [
      {
        id: "1",
        name: "Sarah Chen",
        role: "Team Lead",
        status: "Attending",
        isOrganizer: true,
      },
      {
        id: "2",
        name: "Michael Johnson",
        role: "Senior Actuary",
        status: "Attending",
        isOrganizer: false,
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        role: "Data Scientist",
        status: "Pending",
        isOrganizer: false,
      },
      {
        id: "4",
        name: "David Kim",
        role: "Actuary",
        status: "Attending",
        isOrganizer: false,
      },
      {
        id: "5",
        name: "Lisa Wong",
        role: "Compliance Officer",
        status: "Declined",
        isOrganizer: false,
      },
      {
        id: "6",
        name: "Robert Taylor",
        role: "Risk Analyst",
        status: "Attending",
        isOrganizer: false,
      },
      {
        id: "7",
        name: "Jennifer Martinez",
        role: "Junior Actuary",
        status: "Attending",
        isOrganizer: false,
      },
      {
        id: "8",
        name: "James Wilson",
        role: "Project Manager",
        status: "Pending",
        isOrganizer: false,
      },
    ],
    agenda: [
      {
        topic: "Welcome & Introductions",
        description: "Brief welcome and introductions for new team members",
        duration: "10 minutes",
        presenter: "Sarah Chen",
      },
      {
        topic: "Implementation Progress Review",
        description: "Review of current IFRS 17 implementation status and milestones achieved",
        duration: "30 minutes",
        presenter: "Michael Johnson",
      },
      {
        topic: "Technical Challenges Discussion",
        description: "Discussion of technical challenges encountered and proposed solutions",
        duration: "25 minutes",
        presenter: "Emily Rodriguez",
      },
      {
        topic: "Regulatory Updates",
        description: "Latest regulatory guidance and impact on implementation timeline",
        duration: "15 minutes",
        presenter: "Lisa Wong",
      },
      {
        topic: "Next Steps & Action Items",
        description: "Define action items and next steps for the coming quarter",
        duration: "10 minutes",
        presenter: "Sarah Chen",
      },
    ],
    materials: [
      {
        id: "1",
        name: "IFRS 17 Implementation Progress Report Q2 2023.pdf",
        size: "2.4 MB",
        uploadedBy: "Michael Johnson",
        uploadDate: "June 12, 2023",
      },
      {
        id: "2",
        name: "Technical Challenges and Solutions.docx",
        size: "1.8 MB",
        uploadedBy: "Emily Rodriguez",
        uploadDate: "June 13, 2023",
      },
      {
        id: "3",
        name: "Regulatory Update Summary.pdf",
        size: "956 KB",
        uploadedBy: "Lisa Wong",
        uploadDate: "June 14, 2023",
      },
      {
        id: "4",
        name: "Meeting Agenda.pdf",
        size: "245 KB",
        uploadedBy: "Sarah Chen",
        uploadDate: "June 10, 2023",
      },
    ],
    notes:
      "Key discussion points:\n\n1. Implementation is 75% complete, on track for Q4 2023 deadline\n2. Main challenge: data quality issues in legacy systems\n3. Need additional resources for testing phase\n4. Regulatory guidance clarification received last week\n5. Training sessions to be scheduled for Q3\n\nDecisions made:\n- Hire 2 additional data analysts\n- Extend testing phase by 2 weeks\n- Schedule monthly check-ins with regulatory team",
    lastNotesUpdatedBy: "Sarah Chen",
    lastNotesUpdate: "2 hours ago",
    actionItems: [
      {
        id: "1",
        task: "Hire additional data analysts",
        description: "Recruit and onboard 2 additional data analysts to support data quality initiatives",
        assignee: "James Wilson",
        dueDate: "July 15, 2023",
        priority: "High",
        completed: false,
      },
      {
        id: "2",
        task: "Schedule training sessions",
        description: "Organize IFRS 17 training sessions for all team members in Q3",
        assignee: "Jennifer Martinez",
        dueDate: "July 1, 2023",
        priority: "Medium",
        completed: false,
      },
      {
        id: "3",
        task: "Update project timeline",
        description: "Revise project timeline to reflect extended testing phase",
        assignee: "Michael Johnson",
        dueDate: "June 20, 2023",
        priority: "High",
        completed: true,
      },
      {
        id: "4",
        task: "Prepare data quality report",
        description: "Comprehensive analysis of data quality issues and remediation plan",
        assignee: "Emily Rodriguez",
        dueDate: "June 30, 2023",
        priority: "High",
        completed: false,
      },
    ],
    relatedMeetings: [
      {
        id: "2",
        title: "IFRS 17 Technical Deep Dive",
      },
      {
        id: "3",
        title: "Data Quality Workshop",
      },
    ],
  },
]
