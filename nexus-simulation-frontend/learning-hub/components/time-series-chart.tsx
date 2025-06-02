"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface TimeSeriesChartProps {
  data: { time: number; value: number }[][]
  initialValue: number
  timeHorizon: number
}

export function TimeSeriesChart({ data, initialValue, timeHorizon }: TimeSeriesChartProps) {
  // Prepare data for the chart
  // We need to transform the array of time series into a format suitable for Recharts
  const chartData = []

  // Find the maximum number of time points in any series
  const maxTimePoints = Math.max(...data.map((series) => series.length))

  // For each time point, create an entry in chartData
  for (let i = 0; i < maxTimePoints; i++) {
    const entry: any = { time: 0 }

    // For each series, add its value at this time point
    data.forEach((series, seriesIndex) => {
      if (i < series.length) {
        entry.time = series[i].time
        entry[`series${seriesIndex}`] = series[i].value
      }
    })

    chartData.push(entry)
  }

  // Calculate percentiles for highlighting
  const calculatePercentileAtEnd = (percentile: number) => {
    const endValues = data.map((series) => series[series.length - 1].value).sort((a, b) => a - b)
    const index = Math.floor(percentile * endValues.length)
    return endValues[index]
  }

  const median = calculatePercentileAtEnd(0.5)
  const p90 = calculatePercentileAtEnd(0.9)
  const p10 = calculatePercentileAtEnd(0.1)

  // Find series closest to these percentiles for highlighting
  const findClosestSeries = (target: number) => {
    return data.findIndex((series) => {
      const lastValue = series[series.length - 1].value
      return Math.abs(lastValue - target) === Math.min(...data.map((s) => Math.abs(s[s.length - 1].value - target)))
    })
  }

  const medianSeriesIndex = findClosestSeries(median)
  const p90SeriesIndex = findClosestSeries(p90)
  const p10SeriesIndex = findClosestSeries(p10)

  // Generate colors for the lines
  const getLineColor = (index: number) => {
    if (index === medianSeriesIndex) return "#10b981" // Green for median
    if (index === p90SeriesIndex) return "#3b82f6" // Blue for 90th percentile
    if (index === p10SeriesIndex) return "#ef4444" // Red for 10th percentile
    return "#d1d5db" // Light gray for other lines
  }

  const getLineWidth = (index: number) => {
    if (index === medianSeriesIndex || index === p90SeriesIndex || index === p10SeriesIndex) return 2
    return 1
  }

  const getLineOpacity = (index: number) => {
    if (index === medianSeriesIndex || index === p90SeriesIndex || index === p10SeriesIndex) return 1
    return 0.3
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: "Time (years)", position: "insideBottomRight", offset: -5 }}
            domain={[0, timeHorizon]}
          />
          <YAxis label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value: any) => [`$${(value / 1000).toFixed(0)}k`, ""]}
            labelFormatter={(label) => `Year: ${Number(label).toFixed(1)}`}
          />
          <Legend
            content={() => (
              <div className="flex justify-center mt-2 text-sm">
                <div className="flex items-center mx-2">
                  <div className="w-3 h-3 bg-green-500 mr-1"></div>
                  <span>Median Path</span>
                </div>
                <div className="flex items-center mx-2">
                  <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                  <span>90th Percentile</span>
                </div>
                <div className="flex items-center mx-2">
                  <div className="w-3 h-3 bg-red-500 mr-1"></div>
                  <span>10th Percentile</span>
                </div>
              </div>
            )}
          />

          {/* Initial value marker */}
          <Line
            type="monotone"
            dataKey={() => initialValue}
            stroke="#9ca3af"
            strokeDasharray="5 5"
            name="Initial Value"
            dot={false}
          />

          {/* Draw all the simulation lines */}
          {data.map((_, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`series${index}`}
              stroke={getLineColor(index)}
              strokeWidth={getLineWidth(index)}
              dot={false}
              opacity={getLineOpacity(index)}
              activeDot={
                index === medianSeriesIndex || index === p90SeriesIndex || index === p10SeriesIndex ? { r: 4 } : false
              }
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
