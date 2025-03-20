import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash2, Receipt } from "lucide-react"

const SpendingList = ({ groupedSpendings, onEdit, onDelete, sortOrder, isDarkMode }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Food: isDarkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800",
      Transport: isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800",
      Entertainment: isDarkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-800",
      Bills: isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800",
      Shopping: isDarkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800",
      Health: isDarkMode ? "bg-teal-900 text-teal-300" : "bg-teal-100 text-teal-800",
      Other: isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800",
    }

    return colors[category] || colors["Other"]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const sortedDates = Object.keys(groupedSpendings).sort((a, b) => {
    const dateA = new Date(a).getTime()
    const dateB = new Date(b).getTime()
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Spendings</h2>
      </div>

      {sortedDates.length === 0 ? (
        <p className="text-center py-8 text-slate-500 dark:text-slate-400">
          No spendings found. Add some to get started!
        </p>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {sortedDates.map((date) => (
              <motion.div
                key={date}
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(date)}</h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {groupedSpendings[date].map((spending) => (
                      <motion.div
                        key={spending.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className={`border rounded-lg p-4 transition-colors ${
                          isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{spending.description}</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(spending.category)}`}
                              >
                                {spending.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2 sm:mt-0">
                            <span className="text-lg font-bold">${Number.parseFloat(spending.amount).toFixed(2)}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => onEdit(spending)}
                                className={`p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600`}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onDelete(spending.id)}
                                className={`p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default SpendingList

