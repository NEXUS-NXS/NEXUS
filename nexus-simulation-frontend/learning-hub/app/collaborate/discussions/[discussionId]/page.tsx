import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Share2,
  Bookmark,
  MoreHorizontal,
  Tag,
  Users,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Discussion Details | Nexus Learning Hub",
  description: "Detailed view of the discussion thread.",
}

interface PageProps {
  params: {
    discussionId: string
  }
}

export default function DiscussionDetailPage({ params }: PageProps) {
  const discussion = discussions.find((d) => d.id === params.discussionId)

  if (!discussion) {
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
              Discussions
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{discussion.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold tracking-tight">{discussion.title}</h1>
                      <Badge variant="outline">{discussion.category}</Badge>
                      {discussion.priority && (
                        <Badge variant={discussion.priority === "High" ? "destructive" : "secondary"}>
                          {discussion.priority}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={discussion.author.name} />
                          <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{discussion.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{discussion.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replies.length} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{discussion.participants} participants</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: discussion.content }} />
                </div>

                {discussion.tags && discussion.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {discussion.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      {discussion.dislikes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Replies ({discussion.replies.length})</h3>
              <div className="space-y-4">
                {discussion.replies.map((reply) => (
                  <Card key={reply.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={reply.author.name} />
                          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{reply.author.name}</span>
                            <span className="text-sm text-muted-foreground">{reply.createdAt}</span>
                            {reply.author.badge && (
                              <Badge variant="outline" className="text-xs">
                                {reply.author.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="prose max-w-none text-sm mb-4">
                            <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                          </div>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              {reply.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Flag className="mr-2 h-4 w-4" />
                              Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Add Your Reply</CardTitle>
                <CardDescription>Join the discussion and share your thoughts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea placeholder="Write your reply here..." className="min-h-[120px]" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Markdown supported</span>
                    </div>
                    <Button>Post Reply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Views</span>
                      <span className="text-sm font-medium">{discussion.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Replies</span>
                      <span className="text-sm font-medium">{discussion.replies.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Participants</span>
                      <span className="text-sm font-medium">{discussion.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm font-medium">{discussion.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Activity</span>
                      <span className="text-sm font-medium">{discussion.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{discussion.author.name}</p>
                        <p className="text-xs text-muted-foreground">Original Poster</p>
                      </div>
                    </div>
                    {discussion.replies.slice(0, 5).map((reply) => (
                      <div key={reply.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={reply.author.name} />
                          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{reply.author.name}</p>
                          <p className="text-xs text-muted-foreground">{reply.author.role}</p>
                        </div>
                      </div>
                    ))}
                    {discussion.participants > 6 && (
                      <p className="text-xs text-muted-foreground">+{discussion.participants - 6} more participants</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {discussion.relatedDiscussions?.map((related) => (
                      <Link
                        key={related.id}
                        href={`/collaborate/discussions/${related.id}`}
                        className="text-sm hover:underline"
                      >
                        {related.title}
                      </Link>
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

interface Discussion {
  id: string
  title: string
  content: string
  category: string
  priority?: "High" | "Medium" | "Low"
  author: {
    name: string
    role: string
    avatar: string
  }
  createdAt: string
  lastActivity: string
  views: number
  participants: number
  likes: number
  dislikes: number
  tags?: string[]
  replies: {
    id: string
    content: string
    author: {
      name: string
      role: string
      avatar: string
      badge?: string
    }
    createdAt: string
    likes: number
  }[]
  relatedDiscussions?: {
    id: string
    title: string
  }[]
}

const discussions: Discussion[] = [
  {
    id: "1",
    title: "Best practices for IFRS 17 transition",
    content: `
      <p>As we approach the IFRS 17 implementation deadline, I wanted to start a discussion about best practices and lessons learned from teams who have already begun their transition.</p>
      
      <p>Key areas I'd like to discuss:</p>
      <ul>
        <li>Data preparation and quality assurance</li>
        <li>System integration challenges</li>
        <li>Stakeholder communication strategies</li>
        <li>Testing and validation approaches</li>
      </ul>
      
      <p>What has worked well for your organization? What would you do differently?</p>
    `,
    category: "Regulatory",
    priority: "High",
    author: {
      name: "Sarah Chen",
      role: "Team Lead",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2 days ago",
    lastActivity: "1 hour ago",
    views: 156,
    participants: 12,
    likes: 24,
    dislikes: 2,
    tags: ["IFRS17", "Implementation", "Best Practices", "Regulatory"],
    replies: [
      {
        id: "1",
        content: `
          <p>Great topic, Sarah! We've been working on IFRS 17 for the past 18 months and here are some key lessons:</p>
          
          <p><strong>Data Quality is Critical:</strong> We spent 40% of our time on data cleansing. Start early and involve business users in validation.</p>
          
          <p><strong>Parallel Run Strategy:</strong> Run old and new systems in parallel for at least 6 months to build confidence.</p>
        `,
        author: {
          name: "Michael Johnson",
          role: "Senior Actuary",
          avatar: "/placeholder.svg?height=32&width=32",
          badge: "Expert",
        },
        createdAt: "1 day ago",
        likes: 18,
      },
      {
        id: "2",
        content: `
          <p>Adding to Michael's points - stakeholder communication has been huge for us. We created a monthly newsletter and held quarterly town halls to keep everyone informed about progress and changes.</p>
          
          <p>Also, don't underestimate the training requirements. Plan for extensive training programs for both technical and business users.</p>
        `,
        author: {
          name: "Emily Rodriguez",
          role: "Data Scientist",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: "1 day ago",
        likes: 12,
      },
      {
        id: "3",
        content: `
          <p>One thing we learned the hard way - involve your auditors early in the process. We had to make significant changes late in the project because we didn't get their input soon enough.</p>
          
          <p>Also recommend setting up a dedicated IFRS 17 project office with clear governance and decision-making authority.</p>
        `,
        author: {
          name: "David Kim",
          role: "Risk Analyst",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: "18 hours ago",
        likes: 15,
      },
    ],
    relatedDiscussions: [
      {
        id: "2",
        title: "IFRS 17 system selection criteria",
      },
      {
        id: "3",
        title: "Data governance for regulatory reporting",
      },
    ],
  },
]
