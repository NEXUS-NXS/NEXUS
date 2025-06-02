import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { courses, courseModules } from "@/lib/courses"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

interface ModulePageProps {
  params: {
    courseId: string
    moduleId: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const course = courses.find((c) => c.id === params.courseId)
  const modules = courseModules[params.courseId] || []
  const module = modules.find((m) => m.id === params.moduleId)

  if (!course || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Module not found</h1>
          <p className="mt-2">The module you're looking for doesn't exist.</p>
          <Link href="/courses" passHref>
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const moduleIndex = modules.findIndex((m) => m.id === params.moduleId)
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null
  const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/courses/${params.courseId}`} passHref>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{module.title}</h1>
          <p className="text-gray-500 mt-1">
            {course.title} • Module {moduleIndex + 1} of {modules.length}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Module Content</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{module.content}</p>

                  {/* This would be replaced with actual module content */}
                  <div className="my-8 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Module Content Placeholder</h3>
                    <p>This is where the actual module content would be displayed, including:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Video lectures</li>
                      <li>Text explanations</li>
                      <li>Code examples</li>
                      <li>Interactive exercises</li>
                      <li>Downloadable resources</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-medium mt-8 mb-4">Ready to Test Your Knowledge?</h3>
                  <p>
                    Now that you've completed the module content, it's time to test your understanding with the module
                    quizzes. You need to pass all quizzes to complete this module and move on to the next one.
                  </p>

                  <div className="mt-6 space-y-4">
                    {module.quizzes.map((quiz) => (
                      <Link
                        key={quiz.id}
                        href={`/courses/${params.courseId}/modules/${params.moduleId}/quizzes/${quiz.id}`}
                        passHref
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Take Quiz: {quiz.question.substring(0, 30)}...
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              {prevModule ? (
                <Link href={`/courses/${params.courseId}/modules/${prevModule.id}`} passHref>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Module
                  </Button>
                </Link>
              ) : (
                <div></div>
              )}

              {nextModule ? (
                <Link href={`/courses/${params.courseId}/modules/${nextModule.id}`} passHref>
                  <Button variant="outline">
                    Next Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${params.courseId}/certificate`} passHref>
                  <Button variant="outline">
                    Complete Course
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Module Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Module Requirements:</h4>
                  <ul className="space-y-2 text-sm">
                    {module.quizzes.map((quiz) => (
                      <li key={quiz.id} className="flex items-center">
                        <div className="h-5 w-5 rounded-full border border-gray-300 mr-2 flex items-center justify-center">
                          {/* Replace with CheckCircle when completed */}
                        </div>
                        <span>Complete quiz: {quiz.question.substring(0, 20)}...</span>
                      </li>
                    ))}
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
