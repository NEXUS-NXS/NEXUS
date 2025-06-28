import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Module } from "@/lib/courses"
import { FileText } from "lucide-react"
import Link from "next/link"

interface ModuleAccordionProps {
  modules: Module[]
  courseId: string
}

export default function ModuleAccordion({ modules, courseId }: ModuleAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {modules.map((module, index) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center text-left">
              <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium">{module.title}</h3>
                <p className="text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-11 space-y-4">
              <p className="text-gray-600">{module.content}</p>

              <div className="space-y-3">
                {module.quizzes.map((quiz) => (
                  <Card key={quiz.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">Quiz: {quiz.question.substring(0, 30)}...</span>
                    </div>
                    <Link href={`/courses/${courseId}/modules/${module.id}/quizzes/${quiz.id}`} passHref>
                      <Button size="sm" variant="ghost">
                        Take Quiz
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>

              <Link href={`/courses/${courseId}/modules/${module.id}`} passHref>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Start Module</Button>
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
