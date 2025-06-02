import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Users } from "lucide-react"
import type { Course } from "@/lib/courses"

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
        <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md">
          {course.id === "advanced-excel" && (
            <Image src="/placeholder.svg?text=Excel&width=40&height=40" alt="Excel Logo" width={40} height={40} />
          )}
          {course.id === "python-programming" && (
            <Image src="/placeholder.svg?text=Python&width=40&height=40" alt="Python Logo" width={40} height={40} />
          )}
          {course.id === "artificial-intelligence" && (
            <Image src="/placeholder.svg?text=AI&width=40&height=40" alt="AI Logo" width={40} height={40} />
          )}
          {course.id === "machine-learning" && (
            <Image
              src="/placeholder.svg?text=ML&width=40&height=40"
              alt="Machine Learning Logo"
              width={40}
              height={40}
            />
          )}
          {course.id === "data-science" && (
            <Image src="/placeholder.svg?text=DS&width=40&height=40" alt="Data Science Logo" width={40} height={40} />
          )}
          {course.id === "r-programming" && (
            <Image src="/placeholder.svg?text=R&width=40&height=40" alt="R Logo" width={40} height={40} />
          )}
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <Badge
            variant={
              course.level === "Beginner" ? "default" : course.level === "Intermediate" ? "secondary" : "destructive"
            }
          >
            {course.level}
          </Badge>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} passHref className="w-full">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
