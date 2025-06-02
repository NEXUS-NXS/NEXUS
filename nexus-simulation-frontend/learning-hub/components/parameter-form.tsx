"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, Upload } from "lucide-react"

interface ParameterFormProps {
  parameters: any
  onChange: (parameters: any) => void
  disabled?: boolean
}

export function ParameterForm({ parameters, onChange, disabled = false }: ParameterFormProps) {
  const updateParameter = (key: string, value: any) => {
    onChange({ ...parameters, [key]: value })
  }

  const resetToDefaults = () => {
    onChange({
      initial_value: 100000,
      growth_rate: 0.08,
      volatility: 0.15,
      time_horizon: 10,
      simulations: 10000,
      confidence_level: 0.95,
    })
  }

  const parameterGroups = [
    {
      title: "Portfolio Settings",
      description: "Basic portfolio configuration",
      parameters: [
        {
          key: "initial_value",
          label: "Initial Portfolio Value",
          type: "currency",
          min: 1000,
          max: 10000000,
          step: 1000,
          description: "Starting value of the investment portfolio",
        },
        {
          key: "growth_rate",
          label: "Expected Annual Return",
          type: "percentage",
          min: -0.5,
          max: 0.5,
          step: 0.001,
          description: "Expected annual return rate (as decimal)",
        },
        {
          key: "volatility",
          label: "Annual Volatility",
          type: "percentage",
          min: 0.01,
          max: 1.0,
          step: 0.001,
          description: "Standard deviation of annual returns",
        },
      ],
    },
    {
      title: "Simulation Parameters",
      description: "Monte Carlo simulation settings",
      parameters: [
        {
          key: "time_horizon",
          label: "Time Horizon (Years)",
          type: "number",
          min: 1,
          max: 50,
          step: 1,
          description: "Investment time period in years",
        },
        {
          key: "simulations",
          label: "Number of Simulations",
          type: "number",
          min: 1000,
          max: 100000,
          step: 1000,
          description: "Number of Monte Carlo iterations",
        },
        {
          key: "confidence_level",
          label: "Confidence Level",
          type: "percentage",
          min: 0.8,
          max: 0.99,
          step: 0.01,
          description: "Confidence level for VaR calculations",
        },
      ],
    },
  ]

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(
          value,
        )
      case "percentage":
        return `${(value * 100).toFixed(1)}%`
      default:
        return value.toLocaleString()
    }
  }

  return (
    <div className="space-y-6">
      {parameterGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {group.parameters.map((param) => (
              <div key={param.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={param.key} className="text-sm font-medium">
                    {param.label}
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    {formatValue(parameters[param.key], param.type)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Slider
                    id={param.key}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={[parameters[param.key]]}
                    onValueChange={(value) => updateParameter(param.key, value[0])}
                    disabled={disabled}
                    className="w-full"
                  />

                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={parameters[param.key]}
                      onChange={(e) => updateParameter(param.key, Number(e.target.value))}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      disabled={disabled}
                      className="w-32"
                    />
                    <span className="text-xs text-gray-500 flex-1">{param.description}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Parameter Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Parameter Management</h4>
              <p className="text-xs text-gray-500">Save, load, or reset parameter configurations</p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults} disabled={disabled}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" disabled={disabled}>
                <Upload className="mr-2 h-4 w-4" />
                Load
              </Button>
              <Button variant="outline" size="sm" disabled={disabled}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
