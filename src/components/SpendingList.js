import React from 'react';
import { FaEdit, FaTrash, FaListAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SpendingList = ({ groupedSpendings, onEdit, onDelete, isDarkMode }) => {
  return (
    <motion.div 
      className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-[#3C3D37] text-[#ECDFCC]' : 'bg-white text-[#493D9E]'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaListAlt /> Spendings
      </h2>
      {Object.keys(groupedSpendings).length === 0 ? (
        <p>No spendings found.</p>
      ) : (
        Object.entries(groupedSpendings)
          .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
          .map(([date, spendings]) => (
            <motion.div 
              key={date} 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-2">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <ul className="space-y-2">
                {spendings.map(spending => (
                  <motion.li
                    key={spending.id}
                    className={`flex justify-between items-center p-3 rounded-md transition ${isDarkMode ? 'bg-[#181C14] hover:bg-[#697565]' : 'bg-[#DAD2FF] hover:bg-[#B2A5FF]'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <p className="font-medium">{spending.description}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-[#ECDFCC]' : 'text-[#493D9E]'}`}>{spending.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-medium ${isDarkMode ? 'text-[#ECDFCC]' : 'text-[#493D9E]'}`}>${parseFloat(spending.amount).toFixed(2)}</span>
                      <motion.button 
                        onClick={() => onEdit(spending)}
                        className="hover:text-blue-500 transition"
                        whileHover={{ scale: 1.2 }}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button 
                        onClick={() => onDelete(spending.id)}
                        className="hover:text-red-500 transition"
                        whileHover={{ scale: 1.2 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))
      )}
    </motion.div>
  );
};

export default SpendingList;