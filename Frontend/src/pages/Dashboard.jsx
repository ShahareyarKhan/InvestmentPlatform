import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import { 
  Building2, Wallet, TrendingUp, PieChart, Users, 
  Clock, ArrowUpRight, ArrowDownRight, Plus, Share2,
  LogOut, Settings, Bell, ChevronDown, DollarSign,
  RefreshCw, TrendingDown, CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from './Navbar'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/data')
      setDashboardData(response.data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Wallet Balance',
      value: `$${dashboardData?.user?.walletBalance?.toFixed(2) || '0.00'}`,
      icon: Wallet,
      change: '+12.5%',
      trend: 'up',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Today's ROI",
      value: `$${dashboardData?.investments?.todayROI?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      change: '+2.3%',
      trend: 'up',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Investments',
      value: dashboardData?.investments?.active || 0,
      icon: PieChart,
      change: '+1',
      trend: 'up',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Referrals',
      value: dashboardData?.referrals?.count || 0,
      icon: Users,
      change: '+5',
      trend: 'up',
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const quickActions = [
    { icon: Plus, label: 'Make Investment', color: 'text-blue-600', bgColor: 'bg-blue-50', path: '/investments' },
    { icon: Share2, label: 'Invite Friends', color: 'text-green-600', bgColor: 'bg-green-50', path: '/referrals' },
    { icon: DollarSign, label: 'Withdraw Funds', color: 'text-purple-600', bgColor: 'bg-purple-50', path: '/transactions' },
    { icon: Settings, label: 'Settings', color: 'text-gray-600', bgColor: 'bg-gray-50', path: '/profile' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <Navbar/>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-blue-600">{user?.name}</span>!
          </h1>
          <p className="text-gray-600">
            Here's your investment overview for today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <Link
                  to="/transactions"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>

              {dashboardData?.recentTransactions?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentTransactions.slice(0, 5).map((transaction, index) => (
                    <motion.div
                      key={transaction._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'roi' 
                            ? 'bg-green-100 text-green-600'
                            : transaction.type === 'level_income'
                            ? 'bg-blue-100 text-blue-600'
                            : transaction.type === 'withdrawal'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {transaction.type === 'roi' ? (
                            <TrendingUp className="w-5 h-5" />
                          ) : transaction.type === 'level_income' ? (
                            <Users className="w-5 h-5" />
                          ) : transaction.type === 'withdrawal' ? (
                            <TrendingDown className="w-5 h-5" />
                          ) : (
                            <DollarSign className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.description || transaction.type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Transactions</h3>
                  <p className="text-gray-600">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Account Info */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(action.path)}
                    className={`${action.bgColor} rounded-xl p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow`}
                  >
                    <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                    <span className="text-sm font-medium text-gray-900 text-center">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Referral Code</span>
                  <span className="font-mono font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {user?.referralCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-bold text-gray-900">
                    ${user?.totalEarnings?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Your Referral Link</p>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/register?ref=${user?.referralCode}`}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-xl text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://investflow.com/register?ref=${user?.referralCode}`)
                      toast.success('Referral link copied!')
                    }}
                    className="px-4 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Investment Summary</h2>
            <Link
              to="/investments"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Investments
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Total Invested</h3>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${dashboardData?.investments?.totalInvestment?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Across all active investments</p>
            </div>

            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Estimated Monthly</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${((dashboardData?.investments?.todayROI || 0) * 30).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Based on current ROI rate</p>
            </div>

            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Referral Earnings</h3>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${dashboardData?.referrals?.earnings?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600 mt-2">From {dashboardData?.referrals?.count || 0} referrals</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">InvestFlow</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2026 InvestFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard