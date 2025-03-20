import { useState, useEffect } from "react"
import SpendingForm from "./components/SpendingForm"
import SpendingList from "./components/SpendingList"
import SearchBar from "./components/SearchBar"
import MonthlyChart from "./components/MonthlyChart"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, BarChart3, Wallet, Plus, Trash2, ArrowDownUp, Receipt } from "lucide-react"

const App = () => {
  const initialSpendings = JSON.parse(localStorage.getItem("spendings") || "[]")
  const [spendings, setSpendings] = useState(initialSpendings)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSpending, setEditingSpending] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [sortOrder, setSortOrder] = useState("desc")
  const [activeView, setActiveView] = useState("list")

  useEffect(() => {
    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    if (spendings.length > 0) {
      localStorage.setItem("spendings", JSON.stringify(spendings))
    }
  }, [spendings])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleSaveSpending = (spending) => {
    if (editingSpending) {
      setSpendings(spendings.map((s) => (s.id === editingSpending.id ? { ...spending, id: s.id } : s)))
      setEditingSpending(null)
    } else {
      setSpendings([...spendings, { ...spending, id: Date.now().toString() }])
    }
  }

  const handleDeleteSpending = (id) => {
    setSpendings(spendings.filter((s) => s.id !== id))
  }

  const handleEditSpending = (spending) => {
    setEditingSpending(spending)
    setActiveView("form")
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all spendings?")) {
      setSpendings([])
      localStorage.removeItem("spendings")
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  const filteredSpendings = spendings.filter(
    (s) =>
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedSpendings = filteredSpendings.reduce((acc, spending) => {
    const date = spending.date.split("T")[0]
    acc[date] = acc[date] || []
    acc[date].push(spending)
    return acc
  }, {})

  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentMonthSpendings = spendings.filter((s) => s.date.slice(0, 7) === currentMonth)
  const totalCurrentMonthSpendings = currentMonthSpendings.reduce((sum, s) => sum + Number.parseFloat(s.amount), 0)

  const categoryTotals = currentMonthSpendings.reduce((acc, spending) => {
    const category = spending.category
    if (!acc[category]) {
      acc[category] = 0
    }
    acc[category] += Number.parseFloat(spending.amount)
    return acc
  }, {})

  const categoryData = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    amount: total,
  }))

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <Wallet className="h-8 w-8" /> Money Tracker
          </motion.h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-700"} hover:opacity-80 transition`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Total Spendings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <div className="bg-primary/10 p-6 text-center">
                  <h2 className="text-xl font-bold flex items-center justify-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5" /> This Month
                  </h2>
                  <motion.p
                    className="text-4xl md:text-5xl font-black text-primary"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3,
                    }}
                  >
                    ${totalCurrentMonthSpendings.toFixed(2)}
                  </motion.p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5" /> Top Categories
                  </h2>
                  {categoryData.length > 0 ? (
                    <div className="space-y-3">
                      {categoryData
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 3)
                        .map((item, index) => (
                          <div key={item.category} className="flex justify-between items-center">
                            <span className="font-medium">{item.category}</span>
                            <motion.span
                              className="font-bold text-primary"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              ${item.amount.toFixed(2)}
                            </motion.span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400">No data available</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tabs for different views */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-2 font-medium ${activeView === "list" ? "border-b-2 border-primary text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  onClick={() => setActiveView("list")}
                >
                  <span className="flex items-center gap-1">
                    <Receipt className="h-4 w-4" />
                    <span className="hidden sm:inline">Spendings</span> List
                  </span>
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeView === "chart" ? "border-b-2 border-primary text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  onClick={() => setActiveView("chart")}
                >
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Monthly</span> Chart
                  </span>
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeView === "form" ? "border-b-2 border-primary text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  onClick={() => setActiveView("form")}
                >
                  <span className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add</span>
                  </span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeView === "list" && (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isDarkMode={isDarkMode} />
                      <div className="flex gap-2">
                        <button
                          className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300"}`}
                          onClick={toggleSortOrder}
                        >
                          <ArrowDownUp className="h-4 w-4" />
                          {sortOrder === "desc" ? "Newest" : "Oldest"}
                        </button>
                        <button
                          className="px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 flex items-center gap-1"
                          onClick={handleClearData}
                        >
                          <Trash2 className="h-4 w-4" /> Clear
                        </button>
                      </div>
                    </div>
                    <SpendingList
                      groupedSpendings={groupedSpendings}
                      onEdit={handleEditSpending}
                      onDelete={handleDeleteSpending}
                      sortOrder={sortOrder}
                      isDarkMode={isDarkMode}
                    />
                  </motion.div>
                )}

                {activeView === "chart" && (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MonthlyChart spendings={spendings} isDarkMode={isDarkMode} />
                  </motion.div>
                )}

                {activeView === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SpendingForm
                      onSave={handleSaveSpending}
                      editingSpending={editingSpending}
                      onCancel={() => {
                        setEditingSpending(null)
                        setActiveView("list")
                      }}
                      isDarkMode={isDarkMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right sidebar - only visible on desktop */}
          <div className="hidden lg:block">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Quick Add
                </h2>
                <SpendingForm
                  onSave={(spending) => {
                    handleSaveSpending(spending)
                    setActiveView("list")
                  }}
                  editingSpending={null}
                  onCancel={() => {}}
                  compact={true}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

