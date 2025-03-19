import React from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ searchTerm, setSearchTerm, isDarkMode }) => {
  return (
    <motion.div 
      className="flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search spendings..."
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#181C14] border-[#697565] text-[#ECDFCC] focus:ring-[#ECDFCC]' : 'bg-[#DAD2FF] border-[#493D9E] focus:ring-[#B2A5FF]'}`}
      />
    </motion.div>
  );
};

export default SearchBar;