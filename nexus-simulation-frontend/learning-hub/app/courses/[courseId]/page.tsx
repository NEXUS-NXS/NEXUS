import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { courses, courseModules } from "@/lib/courses"
import { Clock, BookOpen, Users, CheckCircle, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ModuleAccordion from "@/components/module-accordion"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = courses.find((c) => c.id === params.courseId)
  const modules = courseModules[params.courseId] || []

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="mt-2">The course you're looking for doesn't exist.</p>
          <Link href="/courses" passHref>
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 w-full">
            <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <Badge
                variant={
                  course.level === "Beginner"
                    ? "default"
                    : course.level === "Intermediate"
                      ? "secondary"
                      : "destructive"
                }
                className="mb-2"
              >
                {course.level}
              </Badge>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-lg opacity-90 mt-1">{course.description}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{course.students} students</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                    <CardDescription>What you'll learn in this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        This comprehensive course will take you from the basics to advanced concepts in {course.title}.
                        You'll learn through a combination of video lectures, hands-on exercises, and quizzes to test
                        your knowledge.
                      </p>

                      <h3 className="text-lg font-medium mt-6">Key Learning Outcomes</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Master fundamental concepts and techniques in {course.title}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Apply your knowledge to real-world problems and scenarios</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Build a portfolio of projects to showcase your skills</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Earn a certificate upon successful completion of all modules</span>
                        </li>
                      </ul>

                      <h3 className="text-lg font-medium mt-6">Prerequisites</h3>
                      <p>
                        {course.level === "Beginner"
                          ? "No prior experience is required for this course. We'll start from the basics and gradually build your skills."
                          : course.level === "Intermediate"
                            ? "Basic knowledge of the subject matter is recommended. Familiarity with fundamental concepts will help you get the most out of this course."
                            : "This advanced course requires solid understanding of the fundamentals. We recommend completing our beginner and intermediate courses first."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Modules</CardTitle>
                    <CardDescription>Step-by-step learning path</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ModuleAccordion modules={modules} courseId={course.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt={course.instructor}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{course.instructor}</h3>
                        <p className="text-sm text-gray-500">Expert in {course.category}</p>
                        <p className="mt-2">
                          An experienced educator with years of industry experience in {course.category}. Passionate
                          about teaching and helping students achieve their learning goals.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Enroll in Course</Button>
                  <Button variant="outline" className="w-full">
                    Add to Wishlist
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{course.duration} of content</span>
                    </li>
                    <li className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{course.modules} modules</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
