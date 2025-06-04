import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Code, Download, Share2, Play, Copy, ExternalLink, FileText, Database } from "lucide-react"

export const metadata: Metadata = {
  title: "Code Example | Nexus Learning Hub",
  description: "Detailed code example with explanations and variations.",
}

interface PageProps {
  params: {
    exampleId: string
  }
}

export default function ExampleDetailPage({ params }: PageProps) {
  const example = examples.find((e) => e.id === params.exampleId)

  if (!example) {
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
              Examples
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{example.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Code
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{example.title}</CardTitle>
                    <CardDescription className="mt-2">{example.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{example.language}</Badge>
                    <Badge
                      variant={
                        example.complexity === "Simple"
                          ? "default"
                          : example.complexity === "Intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {example.complexity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="code" className="w-full">
                  <TabsList>
                    <TabsTrigger value="code">Main Code</TabsTrigger>
                    <TabsTrigger value="explanation">Explanation</TabsTrigger>
                    <TabsTrigger value="variations">Variations</TabsTrigger>
                    <TabsTrigger value="output">Sample Output</TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="mt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{example.title}</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Run
                          </Button>
                        </div>
                      </div>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto border">
                        <code className="text-sm">{example.code}</code>
                      </pre>
                      {example.imports && (
                        <div>
                          <h4 className="font-medium mb-2">Required Imports</h4>
                          <pre className="bg-muted p-3 rounded-md text-sm">
                            <code>{example.imports}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="explanation" className="mt-6">
                    <div className="prose max-w-none">
                      <h3>How it Works</h3>
                      <p>{example.explanation.overview}</p>

                      <h3>Step-by-Step Breakdown</h3>
                      <ol>
                        {example.explanation.steps.map((step, i) => (
                          <li key={i}>
                            <strong>{step.title}:</strong> {step.description}
                            {step.code && (
                              <pre className="bg-muted p-3 rounded-md mt-2 text-sm">
                                <code>{step.code}</code>
                              </pre>
                            )}
                          </li>
                        ))}
                      </ol>

                      <h3>Key Concepts</h3>
                      <ul>
                        {example.explanation.concepts.map((concept, i) => (
                          <li key={i}>{concept}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="variations" className="mt-6">
                    <div className="flex flex-col gap-6">
                      {example.variations.map((variation, i) => (
                        <Card key={i}>
                          <CardHeader>
                            <CardTitle className="text-lg">{variation.title}</CardTitle>
                            <CardDescription>{variation.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Modified Code</h4>
                                <Button variant="outline" size="sm">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy
                                </Button>
                              </div>
                              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                <code>{variation.code}</code>
                              </pre>
                              <p className="text-sm text-muted-foreground">{variation.notes}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="output" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Expected Output</CardTitle>
                        <CardDescription>Sample output when running this example</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-black text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono">
                          <code>{example.sampleOutput}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Language</span>
                      <span>{example.language}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span>{example.category}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Complexity</span>
                      <span>{example.complexity}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span>{example.lastUpdated}</span>
                    </div>
                    <Separator />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Author</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg?height=24&width=24" alt={example.author} />
                          <AvatarFallback>{example.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{example.author}</span>
                      </div>
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
                    {example.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {example.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {example.relatedExamples.map((related) => (
                      <Link key={related.id} href={`/docs/examples/${related.id}`} className="text-sm hover:underline">
                        {related.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" className="justify-start">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in CodePen
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      View Documentation
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Download Dataset
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

interface Example {
  id: string
  title: string
  description: string
  category: string
  language: string
  complexity: "Simple" | "Intermediate" | "Advanced"
  author: string
  lastUpdated: string
  code: string
  imports?: string
  explanation: {
    overview: string
    steps: {
      title: string
      description: string
      code?: string
    }[]
    concepts: string[]
  }
  variations: {
    title: string
    description: string
    code: string
    notes: string
  }[]
  sampleOutput: string
  tags: string[]
  requirements: string[]
  relatedExamples: {
    id: string
    title: string
  }[]
}

const examples: Example[] = [
  {
    id: "1",
    title: "Life Insurance Premium Calculator",
    description: "Calculate life insurance premiums using mortality tables and present value calculations",
    category: "Life Insurance",
    language: "Python",
    complexity: "Intermediate",
    author: "Dr. Sarah Chen",
    lastUpdated: "June 5, 2023",
    imports: `import numpy as np
import pandas as pd
from scipy import optimize
import matplotlib.pyplot as plt`,
    code: `def calculate_life_premium(age, gender, face_amount, term, interest_rate, mortality_table):
    \"\"\"
    Calculate annual life insurance premium using the equivalence principle
    
    Parameters:
    - age: int, current age of insured
    - gender: str, 'M' or 'F'
    - face_amount: float, death benefit amount
    - term: int, policy term in years
    - interest_rate: float, annual interest rate
    - mortality_table: dict, mortality rates by age and gender
    
    Returns:
    - annual_premium: float, annual premium amount
    \"\"\"
    
    # Calculate present value of benefits
    pv_benefits = 0
    for t in range(1, term + 1):
        current_age = age + t - 1
        
        # Get mortality rate for current age
        if current_age in mortality_table[gender]:
            q_x = mortality_table[gender][current_age]
        else:
            q_x = 0.5  # Default high mortality for very old ages
        
        # Probability of death in year t
        prob_death = q_x * survival_probability(age, current_age - 1, gender, mortality_table)
        
        # Discount factor
        discount = (1 + interest_rate) ** (-t)
        
        # Add to present value
        pv_benefits += face_amount * prob_death * discount
    
    # Calculate present value of annuity (premium payments)
    pv_annuity = 0
    for t in range(term):
        current_age = age + t
        
        # Probability of survival to beginning of year t+1
        prob_survival = survival_probability(age, current_age, gender, mortality_table)
        
        # Discount factor
        discount = (1 + interest_rate) ** (-t)
        
        # Add to present value
        pv_annuity += prob_survival * discount
    
    # Calculate premium using equivalence principle
    annual_premium = pv_benefits / pv_annuity
    
    return annual_premium

def survival_probability(initial_age, target_age, gender, mortality_table):
    \"\"\"
    Calculate probability of survival from initial_age to target_age
    \"\"\"
    if target_age <= initial_age:
        return 1.0
    
    prob = 1.0
    for age in range(initial_age, target_age):
        if age in mortality_table[gender]:
            q_x = mortality_table[gender][age]
            prob *= (1 - q_x)
        else:
            prob *= 0.5  # High mortality for missing ages
    
    return prob

# Sample mortality table (simplified)
mortality_table = {
    'M': {
        25: 0.0012, 26: 0.0013, 27: 0.0014, 28: 0.0015, 29: 0.0016,
        30: 0.0017, 31: 0.0018, 32: 0.0019, 33: 0.0020, 34: 0.0021,
        35: 0.0022, 36: 0.0024, 37: 0.0026, 38: 0.0028, 39: 0.0030,
        40: 0.0032, 41: 0.0035, 42: 0.0038, 43: 0.0041, 44: 0.0045,
        45: 0.0049, 46: 0.0054, 47: 0.0059, 48: 0.0065, 49: 0.0071,
        50: 0.0078, 51: 0.0086, 52: 0.0095, 53: 0.0105, 54: 0.0116
    },
    'F': {
        25: 0.0008, 26: 0.0009, 27: 0.0009, 28: 0.0010, 29: 0.0011,
        30: 0.0012, 31: 0.0012, 32: 0.0013, 33: 0.0014, 34: 0.0015,
        35: 0.0016, 36: 0.0017, 37: 0.0018, 38: 0.0020, 39: 0.0021,
        40: 0.0023, 41: 0.0025, 42: 0.0027, 43: 0.0030, 44: 0.0032,
        45: 0.0035, 46: 0.0038, 47: 0.0042, 48: 0.0046, 49: 0.0050,
        50: 0.0055, 51: 0.0061, 52: 0.0067, 53: 0.0074, 54: 0.0082
    }
}

// Example calculation
const age = 35
const gender = 'M'
const face_amount = 500000
const term = 20
const interest_rate = 0.04

const premium = calculate_life_premium(age, gender, face_amount, term, interest_rate, mortality_table);
console.log(\`Annual Premium: $\${premium:,.2f}\`)

// Calculate some additional metrics
const total_premiums = premium * term;
const benefit_cost_ratio = face_amount / total_premiums;

console.log(\`Total Premiums over \${term} years: $\${total_premiums:,.2f}\`)
console.log(\`Benefit to Cost Ratio: \${benefit_cost_ratio:.2f}\`)`,
    explanation: {
      overview:
        "This example demonstrates how to calculate life insurance premiums using the actuarial equivalence principle, which states that the present value of premiums should equal the present value of benefits.",
      steps: [
        {
          title: "Define the premium calculation function",
          description:
            "Set up the main function with all necessary parameters including age, gender, face amount, term, interest rate, and mortality table",
          code: "def calculate_life_premium(age, gender, face_amount, term, interest_rate, mortality_table):",
        },
        {
          title: "Calculate present value of benefits",
          description:
            "For each year of the policy term, calculate the probability of death and discount the benefit payment back to present value",
          code: "pv_benefits += face_amount * prob_death * discount",
        },
        {
          title: "Calculate present value of premium annuity",
          description:
            "For each year premiums are paid, calculate the probability of survival and discount the premium payment back to present value",
          code: "pv_annuity += prob_survival * discount",
        },
        {
          title: "Apply equivalence principle",
          description:
            "Set present value of benefits equal to present value of premiums to solve for the premium amount",
          code: "annual_premium = pv_benefits / pv_annuity",
        },
        {
          title: "Helper functions for survival probability",
          description: "Create utility functions to calculate survival probabilities from mortality tables",
          code: "def survival_probability(initial_age, target_age, gender, mortality_table):",
        },
      ],
      concepts: [
        "Actuarial equivalence principle",
        "Present value calculations",
        "Mortality tables and survival probabilities",
        "Time value of money in insurance pricing",
        "Life contingent cash flows",
      ],
    },
    variations: [
      {
        title: "With Loading for Expenses",
        description: "Add expense loading to account for administrative costs and profit margins",
        code: `def calculate_loaded_premium(age, gender, face_amount, term, interest_rate, mortality_table, loading_factor=0.15):
    net_premium = calculate_life_premium(age, gender, face_amount, term, interest_rate, mortality_table)
    loaded_premium = net_premium * (1 + loading_factor)
    return loaded_premium

// Example with 15% loading
const loaded_premium = calculate_loaded_premium(35, 'M', 500000, 20, 0.04, mortality_table)
console.log(\`Loaded Premium: $\${loaded_premium:,.2f}\`)`,
        notes:
          "Loading factors typically range from 10% to 30% depending on the insurer's expense structure and profit targets.",
      },
      {
        title: "Level Premium with Cash Values",
        description: "Calculate premiums for whole life insurance with cash value accumulation",
        code: `def calculate_whole_life_premium(age, gender, face_amount, interest_rate, mortality_table):
    \"\"\"Calculate level premium for whole life insurance\"\"\"
    max_age = 100
    
    # Calculate net single premium
    nsp = 0
    for t in range(1, max_age - age + 1):
        current_age = age + t - 1
        q_x = mortality_table[gender].get(current_age, 0.5)
        prob_death = q_x * survival_probability(age, current_age - 1, gender, mortality_table)
        discount = (1 + interest_rate) ** (-t)
        nsp += face_amount * prob_death * discount
    
    # Calculate present value of life annuity
    pv_life_annuity = 0
    for t in range(max_age - age):
        current_age = age + t
        prob_survival = survival_probability(age, current_age, gender, mortality_table)
        discount = (1 + interest_rate) ** (-t)
        pv_life_annuity += prob_survival * discount
    
    return nsp / pv_life_annuity`,
        notes:
          "Whole life premiums are typically higher than term premiums because they include both insurance and savings components.",
      },
    ],
    sampleOutput: `Annual Premium: $1,247.83
Total Premiums over 20 years: $24,956.60
Benefit to Cost Ratio: 20.04

Additional Analysis:
- Monthly Premium: $103.99
- Premium as % of Face Amount: 0.25%
- Break-even year (if invested at 4%): 18.2 years`,
    tags: ["life-insurance", "premium-calculation", "mortality-tables", "present-value", "actuarial-math"],
    requirements: ["Python 3.7+", "NumPy", "Pandas", "SciPy", "Matplotlib"],
    relatedExamples: [
      {
        id: "2",
        title: "Annuity Valuation Calculator",
      },
      {
        id: "3",
        title: "Pension Liability Model",
      },
      {
        id: "4",
        title: "Health Insurance Pricing",
      },
    ],
  },
]
