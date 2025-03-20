import { motion } from "framer-motion"
import { Search } from "lucide-react"

const SearchBar = ({ searchTerm, setSearchTerm, isDarkMode }) => {
  return (
    <motion.div
      className="relative flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search spendings..."
          className={`pl-9 w-full p-2 rounded-md border ${
            isDarkMode
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
          }`}
        />
      </div>
    </motion.div>
  )
}

export default SearchBar

