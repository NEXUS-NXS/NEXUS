import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  Globe,
  TrendingUp,
  Heart,
  Brain,
  Shield,
  Users,
  Code,
  BarChart3,
  Download,
  Play,
} from "lucide-react"

const modelCategories = [
  {
    id: "actuarial",
    title: "Actuarial Models",
    description: "Risk assessment, pricing, and reserving models",
    icon: Calculator,
    color: "bg-blue-500",
    count: 12,
    examples: ["IFRS 17", "Chain Ladder", "GLM Pricing"],
  },
  {
    id: "climate",
    title: "Climate & Environmental",
    description: "Climate risk modeling and environmental impact analysis",
    icon: Globe,
    color: "bg-green-500",
    count: 8,
    examples: ["Carbon Footprint", "Climate VaR", "ESG Scoring"],
  },
  {
    id: "financial",
    title: "Financial & Investment",
    description: "Portfolio optimization and financial risk models",
    icon: TrendingUp,
    color: "bg-emerald-500",
    count: 15,
    examples: ["Monte Carlo", "CAPM", "Black-Scholes"],
  },
  {
    id: "health",
    title: "Health & Demographic",
    description: "Population modeling and health analytics",
    icon: Heart,
    color: "bg-red-500",
    count: 6,
    examples: ["Mortality Tables", "Epidemic Models", "Demographics"],
  },
  {
    id: "ml",
    title: "Machine Learning",
    description: "Predictive models and AI-driven analytics",
    icon: Brain,
    color: "bg-purple-500",
    count: 10,
    examples: ["Neural Networks", "Random Forest", "Clustering"],
  },
  {
    id: "insurance",
    title: "Insurance Products",
    description: "Product design and performance modeling",
    icon: Shield,
    color: "bg-orange-500",
    count: 9,
    examples: ["Life Insurance", "P&C Pricing", "Reinsurance"],
  },
]

const features = [
  {
    icon: Code,
    title: "Multi-Language Support",
    description: "Write models in Python, R, or Fast Expression Language",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Work with 2-4 peers simultaneously on the same model",
  },
  {
    icon: BarChart3,
    title: "Dynamic Visualizations",
    description: "Interactive charts, graphs, and statistical outputs",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download results as PDF reports with full analysis",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Nexus Simulation</span>
              <span className="block text-blue-600">Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Build, simulate, and collaborate on advanced models across actuarial science, finance, climate risk, and
              data science.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/models" passHref>
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-5 w-5" />
                    Start Simulating
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/create" passHref>
                  <Button size="lg" variant="outline" className="w-full">
                    <Code className="mr-2 h-5 w-5" />
                    Create Model
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Platform Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for advanced modeling
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Card key={feature.title} className="text-center">
                    <CardHeader>
                      <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Model Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Model Categories</h2>
            <p className="mt-4 text-xl text-gray-500">
              Explore pre-built models or create your own across multiple domains
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modelCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link key={category.id} href={`/models/${category.id}`} passHref>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`rounded-lg p-3 ${category.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary">{category.count} models</Badge>
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Popular models:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.examples.map((example) => (
                            <Badge key={example} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start modeling?</span>
            <span className="block text-blue-200">Join thousands of students and professionals.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup" passHref>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/demo" passHref>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-600">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
