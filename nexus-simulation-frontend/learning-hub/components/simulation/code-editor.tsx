"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Users, Code, FileText, Zap } from "lucide-react"

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  category: string
}

export function CodeEditor({ language, value, onChange, category }: CodeEditorProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [syntaxValid, setSyntaxValid] = useState(true)

  const validateSyntax = () => {
    setIsValidating(true)
    // Mock syntax validation
    setTimeout(() => {
      setSyntaxValid(true)
      setIsValidating(false)
    }, 1000)
  }

  const getLanguageFeatures = (lang: string) => {
    const features = {
      python: {
        icon: "🐍",
        syntax: "Python 3.9+",
        libraries: ["numpy", "pandas", "scipy", "matplotlib", "scikit-learn"],
        execution: "Sandboxed Python environment",
      },
      r: {
        icon: "📈",
        syntax: "R 4.0+",
        libraries: ["dplyr", "ggplot2", "tidyr", "forecast", "caret"],
        execution: "Sandboxed R environment",
      },
      fel: {
        icon: "⚡",
        syntax: "Fast Expression Language",
        libraries: ["Built-in math functions", "Statistical functions", "Financial functions"],
        execution: "Native FEL interpreter",
      },
    }
    return features[lang] || features.python
  }

  const features = getLanguageFeatures(language)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Code Editor - {features.icon} {language.toUpperCase()}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={validateSyntax} disabled={isValidating}>
                {isValidating ? <Zap className="mr-1 h-3 w-3 animate-spin" /> : <FileText className="mr-1 h-3 w-3" />}
                Validate
              </Button>
              <Button variant="outline" size="sm">
                <Save className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="editor">
            <TabsList className="mb-4">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <div className="space-y-4">
                {/* Collaboration Bar */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Live Collaboration</span>
                    <Badge variant="secondary">1 user editing</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      variant="outline"
                      className={syntaxValid ? "border-green-500 text-green-700" : "border-red-500 text-red-700"}
                    >
                      {syntaxValid ? "✓ Syntax Valid" : "✗ Syntax Error"}
                    </Badge>
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
                      <div className="text-xs text-gray-400">{features.execution}</div>
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
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    syntaxValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${syntaxValid ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={`text-sm ${syntaxValid ? "text-green-700" : "text-red-700"}`}>
                      {syntaxValid ? "Code syntax is valid" : "Syntax errors detected"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={syntaxValid ? "text-green-700 border-green-300" : "text-red-700 border-red-300"}
                  >
                    {syntaxValid ? "Ready to run" : "Needs fixing"}
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template">
              <Card>
                <CardHeader>
                  <CardTitle>Code Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">Basic {category} Model</h4>
                      <p className="text-sm text-gray-500 mt-1">Standard template for {category} simulations</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium">Advanced Template</h4>
                      <p className="text-sm text-gray-500 mt-1">Template with advanced features and validation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="docs">
              <Card>
                <CardHeader>
                  <CardTitle>{language.toUpperCase()} Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Available Libraries</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {features.libraries.map((lib, index) => (
                          <Badge key={index} variant="outline">
                            {lib}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Syntax Highlighting</h4>
                      <p className="text-sm text-gray-600">{features.syntax}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Execution Environment</h4>
                      <p className="text-sm text-gray-600">{features.execution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
