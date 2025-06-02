import type { Metadata } from "next"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Calendar, MessageSquare, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Collaborate | Nexus Learning Hub",
  description: "Collaborate with other actuaries and financial professionals on models and projects.",
}

export default function CollaboratePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collaborate</h1>
            <p className="text-muted-foreground">
              Work together with other actuaries and financial professionals on models and projects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search projects and teams..." className="w-full pl-8" />
          </div>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="teams" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="meetings" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="discussions" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {discussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface Project {
  id: string
  name: string
  description: string
  status: "Active" | "Completed" | "On Hold"
  members: number
  lastActivity: string
}

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{project.name}</CardTitle>
          <Badge
            variant={project.status === "Active" ? "default" : project.status === "Completed" ? "success" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{project.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{project.lastActivity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/collaborate/projects/${project.id}`}>
            Open Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface Team {
  id: string
  name: string
  description: string
  members: {
    id: string
    name: string
    avatar: string
    role: string
  }[]
  projects: number
}

interface TeamCardProps {
  team: Team
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
        <CardDescription>{team.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex -space-x-2">
            {team.members.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 5 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{team.members.length - 5}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{team.projects} active projects</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/collaborate/teams/${team.id}`}>
            View Team
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  attendees: number
  status: "Upcoming" | "Completed" | "Cancelled"
}

interface MeetingCardProps {
  meeting: Meeting
}

function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{meeting.title}</CardTitle>
          <Badge
            variant={
              meeting.status === "Upcoming" ? "default" : meeting.status === "Completed" ? "success" : "destructive"
            }
          >
            {meeting.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{meeting.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{meeting.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{meeting.attendees} attendees</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={meeting.status === "Upcoming" ? "default" : "outline"} asChild>
          <Link href={`/collaborate/meetings/${meeting.id}`}>
            {meeting.status === "Upcoming" ? "Join Meeting" : "View Details"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface Discussion {
  id: string
  title: string
  category: string
  author: {
    name: string
    avatar: string
  }
  replies: number
  lastActivity: string
}

interface DiscussionCardProps {
  discussion: Discussion
}

function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{discussion.title}</CardTitle>
          <Badge variant="outline">{discussion.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
              <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{discussion.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{discussion.replies} replies</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{discussion.lastActivity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/collaborate/discussions/${discussion.id}`}>
            View Discussion
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const projects: Project[] = [
  {
    id: "1",
    name: "IFRS 17 Implementation",
    description: "Collaborative project for implementing IFRS 17 standards in insurance reporting",
    status: "Active",
    members: 8,
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "Mortality Table Analysis",
    description: "Research project analyzing recent changes in mortality patterns",
    status: "Active",
    members: 5,
    lastActivity: "Yesterday",
  },
  {
    id: "3",
    name: "Pricing Model Validation",
    description: "Validation of new pricing models for auto insurance products",
    status: "Completed",
    members: 4,
    lastActivity: "1 week ago",
  },
  {
    id: "4",
    name: "Capital Modeling Framework",
    description: "Development of a new capital modeling framework for regulatory compliance",
    status: "On Hold",
    members: 6,
    lastActivity: "3 days ago",
  },
  {
    id: "5",
    name: "Climate Risk Assessment",
    description: "Assessing the impact of climate change on insurance risk models",
    status: "Active",
    members: 7,
    lastActivity: "Just now",
  },
  {
    id: "6",
    name: "Pension Fund Optimization",
    description: "Optimizing investment strategies for pension fund management",
    status: "Active",
    members: 3,
    lastActivity: "4 hours ago",
  },
]

const teams: Team[] = [
  {
    id: "1",
    name: "Risk Modeling Team",
    description: "Specialists in risk assessment and modeling techniques",
    members: [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Team Lead",
      },
      {
        id: "2",
        name: "Michael Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Senior Actuary",
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Data Scientist",
      },
      {
        id: "4",
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Actuary",
      },
    ],
    projects: 3,
  },
  {
    id: "2",
    name: "Regulatory Compliance",
    description: "Experts in insurance regulatory frameworks and compliance",
    members: [
      {
        id: "5",
        name: "Lisa Wong",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Compliance Officer",
      },
      {
        id: "6",
        name: "Robert Taylor",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Legal Advisor",
      },
      {
        id: "7",
        name: "Jennifer Martinez",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Regulatory Specialist",
      },
    ],
    projects: 2,
  },
  {
    id: "3",
    name: "Product Development",
    description: "Team focused on new insurance product development and pricing",
    members: [
      {
        id: "8",
        name: "James Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Product Manager",
      },
      {
        id: "9",
        name: "Sophia Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Pricing Actuary",
      },
      {
        id: "10",
        name: "Daniel Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Market Analyst",
      },
      {
        id: "11",
        name: "Olivia Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Underwriter",
      },
      {
        id: "12",
        name: "William Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Actuary",
      },
      {
        id: "13",
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Data Analyst",
      },
    ],
    projects: 4,
  },
]

const meetings: Meeting[] = [
  {
    id: "1",
    title: "IFRS 17 Implementation Review",
    date: "Today",
    time: "2:00 PM - 3:30 PM",
    attendees: 8,
    status: "Upcoming",
  },
  {
    id: "2",
    title: "Quarterly Risk Assessment",
    date: "Tomorrow",
    time: "10:00 AM - 12:00 PM",
    attendees: 12,
    status: "Upcoming",
  },
  {
    id: "3",
    title: "Model Validation Workshop",
    date: "Jun 5, 2023",
    time: "1:00 PM - 4:00 PM",
    attendees: 6,
    status: "Completed",
  },
  {
    id: "4",
    title: "Regulatory Update Briefing",
    date: "Jun 8, 2023",
    time: "11:00 AM - 12:00 PM",
    attendees: 15,
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Product Development Sprint Planning",
    date: "Jun 3, 2023",
    time: "9:00 AM - 10:30 AM",
    attendees: 7,
    status: "Cancelled",
  },
  {
    id: "6",
    title: "Climate Risk Modeling Session",
    date: "Jun 2, 2023",
    time: "3:00 PM - 5:00 PM",
    attendees: 9,
    status: "Completed",
  },
]

const discussions: Discussion[] = [
  {
    id: "1",
    title: "Best practices for IFRS 17 transition",
    category: "Regulatory",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    replies: 24,
    lastActivity: "1 hour ago",
  },
  {
    id: "2",
    title: "Monte Carlo simulation efficiency improvements",
    category: "Modeling",
    author: {
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    replies: 18,
    lastActivity: "3 hours ago",
  },
  {
    id: "3",
    title: "Climate change impact on catastrophe modeling",
    category: "Risk Assessment",
    author: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    replies: 32,
    lastActivity: "Yesterday",
  },
  {
    id: "4",
    title: "Python vs. R for actuarial analysis",
    category: "Tools",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    replies: 45,
    lastActivity: "2 days ago",
  },
  {
    id: "5",
    title: "Implementing predictive analytics in underwriting",
    category: "Innovation",
    author: {
      name: "Lisa Wong",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    replies: 12,
    lastActivity: "Just now",
  },
  {
    id: "6",
    title: "Ethical considerations in algorithmic pricing",
    category: "Ethics",
    author: {
      name: "Robert Taylor",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    replies: 27,
    lastActivity: "5 hours ago",
  },
]
