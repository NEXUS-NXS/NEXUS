import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadDatasetDialog } from "@/components/upload-dataset-dialog"
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Database,
  FileSpreadsheet,
  BarChart,
  Users,
  TrendingUp,
  Upload,
} from "lucide-react"
import type { Metadata } from "next"

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
            <p className="text-muted-foreground">Discover and share actuarial datasets for research and modeling</p>
          </div>
          <div className="flex items-center gap-2">
            <UploadDatasetDialog>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Dataset
              </Button>
            </UploadDatasetDialog>
            <Button variant="outline" asChild>
              <Link href="/datasets/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Page
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Datasets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">69% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contributors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">+23 new this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search datasets..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Datasets</TabsTrigger>
            <TabsTrigger value="mortality">Mortality</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="economic">Economic</TabsTrigger>
            <TabsTrigger value="my-datasets">My Datasets</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {dataset.type === "csv" && <FileSpreadsheet className="h-5 w-5 text-green-500" />}
                        {dataset.type === "database" && <Database className="h-5 w-5 text-blue-500" />}
                        {dataset.type === "json" && <BarChart className="h-5 w-5 text-purple-500" />}
                        <CardTitle className="text-lg">{dataset.title}</CardTitle>
                      </div>
                      <Badge variant={dataset.isPublic ? "default" : "secondary"}>
                        {dataset.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{dataset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{dataset.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{dataset.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{dataset.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" alt={dataset.author} />
                            <AvatarFallback>{dataset.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{dataset.author}</span>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/datasets/${dataset.id}`}>View Dataset</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mortality" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets
                .filter((dataset) => dataset.category === "mortality")
                .map((dataset) => (
                  <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-5 w-5 text-green-500" />
                          <CardTitle className="text-lg">{dataset.title}</CardTitle>
                        </div>
                        <Badge variant={dataset.isPublic ? "default" : "secondary"}>
                          {dataset.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{dataset.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-1">
                          {dataset.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{dataset.downloads}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{dataset.views}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{dataset.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg?height=24&width=24" alt={dataset.author} />
                              <AvatarFallback>{dataset.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{dataset.author}</span>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/datasets/${dataset.id}`}>View Dataset</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Add other tab contents as needed */}
        </Tabs>
      </div>
    </div>
  )
}

const datasets = [
  {
    id: "1",
    title: "US Life Tables 2020",
    description:
      "Comprehensive mortality data for the United States population, including age-specific death rates and life expectancy calculations.",
    category: "mortality",
    type: "csv",
    author: "CDC Statistics",
    lastUpdated: "2 days ago",
    downloads: 1234,
    views: 5678,
    isPublic: true,
    tags: ["mortality", "life-tables", "usa", "2020"],
  },
  {
    id: "2",
    title: "Auto Insurance Claims Dataset",
    description:
      "Historical auto insurance claims data with detailed information about claim amounts, types, and settlement patterns.",
    category: "claims",
    type: "database",
    author: "Insurance Analytics Corp",
    lastUpdated: "1 week ago",
    downloads: 892,
    views: 3421,
    isPublic: true,
    tags: ["auto-insurance", "claims", "historical", "analytics"],
  },
  {
    id: "3",
    title: "Economic Indicators 2023",
    description:
      "Key economic indicators including inflation rates, GDP growth, unemployment rates, and interest rate trends.",
    category: "economic",
    type: "json",
    author: "Economic Research Institute",
    lastUpdated: "3 days ago",
    downloads: 567,
    views: 2134,
    isPublic: true,
    tags: ["economics", "indicators", "2023", "trends"],
  },
  {
    id: "4",
    title: "Health Insurance Premiums",
    description: "Analysis of health insurance premium trends across different demographics and geographic regions.",
    category: "financial",
    type: "csv",
    author: "Health Analytics Team",
    lastUpdated: "5 days ago",
    downloads: 445,
    views: 1876,
    isPublic: false,
    tags: ["health-insurance", "premiums", "demographics", "regional"],
  },
  {
    id: "5",
    title: "Pension Fund Performance",
    description: "Long-term performance data of pension funds including returns, asset allocation, and risk metrics.",
    category: "financial",
    type: "database",
    author: "Pension Research Group",
    lastUpdated: "1 week ago",
    downloads: 723,
    views: 2987,
    isPublic: true,
    tags: ["pension", "performance", "returns", "risk"],
  },
  {
    id: "6",
    title: "Disability Insurance Claims",
    description:
      "Comprehensive dataset of disability insurance claims including claim duration, benefit amounts, and recovery rates.",
    category: "claims",
    type: "csv",
    author: "Disability Insurance Institute",
    lastUpdated: "4 days ago",
    downloads: 334,
    views: 1543,
    isPublic: true,
    tags: ["disability", "insurance", "claims", "recovery"],
  },
]
