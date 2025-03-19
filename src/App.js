import React, { useState, useEffect } from 'react';
import SpendingForm from './components/SpendingForm';
import SpendingList from './components/SpendingList';
import SearchBar from './components/SearchBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaChartBar, FaList, FaPlus, FaTrash } from 'react-icons/fa';

const App = () => {
  const initialSpendings = JSON.parse(localStorage.getItem('spendings') || '[]');
  const [spendings, setSpendings] = useState(initialSpendings);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSpending, setEditingSpending] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (spendings.length > 0) {
      localStorage.setItem('spendings', JSON.stringify(spendings));
    }
  }, [spendings]);

  const handleSaveSpending = (spending) => {
    if (editingSpending) {
      setSpendings(spendings.map(s => (s.id === editingSpending.id ? { ...spending, id: s.id } : s)));
      setEditingSpending(null);
    } else {
      setSpendings([...spendings, { ...spending, id: Date.now().toString() }]);
    }
  };

  const handleDeleteSpending = (id) => {
    setSpendings(spendings.filter(s => s.id !== id));
  };

  const handleEditSpending = (spending) => {
    setEditingSpending(spending);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all spendings?')) {
      setSpendings([]);
      localStorage.removeItem('spendings');
    }
  };

  const filteredSpendings = spendings.filter(s => 
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSpendings = filteredSpendings.reduce((acc, spending) => {
    const date = spending.date.split('T')[0];
    acc[date] = acc[date] || [];
    acc[date].push(spending);
    return acc;
  }, {});

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthSpendings = spendings.filter(s => s.date.slice(0, 7) === currentMonth);
  const totalCurrentMonthSpendings = currentMonthSpendings.reduce((sum, s) => sum + parseFloat(s.amount), 0);

  const monthlyData = spendings.reduce((acc, spending) => {
    const date = new Date(spending.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        expenses: 0,
      };
    }
    acc[monthYear].expenses += parseFloat(spending.amount);
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month + " 1");
    const dateB = new Date(b.month + " 1");
    return dateA.getTime() - dateB.getTime();
  });

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-[#181C14] to-[#3C3D37] text-[#ECDFCC]' : 'bg-gradient-to-br from-[#DAD2FF] to-[#FFF2AF] text-[#493D9E]'}`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header with Theme Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#ECDFCC]' : 'text-[#493D9E]'}`}>
            Money Tracker
          </h1>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-[#697565] text-[#ECDFCC]' : 'bg-[#B2A5FF] text-[#493D9E]'} hover:opacity-80 transition`}
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </motion.div>

        {/* Total Spendings */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`p-8 rounded-xl shadow-xl text-center ${isDarkMode ? 'bg-[#3C3D37] border-2 border-[#697565]' : 'bg-[#B2A5FF] border-2 border-[#493D9E]'}`}
        >
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <FaChartBar /> Total This Month
          </h2>
          <p className={`text-5xl font-black mt-4 ${isDarkMode ? 'text-[#ECDFCC]' : 'text-[#493D9E]'}`}>
            ${totalCurrentMonthSpendings.toFixed(2)}
          </p>
        </motion.div>

        {/* Monthly Spending Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-6 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-[#3C3D37]' : 'bg-white'}`}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartBar /> Monthly Spending
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#697565' : '#ccc'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#ECDFCC' : '#493D9E'} />
                <YAxis stroke={isDarkMode ? '#ECDFCC' : '#493D9E'} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{ backgroundColor: isDarkMode ? '#3C3D37' : '#fff', color: isDarkMode ? '#ECDFCC' : '#493D9E' }} />
                <Bar dataKey="expenses" fill={isDarkMode ? '#697565' : '#493D9E'} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Add spendings to see the chart.</p>
          )}
        </motion.div>

        {/* Spending Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <SpendingForm 
            onSave={handleSaveSpending} 
            editingSpending={editingSpending} 
            onCancel={() => setEditingSpending(null)}
            isDarkMode={isDarkMode}
          />
        </motion.div>

        {/* Search Bar and Clear Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 mt-6"
        >
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isDarkMode={isDarkMode} />
          <button
            onClick={handleClearData}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${isDarkMode ? 'bg-[#697565] hover:bg-[#ECDFCC] hover:text-[#3C3D37]' : 'bg-[#493D9E] hover:bg-[#B2A5FF] text-white'}`}
          >
            <FaTrash /> Clear All
          </button>
        </motion.div>

        {/* Spending List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <SpendingList 
            groupedSpendings={groupedSpendings} 
            onEdit={handleEditSpending} 
            onDelete={handleDeleteSpending}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default App;