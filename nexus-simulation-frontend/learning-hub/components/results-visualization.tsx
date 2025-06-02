"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Share2, Maximize2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ResultsVisualizationProps {
  results: any
  parameters: any
}

export function ResultsVisualization({ results, parameters }: ResultsVisualizationProps) {
  const { summary, timeSeries, histogram, riskMetrics } = results

  const riskColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expected Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(summary.mean / 1000).toFixed(0)}k</div>
            <p className="text-xs text-gray-500">
              {((summary.mean / parameters.initial_value - 1) * 100).toFixed(1)}% total return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Value at Risk (95%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${(summary.var95 / 1000).toFixed(0)}k</div>
            <p className="text-xs text-gray-500">
              ${((parameters.initial_value - summary.var95) / 1000).toFixed(0)}k potential loss
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {((summary.stdDev / summary.mean) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">Coefficient of variation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Probability of Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{(summary.probLoss * 100).toFixed(1)}%</div>
            <p className="text-xs text-gray-500">Chance of losing money</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Visualizations */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="timeseries">Time Series</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Maximize2 className="mr-2 h-4 w-4" />
              Fullscreen
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Chart
            </Button>
          </div>
        </div>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Value Distribution</CardTitle>
              <CardDescription>
                Distribution of final portfolio values after {parameters.time_horizon} years
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogram}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => [value, "Frequency"]}
                      labelFormatter={(label) => `Portfolio Value: $${label}`}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeseries">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Value Paths</CardTitle>
              <CardDescription>Sample simulation paths showing portfolio evolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      domain={[0, parameters.time_horizon]}
                      label={{ value: "Years", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: any) => [`$${(value / 1000).toFixed(0)}k`, ""]}
                      labelFormatter={(label) => `Year: ${Number(label).toFixed(1)}`}
                    />

                    {/* Initial value line */}
                    <Line
                      data={[
                        { time: 0, value: parameters.initial_value },
                        { time: parameters.time_horizon, value: parameters.initial_value },
                      ]}
                      type="monotone"
                      dataKey="value"
                      stroke="#9ca3af"
                      strokeDasharray="5 5"
                      dot={false}
                    />

                    {/* Sample paths */}
                    {timeSeries.slice(0, 10).map((path: any, index: number) => (
                      <Line
                        key={index}
                        data={path}
                        type="monotone"
                        dataKey="value"
                        stroke={index < 3 ? ["#ef4444", "#3b82f6", "#10b981"][index] : "#d1d5db"}
                        strokeWidth={index < 3 ? 2 : 1}
                        dot={false}
                        opacity={index < 3 ? 1 : 0.3}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Key risk indicators for the portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Sharpe Ratio", value: riskMetrics.sharpeRatio.toFixed(2), color: "text-green-600" },
                  {
                    label: "Maximum Drawdown",
                    value: `${(riskMetrics.maxDrawdown * 100).toFixed(1)}%`,
                    color: "text-red-600",
                  },
                  {
                    label: "Volatility",
                    value: `${(riskMetrics.volatility * 100).toFixed(1)}%`,
                    color: "text-orange-600",
                  },
                  { label: "Beta", value: riskMetrics.beta.toFixed(2), color: "text-blue-600" },
                ].map((metric) => (
                  <div key={metric.label} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className={`text-lg font-bold ${metric.color}`}>{metric.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Probability of different outcome ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Large Loss (>20%)", value: 5, color: "#ef4444" },
                          { name: "Small Loss (0-20%)", value: 15, color: "#f97316" },
                          { name: "Small Gain (0-20%)", value: 35, color: "#eab308" },
                          { name: "Good Gain (20-50%)", value: 30, color: "#22c55e" },
                          { name: "Excellent (>50%)", value: 15, color: "#3b82f6" },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {riskColors.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Descriptive Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Mean", value: `$${(summary.mean / 1000).toFixed(0)}k` },
                    { label: "Median", value: `$${(summary.median / 1000).toFixed(0)}k` },
                    { label: "Standard Deviation", value: `$${(summary.stdDev / 1000).toFixed(0)}k` },
                    { label: "Minimum", value: `$${(summary.min / 1000).toFixed(0)}k` },
                    { label: "Maximum", value: `$${(summary.max / 1000).toFixed(0)}k` },
                    { label: "VaR (99%)", value: `$${(summary.var99 / 1000).toFixed(0)}k` },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between">
                      <span className="text-sm">{stat.label}</span>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simulation Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Initial Value", value: `$${(parameters.initial_value / 1000).toFixed(0)}k` },
                    { label: "Expected Return", value: `${(parameters.growth_rate * 100).toFixed(1)}%` },
                    { label: "Volatility", value: `${(parameters.volatility * 100).toFixed(1)}%` },
                    { label: "Time Horizon", value: `${parameters.time_horizon} years` },
                    { label: "Simulations", value: parameters.simulations.toLocaleString() },
                    { label: "Confidence Level", value: `${(parameters.confidence_level * 100).toFixed(0)}%` },
                  ].map((param) => (
                    <div key={param.label} className="flex justify-between">
                      <span className="text-sm">{param.label}</span>
                      <span className="font-medium">{param.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Results</CardTitle>
          <CardDescription>Download your simulation results in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              PDF Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Excel Data
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSV Results
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
