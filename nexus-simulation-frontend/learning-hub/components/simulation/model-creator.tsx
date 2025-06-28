"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, Code, Settings, Database, FileText } from "lucide-react"
import { CodeEditor } from "@/components/simulation/code-editor"
import { ParameterBuilder } from "@/components/simulation/parameter-builder"
import { ValidationPanel } from "@/components/simulation/validation-panel"

interface ModelCreatorProps {
  categories: any[]
  languages: any[]
  onModelCreated: (model: any) => void
}

export function ModelCreator({ categories, languages, onModelCreated }: ModelCreatorProps) {
  const [modelData, setModelData] = useState({
    title: "",
    description: "",
    category: "",
    language: "python",
    code: "",
    parameters: [],
    datasets: [],
    isPublic: true,
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [validationResults, setValidationResults] = useState({ errors: [], warnings: [] })

  const handleSave = () => {
    const newModel = {
      id: `model_${Date.now()}`,
      ...modelData,
      author: "Current User",
      lastModified: new Date().toISOString().split("T")[0],
      collaborators: 1,
      runs: 0,
      rating: 0,
    }
    onModelCreated(newModel)
  }

  const handleValidate = () => {
    // Mock validation logic
    const errors = []
    const warnings = []

    if (!modelData.title) errors.push("Model title is required")
    if (!modelData.category) errors.push("Model category is required")
    if (!modelData.code) errors.push("Model code is required")

    if (modelData.category === "actuarial" && !modelData.datasets.some((d) => d.includes("mortality"))) {
      warnings.push("Actuarial models typically require mortality tables")
    }

    setValidationResults({ errors, warnings })
  }

  const getCodeTemplate = (language: string, category: string) => {
    const templates = {
      python: {
        actuarial: `# Actuarial Model Template
import numpy as np
import pandas as pd
from scipy import stats

def actuarial_simulation(mortality_table, interest_rate, policy_data):
    """
    Actuarial simulation function
    
    Parameters:
    - mortality_table: DataFrame with age and mortality rates
    - interest_rate: Annual interest rate
    - policy_data: DataFrame with policy information
    
    Returns:
    - results: Dictionary with simulation results
    """
    
    # Your actuarial calculations here
    results = {
        'present_value': 0,
        'reserves': 0,
        'profit_margin': 0
    }
    
    return results`,
        financial: `# Financial Model Template
import numpy as np
import pandas as pd
from scipy.optimize import minimize

def financial_simulation(initial_portfolio, returns_data, risk_params):
    """
    Financial simulation function
    
    Parameters:
    - initial_portfolio: Initial portfolio value
    - returns_data: Historical returns data
    - risk_params: Risk parameters dictionary
    
    Returns:
    - results: Dictionary with simulation results
    """
    
    # Your financial calculations here
    results = {
        'expected_return': 0,
        'volatility': 0,
        'var_95': 0,
        'sharpe_ratio': 0
    }
    
    return results`,
      },
      r: {
        actuarial: `# Actuarial Model Template in R
library(dplyr)
library(ggplot2)

actuarial_simulation <- function(mortality_table, interest_rate, policy_data) {
  # Actuarial simulation function
  #
  # Parameters:
  # - mortality_table: Data frame with age and mortality rates
  # - interest_rate: Annual interest rate
  # - policy_data: Data frame with policy information
  #
  # Returns:
  # - results: List with simulation results
  
  # Your actuarial calculations here
  results <- list(
    present_value = 0,
    reserves = 0,
    profit_margin = 0
  )
  
  return(results)
}`,
      },
      fel: {
        actuarial: `// Fast Expression Language - Actuarial Model
model ActuarialSimulation {
  // Input parameters
  input mortality_rate: number = 0.01
  input interest_rate: number = 0.03
  input policy_amount: number = 100000
  input policy_term: number = 20
  
  // Calculations
  function calculate_present_value() {
    let pv = 0
    for (let year = 1; year <= policy_term; year++) {
      let survival_prob = pow(1 - mortality_rate, year)
      let discount_factor = pow(1 + interest_rate, -year)
      pv += policy_amount * survival_prob * discount_factor
    }
    return pv
  }
  
  // Outputs
  output present_value: number = calculate_present_value()
  output annual_premium: number = present_value / policy_term
}`,
      },
    }

    return templates[language]?.[category] || `// ${language} template for ${category} model\n// Start coding here...`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Simulation Model</CardTitle>
          <CardDescription>Build a custom simulation model with collaborative features and validation</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="basic">
            <Settings className="mr-2 h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="mr-2 h-4 w-4" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="parameters">
            <Settings className="mr-2 h-4 w-4" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="datasets">
            <Database className="mr-2 h-4 w-4" />
            Datasets
          </TabsTrigger>
          <TabsTrigger value="validation">
            <FileText className="mr-2 h-4 w-4" />
            Validation
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Model Information</CardTitle>
                  <CardDescription>Define the basic properties of your simulation model</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Model Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter model title..."
                        value={modelData.title}
                        onChange={(e) => setModelData((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={modelData.category}
                        onValueChange={(value) => {
                          setModelData((prev) => ({
                            ...prev,
                            category: value,
                            code: getCodeTemplate(prev.language, value),
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your model does..."
                      value={modelData.description}
                      onChange={(e) => setModelData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Programming Language</Label>
                      <Select
                        value={modelData.language}
                        onValueChange={(value) => {
                          setModelData((prev) => ({
                            ...prev,
                            language: value,
                            code: getCodeTemplate(value, prev.category),
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.id} value={language.id}>
                              {language.icon} {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={modelData.isPublic}
                          onChange={(e) => setModelData((prev) => ({ ...prev, isPublic: e.target.checked }))}
                        />
                        <Label htmlFor="isPublic">Make model public</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code">
              <CodeEditor
                language={modelData.language}
                value={modelData.code}
                onChange={(code) => setModelData((prev) => ({ ...prev, code }))}
                category={modelData.category}
              />
            </TabsContent>

            <TabsContent value="parameters">
              <ParameterBuilder
                parameters={modelData.parameters}
                onChange={(parameters) => setModelData((prev) => ({ ...prev, parameters }))}
              />
            </TabsContent>

            <TabsContent value="datasets">
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Requirements</CardTitle>
                  <CardDescription>Specify the datasets your model requires</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Define the datasets your model needs. Users will be able to upload their own data or use preloaded
                      datasets.
                    </div>

                    {/* Dataset requirements would go here */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Dataset Configuration</h3>
                      <p className="text-gray-500">Configure required datasets for your model</p>
                      <Button className="mt-4">Add Dataset Requirement</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validation">
              <ValidationPanel
                modelData={modelData}
                validationResults={validationResults}
                onValidate={handleValidate}
              />
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Model Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Basic Info</span>
                    <Badge variant={modelData.title && modelData.category ? "default" : "secondary"}>
                      {modelData.title && modelData.category ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Code</span>
                    <Badge variant={modelData.code ? "default" : "secondary"}>
                      {modelData.code ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Parameters</span>
                    <Badge variant={modelData.parameters.length > 0 ? "default" : "secondary"}>
                      {modelData.parameters.length > 0 ? "Complete" : "Optional"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Validation</span>
                    <Badge variant={validationResults.errors.length === 0 ? "default" : "destructive"}>
                      {validationResults.errors.length === 0 ? "Passed" : "Failed"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    <strong>Language:</strong> {modelData.language || "Not selected"}
                  </p>
                  <p>
                    <strong>Category:</strong> {modelData.category || "Not selected"}
                  </p>
                  <p>
                    <strong>Visibility:</strong> {modelData.isPublic ? "Public" : "Private"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={handleValidate} variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Validate Model
                  </Button>
                  <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
