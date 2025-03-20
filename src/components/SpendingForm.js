import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Save, X } from "lucide-react"

const SpendingForm = ({ onSave, editingSpending, onCancel, compact = false, isDarkMode }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (editingSpending) {
      setFormData(editingSpending)
    }
  }, [editingSpending])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.category || !formData.description) {
      alert("Please fill in all fields")
      return
    }
    onSave(formData)
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const categories = [
    { value: "Food", label: "Food" },
    { value: "Transport", label: "Transport" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Bills", label: "Bills" },
    { value: "Shopping", label: "Shopping" },
    { value: "Health", label: "Health" },
    { value: "Other", label: "Other" },
  ]

  const inputClasses = `w-full p-2 rounded-md border ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
      : "bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent"
  }`

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg ${!compact && "shadow-md"} overflow-hidden`}>
      <div className={compact ? "p-4" : "p-6"}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${compact ? "text-lg" : "text-xl"} font-semibold flex items-center gap-2`}>
              {editingSpending ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingSpending ? "Edit Spending" : "Add Spending"}
            </h2>
            {editingSpending && (
              <button
                type="button"
                onClick={onCancel}
                className="h-8 w-8 p-0 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 25.99"
                step="0.01"
                required
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <input
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Lunch at Cafe"
                required
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md font-medium flex items-center gap-1 ${
                  isDarkMode ? "bg-primary text-white hover:bg-primary/90" : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {editingSpending ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingSpending ? "Update" : "Add"}
              </button>
            </motion.div>
            {editingSpending && !compact && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="button"
                  onClick={onCancel}
                  className={`px-4 py-2 rounded-md font-medium ${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SpendingForm

