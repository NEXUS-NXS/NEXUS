import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { courses } from "@/lib/courses"
import { BookOpen, Award, Clock, BarChart3, BookMarked } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  // Mock data for enrolled courses
  const enrolledCourses = courses.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your progress and continue learning</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-gray-500">Out of {courses.length} available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <Award className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Keep learning!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hours Spent</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Complete courses to earn</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="in-progress">
          <TabsList className="mb-6">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress">
            <div className="grid grid-cols-1 gap-6">
              {enrolledCourses.map((course, index) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 pb-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Progress</span>
                              <span>{index * 10}%</span>
                            </div>
                            <Progress value={index * 10} className="h-2" />
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <BookMarked className="mr-1 h-4 w-4" />
                            <span>Last accessed: 2 days ago</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0">
                        <Link href={`/courses/${course.id}`} passHref>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">Continue Learning</Button>
                        </Link>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}

              {enrolledCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No courses in progress</h3>
                  <p className="mt-1 text-gray-500">Enroll in a course to start learning</p>
                  <div className="mt-6">
                    <Link href="/courses" passHref>
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No completed courses yet</h3>
              <p className="mt-1 text-gray-500">Complete a course to see it here</p>
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No certificates earned yet</h3>
              <p className="mt-1 text-gray-500">Complete courses to earn certificates</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
