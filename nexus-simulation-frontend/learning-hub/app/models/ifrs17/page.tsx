"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calculator, Download, Info } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface IFRS17Inputs {
  premiums: number
  expectedClaims: number
  expenses: number
  discountRate: number
  riskAdjustment: number
  contractTerm: number
}

export default function IFRS17Page() {
  const [inputs, setInputs] = useState<IFRS17Inputs>({
    premiums: 1000000,
    expectedClaims: 750000,
    expenses: 150000,
    discountRate: 3.5,
    riskAdjustment: 5,
    contractTerm: 10,
  })

  const [results, setResults] = useState<any>(null)

  const calculateIFRS17 = () => {
    const { premiums, expectedClaims, expenses, discountRate, riskAdjustment, contractTerm } = inputs

    // Calculate present value of cash flows
    const totalCashOutflows = expectedClaims + expenses
    const discountFactor = Math.pow(1 + discountRate / 100, -contractTerm / 2) // Simplified
    const pvCashOutflows = totalCashOutflows * discountFactor

    // Risk adjustment calculation
    const riskAdjustmentAmount = (pvCashOutflows * riskAdjustment) / 100

    // Contractual Service Margin (CSM)
    const csm = Math.max(0, premiums - pvCashOutflows - riskAdjustmentAmount)

    // Liability for remaining coverage
    const lrc = pvCashOutflows + riskAdjustmentAmount + csm

    // Generate profit recognition pattern
    const profitPattern = []
    for (let year = 1; year <= contractTerm; year++) {
      const csmRelease = csm / contractTerm
      const cumulativeProfit = (csmRelease * year) / 1000 // Convert to thousands
      profitPattern.push({
        year,
        csmRelease: csmRelease / 1000,
        cumulativeProfit,
        remainingCSM: (csm - csmRelease * year) / 1000,
      })
    }

    setResults({
      pvCashOutflows: pvCashOutflows / 1000,
      riskAdjustmentAmount: riskAdjustmentAmount / 1000,
      csm: csm / 1000,
      lrc: lrc / 1000,
      profitMargin: ((csm / premiums) * 100).toFixed(2),
      profitPattern,
    })
  }

  const handleInputChange = (field: keyof IFRS17Inputs, value: string) => {
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
              <h1 className="text-3xl font-bold">IFRS 17 Insurance Contracts</h1>
              <p className="text-gray-500 mt-1">
                Calculate present values, risk adjustments, and contractual service margins
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800">Advanced Model</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Model Inputs
                </CardTitle>
                <CardDescription>Enter your contract parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="premiums">Total Premiums ($)</Label>
                  <Input
                    id="premiums"
                    type="number"
                    value={inputs.premiums}
                    onChange={(e) => handleInputChange("premiums", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedClaims">Expected Claims ($)</Label>
                  <Input
                    id="expectedClaims"
                    type="number"
                    value={inputs.expectedClaims}
                    onChange={(e) => handleInputChange("expectedClaims", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="expenses">Expenses ($)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    value={inputs.expenses}
                    onChange={(e) => handleInputChange("expenses", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="discountRate">Discount Rate (%)</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    step="0.1"
                    value={inputs.discountRate}
                    onChange={(e) => handleInputChange("discountRate", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="riskAdjustment">Risk Adjustment (%)</Label>
                  <Input
                    id="riskAdjustment"
                    type="number"
                    step="0.1"
                    value={inputs.riskAdjustment}
                    onChange={(e) => handleInputChange("riskAdjustment", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="contractTerm">Contract Term (years)</Label>
                  <Input
                    id="contractTerm"
                    type="number"
                    value={inputs.contractTerm}
                    onChange={(e) => handleInputChange("contractTerm", e.target.value)}
                  />
                </div>

                <Button onClick={calculateIFRS17} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Calculate IFRS 17 Metrics
                </Button>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  About IFRS 17
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>IFRS 17</strong> is the international accounting standard for insurance contracts that
                  provides a comprehensive framework for recognition, measurement, and disclosure.
                </p>
                <p>
                  <strong>Key Components:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Present Value of Future Cash Flows</li>
                  <li>Risk Adjustment for Non-Financial Risk</li>
                  <li>Contractual Service Margin (CSM)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {results ? (
              <Tabs defaultValue="summary">
                <TabsList className="mb-6">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="profit-pattern">Profit Pattern</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Liability for Remaining Coverage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">${results.lrc.toFixed(0)}k</div>
                        <p className="text-sm text-gray-500">Total liability under IFRS 17</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contractual Service Margin</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">${results.csm.toFixed(0)}k</div>
                        <p className="text-sm text-gray-500">Expected future profit</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Adjustment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-600">
                          ${results.riskAdjustmentAmount.toFixed(0)}k
                        </div>
                        <p className="text-sm text-gray-500">Compensation for uncertainty</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Profit Margin</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{results.profitMargin}%</div>
                        <p className="text-sm text-gray-500">CSM as % of premiums</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="profit-pattern">
                  <Card>
                    <CardHeader>
                      <CardTitle>CSM Release Pattern</CardTitle>
                      <CardDescription>How profit is recognized over the contract term</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={results.profitPattern}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => [`$${value}k`, ""]} />
                            <Line
                              type="monotone"
                              dataKey="cumulativeProfit"
                              stroke="#10b981"
                              strokeWidth={2}
                              name="Cumulative Profit"
                            />
                            <Line
                              type="monotone"
                              dataKey="remainingCSM"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              name="Remaining CSM"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="components">
                  <Card>
                    <CardHeader>
                      <CardTitle>IFRS 17 Components Breakdown</CardTitle>
                      <CardDescription>Visual breakdown of liability components</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: "PV Cash Outflows",
                                value: results.pvCashOutflows,
                                fill: "#ef4444",
                              },
                              {
                                name: "Risk Adjustment",
                                value: results.riskAdjustmentAmount,
                                fill: "#f97316",
                              },
                              {
                                name: "CSM",
                                value: results.csm,
                                fill: "#10b981",
                              },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => [`$${value}k`, ""]} />
                            <Bar dataKey="value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Calculate</h3>
                  <p className="text-gray-500">
                    Enter your contract parameters and click calculate to see IFRS 17 results
                  </p>
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
