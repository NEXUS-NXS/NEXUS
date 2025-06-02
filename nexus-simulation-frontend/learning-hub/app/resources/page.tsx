import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, BookOpen, FileText, Download, Lock, BookMarked } from "lucide-react"
import Image from "next/image"
import { actuarialResources } from "@/lib/actuarial-resources"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Actuarial Resource Library</h1>
          <p className="mt-3 text-xl text-gray-500">
            Access books, study materials, and revision resources for your actuarial exams
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="bg-white">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="revision">Revision Materials</TabsTrigger>
              <TabsTrigger value="papers">Past Papers</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search resources..." className="pl-10" />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Organizations</SelectLabel>
                    <SelectItem value="all">All Organizations</SelectItem>
                    <SelectItem value="soa">Society of Actuaries (SOA)</SelectItem>
                    <SelectItem value="ifoa">Institute and Faculty of Actuaries (IFOA)</SelectItem>
                    <SelectItem value="cas">Casualty Actuarial Society (CAS)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Exam/Paper" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>SOA Exams</SelectLabel>
                    <SelectItem value="p">Exam P - Probability</SelectItem>
                    <SelectItem value="fm">Exam FM - Financial Mathematics</SelectItem>
                    <SelectItem value="ltam">Exam LTAM - Long-Term Actuarial Mathematics</SelectItem>
                    <SelectItem value="stam">Exam STAM - Short-Term Actuarial Mathematics</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>IFOA Papers</SelectLabel>
                    <SelectItem value="cs1">CS1 - Actuarial Statistics</SelectItem>
                    <SelectItem value="cs2">CS2 - Risk Modelling and Survival Analysis</SelectItem>
                    <SelectItem value="cm1">CM1 - Actuarial Mathematics</SelectItem>
                    <SelectItem value="cm2">CM2 - Financial Engineering and Loss Reserving</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>CAS Exams</SelectLabel>
                    <SelectItem value="1">Exam 1 - Probability</SelectItem>
                    <SelectItem value="2">Exam 2 - Financial Mathematics</SelectItem>
                    <SelectItem value="3f">Exam 3F - Financial Economics</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="free" />
                  <Label htmlFor="free">Free Resources</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="premium" />
                  <Label htmlFor="premium">Premium</Label>
                </div>
              </div>

              <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Filters</Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {actuarialResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="books" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {actuarialResources
                .filter((resource) => resource.type === "book")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="revision" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {actuarialResources
                .filter((resource) => resource.type === "revision")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="papers" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {actuarialResources
                .filter((resource) => resource.type === "paper")
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Organization Sections */}
        <div className="space-y-12 mt-16">
          <OrganizationSection
            title="Society of Actuaries (SOA)"
            description="Study materials and resources for SOA exams"
            resources={actuarialResources.filter((r) => r.organization === "SOA")}
          />

          <OrganizationSection
            title="Institute and Faculty of Actuaries (IFOA)"
            description="Study materials and resources for IFOA papers"
            resources={actuarialResources.filter((r) => r.organization === "IFOA")}
          />

          <OrganizationSection
            title="Casualty Actuarial Society (CAS)"
            description="Study materials and resources for CAS exams"
            resources={actuarialResources.filter((r) => r.organization === "CAS")}
          />
        </div>
      </div>
    </div>
  )
}

interface ResourceCardProps {
  resource: (typeof actuarialResources)[0]
}

function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0 bg-gray-100 flex items-center justify-center">
          {resource.type === "book" ? (
            <div className="relative h-32 w-24">
              <Image
                src={resource.coverImage || "/placeholder.svg?height=128&width=96"}
                alt={resource.title}
                fill
                className="object-cover shadow-md"
              />
            </div>
          ) : (
            <div className="p-4">
              {resource.type === "revision" ? (
                <FileText className="h-16 w-16 text-emerald-600" />
              ) : (
                <BookMarked className="h-16 w-16 text-emerald-600" />
              )}
            </div>
          )}
        </div>
        <div className="flex-1 p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-xl">{resource.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={resource.isPremium ? "destructive" : "default"}>
                  {resource.isPremium ? "Premium" : "Free"}
                </Badge>
                <Badge variant="outline">{resource.organization}</Badge>
                <Badge variant="secondary">{resource.exam}</Badge>
              </div>
            </div>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="mr-1 h-4 w-4" />
                <span>
                  {resource.type === "book"
                    ? `By ${resource.author}`
                    : resource.type === "revision"
                      ? "Revision Material"
                      : "Past Paper"}
                </span>
              </div>
              {resource.lastUpdated && (
                <div className="text-sm text-gray-500">Last updated: {resource.lastUpdated}</div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-0 flex flex-wrap gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              {resource.isPremium ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Purchase
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
            <Button variant="outline">Preview</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

interface OrganizationSectionProps {
  title: string
  description: string
  resources: typeof actuarialResources
}

function OrganizationSection({ title, description, resources }: OrganizationSectionProps) {
  // Group resources by exam
  const resourcesByExam: Record<string, typeof actuarialResources> = {}

  resources.forEach((resource) => {
    if (!resourcesByExam[resource.exam]) {
      resourcesByExam[resource.exam] = []
    }
    resourcesByExam[resource.exam].push(resource)
  })

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>

      <div className="space-y-8">
        {Object.entries(resourcesByExam).map(([exam, examResources]) => (
          <div key={exam} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">{exam}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examResources.map((resource) => (
                <Card key={resource.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{resource.title}</CardTitle>
                      <Badge variant={resource.isPremium ? "destructive" : "default"} className="ml-2">
                        {resource.isPremium ? "Premium" : "Free"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-sm text-gray-500">
                      {resource.type === "book"
                        ? `By ${resource.author}`
                        : resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      {resource.isPremium ? "Purchase" : "Download"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
