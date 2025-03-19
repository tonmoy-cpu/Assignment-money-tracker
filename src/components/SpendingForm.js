import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SpendingForm = ({ onSave, editingSpending, onCancel, isDarkMode }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingSpending) {
      setFormData(editingSpending);
    }
  }, [editingSpending]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) {
      alert('Please fill in all fields');
      return;
    }
    onSave(formData);
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-[#3C3D37] text-[#ECDFCC]' : 'bg-white text-[#493D9E]'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaPlus /> {editingSpending ? 'Edit Spending' : 'Add Spending'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#181C14] border-[#697565] text-[#ECDFCC] focus:ring-[#ECDFCC]' : 'bg-[#DAD2FF] border-[#493D9E] focus:ring-[#B2A5FF]'}`}
            placeholder="e.g., 25.99"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#181C14] border-[#697565] text-[#ECDFCC] focus:ring-[#ECDFCC]' : 'bg-[#DAD2FF] border-[#493D9E] focus:ring-[#B2A5FF]'}`}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#181C14] border-[#697565] text-[#ECDFCC] focus:ring-[#ECDFCC]' : 'bg-[#DAD2FF] border-[#493D9E] focus:ring-[#B2A5FF]'}`}
            placeholder="e.g., Lunch at Cafe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-[#181C14] border-[#697565] text-[#ECDFCC] focus:ring-[#ECDFCC]' : 'bg-[#DAD2FF] border-[#493D9E] focus:ring-[#B2A5FF]'}`}
            required
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <motion.button
          type="submit"
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${isDarkMode ? 'bg-[#697565] hover:bg-[#ECDFCC] hover:text-[#3C3D37]' : 'bg-[#493D9E] hover:bg-[#B2A5FF] text-white'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> {editingSpending ? 'Update' : 'Add'}
        </motion.button>
        {editingSpending && (
          <motion.button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-md transition ${isDarkMode ? 'bg-[#3C3D37] hover:bg-[#697565]' : 'bg-[#DAD2FF] hover:bg-[#B2A5FF]'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

export default SpendingForm;