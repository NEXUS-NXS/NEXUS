import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Calendar, BookOpen, Download, Share2, ThumbsUp, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Guide Details | Nexus Learning Hub",
  description: "Detailed guide with step-by-step instructions.",
}

interface PageProps {
  params: {
    guideId: string
  }
}

export default function GuideDetailPage({ params }: PageProps) {
  const guide = guides.find((g) => g.id === params.guideId)

  if (!guide) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
              Guides
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{guide.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{guide.title}</CardTitle>
                    <CardDescription className="mt-2">{guide.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      guide.difficulty === "Beginner"
                        ? "default"
                        : guide.difficulty === "Intermediate"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {guide.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{guide.readingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{guide.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{guide.lastUpdated}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <h2>Introduction</h2>
                  <p>{guide.content.introduction}</p>

                  <h2>Prerequisites</h2>
                  <ul>
                    {guide.content.prerequisites.map((prereq, i) => (
                      <li key={i}>{prereq}</li>
                    ))}
                  </ul>

                  <h2>Step-by-Step Instructions</h2>
                  {guide.content.steps.map((step, i) => (
                    <div key={i} className="mb-6">
                      <h3>
                        Step {i + 1}: {step.title}
                      </h3>
                      <p>{step.description}</p>
                      {step.code && (
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                      )}
                      {step.note && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                          <p className="text-blue-800">
                            <strong>Note:</strong> {step.note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  <h2>Conclusion</h2>
                  <p>{guide.content.conclusion}</p>

                  <h2>Next Steps</h2>
                  <ul>
                    {guide.content.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guide Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span>{guide.category}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <span>{guide.difficulty}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Reading Time</span>
                      <span>{guide.readingTime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span>{guide.lastUpdated}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Author</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={guide.author} />
                          <AvatarFallback>{guide.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{guide.author}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Helpful</span>
                      </div>
                      <span className="text-sm font-medium">{guide.likes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Comments</span>
                      </div>
                      <span className="text-sm font-medium">{guide.comments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Views</span>
                      </div>
                      <span className="text-sm font-medium">{guide.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Related Guides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {guide.relatedGuides.map((related) => (
                      <Link key={related.id} href={`/docs/guides/${related.id}`} className="text-sm hover:underline">
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

interface Guide {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  readingTime: string
  author: string
  lastUpdated: string
  likes: number
  comments: number
  views: number
  content: {
    introduction: string
    prerequisites: string[]
    steps: {
      title: string
      description: string
      code?: string
      note?: string
    }[]
    conclusion: string
    nextSteps: string[]
  }
  relatedGuides: {
    id: string
    title: string
  }[]
}

const guides: Guide[] = [
  {
    id: "1",
    title: "Getting Started with Actuarial Modeling",
    description: "A comprehensive introduction to building your first actuarial model",
    category: "Modeling",
    difficulty: "Beginner",
    readingTime: "15 min read",
    author: "Dr. Sarah Chen",
    lastUpdated: "May 15, 2023",
    likes: 124,
    comments: 18,
    views: 2847,
    content: {
      introduction:
        "Actuarial modeling is the foundation of modern insurance and risk management. This guide will walk you through the essential concepts and practical steps to build your first actuarial model using industry-standard tools and methodologies.",
      prerequisites: [
        "Basic understanding of probability and statistics",
        "Familiarity with Excel or similar spreadsheet software",
        "Access to actuarial modeling software (Prophet, MoSes, or similar)",
        "Understanding of insurance concepts",
      ],
      steps: [
        {
          title: "Define Your Model Objectives",
          description:
            "Start by clearly defining what you want your model to achieve. Are you pricing a new product, calculating reserves, or performing risk analysis?",
          note: "Clear objectives will guide all subsequent modeling decisions and help you validate your results.",
        },
        {
          title: "Gather and Prepare Your Data",
          description:
            "Collect all necessary data including historical claims, exposure data, economic assumptions, and regulatory requirements.",
          code: `# Example data preparation in Python
import pandas as pd
import numpy as np

# Load claims data
claims_data = pd.read_csv('claims_history.csv')

# Clean and validate data
claims_data = claims_data.dropna()
claims_data['claim_amount'] = pd.to_numeric(claims_data['claim_amount'])

# Calculate basic statistics
print(claims_data.describe())`,
        },
        {
          title: "Choose Your Modeling Approach",
          description:
            "Select the appropriate modeling methodology based on your objectives. Common approaches include deterministic models, stochastic models, and machine learning techniques.",
        },
        {
          title: "Build the Model Structure",
          description:
            "Create the basic framework of your model, including cash flow projections, assumption sets, and calculation engines.",
          code: `# Basic cash flow projection structure
def calculate_cash_flows(policies, assumptions):
    cash_flows = []
    for year in range(projection_years):
        premiums = calculate_premiums(policies, year)
        claims = calculate_claims(policies, assumptions, year)
        expenses = calculate_expenses(policies, year)
        
        net_cash_flow = premiums - claims - expenses
        cash_flows.append(net_cash_flow)
    
    return cash_flows`,
        },
        {
          title: "Implement Calculations",
          description:
            "Code the mathematical calculations for your model, including mortality rates, interest calculations, and policy projections.",
        },
        {
          title: "Validate and Test",
          description:
            "Thoroughly test your model with known scenarios and validate results against benchmarks or regulatory requirements.",
          note: "Model validation is crucial for regulatory compliance and business confidence.",
        },
        {
          title: "Document Your Model",
          description:
            "Create comprehensive documentation including methodology, assumptions, limitations, and user instructions.",
        },
      ],
      conclusion:
        "Building actuarial models requires careful planning, attention to detail, and thorough testing. Start with simple models and gradually increase complexity as you gain experience. Remember that model validation and documentation are as important as the calculations themselves.",
      nextSteps: [
        "Practice with different types of insurance products",
        "Learn advanced stochastic modeling techniques",
        "Explore regulatory modeling requirements",
        "Study model validation best practices",
        "Join actuarial modeling communities and forums",
      ],
    },
    relatedGuides: [
      {
        id: "2",
        title: "Advanced Stochastic Modeling Techniques",
      },
      {
        id: "3",
        title: "Model Validation Best Practices",
      },
      {
        id: "4",
        title: "Regulatory Compliance in Actuarial Models",
      },
    ],
  },
]
