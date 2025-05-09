"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO } from "date-fns"
import { Loader2 } from "lucide-react"

interface SalesData {
  period: string
  totalQuantity: number
  totalTransactions: number
}

export default function Page() {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("day")

  const { data: salesReport, isLoading } = useQuery({
    queryKey: ["sales-report", period],
    queryFn: async () => {
      const response = await api.get(`/payments/sales-report?period=${period}`)
      return response.data.data as SalesData[]
    }
  })

  const formattedData = salesReport?.map(item => ({
    ...item,
    period: format(parseISO(item.period), period === "day" ? "MMM d" : period === "week" ? "MMM d" : period === "month" ? "MMM" : "yyyy"),
    totalQuantity: Number(item.totalQuantity)
  }))

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

    

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="period"
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      className="text-xs"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Quantity
                                  </span>
                                  <span className="font-bold text-red-500">
                                    {payload[0].value?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Transactions
                                  </span>
                                  <span className="font-bold text-blue-500">
                                    {payload[1].value?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalQuantity"
                      name="Quantity"
                      strokeWidth={2}
                      stroke={"rgb(217, 18, 18)"}
                      activeDot={{
                        r: 4,
                        fill: "rgb(217, 18, 18)"
                      }}
                      className="stroke-primary"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalTransactions"
                      name="Transactions"
                      strokeWidth={2}
                      stroke="#3b82f6"
                      activeDot={{
                        r: 4,
                        fill: "#3b82f6"
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}