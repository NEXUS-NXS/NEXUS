"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Save, Download, Users } from "lucide-react"

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [collaborators, setCollaborators] = useState([
    { name: "Alice Chen", color: "bg-blue-500", active: true },
    { name: "Bob Smith", color: "bg-green-500", active: false },
  ])

  const getLanguageTemplate = (lang: string) => {
    switch (lang) {
      case "python":
        return `# Python Simulation Model
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def simulate_model(parameters):
    """
    Main simulation function
    
    Parameters:
    - parameters: dict containing model inputs
    
    Returns:
    - results: dict containing simulation outputs
    """
    
    # Your simulation logic here
    results = {
        'summary': {},
        'data': pd.DataFrame(),
        'charts': []
    }
    
    return results

# Example usage
if __name__ == "__main__":
    params = {
        'initial_value': 100000,
        'growth_rate': 0.05,
        'volatility': 0.15,
        'time_horizon': 10
    }
    
    results = simulate_model(params)
    print("Simulation completed successfully!")
`
      case "r":
        return `# R Simulation Model
library(ggplot2)
library(dplyr)

simulate_model <- function(parameters) {
  # Main simulation function
  #
  # Parameters:
  # - parameters: list containing model inputs
  #
  # Returns:
  # - results: list containing simulation outputs
  
  # Your simulation logic here
  results <- list(
    summary = list(),
    data = data.frame(),
    charts = list()
  )
  
  return(results)
}

# Example usage
params <- list(
  initial_value = 100000,
  growth_rate = 0.05,
  volatility = 0.15,
  time_horizon = 10
)

results <- simulate_model(params)
print("Simulation completed successfully!")
`
      case "fel":
        return `// Fast Expression Language Model
// Define your simulation logic using FEL syntax

model SimulationModel {
  // Input parameters
  input initial_value: number = 100000
  input growth_rate: number = 0.05
  input volatility: number = 0.15
  input time_horizon: number = 10
  
  // Simulation logic
  function simulate() {
    let results = {}
    
    // Your simulation calculations here
    for (let t = 0; t < time_horizon; t++) {
      // Simulation step
    }
    
    return results
  }
  
  // Output definitions
  output summary: object
  output data: array
  output charts: array
}
`
      default:
        return "// Select a programming language to get started"
    }
  }

  useEffect(() => {
    if (!value && language) {
      onChange(getLanguageTemplate(language))
    }
  }, [language])

  return (
    <div className="space-y-4">
      {/* Collaboration Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Collaborators:</span>
          {collaborators.map((collab, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${collab.color}`}></div>
              <span className="text-xs">{collab.name}</span>
              {collab.active && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Save className="mr-1 h-3 w-3" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Play className="mr-1 h-3 w-3" />
            Test
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gray-900 text-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{language.toUpperCase()}</Badge>
              <span className="text-sm text-gray-400">
                model.{language === "python" ? "py" : language === "r" ? "R" : "fel"}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-96 bg-transparent border-none outline-none resize-none font-mono text-sm"
            placeholder={`Write your ${language} code here...`}
            spellCheck={false}
          />
        </div>
      </Card>

      {/* Syntax Validation */}
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700">Syntax validation passed</span>
        </div>
        <Badge variant="outline" className="text-green-700 border-green-300">
          Ready to run
        </Badge>
      </div>
    </div>
  )
}
