"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Settings } from "lucide-react"

interface Parameter {
  id: string
  name: string
  type: string
  defaultValue: any
  min?: number
  max?: number
  description: string
  required: boolean
}

interface ParameterBuilderProps {
  parameters: Parameter[]
  onChange: (parameters: Parameter[]) => void
}

export function ParameterBuilder({ parameters, onChange }: ParameterBuilderProps) {
  const [editingParam, setEditingParam] = useState<Parameter | null>(null)

  const addParameter = () => {
    const newParam: Parameter = {
      id: `param_${Date.now()}`,
      name: "",
      type: "number",
      defaultValue: 0,
      description: "",
      required: true,
    }
    setEditingParam(newParam)
  }

  const saveParameter = (param: Parameter) => {
    const existingIndex = parameters.findIndex((p) => p.id === param.id)
    if (existingIndex >= 0) {
      const updated = [...parameters]
      updated[existingIndex] = param
      onChange(updated)
    } else {
      onChange([...parameters, param])
    }
    setEditingParam(null)
  }

  const deleteParameter = (id: string) => {
    onChange(parameters.filter((p) => p.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Model Parameters</CardTitle>
          <Button onClick={addParameter} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Parameter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {parameters.map((param) => (
            <Card key={param.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{param.name}</span>
                    <Badge variant="outline">{param.type}</Badge>
                    {param.required && <Badge variant="secondary">Required</Badge>}
                  </div>
                  <p className="text-sm text-gray-500">{param.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Default: {param.defaultValue}
                    {param.min !== undefined && param.max !== undefined && ` (Range: ${param.min} - ${param.max})`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingParam(param)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteParameter(param.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {parameters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No parameters defined yet</p>
              <p className="text-sm">Add parameters to make your model configurable</p>
            </div>
          )}
        </div>

        {/* Parameter Editor Modal */}
        {editingParam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>{parameters.find((p) => p.id === editingParam.id) ? "Edit" : "Add"} Parameter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="param-name">Parameter Name</Label>
                  <Input
                    id="param-name"
                    value={editingParam.name}
                    onChange={(e) => setEditingParam({ ...editingParam, name: e.target.value })}
                    placeholder="e.g., interest_rate"
                  />
                </div>

                <div>
                  <Label htmlFor="param-type">Type</Label>
                  <Select
                    value={editingParam.type}
                    onValueChange={(value) => setEditingParam({ ...editingParam, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="array">Array</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="param-default">Default Value</Label>
                  <Input
                    id="param-default"
                    value={editingParam.defaultValue}
                    onChange={(e) => setEditingParam({ ...editingParam, defaultValue: e.target.value })}
                    placeholder="Default value"
                  />
                </div>

                <div>
                  <Label htmlFor="param-description">Description</Label>
                  <Input
                    id="param-description"
                    value={editingParam.description}
                    onChange={(e) => setEditingParam({ ...editingParam, description: e.target.value })}
                    placeholder="Describe this parameter"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingParam(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => saveParameter(editingParam)}>Save Parameter</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
