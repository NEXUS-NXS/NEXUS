import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { courses, courseModules } from "@/lib/courses"
import { ArrowLeft, HelpCircle } from "lucide-react"
import Link from "next/link"

interface QuizPageProps {
  params: {
    courseId: string
    moduleId: string
    quizId: string
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  const course = courses.find((c) => c.id === params.courseId)
  const modules = courseModules[params.courseId] || []
  const module = modules.find((m) => m.id === params.moduleId)
  const quiz = module?.quizzes.find((q) => q.id === params.quizId)

  if (!course || !module || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Quiz not found</h1>
          <p className="mt-2">The quiz you're looking for doesn't exist.</p>
          <Link href="/courses" passHref>
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/courses/${params.courseId}/modules/${params.moduleId}`} passHref>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Module
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Module Quiz</h1>
          <p className="text-gray-500 mt-1">{module.title}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question</CardTitle>
            <CardDescription>Select the correct answer to proceed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{quiz.question}</h3>
                <p className="text-sm text-gray-500 mt-1">Choose one option</p>
              </div>

              <RadioGroup defaultValue="option-0">
                {quiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50">
                    <RadioGroupItem value={`option-${index}`} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <HelpCircle className="mr-2 h-4 w-4" />
              Hint
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Submit Answer</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
