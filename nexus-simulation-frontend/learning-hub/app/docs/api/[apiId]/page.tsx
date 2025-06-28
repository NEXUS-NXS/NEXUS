import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Code, Copy, ExternalLink, Play } from "lucide-react"

export const metadata: Metadata = {
  title: "API Reference | Nexus Learning Hub",
  description: "Detailed API documentation and reference.",
}

interface PageProps {
  params: {
    apiId: string
  }
}

export default function ApiDetailPage({ params }: PageProps) {
  const api = apis.find((a) => a.id === params.apiId)

  if (!api) {
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
              API Reference
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{api.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Postman
            </Button>
            <Button size="sm">
              <Play className="mr-2 h-4 w-4" />
              Try API
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{api.name}</h1>
              <Badge variant="outline">v{api.version}</Badge>
            </div>
            <p className="text-muted-foreground">{api.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="sdks">SDKs</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Overview</CardTitle>
                    <CardDescription>Introduction to the {api.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{api.overview}</p>
                      <h3>Base URL</h3>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm">{api.baseUrl}</div>
                      <h3>Rate Limits</h3>
                      <ul>
                        <li>Standard: {api.rateLimits.standard} requests per minute</li>
                        <li>Premium: {api.rateLimits.premium} requests per minute</li>
                      </ul>
                      <h3>Response Format</h3>
                      <p>All responses are returned in JSON format with the following structure:</p>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                        <code>{JSON.stringify(api.responseFormat, null, 2)}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="endpoints" className="mt-6">
                <div className="flex flex-col gap-6">
                  {api.endpoints.map((endpoint) => (
                    <Card key={endpoint.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Badge
                              variant={
                                endpoint.method === "GET"
                                  ? "default"
                                  : endpoint.method === "POST"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm">{endpoint.path}</code>
                          </CardTitle>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{endpoint.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Parameters</h4>
                              <div className="rounded-md border">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b bg-muted/50">
                                      <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                                      <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                                      <th className="px-4 py-2 text-left text-sm font-medium">Required</th>
                                      <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {endpoint.parameters.map((param, i) => (
                                      <tr key={i} className="border-b">
                                        <td className="px-4 py-2 text-sm font-mono">{param.name}</td>
                                        <td className="px-4 py-2 text-sm">{param.type}</td>
                                        <td className="px-4 py-2 text-sm">{param.required ? "Yes" : "No"}</td>
                                        <td className="px-4 py-2 text-sm">{param.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium mb-2">Example Request</h4>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code>{endpoint.exampleRequest}</code>
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Example Response</h4>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code>{endpoint.exampleResponse}</code>
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="authentication" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>How to authenticate with the {api.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{api.authentication.description}</p>
                      <h3>API Key Authentication</h3>
                      <p>Include your API key in the request headers:</p>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                        <code>{api.authentication.example}</code>
                      </pre>
                      <h3>Getting Your API Key</h3>
                      <ol>
                        <li>Sign up for an account on our platform</li>
                        <li>Navigate to the API section in your dashboard</li>
                        <li>Generate a new API key</li>
                        <li>Copy the key and store it securely</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="examples" className="mt-6">
                <div className="flex flex-col gap-6">
                  {api.examples.map((example, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle>{example.title}</CardTitle>
                        <CardDescription>{example.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Code Example</h4>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Expected Output</h4>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code>{example.output}</code>
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="sdks" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SDKs and Libraries</CardTitle>
                    <CardDescription>Official and community SDKs for the {api.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {api.sdks.map((sdk, i) => (
                        <div key={i} className="rounded-md border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{sdk.name}</h4>
                              <p className="text-sm text-muted-foreground">{sdk.description}</p>
                            </div>
                            <Badge variant="outline">{sdk.language}</Badge>
                          </div>
                          <div className="mt-3">
                            <pre className="bg-muted p-2 rounded text-sm">
                              <code>{sdk.installation}</code>
                            </pre>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Documentation
                          </Button>
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
                  <CardTitle>API Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Version</span>
                      <span>v{api.version}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="default">Stable</Badge>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span>{api.lastUpdated}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Base URL</span>
                      <code className="text-sm">{api.baseUrl}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" className="justify-start">
                      <Code className="mr-2 h-4 w-4" />
                      Interactive API Explorer
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Postman Collection
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      OpenAPI Specification
                    </Button>
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

interface ApiEndpoint {
  id: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  parameters?: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  exampleRequest: string
  exampleResponse: string
}

interface Api {
  id: string
  name: string
  description: string
  version: string
  baseUrl: string
  lastUpdated: string
  overview: string
  rateLimits: {
    standard: number
    premium: number
  }
  responseFormat: object
  authentication: {
    description: string
    example: string
  }
  endpoints: ApiEndpoint[]
  examples: {
    title: string
    description: string
    code: string
    output: string
  }[]
  sdks: {
    name: string
    language: string
    description: string
    installation: string
  }[]
}

const apis: Api[] = [
  {
    id: "1",
    name: "Actuarial Calculation API",
    description: "Comprehensive API for actuarial calculations and risk modeling",
    version: "2.1.0",
    baseUrl: "https://api.nexuslearning.com/v2",
    lastUpdated: "May 20, 2023",
    overview: "The Actuarial Calculation API provides a comprehensive set of endpoints for performing complex actuarial calculations, risk modeling, and insurance analytics. It supports various calculation methods including life tables, annuity valuations, reserve calculations, and stochastic modeling.",
    rateLimits: {
      standard: 100,
      premium: 1000
    },
    responseFormat: {
      success: true,
      data: {},
      message: "string",
      timestamp: "2023-05-20T10:30:00Z"
    },
    authentication: {
      description: "The API uses API key authentication. Include your API key in the Authorization header of each request.",
      example: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.nexuslearning.com/v2/calculations`
    },
    endpoints: [
      {
        id: "1",
        method: "POST",
        path: "/calculations/mortality",
        description: "Calculate mortality rates and life expectancy",
        parameters: [
          {
            name: "age",
            type: "integer",
            required: true,
            description: "Age of the individual"
          },
          {
            name: "gender",
            type: "string",
            required: true,
            description: "Gender (M/F)"
          },
          {
            name: "table",
            type: "string",
            required: false,
            description: "Mortality table to use (default: CSO2017)"
          }
        ],
        exampleRequest: `{
  "age": 35,
  "gender": "M",
  "table": "CSO2017"
}`,
        exampleResponse: `{
  "success": true,
  "data": {
    "mortality_rate": 0.00142,
    "life_expectancy": 42.5,
    "survival_probability": 0.99858
  },
  "message": "Calculation completed successfully",
  "timestamp": "2023-05-20T10:30:00Z"
}`
      },
      {
        id: "2",
        method: "POST",
        path: "/calculations/annuity",
        description: "Calculate present value of annuities",
        parameters: [
          {
            name: "payment_amount",
            type: "number",
            required: true,
            description: "Annual payment amount"
          },
          {
            name: "interest_rate",
            type: "number",
            required: true,
            description: "Annual interest rate (as decimal)"
          },
          {
            name: "term",
            type: "integer",
            required: true,
            description: "Number of years"
          },
          {
            name: "type",
            type: "string",
            required: false,
            description: "Annuity type (ordinary/due)"
          }
        ],
        exampleRequest: `{
  "payment_amount": 1000,
  "interest_rate": 0.05,
  "term": 20,
  "type": "ordinary"
}`,
        exampleResponse: `{
  "success": true,
  "data": {
    "present_value": 12462.21,
    "future_value": 33066.00,
    "total_payments": 20000.00
  },
  "message": "Annuity calculation completed",
  "timestamp": "2023-05-20T10:30:00Z"
}`
      }
    ],
    examples: [
      {
        title: "Calculate Life Insurance Premium",
        description: "Example of calculating a life insurance premium using mortality rates and interest assumptions",
        code: `import requests

url = "https://api.nexuslearning.com/v2/calculations/premium"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "age": 35,
    "gender": "M",
    "face_amount": 100000,
    "term": 20,
    "interest_rate": 0.04
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

print(f\"Annual Premium: \${result['data\'][\'annual_premium\']:.2f}")`,
        output: `Annual Premium: $245.67`
      },
      {
        title: "Batch Mortality Calculations",
        description: "Process multiple mortality calculations in a single API call",
        code: `import requests

url = "https://api.nexuslearning.com/v2/calculations/mortality/batch"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "calculations": [
        {"age": 25, "gender": "F"},
        {"age": 35, "gender": "M"},
        {"age": 45, "gender": "F"}
    ]
}

response = requests.post(url, headers=headers, json=data)
results = response.json()

for i, calc in Object.entries(results['data']):
    console.log(\`Age \${data['calculations'][parseInt(i)]['age']}: \${calc['mortality_rate']:.6f}\`)`,
        output: `Age 25: 0.000654
Age 35: 0.001420
Age 45: 0.002890`
      }
    ],
    sdks: [
      {
        name: "Python SDK",
        language: "Python",
        description: "Official Python SDK for the Actuarial Calculation API",
        installation: "pip install nexus-actuarial-sdk"
      },
      {
        name: "R Package",
        language: "R",
        description: "R package for actuarial calculations",
        installation: "install.packages('nexusActuarial')"
      },
      {
        name: "JavaScript SDK",
        language: "JavaScript",
        description: "Node.js and browser SDK",
        installation: "npm install @nexus/actuarial-sdk"
      },
      {
        name: "Excel Add-in",
        language: "VBA",
        description: "Excel add-in for direct spreadsheet integration",
        installation: "Download from marketplace"
      }
    ]
  }
]
