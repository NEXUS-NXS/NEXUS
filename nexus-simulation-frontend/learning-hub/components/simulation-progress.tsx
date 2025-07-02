"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, CheckCircle } from "lucide-react"

interface SimulationProgressProps {
  sessionId: string
  startTime?: Date
}

export function SimulationProgress({ sessionId, startTime }: SimulationProgressProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Starting...")
  const [status, setStatus] = useState<"validating" | "running" | "completed" | "failed">("running")

  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws"
    const wsUrl = `${protocol}://${window.location.host}/ws/simulation/${sessionId}/`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected to:", wsUrl)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.progress !== undefined) setProgress(data.progress)
      if (data.current_step) setCurrentStep(data.current_step)
      if (data.status) setStatus(data.status)
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
    }

    ws.onerror = (e) => {
      console.error("WebSocket error", e)
    }

    return () => {
      ws.close()
    }
  }, [sessionId])

  const getElapsedTime = () => {
    if (!startTime) return "0s"
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
    return elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
  }

  const getEstimatedTimeRemaining = () => {
    if (!startTime || progress === 0) return "Calculating..."
    const elapsed = (Date.now() - startTime.getTime()) / 1000
    const rate = progress / elapsed
    const remaining = Math.max(0, (100 - progress) / rate)
    return remaining < 60 ? `${Math.ceil(remaining)}s` : `${Math.ceil(remaining / 60)}m`
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-blue-900">
            {status === "validating" ? (
              <Zap className="mr-2 h-5 w-5 text-yellow-600" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
            )}
            {status === "validating"
              ? "Validating Model"
              : status === "completed"
              ? "Simulation Completed"
              : status === "failed"
              ? "Simulation Failed"
              : "Running Simulation"}
          </CardTitle>
          <Badge variant={status === "validating" ? "secondary" : "default"}>{progress}% Complete</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-blue-900">{currentStep}</span>
            <span className="text-blue-700">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-blue-700">
            <Clock className="mr-2 h-4 w-4" />
            <span>Elapsed: {getElapsedTime()}</span>
          </div>
          <div className="flex items-center text-blue-700">
            <Clock className="mr-2 h-4 w-4" />
            <span>Remaining: {getEstimatedTimeRemaining()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { step: "Validate", threshold: 25 },
            { step: "Initialize", threshold: 35 },
            { step: "Execute", threshold: 85 },
            { step: "Results", threshold: 100 },
          ].map(({ step, threshold }) => (
            <div key={step} className="text-center">
              <div
                className={`w-full h-2 rounded-full mb-1 ${progress >= threshold ? "bg-blue-600" : "bg-gray-200"}`}
              />
              <span
                className={`text-xs ${progress >= threshold ? "text-blue-900 font-medium" : "text-gray-500"}`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}