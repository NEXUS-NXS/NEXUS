import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, FileSpreadsheet, Database, BarChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Dataset Details | Nexus Learning Hub",
  description: "Detailed information about the selected dataset.",
}

interface PageProps {
  params: {
    datasetId: string
  }
}

export default function DatasetDetailPage({ params }: PageProps) {
  const dataset = datasets.find((d) => d.id === params.datasetId)

  if (!dataset) {
    notFound()
  }

  const DatasetIcon = dataset.type === "CSV" ? FileSpreadsheet : dataset.type === "Database" ? Database : BarChart

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/datasets" className="text-sm text-muted-foreground hover:text-foreground">
              Datasets
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{dataset.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-2">
                      <DatasetIcon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle>{dataset.name}</CardTitle>
                  </div>
                  <Badge variant={dataset.public ? "default" : "outline"}>
                    {dataset.public ? "Public" : "Private"}
                  </Badge>
                </div>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="preview">Data Preview</TabsTrigger>
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-lg font-medium">About this dataset</h3>
                        <p className="mt-2 text-muted-foreground">{dataset.longDescription}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Data Source</h3>
                        <p className="mt-2 text-muted-foreground">{dataset.source}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Data Quality</h3>
                        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Completeness</span>
                            <span className="text-lg font-medium">{dataset.quality.completeness}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Accuracy</span>
                            <span className="text-lg font-medium">{dataset.quality.accuracy}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Consistency</span>
                            <span className="text-lg font-medium">{dataset.quality.consistency}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">Timeliness</span>
                            <span className="text-lg font-medium">{dataset.quality.timeliness}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="mt-6">
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              {dataset.preview.columns.map((column) => (
                                <th key={column} className="px-4 py-2 text-left text-sm font-medium">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataset.preview.rows.map((row, i) => (
                              <tr key={i} className="border-b">
                                {row.map((cell, j) => (
                                  <td key={j} className="px-4 py-2 text-sm">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Showing {dataset.preview.rows.length} of {dataset.rowCount} rows
                    </p>
                  </TabsContent>
                  <TabsContent value="schema" className="mt-6">
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="px-4 py-2 text-left text-sm font-medium">Column Name</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                              <th className="px-4 py-2 text-left text-sm font-medium">Nullable</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataset.schema.map((column, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-4 py-2 text-sm font-medium">{column.name}</td>
                                <td className="px-4 py-2 text-sm">{column.type}</td>
                                <td className="px-4 py-2 text-sm">{column.description}</td>
                                <td className="px-4 py-2 text-sm">{column.nullable ? "Yes" : "No"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="usage" className="mt-6">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-lg font-medium">Usage in Models</h3>
                        <p className="mt-2 text-muted-foreground">
                          This dataset is currently used in {dataset.usageStats.models} models.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {dataset.usageStats.modelNames.map((model) => (
                            <Badge key={model} variant="secondary">
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Code Example</h3>
                        <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-4">
                          <code className="text-sm">
                            {`// Load the dataset in Python
import pandas as pd

# Load the dataset
df = pd.read_csv("${dataset.name.toLowerCase().replace(/\s+/g, "_")}.csv")

# Display the first few rows
print(df.head())

# Get basic statistics
print(df.describe())`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <div className="flex items-center gap-2">
                        <DatasetIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{dataset.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <span>{dataset.size}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Rows</span>
                      <span>{dataset.rowCount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Columns</span>
                      <span>{dataset.columnCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span>{dataset.created}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span>{dataset.lastUpdated}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Owner</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={dataset.owner} />
                          <AvatarFallback>{dataset.owner.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{dataset.owner}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Visibility</span>
                      <span>{dataset.public ? "Public" : "Private"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Shared With</span>
                      <div className="mt-2 flex -space-x-2">
                        {dataset.sharedWith.map((user, i) => (
                          <Avatar key={i} className="border-2 border-background">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user} />
                            <AvatarFallback>{user.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {dataset.sharedWith.length > 0 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{dataset.sharedWithCount - dataset.sharedWith.length}
                          </div>
                        )}
                      </div>
                    </div>
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

interface Dataset {
  id: string
  name: string
  description: string
  longDescription: string
  type: string
  size: string
  owner: string
  lastUpdated: string
  created: string
  shared: boolean
  public: boolean
  rowCount: number
  columnCount: number
  source: string
  quality: {
    completeness: number
    accuracy: number
    consistency: number
    timeliness: number
  }
  preview: {
    columns: string[]
    rows: (string | number)[][]
  }
  schema: {
    name: string
    type: string
    description: string
    nullable: boolean
  }[]
  usageStats: {
    models: number
    modelNames: string[]
  }
  sharedWith: string[]
  sharedWithCount: number
}

const datasets: Dataset[] = [
  {
    id: "1",
    name: "Mortality Tables 2023",
    description: "Standard mortality tables for life insurance calculations",
    longDescription:
      "This dataset contains comprehensive mortality tables for 2023, including standard mortality rates by age, gender, and risk class. The data is based on industry standard tables with adjustments for recent mortality trends. It's suitable for life insurance pricing, reserving, and risk management calculations.",
    type: "CSV",
    size: "2.4 MB",
    owner: "You",
    created: "Jan 15, 2023",
    lastUpdated: "2 days ago",
    shared: true,
    public: true,
    rowCount: 12500,
    columnCount: 8,
    source: "Society of Actuaries, 2023 Industry Tables",
    quality: {
      completeness: 99.8,
      accuracy: 98.5,
      consistency: 99.2,
      timeliness: 100,
    },
    preview: {
      columns: ["Age", "Gender", "Mortality_Rate", "Standard_Deviation", "Smoker_Factor", "Region", "SES_Factor"],
      rows: [
        [25, "M", 0.00123, 0.00012, 2.5, "North", 0.95],
        [25, "F", 0.00098, 0.0001, 2.3, "North", 0.95],
        [30, "M", 0.00132, 0.00013, 2.5, "North", 0.97],
        [30, "F", 0.00102, 0.00011, 2.3, "North", 0.97],
        [35, "M", 0.00142, 0.00014, 2.4, "North", 0.98],
      ],
    },
    schema: [
      {
        name: "Age",
        type: "Integer",
        description: "Age of the individual",
        nullable: false,
      },
      {
        name: "Gender",
        type: "String",
        description: "Gender (M/F)",
        nullable: false,
      },
      {
        name: "Mortality_Rate",
        type: "Float",
        description: "Annual mortality rate",
        nullable: false,
      },
      {
        name: "Standard_Deviation",
        type: "Float",
        description: "Standard deviation of the mortality rate",
        nullable: false,
      },
      {
        name: "Smoker_Factor",
        type: "Float",
        description: "Multiplier for smoker status",
        nullable: false,
      },
      {
        name: "Region",
        type: "String",
        description: "Geographic region",
        nullable: false,
      },
      {
        name: "SES_Factor",
        type: "Float",
        description: "Socioeconomic status adjustment factor",
        nullable: false,
      },
    ],
    usageStats: {
      models: 8,
      modelNames: ["Life Premium Calculator", "Term Insurance Pricing", "Annuity Valuation", "Pension Liability Model"],
    },
    sharedWith: ["Sarah Chen", "Michael Johnson", "Emily Rodriguez"],
    sharedWithCount: 8,
  },
  {
    id: "2",
    name: "Interest Rate History",
    description: "Historical interest rates from 1950 to present",
    longDescription:
      "This dataset provides a comprehensive historical record of interest rates from 1950 to the present day. It includes daily, monthly, and annual rates for various durations and types of financial instruments. The data is sourced from central banks and financial institutions and has been cleaned and normalized for consistency.",
    type: "CSV",
    size: "5.7 MB",
    owner: "Sarah Chen",
    created: "Mar 22, 2022",
    lastUpdated: "1 week ago",
    shared: true,
    public: false,
    rowCount: 26280,
    columnCount: 12,
    source: "Federal Reserve Economic Data (FRED), European Central Bank",
    quality: {
      completeness: 99.5,
      accuracy: 99.9,
      consistency: 98.7,
      timeliness: 97.0,
    },
    preview: {
      columns: ["Date", "Fed_Funds_Rate", "1Y_Treasury", "5Y_Treasury", "10Y_Treasury", "30Y_Treasury", "LIBOR_3M"],
      rows: [
        ["2023-05-01", 5.25, 5.05, 4.02, 3.76, 3.92, 5.32],
        ["2023-04-01", 5.0, 4.78, 3.95, 3.65, 3.85, 5.12],
        ["2023-03-01", 4.75, 4.55, 3.87, 3.62, 3.81, 4.98],
        ["2023-02-01", 4.5, 4.32, 3.75, 3.55, 3.75, 4.78],
        ["2023-01-01", 4.25, 4.12, 3.65, 3.45, 3.65, 4.58],
      ],
    },
    schema: [
      {
        name: "Date",
        type: "Date",
        description: "Date of the observation",
        nullable: false,
      },
      {
        name: "Fed_Funds_Rate",
        type: "Float",
        description: "Federal Funds Rate (%)",
        nullable: false,
      },
      {
        name: "1Y_Treasury",
        type: "Float",
        description: "1-Year Treasury Yield (%)",
        nullable: false,
      },
      {
        name: "5Y_Treasury",
        type: "Float",
        description: "5-Year Treasury Yield (%)",
        nullable: false,
      },
      {
        name: "10Y_Treasury",
        type: "Float",
        description: "10-Year Treasury Yield (%)",
        nullable: false,
      },
      {
        name: "30Y_Treasury",
        type: "Float",
        description: "30-Year Treasury Yield (%)",
        nullable: false,
      },
      {
        name: "LIBOR_3M",
        type: "Float",
        description: "3-Month LIBOR Rate (%)",
        nullable: false,
      },
    ],
    usageStats: {
      models: 12,
      modelNames: [
        "Interest Rate Forecast",
        "Economic Scenario Generator",
        "Asset Liability Model",
        "Fixed Income Pricing",
      ],
    },
    sharedWith: ["You", "Michael Johnson", "David Kim"],
    sharedWithCount: 6,
  },
  {
    id: "3",
    name: "Claims Database",
    description: "Comprehensive insurance claims database with categories",
    longDescription:
      "A comprehensive database of insurance claims across multiple lines of business. The dataset includes claim amounts, dates, categories, and resolution information. All personally identifiable information has been removed, and the data has been anonymized while preserving statistical properties important for actuarial analysis.",
    type: "Database",
    size: "124 MB",
    owner: "You",
    created: "Sep 10, 2022",
    lastUpdated: "3 days ago",
    shared: false,
    public: false,
    rowCount: 1250000,
    columnCount: 25,
    source: "Internal claims system, anonymized and aggregated",
    quality: {
      completeness: 97.8,
      accuracy: 99.2,
      consistency: 98.5,
      timeliness: 99.5,
    },
    preview: {
      columns: ["Claim_ID", "LOB", "Claim_Date", "Report_Date", "Claim_Amount", "Status", "Resolution_Days"],
      rows: [
        ["C10045892", "Auto", "2023-01-15", "2023-01-16", 4250.75, "Closed", 12],
        ["C10045893", "Home", "2023-01-15", "2023-01-17", 12500.0, "Closed", 45],
        ["C10045894", "Auto", "2023-01-16", "2023-01-16", 1875.25, "Closed", 8],
        ["C10045895", "Liability", "2023-01-16", "2023-01-20", 35000.0, "Open",""],
        ["C10045896", "Home", "2023-01-17", "2023-01-18", 5250.5, "Closed", 21],
      ],
    },
    schema: [
      {
        name: "Claim_ID",
        type: "String",
        description: "Unique identifier for the claim",
        nullable: false,
      },
      {
        name: "LOB",
        type: "String",
        description: "Line of business",
        nullable: false,
      },
      {
        name: "Claim_Date",
        type: "Date",
        description: "Date when the claim occurred",
        nullable: false,
      },
      {
        name: "Report_Date",
        type: "Date",
        description: "Date when the claim was reported",
        nullable: false,
      },
      {
        name: "Claim_Amount",
        type: "Float",
        description: "Total claim amount",
        nullable: false,
      },
      {
        name: "Status",
        type: "String",
        description: "Current status of the claim",
        nullable: false,
      },
      {
        name: "Resolution_Days",
        type: "Integer",
        description: "Number of days to resolve the claim",
        nullable: true,
      },
    ],
    usageStats: {
      models: 5,
      modelNames: ["Claims Forecasting", "Reserving Model", "Pricing Analysis", "Fraud Detection"],
    },
    sharedWith: [],
    sharedWithCount: 0,
  },
  {
    id: "4",
    name: "Market Volatility Index",
    description: "Daily market volatility measurements for risk modeling",
    longDescription:
      "This dataset contains daily market volatility measurements across major global markets. It includes implied volatility indices, realized volatility measures, and correlation matrices between different asset classes. The data is particularly useful for risk modeling, economic scenario generation, and stress testing.",
    type: "Time Series",
    size: "8.2 MB",
    owner: "Michael Johnson",
    created: "Nov 5, 2021",
    lastUpdated: "5 hours ago",
    shared: true,
    public: true,
    rowCount: 15340,
    columnCount: 18,
    source: "Bloomberg, CBOE, proprietary calculations",
    quality: {
      completeness: 99.9,
      accuracy: 99.7,
      consistency: 99.8,
      timeliness: 100,
    },
    preview: {
      columns: ["Date", "VIX", "VSTOXX", "VDAX", "VXN", "RV_SP500", "RV_FTSE", "Corr_Eq_Bond"],
      rows: [
        ["2023-05-01", 18.25, 19.32, 19.05, 22.45, 15.32, 14.87, -0.35],
        ["2023-04-30", 17.95, 19.05, 18.75, 22.15, 15.28, 14.75, -0.34],
        ["2023-04-29", 18.05, 19.12, 18.82, 22.25, 15.3, 14.8, -0.34],
        ["2023-04-28", 18.15, 19.22, 18.95, 22.35, 15.31, 14.85, -0.35],
        ["2023-04-27", 18.35, 19.42, 19.15, 22.55, 15.33, 14.9, -0.36],
      ],
    },
    schema: [
      {
        name: "Date",
        type: "Date",
        description: "Observation date",
        nullable: false,
      },
      {
        name: "VIX",
        type: "Float",
        description: "CBOE Volatility Index",
        nullable: false,
      },
      {
        name: "VSTOXX",
        type: "Float",
        description: "Euro STOXX 50 Volatility Index",
        nullable: false,
      },
      {
        name: "VDAX",
        type: "Float",
        description: "German DAX Volatility Index",
        nullable: false,
      },
      {
        name: "VXN",
        type: "Float",
        description: "Nasdaq-100 Volatility Index",
        nullable: false,
      },
      {
        name: "RV_SP500",
        type: "Float",
        description: "Realized volatility of S&P 500",
        nullable: false,
      },
      {
        name: "RV_FTSE",
        type: "Float",
        description: "Realized volatility of FTSE 100",
        nullable: false,
      },
      {
        name: "Corr_Eq_Bond",
        type: "Float",
        description: "Correlation between equities and bonds",
        nullable: false,
      },
    ],
    usageStats: {
      models: 10,
      modelNames: ["Economic Scenario Generator", "Market Risk Model", "Asset Allocation", "Stress Testing Framework"],
    },
    sharedWith: ["You", "Sarah Chen", "Lisa Wong"],
    sharedWithCount: 12,
  },
  {
    id: "5",
    name: "Pension Fund Performance",
    description: "Quarterly performance data for major pension funds",
    longDescription:
      "This dataset contains quarterly performance data for major pension funds across different regions and investment strategies. It includes returns, asset allocations, funding ratios, and benchmark comparisons. The data has been aggregated from public disclosures and industry reports.",
    type: "CSV",
    size: "3.1 MB",
    owner: "You",
    created: "Feb 8, 2023",
    lastUpdated: "Yesterday",
    shared: false,
    public: true,
    rowCount: 5200,
    columnCount: 15,
    source: "Public pension fund disclosures, industry reports",
    quality: {
      completeness: 98.5,
      accuracy: 99.0,
      consistency: 97.5,
      timeliness: 98.0,
    },
    preview: {
      columns: ["Quarter", "Fund_ID", "Region", "AUM_Millions", "Return_Pct", "Benchmark_Return", "Funding_Ratio"],
      rows: [
        ["2023Q1", "PF001", "North America", 25450, 3.2, 2.8, 0.92],
        ["2023Q1", "PF002", "Europe", 18750, 2.8, 2.5, 0.88],
        ["2023Q1", "PF003", "Asia", 12300, 2.5, 2.3, 0.95],
        ["2023Q1", "PF004", "North America", 8500, 3.5, 2.8, 0.97],
        ["2023Q1", "PF005", "Europe", 15200, 2.7, 2.5, 0.91],
      ],
    },
    schema: [
      {
        name: "Quarter",
        type: "String",
        description: "Year and quarter (YYYYQN format)",
        nullable: false,
      },
      {
        name: "Fund_ID",
        type: "String",
        description: "Unique identifier for the pension fund",
        nullable: false,
      },
      {
        name: "Region",
        type: "String",
        description: "Geographic region of the fund",
        nullable: false,
      },
      {
        name: "AUM_Millions",
        type: "Float",
        description: "Assets under management in millions USD",
        nullable: false,
      },
      {
        name: "Return_Pct",
        type: "Float",
        description: "Quarterly return percentage",
        nullable: false,
      },
      {
        name: "Benchmark_Return",
        type: "Float",
        description: "Benchmark return percentage",
        nullable: false,
      },
      {
        name: "Funding_Ratio",
        type: "Float",
        description: "Ratio of assets to liabilities",
        nullable: false,
      },
    ],
    usageStats: {
      models: 6,
      modelNames: ["Pension Liability Model", "Asset Allocation Optimizer", "Funding Strategy Analysis"],
    },
    sharedWith: [],
    sharedWithCount: 0,
  },
  {
    id: "6",
    name: "Healthcare Cost Projections",
    description: "Projected healthcare costs by region and demographic",
    longDescription:
      "This dataset provides detailed projections of healthcare costs broken down by region, demographic factors, and treatment categories. It includes historical trends and forward-looking estimates based on demographic shifts, medical inflation, and technological advancements in healthcare.",
    type: "Database",
    size: "76 MB",
    owner: "Lisa Wong",
    created: "Apr 12, 2022",
    lastUpdated: "2 weeks ago",
    shared: true,
    public: false,
    rowCount: 85000,
    columnCount: 22,
    source: "Healthcare Economics Research Institute, government projections",
    quality: {
      completeness: 96.5,
      accuracy: 97.0,
      consistency: 96.0,
      timeliness: 95.0,
    },
    preview: {
      columns: ["Year", "Region", "Age_Group", "Gender", "Treatment_Category", "Annual_Cost", "Growth_Rate"],
      rows: [
        [2023, "Northeast", "65-74", "M", "Inpatient", 12450, 0.045],
        [2023, "Northeast", "65-74", "F", "Inpatient", 11980, 0.043],
        [2023, "Northeast", "65-74", "M", "Outpatient", 5250, 0.052],
        [2023, "Northeast", "65-74", "F", "Outpatient", 5780, 0.054],
        [2023, "Northeast", "65-74", "M", "Prescription", 4320, 0.068],
      ],
    },
    schema: [
      {
        name: "Year",
        type: "Integer",
        description: "Projection year",
        nullable: false,
      },
      {
        name: "Region",
        type: "String",
        description: "Geographic region",
        nullable: false,
      },
      {
        name: "Age_Group",
        type: "String",
        description: "Age group category",
        nullable: false,
      },
      {
        name: "Gender",
        type: "String",
        description: "Gender (M/F)",
        nullable: false,
      },
      {
        name: "Treatment_Category",
        type: "String",
        description: "Category of medical treatment",
        nullable: false,
      },
      {
        name: "Annual_Cost",
        type: "Float",
        description: "Projected annual cost per person",
        nullable: false,
      },
      {
        name: "Growth_Rate",
        type: "Float",
        description: "Projected annual growth rate",
        nullable: false,
      },
    ],
    usageStats: {
      models: 7,
      modelNames: ["Healthcare Trend Model", "Medicare Supplement Pricing", "Long-term Care Forecast"],
    },
    sharedWith: ["You", "Sarah Chen", "Robert Taylor"],
    sharedWithCount: 5,
  },
]
