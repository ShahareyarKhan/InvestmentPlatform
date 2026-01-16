import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Filter, Search, Download, TrendingUp, Users, 
  DollarSign, Clock, ChevronDown, Calendar, 
  TrendingDown, RefreshCw, Eye, EyeOff
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Navbar from './Navbar'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [searchTerm, filterType, dateRange, transactions])

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/dashboard/roi-history')
      setTransactions(response.data.data)
      setFilteredTransactions(response.data.data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(term) ||
        t.type?.toLowerCase().includes(term)
      )
    }

    // Filter by date range
    if (dateRange.start) {
      const startDate = new Date(dateRange.start)
      filtered = filtered.filter(t => new Date(t.date) >= startDate)
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => new Date(t.date) <= endDate)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'roi': return TrendingUp
      case 'level_income': return Users
      case 'withdrawal': return TrendingDown
      case 'deposit': return DollarSign
      default: return Clock
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'roi': return 'text-green-600 bg-green-50'
      case 'level_income': return 'text-blue-600 bg-blue-50'
      case 'withdrawal': return 'text-red-600 bg-red-50'
      case 'deposit': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'roi': return 'ROI'
      case 'level_income': return 'Referral'
      case 'withdrawal': return 'Withdrawal'
      case 'deposit': return 'Deposit'
      default: return type
    }
  }

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Type', 'Description', 'Amount', 'Status'],
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        getTypeLabel(t.type),
        t.description || '-',
        `$${t.amount.toFixed(2)}`,
        'Completed'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Transactions exported successfully')
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar/>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
              <p className="text-gray-600">Track all your earnings, withdrawals, and deposits</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchTransactions}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportTransactions}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                 CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Search transactions..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                    >
                      <option value="all">All Types</option>
                      <option value="roi">ROI</option>
                      <option value="level_income">Referral Income</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="deposit">Deposit</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('all')
                    setDateRange({ start: '', end: '' })
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
              <div className="text-sm text-gray-600">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </div>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || dateRange.start || dateRange.end
                  ? 'Try changing your filters'
                  : 'Your transaction history will appear here'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((transaction, index) => {
                      const Icon = getTypeIcon(transaction.type)
                      return (
                        <motion.tr
                          key={transaction._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-lg ${getTypeColor(transaction.type)} flex items-center justify-center mr-3`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {getTypeLabel(transaction.type)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-gray-900">{transaction.description || '-'}</div>
                            {transaction.level && (
                              <div className="text-xs text-gray-500">
                                Level {transaction.level} commission
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className={`text-sm font-semibold ${
                              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                              Completed
                            </span>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Total Earnings</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${transactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Total Withdrawals</h3>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${Math.abs(transactions
                .filter(t => t.type === 'withdrawal')
                .reduce((sum, t) => sum + t.amount, 0))
                .toFixed(2)}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Total ROI</h3>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${transactions
                .filter(t => t.type === 'roi')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Referral Income</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${transactions
                .filter(t => t.type === 'level_income')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions