"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle, Play } from "lucide-react"

interface ValidationPanelProps {
  modelData: any
  validationResults: { errors: string[]; warnings: string[] }
  onValidate: () => void
}

export function ValidationPanel({ modelData, validationResults, onValidate }: ValidationPanelProps) {
  const { errors, warnings } = validationResults

  const categoryRules = {
    actuarial: [
      "Must include mortality or morbidity calculations",
      "Should use appropriate discount rates",
      "Must validate age ranges and demographics",
    ],
    financial: [
      "Must include risk metrics calculations",
      "Should validate market data inputs",
      "Must handle negative returns appropriately",
    ],
    climate: [
      "Must include geographic or temporal data",
      "Should validate climate scenarios",
      "Must handle uncertainty quantification",
    ],
  }

  const getCurrentRules = () => {
    return categoryRules[modelData.category] || ["General validation rules apply"]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Validation</CardTitle>
          <CardDescription>Validate your model against category-specific rules and requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Validation Status</h4>
              <p className="text-sm text-gray-500">
                {errors.length === 0 ? "Model passes all validation checks" : `${errors.length} errors found`}
              </p>
            </div>
            <Button onClick={onValidate}>
              <Play className="mr-2 h-4 w-4" />
              Run Validation
            </Button>
          </div>

          {/* Validation Results */}
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <Alert key={`error-${index}`} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {errors.length === 0 && warnings.length === 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All validations passed. Model is ready to run.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Category Rules */}
      {modelData.category && (
        <Card>
          <CardHeader>
            <CardTitle>Category Requirements</CardTitle>
            <CardDescription>Specific rules and requirements for {modelData.category} models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getCurrentRules().map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{rule}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
