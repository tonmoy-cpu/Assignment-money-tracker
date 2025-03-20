import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, PieChart } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const MonthlyChart = ({ spendings, isDarkMode }) => {
  const [chartType, setChartType] = useState("monthly")

  // Process data for monthly chart
  const monthlyData = spendings.reduce((acc, spending) => {
    const date = new Date(spending.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        expenses: 0,
      }
    }
    acc[monthYear].expenses += Number.parseFloat(spending.amount)
    return acc
  }, {})

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month + " 1")
    const dateB = new Date(b.month + " 1")
    return dateA.getTime() - dateB.getTime()
  })

  // Process data for category chart
  const categoryData = spendings.reduce((acc, spending) => {
    const category = spending.category
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
      }
    }
    acc[category].value += Number.parseFloat(spending.amount)
    return acc
  }, {})

  const pieData = Object.values(categoryData)

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-md shadow-md ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
        >
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`$${payload[0].value.toFixed(2)}`}</p>
        </div>
      )
    }
    return null
  }

  const PieCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-md shadow-md ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
        >
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{`$${payload[0].value.toFixed(2)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> Spending Analysis
        </h2>
        <div className="flex border rounded-md overflow-hidden">
          <button
            className={`px-3 py-1 text-sm font-medium flex items-center gap-1 ${
              chartType === "monthly"
                ? isDarkMode
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-900"
                : isDarkMode
                  ? "bg-slate-800 text-slate-300"
                  : "bg-white text-slate-600"
            }`}
            onClick={() => setChartType("monthly")}
          >
            <BarChart3 className="h-4 w-4" /> Monthly
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium flex items-center gap-1 ${
              chartType === "category"
                ? isDarkMode
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-900"
                : isDarkMode
                  ? "bg-slate-800 text-slate-300"
                  : "bg-white text-slate-600"
            }`}
            onClick={() => setChartType("category")}
          >
            <PieChart className="h-4 w-4" /> Categories
          </button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {chartType === "monthly" && (
          <>
            {chartData.length > 0 ? (
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                    <XAxis
                      dataKey="month"
                      stroke={isDarkMode ? "#cbd5e1" : "#475569"}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke={isDarkMode ? "#cbd5e1" : "#475569"} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="expenses"
                      fill={isDarkMode ? "#8884d8" : "#6366f1"}
                      name="Expenses"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">Add spendings to see the chart</p>
              </div>
            )}
          </>
        )}

        {chartType === "category" && (
          <>
            {pieData.length > 0 ? (
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                      animationBegin={200}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieCustomTooltip />} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">Add spendings to see the chart</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MonthlyChart

