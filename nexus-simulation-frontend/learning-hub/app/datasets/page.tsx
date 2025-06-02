import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Download, Filter, Database, FileSpreadsheet, BarChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Datasets | Nexus Learning Hub",
  description: "Browse and manage actuarial and financial datasets for your simulations and models.",
}

export default function DatasetsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
            <p className="text-muted-foreground">
              Browse and manage actuarial and financial datasets for your simulations and models.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Dataset
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search datasets..." className="w-full pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Datasets</TabsTrigger>
            <TabsTrigger value="my">My Datasets</TabsTrigger>
            <TabsTrigger value="shared">Shared With Me</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="my" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets
                .filter((dataset) => dataset.owner === "You")
                .map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="shared" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets
                .filter((dataset) => dataset.shared)
                .map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="public" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets
                .filter((dataset) => dataset.public)
                .map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface Dataset {
  id: string
  name: string
  description: string
  type: string
  size: string
  owner: string
  lastUpdated: string
  shared: boolean
  public: boolean
}

interface DatasetCardProps {
  dataset: Dataset
}

function DatasetCard({ dataset }: DatasetCardProps) {
  const DatasetIcon = dataset.type === "CSV" ? FileSpreadsheet : dataset.type === "Database" ? Database : BarChart

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2">
              <DatasetIcon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle>{dataset.name}</CardTitle>
          </div>
          <Badge variant={dataset.public ? "default" : "outline"}>{dataset.public ? "Public" : "Private"}</Badge>
        </div>
        <CardDescription>{dataset.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Type</span>
            <span>{dataset.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Size</span>
            <span>{dataset.size}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Owner</span>
            <span>{dataset.owner}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Last Updated</span>
            <span>{dataset.lastUpdated}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button size="sm" asChild>
          <Link href={`/datasets/${dataset.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const datasets: Dataset[] = [
  {
    id: "1",
    name: "Mortality Tables 2023",
    description: "Standard mortality tables for life insurance calculations",
    type: "CSV",
    size: "2.4 MB",
    owner: "You",
    lastUpdated: "2 days ago",
    shared: true,
    public: true,
  },
  {
    id: "2",
    name: "Interest Rate History",
    description: "Historical interest rates from 1950 to present",
    type: "CSV",
    size: "5.7 MB",
    owner: "Sarah Chen",
    lastUpdated: "1 week ago",
    shared: true,
    public: false,
  },
  {
    id: "3",
    name: "Claims Database",
    description: "Comprehensive insurance claims database with categories",
    type: "Database",
    size: "124 MB",
    owner: "You",
    lastUpdated: "3 days ago",
    shared: false,
    public: false,
  },
  {
    id: "4",
    name: "Market Volatility Index",
    description: "Daily market volatility measurements for risk modeling",
    type: "Time Series",
    size: "8.2 MB",
    owner: "Michael Johnson",
    lastUpdated: "5 hours ago",
    shared: true,
    public: true,
  },
  {
    id: "5",
    name: "Pension Fund Performance",
    description: "Quarterly performance data for major pension funds",
    type: "CSV",
    size: "3.1 MB",
    owner: "You",
    lastUpdated: "Yesterday",
    shared: false,
    public: true,
  },
  {
    id: "6",
    name: "Healthcare Cost Projections",
    description: "Projected healthcare costs by region and demographic",
    type: "Database",
    size: "76 MB",
    owner: "Lisa Wong",
    lastUpdated: "2 weeks ago",
    shared: true,
    public: false,
  },
]
