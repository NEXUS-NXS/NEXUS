import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, FileText, Video, Code, ArrowRight, Clock, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation | Nexus Learning Hub",
  description: "Comprehensive documentation for actuarial models, tools, and methodologies.",
}

export default function DocsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground">
              Comprehensive guides and references for actuarial models, tools, and methodologies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search documentation..." className="w-full pl-8" />
          </div>
        </div>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          <TabsContent value="guides" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="api" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {apiDocs.map((api) => (
                <ApiCard key={api.id} api={api} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tutorials" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="examples" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {examples.map((example) => (
                <ExampleCard key={example.id} example={example} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface Guide {
  id: string
  title: string
  description: string
  category: string
  readingTime: string
  lastUpdated: string
}

interface GuideCardProps {
  guide: Guide
}

function GuideCard({ guide }: GuideCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{guide.title}</CardTitle>
          <Badge variant="outline">{guide.category}</Badge>
        </div>
        <CardDescription>{guide.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{guide.readingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Updated {guide.lastUpdated}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/docs/guides/${guide.id}`}>
            Read Guide
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ApiDoc {
  id: string
  title: string
  description: string
  category: string
  version: string
  status: "Stable" | "Beta" | "Deprecated"
}

interface ApiCardProps {
  api: ApiDoc
}

function ApiCard({ api }: ApiCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{api.title}</CardTitle>
          <Badge variant={api.status === "Stable" ? "default" : api.status === "Beta" ? "secondary" : "destructive"}>
            {api.status}
          </Badge>
        </div>
        <CardDescription>{api.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{api.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">v{api.version}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/docs/api/${api.id}`}>
            View Reference
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface Tutorial {
  id: string
  title: string
  description: string
  type: "Video" | "Interactive" | "Article"
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  rating: number
}

interface TutorialCardProps {
  tutorial: Tutorial
}

function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{tutorial.title}</CardTitle>
          <Badge
            variant={
              tutorial.difficulty === "Beginner"
                ? "outline"
                : tutorial.difficulty === "Intermediate"
                  ? "secondary"
                  : "default"
            }
          >
            {tutorial.difficulty}
          </Badge>
        </div>
        <CardDescription>{tutorial.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {tutorial.type === "Video" ? (
              <Video className="h-4 w-4 text-muted-foreground" />
            ) : tutorial.type === "Interactive" ? (
              <Code className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">{tutorial.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{tutorial.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{tutorial.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/docs/tutorials/${tutorial.id}`}>
            Start Tutorial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface Example {
  id: string
  title: string
  description: string
  category: string
  complexity: "Simple" | "Moderate" | "Complex"
  tags: string[]
}

interface ExampleCardProps {
  example: Example
}

function ExampleCard({ example }: ExampleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{example.title}</CardTitle>
          <Badge
            variant={
              example.complexity === "Simple" ? "outline" : example.complexity === "Moderate" ? "secondary" : "default"
            }
          >
            {example.complexity}
          </Badge>
        </div>
        <CardDescription>{example.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{example.category}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {example.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/docs/examples/${example.id}`}>
            View Example
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const guides: Guide[] = [
  {
    id: "getting-started",
    title: "Getting Started with Nexus",
    description: "Learn the basics of the Nexus platform and how to create your first model",
    category: "Fundamentals",
    readingTime: "10 min read",
    lastUpdated: "2 days ago",
  },
  {
    id: "ifrs17-implementation",
    title: "IFRS 17 Implementation Guide",
    description: "Comprehensive guide to implementing IFRS 17 standards in your models",
    category: "Regulatory",
    readingTime: "25 min read",
    lastUpdated: "1 week ago",
  },
  {
    id: "monte-carlo-simulations",
    title: "Monte Carlo Simulation Techniques",
    description: "Advanced techniques for implementing Monte Carlo simulations in actuarial models",
    category: "Modeling",
    readingTime: "20 min read",
    lastUpdated: "3 days ago",
  },
  {
    id: "data-preparation",
    title: "Data Preparation Best Practices",
    description: "Learn how to prepare and clean data for actuarial modeling",
    category: "Data",
    readingTime: "15 min read",
    lastUpdated: "Yesterday",
  },
  {
    id: "collaboration-workflow",
    title: "Collaborative Modeling Workflow",
    description: "Best practices for team collaboration on actuarial models",
    category: "Workflow",
    readingTime: "12 min read",
    lastUpdated: "5 days ago",
  },
  {
    id: "model-validation",
    title: "Model Validation Framework",
    description: "A comprehensive framework for validating actuarial models",
    category: "Validation",
    readingTime: "18 min read",
    lastUpdated: "1 day ago",
  },
]

const apiDocs: ApiDoc[] = [
  {
    id: "model-api",
    title: "Model API",
    description: "API reference for creating and managing simulation models",
    category: "Core API",
    version: "2.3.0",
    status: "Stable",
  },
  {
    id: "dataset-api",
    title: "Dataset API",
    description: "API reference for working with datasets and data sources",
    category: "Core API",
    version: "2.1.5",
    status: "Stable",
  },
  {
    id: "simulation-api",
    title: "Simulation API",
    description: "API reference for running and managing simulations",
    category: "Core API",
    version: "2.2.1",
    status: "Stable",
  },
  {
    id: "visualization-api",
    title: "Visualization API",
    description: "API reference for creating custom visualizations of simulation results",
    category: "Extension API",
    version: "1.8.3",
    status: "Beta",
  },
  {
    id: "collaboration-api",
    title: "Collaboration API",
    description: "API reference for collaborative features and team management",
    category: "Extension API",
    version: "1.5.0",
    status: "Beta",
  },
  {
    id: "legacy-model-api",
    title: "Legacy Model API",
    description: "API reference for the legacy model format (pre-v2.0)",
    category: "Legacy API",
    version: "1.9.7",
    status: "Deprecated",
  },
]

const tutorials: Tutorial[] = [
  {
    id: "first-model",
    title: "Creating Your First Model",
    description: "Step-by-step tutorial for creating your first actuarial model in Nexus",
    type: "Video",
    duration: "15 minutes",
    difficulty: "Beginner",
    rating: 4.8,
  },
  {
    id: "advanced-monte-carlo",
    title: "Advanced Monte Carlo Techniques",
    description: "Learn advanced Monte Carlo simulation techniques for complex risk modeling",
    type: "Interactive",
    duration: "45 minutes",
    difficulty: "Advanced",
    rating: 4.9,
  },
  {
    id: "data-visualization",
    title: "Effective Data Visualization",
    description: "Best practices for visualizing actuarial data and simulation results",
    type: "Article",
    duration: "20 minutes",
    difficulty: "Intermediate",
    rating: 4.6,
  },
  {
    id: "parameter-optimization",
    title: "Parameter Optimization Methods",
    description: "Techniques for optimizing model parameters for better accuracy",
    type: "Interactive",
    duration: "30 minutes",
    difficulty: "Intermediate",
    rating: 4.7,
  },
  {
    id: "regulatory-reporting",
    title: "Regulatory Reporting Automation",
    description: "How to automate regulatory reporting using Nexus models",
    type: "Video",
    duration: "25 minutes",
    difficulty: "Intermediate",
    rating: 4.5,
  },
  {
    id: "collaborative-modeling",
    title: "Collaborative Modeling Workflow",
    description: "Learn how to effectively collaborate on models with your team",
    type: "Article",
    duration: "15 minutes",
    difficulty: "Beginner",
    rating: 4.4,
  },
]

const examples: Example[] = [
  {
    id: "ifrs17-model",
    title: "IFRS 17 Calculation Engine",
    description: "Complete example of an IFRS 17 calculation engine with contract groups",
    category: "Regulatory Models",
    complexity: "Complex",
    tags: ["IFRS 17", "Insurance", "Regulatory", "Python"],
  },
  {
    id: "mortality-analysis",
    title: "Mortality Analysis Dashboard",
    description: "Interactive dashboard for analyzing mortality trends and patterns",
    category: "Data Analysis",
    complexity: "Moderate",
    tags: ["Mortality", "Dashboard", "Visualization", "R"],
  },
  {
    id: "pricing-model",
    title: "Auto Insurance Pricing Model",
    description: "Example pricing model for auto insurance with multiple rating factors",
    category: "Pricing Models",
    complexity: "Moderate",
    tags: ["Pricing", "Insurance", "GLM", "Python"],
  },
  {
    id: "capital-model",
    title: "Economic Capital Model",
    description: "Stochastic model for calculating economic capital requirements",
    category: "Capital Models",
    complexity: "Complex",
    tags: ["Capital", "Solvency", "Monte Carlo", "Python"],
  },
  {
    id: "claims-forecast",
    title: "Claims Forecasting Model",
    description: "Time series model for forecasting insurance claims frequency and severity",
    category: "Forecasting Models",
    complexity: "Moderate",
    tags: ["Claims", "Forecasting", "Time Series", "R"],
  },
  {
    id: "simple-life-table",
    title: "Simple Life Table Calculator",
    description: "Basic implementation of a life table calculator with visualization",
    category: "Life Insurance",
    complexity: "Simple",
    tags: ["Life Insurance", "Mortality", "JavaScript"],
  },
]
