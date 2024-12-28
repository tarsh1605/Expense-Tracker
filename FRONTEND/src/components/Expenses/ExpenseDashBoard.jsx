import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const ExpenseList = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [expenseList, setExpenseList] = useState([]);
  const [filteredExpenseList, setFilteredExpenseList] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [filters, setFilters] = useState({
    amountRange: { min: "", max: "" },
    dateRange: { start: "", end: "" },
    category: "",
  });
  const { getAccessToken } = useContext(AuthContext);

  const fetchExpenseList = async () => {
    const response = await axios.get("http://localhost:5000/expenses", {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    setExpenseList(response.data);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:5000/expenses",
      { ...newExpense },
      { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    );
    setExpenseList([...expenseList, response.data]);
    setNewExpense({ title: "", category: "", amount: "", date: "" });
  };

  const handleDeleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/expenses/${id}`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const newexpenseList = expenseList.filter((expense) => expense._id !== id);
    setExpenseList(newexpenseList);
  };

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "min" || name === "max") {
      setFilters({
        ...filters,
        amountRange: { ...filters.amountRange, [name]: value },
      });
    } else if (name === "start" || name === "end") {
      setFilters({
        ...filters,
        dateRange: { ...filters.dateRange, [name]: value },
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const applyFilters = () => {
    const { amountRange, category, dateRange } = filters;
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    const filtered = expenseList.filter((expense) => {
      const amount = parseFloat(expense.amount);
      const date = new Date(expense.date);
      const amountCondition =
        (!amountRange.min || amount >= amountRange.min) &&
        (!amountRange.max || amount <= amountRange.max);

      const dateCondition =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);

      const categoryCondition = !category || expense.category === category;
      return amountCondition && dateCondition && categoryCondition;
    });
    setFilteredExpenseList(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchExpenseList();
  }, [filters, expenseList]);

  useEffect(() => {
    applyFilters();
  }, [filters, expenseList]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Amount Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={filters.amountRange.min}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={filters.amountRange.max}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="start"
                  value={filters.dateRange.start}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
                <input
                  type="date"
                  name="end"
                  value={filters.dateRange.end}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              >
                <option value="">All Categories</option>
                <option value="Groceries">Groceries</option>
                <option value="Leisure">Leisure</option>
                <option value="Electronics">Electronics</option>
                <option value="Utilities">Utilities</option>
                <option value="Clothing">Clothing</option>
                <option value="Health">Health</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
          <ul className="space-y-3">
            {filteredExpenseList.map((expense) => (
              <li
                key={expense._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <h3 className="font-medium text-gray-900">{expense.title}</h3>
                  <span className="text-gray-700">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-green-700">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm text-center">
                    {expense.category}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="ml-4 px-3 py-1 text-sm text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add Expense
          </h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                name="title"
                placeholder="Title"
                value={newExpense.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
              <select
                name="category"
                value={newExpense.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              >
                <option value="">Select Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Leisure">Leisure</option>
                <option value="Electronics">Electronics</option>
                <option value="Utilities">Utilities</option>
                <option value="Clothing">Clothing</option>
                <option value="Health">Health</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition-colors"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
