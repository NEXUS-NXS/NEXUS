"use client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"

interface ValidationPanelProps {
  errors: string[]
  warnings: string[]
}

export function ValidationPanel({ errors, warnings }: ValidationPanelProps) {
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">All validations passed. Model is ready to run.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mb-6 space-y-3">
      {errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}

      {warnings.map((warning, index) => (
        <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
