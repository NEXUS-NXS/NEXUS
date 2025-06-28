import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Calendar, Plus, Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "Team Details | Nexus Learning Hub",
  description: "Detailed information about the selected team.",
}

interface PageProps {
  params: {
    teamId: string
  }
}

export default function TeamDetailPage({ params }: PageProps) {
  const team = teams.find((t) => t.id === params.teamId)

  if (!team) {
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
              Teams
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{team.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
              <Badge variant="outline">{team.type}</Badge>
            </div>
            <p className="text-muted-foreground">{team.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="members" className="w-full">
              <TabsList>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="members" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage team members and their roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-md border p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                              {member.status}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Projects</CardTitle>
                    <CardDescription>Projects this team is working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {team.projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between rounded-md border p-4">
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.description}</div>
                          </div>
                          <Badge
                            variant={
                              project.status === "Active"
                                ? "default"
                                : project.status === "Completed"
                                  ? "success"
                                  : "secondary"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="discussions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Discussions</CardTitle>
                    <CardDescription>Recent team conversations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {team.discussions.map((discussion) => (
                        <div key={discussion.id} className="flex flex-col gap-2 rounded-md border p-4">
                          <div className="font-medium">{discussion.title}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Started by {discussion.startedBy}</span>
                            <span>{discussion.replies} replies</span>
                            <span>{discussion.lastActivity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest team activity and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {team.recentActivity.map((activity, i) => (
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
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Team Lead</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={team.lead} />
                          <AvatarFallback>{team.lead.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{team.lead}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span>{team.created}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Members</span>
                      <span>{team.memberCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Active Projects</span>
                      <span>{team.activeProjects}</span>
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
                    {team.meetings.map((meeting) => (
                      <div key={meeting.id} className="flex flex-col gap-2 rounded-md border p-3">
                        <div className="font-medium">{meeting.title}</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {meeting.date} at {meeting.time}
                          </span>
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

interface Team {
  id: string
  name: string
  description: string
  type: string
  lead: string
  created: string
  memberCount: number
  activeProjects: number
  members: {
    id: string
    name: string
    role: string
    status: "Active" | "Inactive"
  }[]
  projects: {
    id: string
    name: string
    description: string
    status: "Active" | "Completed" | "On Hold"
  }[]
  discussions: {
    id: string
    title: string
    startedBy: string
    replies: number
    lastActivity: string
  }[]
  meetings: {
    id: string
    title: string
    date: string
    time: string
  }[]
  recentActivity: {
    user: string
    action: string
    time: string
  }[]
}

const teams: Team[] = [
  {
    id: "1",
    name: "Actuarial Research Team",
    description: "Advanced research in actuarial science and risk modeling",
    type: "Research",
    lead: "Dr. Sarah Chen",
    created: "Jan 15, 2023",
    memberCount: 8,
    activeProjects: 3,
    members: [
      {
        id: "1",
        name: "Dr. Sarah Chen",
        role: "Team Lead",
        status: "Active",
      },
      {
        id: "2",
        name: "Michael Johnson",
        role: "Senior Actuary",
        status: "Active",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        role: "Data Scientist",
        status: "Active",
      },
      {
        id: "4",
        name: "David Kim",
        role: "Research Analyst",
        status: "Active",
      },
      {
        id: "5",
        name: "Lisa Wong",
        role: "Statistician",
        status: "Active",
      },
      {
        id: "6",
        name: "Robert Taylor",
        role: "Risk Analyst",
        status: "Active",
      },
      {
        id: "7",
        name: "Jennifer Martinez",
        role: "Junior Actuary",
        status: "Active",
      },
      {
        id: "8",
        name: "James Wilson",
        role: "Research Assistant",
        status: "Inactive",
      },
    ],
    projects: [
      {
        id: "1",
        name: "IFRS 17 Implementation",
        description: "Implementing new accounting standards for insurance contracts",
        status: "Active",
      },
      {
        id: "2",
        name: "Climate Risk Modeling",
        description: "Developing models for climate-related financial risks",
        status: "Active",
      },
      {
        id: "3",
        name: "Mortality Trend Analysis",
        description: "Analyzing long-term mortality trends and their implications",
        status: "Completed",
      },
    ],
    discussions: [
      {
        id: "1",
        title: "New mortality tables impact on pricing",
        startedBy: "Michael Johnson",
        replies: 15,
        lastActivity: "2 hours ago",
      },
      {
        id: "2",
        title: "Climate risk modeling methodology",
        startedBy: "Emily Rodriguez",
        replies: 8,
        lastActivity: "1 day ago",
      },
      {
        id: "3",
        title: "IFRS 17 transition challenges",
        startedBy: "Dr. Sarah Chen",
        replies: 22,
        lastActivity: "3 days ago",
      },
    ],
    meetings: [
      {
        id: "1",
        title: "Weekly Team Standup",
        date: "Tomorrow",
        time: "9:00 AM",
      },
      {
        id: "2",
        title: "Research Review Session",
        date: "Friday",
        time: "2:00 PM",
      },
    ],
    recentActivity: [
      {
        user: "Michael Johnson",
        action: "Completed the mortality analysis report",
        time: "2 hours ago",
      },
      {
        user: "Emily Rodriguez",
        action: "Updated the climate risk model parameters",
        time: "1 day ago",
      },
      {
        user: "Dr. Sarah Chen",
        action: "Reviewed and approved the IFRS 17 methodology document",
        time: "2 days ago",
      },
    ],
  },
]
