import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MoreHorizontal,
  Pin,
  Flag,
  Share2,
  Clock,
  User,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Discussion Details | Nexus Learning Hub",
  description: "View and participate in project discussions.",
}

interface PageProps {
  params: {
    projectId: string
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
        <div className="flex items-center gap-2">
          <Link
            href={`/collaborate/projects/${params.projectId}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4 inline" />
            Back to Project
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{discussion.category}</Badge>
                      <Badge
                        variant={
                          discussion.priority === "High" || discussion.priority === "Urgent"
                            ? "destructive"
                            : discussion.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {discussion.priority}
                      </Badge>
                      {discussion.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <CardTitle className="text-2xl">{discussion.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Started by {discussion.startedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{discussion.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replies.length} replies</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={discussion.startedBy} />
                      <AvatarFallback>{discussion.startedBy.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{discussion.startedBy}</span>
                        <span className="text-sm text-muted-foreground">{discussion.createdAt}</span>
                      </div>
                      <div className="prose max-w-none">
                        <p>{discussion.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
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
                        <Button variant="ghost" size="sm">
                          <Flag className="mr-2 h-4 w-4" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-6">
                    <h3 className="font-semibold">Replies ({discussion.replies.length})</h3>
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={reply.author} />
                          <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{reply.author}</span>
                            <span className="text-sm text-muted-foreground">{reply.createdAt}</span>
                          </div>
                          <div className="prose max-w-none">
                            <p>{reply.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="mr-2 h-3 w-3" />
                              {reply.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Reply className="mr-2 h-3 w-3" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium">Add Reply</h4>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                        <AvatarFallback>Y</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea placeholder="Write your reply..." rows={4} />
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-muted-foreground">
                            Use Markdown for formatting. Be respectful and constructive.
                          </div>
                          <Button>Post Reply</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span>{discussion.category}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Priority</span>
                      <span>{discussion.priority}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span>{discussion.createdAt}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Activity</span>
                      <span>{discussion.lastActivity}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Participants</span>
                      <span>{discussion.participants} members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {discussion.relatedDiscussions.map((related) => (
                      <Link
                        key={related.id}
                        href={`/collaborate/projects/${params.projectId}/discussions/${related.id}`}
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
  priority: "Low" | "Medium" | "High" | "Urgent"
  startedBy: string
  createdAt: string
  lastActivity: string
  participants: number
  likes: number
  dislikes: number
  isPinned: boolean
  tags: string[]
  replies: {
    id: string
    author: string
    content: string
    createdAt: string
    likes: number
  }[]
  relatedDiscussions: {
    id: string
    title: string
  }[]
}

const discussions: Discussion[] = [
  {
    id: "1",
    title: "Contract Boundary Definition for Health Insurance Products",
    content: `I've been working on defining contract boundaries for our health insurance products according to IFRS 17 guidelines, and I'm encountering some challenges with determining the appropriate boundary for renewable contracts.

The main question is: How do we handle contracts where the insurer has the right to reassess the risk of the portfolio and adjust premiums accordingly? According to IFRS 17, the contract boundary should include only those cash flows that are within the boundary of the insurance contract.

For renewable health insurance contracts, I believe we need to consider:

1. **Substantive rights**: Does the insurer have substantive rights to reassess the risk and set premiums that fully reflect the reassessed risk?

2. **Practical ability**: Can the insurer practically exercise these rights?

3. **Economic compulsion**: Is there any economic compulsion that would prevent the insurer from exercising these rights?

I've reviewed the standard and various interpretations, but I'd like to get the team's perspective on this. Has anyone dealt with similar situations? What approach did you take?

Looking forward to your thoughts and experiences.`,
    category: "Methodology",
    priority: "High",
    startedBy: "Michael Johnson",
    createdAt: "3 days ago",
    lastActivity: "2 hours ago",
    participants: 8,
    likes: 12,
    dislikes: 1,
    isPinned: true,
    tags: ["IFRS17", "contract-boundary", "health-insurance", "methodology"],
    replies: [
      {
        id: "1",
        author: "Sarah Chen",
        content: `Great question, Michael! I've dealt with similar issues in our life insurance portfolio. 

For renewable health insurance contracts, the key is to assess whether the insurer has substantive rights to reassess risk. In our case, we determined that if the insurer can:

1. Reassess the risk of the entire portfolio (not just individual contracts)
2. Set premiums that fully reflect the reassessed risk
3. Exercise this right without significant constraints

Then the contract boundary should be limited to the period until the next reassessment date.

However, if there are regulatory constraints that limit the insurer's ability to adjust premiums to fully reflect the risk, then you might need to extend the boundary.`,
        createdAt: "2 days ago",
        likes: 8,
      },
      {
        id: "2",
        author: "Emily Rodriguez",
        content: `I agree with Sarah's assessment. We also need to consider the practical aspects of implementation. 

From a systems perspective, limiting the contract boundary to the reassessment period makes the calculations more manageable and aligns with how we actually manage these products.

One thing to watch out for is the interaction with the risk adjustment calculation. If you're extending the boundary beyond the reassessment period, you'll need to ensure your risk adjustment properly reflects the uncertainty in those future cash flows.`,
        createdAt: "1 day ago",
        likes: 5,
      },
      {
        id: "3",
        author: "David Kim",
        content: `This is a complex area, and I think we should also consider the regulatory environment. In some jurisdictions, there are specific requirements about how health insurance premiums can be adjusted.

I'd recommend documenting our approach clearly and getting it reviewed by our external auditors early in the process. This will help avoid any surprises later.

Also, has anyone looked at how other insurers in our market are handling this? It might be worth reaching out to industry groups for guidance.`,
        createdAt: "12 hours ago",
        likes: 3,
      },
    ],
    relatedDiscussions: [
      {
        id: "2",
        title: "Risk Adjustment Calculation Approach",
      },
      {
        id: "3",
        title: "Transition Approach for Existing Contracts",
      },
    ],
  },
]
