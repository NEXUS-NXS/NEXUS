"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Download, Info, Play } from "lucide-react"
import Link from "next/link"
import { HistogramChart } from "@/components/histogram-chart"
import { TimeSeriesChart } from "@/components/time-series-chart"

interface MonteCarloInputs {
  mean: number
  stdDev: number
  simulations: number
  timeHorizon: number
  initialValue: number
}

interface SimulationResults {
  values: number[]
  statistics: {
    mean: number
    median: number
    stdDev: number
    var95: number
    var99: number
    min: number
    max: number
  }
  histogram: { bin: string; count: number }[]
  timeSeriesData: { time: number; value: number }[][]
}

export default function MonteCarloPage() {
  const [inputs, setInputs] = useState<MonteCarloInputs>({
    mean: 8,
    stdDev: 15,
    simulations: 10000,
    timeHorizon: 1,
    initialValue: 100000,
  })

  const [results, setResults] = useState<SimulationResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const runSimulation = async () => {
    setIsRunning(true)
    setProgress(0)

    // Simulate portfolio returns using normal distribution
    const { mean, stdDev, simulations, timeHorizon, initialValue } = inputs
    const values: number[] = []
    const timeSeriesData: { time: number; value: number }[][] = []

    // Create a batch size to update progress
    const batchSize = Math.max(1, Math.floor(simulations / 100))

    for (let i = 0; i < simulations; i++) {
      // Box-Muller transformation for normal distribution
      const u1 = Math.random()
      const u2 = Math.random()
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

      // Apply mean and standard deviation
      const annualReturn = (mean + stdDev * z) / 100
      const finalValue = initialValue * Math.pow(1 + annualReturn, timeHorizon)
      values.push(finalValue)

      // Generate time series data for a subset of simulations (for performance)
      if (i < 50) {
        // Only store 50 time series for visualization
        const timeSeries = []
        let currentValue = initialValue

        // Generate values at multiple points in time
        const timePoints = 20 // Number of points to plot
        for (let t = 0; t <= timePoints; t++) {
          const timePoint = (t / timePoints) * timeHorizon
          // Generate a new random return for each time point
          const u1t = Math.random()
          const u2t = Math.random()
          const zt = Math.sqrt(-2 * Math.log(u1t)) * Math.cos(2 * Math.PI * u2t)
          const periodReturn = ((mean + stdDev * zt) / 100) * (timePoint / timePoints)
          currentValue = initialValue * Math.pow(1 + periodReturn, timePoint)

          timeSeries.push({
            time: timePoint,
            value: currentValue,
          })
        }
        timeSeriesData.push(timeSeries)
      }

      // Update progress every batch
      if (i % batchSize === 0 || i === simulations - 1) {
        setProgress(Math.min(99, Math.floor((i / simulations) * 100)))
        // Allow UI to update by yielding to the event loop
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }

    // Calculate statistics
    const sortedValues = [...values].sort((a, b) => a - b)
    const mean_result = values.reduce((sum, val) => sum + val, 0) / values.length
    const median = sortedValues[Math.floor(sortedValues.length / 2)]
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean_result, 2), 0) / values.length
    const stdDev_result = Math.sqrt(variance)

    // Value at Risk calculations
    const var95Index = Math.floor(0.05 * sortedValues.length)
    const var99Index = Math.floor(0.01 * sortedValues.length)

    // Create histogram data
    const bins = 20
    const min = Math.min(...values)
    const max = Math.max(...values)
    const binWidth = (max - min) / bins
    const histogram = Array.from({ length: bins }, (_, i) => ({
      bin: `${(min + (i * binWidth) / 1000).toFixed(0)}k`,
      count: 0,
    }))

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1)
      histogram[binIndex].count++
    })

    // Set progress to 100% when done
    setProgress(100)

    setResults({
      values,
      statistics: {
        mean: mean_result,
        median,
        stdDev: stdDev_result,
        var95: sortedValues[var95Index],
        var99: sortedValues[var99Index],
        min: Math.min(...values),
        max: Math.max(...values),
      },
      histogram,
      timeSeriesData,
    })

    // Short delay to show 100% completion
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsRunning(false)
  }

  const handleInputChange = (field: keyof MonteCarloInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/models" passHref>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Models
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Monte Carlo Simulation</h1>
              <p className="text-gray-500 mt-1">Simulate portfolio returns and assess risk under uncertainty</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Risk Management</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Simulation Parameters
                </CardTitle>
                <CardDescription>Configure your Monte Carlo simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="initialValue">Initial Portfolio Value ($)</Label>
                  <Input
                    id="initialValue"
                    type="number"
                    value={inputs.initialValue}
                    onChange={(e) => handleInputChange("initialValue", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="mean">Expected Annual Return (%)</Label>
                  <Input
                    id="mean"
                    type="number"
                    step="0.1"
                    value={inputs.mean}
                    onChange={(e) => handleInputChange("mean", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="stdDev">Annual Volatility (%)</Label>
                  <Input
                    id="stdDev"
                    type="number"
                    step="0.1"
                    value={inputs.stdDev}
                    onChange={(e) => handleInputChange("stdDev", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="timeHorizon">Time Horizon (years)</Label>
                  <Input
                    id="timeHorizon"
                    type="number"
                    step="0.1"
                    value={inputs.timeHorizon}
                    onChange={(e) => handleInputChange("timeHorizon", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="simulations">Number of Simulations</Label>
                  <Input
                    id="simulations"
                    type="number"
                    value={inputs.simulations}
                    onChange={(e) => handleInputChange("simulations", e.target.value)}
                  />
                </div>

                <div>
                  {isRunning ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Running simulation...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={runSimulation} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Play className="mr-2 h-4 w-4" />
                      Run Simulation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  About Monte Carlo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Monte Carlo simulation</strong> uses random sampling to model complex systems and assess risk.
                </p>
                <p>
                  <strong>Key Metrics:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <strong>VaR 95%:</strong> 5% chance of losing more
                  </li>
                  <li>
                    <strong>VaR 99%:</strong> 1% chance of losing more
                  </li>
                  <li>
                    <strong>Expected Value:</strong> Average outcome
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {results ? (
              <Tabs defaultValue="distribution">
                <TabsList className="mb-6">
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                  <TabsTrigger value="time-series">Time Series</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  <TabsTrigger value="risk-metrics">Risk Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="distribution">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Value Distribution</CardTitle>
                      <CardDescription>
                        Distribution of portfolio values after {inputs.timeHorizon} year(s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HistogramChart data={results.histogram} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="time-series">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Value Over Time</CardTitle>
                      <CardDescription>
                        Sample paths showing how portfolio value might evolve over {inputs.timeHorizon} year(s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TimeSeriesChart
                        data={results.timeSeriesData}
                        initialValue={inputs.initialValue}
                        timeHorizon={inputs.timeHorizon}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="statistics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Expected Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                          ${(results.statistics.mean / 1000).toFixed(0)}k
                        </div>
                        <p className="text-sm text-gray-500">Average portfolio value</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Median Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                          ${(results.statistics.median / 1000).toFixed(0)}k
                        </div>
                        <p className="text-sm text-gray-500">50th percentile</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Standard Deviation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-600">
                          ${(results.statistics.stdDev / 1000).toFixed(0)}k
                        </div>
                        <p className="text-sm text-gray-500">Volatility measure</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Range</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-bold text-purple-600">
                          ${(results.statistics.min / 1000).toFixed(0)}k - ${(results.statistics.max / 1000).toFixed(0)}
                          k
                        </div>
                        <p className="text-sm text-gray-500">Min - Max values</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="risk-metrics">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Value at Risk (95%)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                          ${(results.statistics.var95 / 1000).toFixed(0)}k
                        </div>
                        <p className="text-sm text-gray-500">5% chance of portfolio being worth less</p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Potential Loss: </span>
                          <span className="text-red-600">
                            ${((inputs.initialValue - results.statistics.var95) / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Value at Risk (99%)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-700">
                          ${(results.statistics.var99 / 1000).toFixed(0)}k
                        </div>
                        <p className="text-sm text-gray-500">1% chance of portfolio being worth less</p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Potential Loss: </span>
                          <span className="text-red-700">
                            ${((inputs.initialValue - results.statistics.var99) / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Probability of Loss:</span>
                            <span className="font-medium">
                              {(
                                (results.values.filter((v) => v < inputs.initialValue).length / results.values.length) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Probability of 10%+ Loss:</span>
                            <span className="font-medium">
                              {(
                                (results.values.filter((v) => v < inputs.initialValue * 0.9).length /
                                  results.values.length) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Probability of 20%+ Gain:</span>
                            <span className="font-medium text-green-600">
                              {(
                                (results.values.filter((v) => v > inputs.initialValue * 1.2).length /
                                  results.values.length) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Simulate</h3>
                  <p className="text-gray-500">Configure your parameters and run the Monte Carlo simulation</p>
                </div>
              </Card>
            )}

            {results && (
              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="mr-2">
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
