"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HistogramChartProps {
  data: { bin: string; count: number }[]
}

export function HistogramChart({ data }: HistogramChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  )
}
