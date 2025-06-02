import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { courses } from "@/lib/courses"
import { Download, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CertificatePageProps {
  params: {
    courseId: string
  }
}

export default function CertificatePage({ params }: CertificatePageProps) {
  const course = courses.find((c) => c.id === params.courseId)

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

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Course Certificate</h1>
          <p className="text-gray-500 mt-1">Congratulations on completing {course.title}!</p>
        </div>

        <Card className="overflow-hidden border-4 border-emerald-600 mb-8">
          <CardContent className="p-0">
            <div className="relative bg-white p-8 text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute inset-0 bg-emerald-600 rounded-full scale-150 -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              <div className="relative">
                <div className="mb-6">
                  <div className="mx-auto w-24 h-24 relative mb-2">
                    <Image
                      src="/placeholder.svg?height=96&width=96"
                      alt="TechLearn Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-600">TechLearn Hub</h2>
                </div>

                <h1 className="text-4xl font-serif mb-2">Certificate of Completion</h1>
                <p className="text-xl mb-8">This certifies that</p>

                <p className="text-3xl font-bold mb-6 border-b-2 border-gray-200 pb-2 mx-auto max-w-md">John Doe</p>

                <p className="text-xl mb-8">
                  has successfully completed the course
                  <br />
                  <span className="font-bold text-2xl">{course.title}</span>
                </p>

                <div className="grid grid-cols-2 gap-8 mb-8 max-w-lg mx-auto">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{currentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instructor</p>
                    <p className="font-medium">{course.instructor}</p>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 max-w-xs mx-auto">
                  <p className="text-sm text-gray-500">Certificate ID</p>
                  <p className="font-mono text-xs">
                    {course.id}-{Date.now().toString().substring(0, 10)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Download Certificate
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Certificate
          </Button>
        </div>
      </div>
    </div>
  )
}
