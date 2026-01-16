import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, TrendingUp, Shield, Zap, Clock, 
  Calendar, CheckCircle, XCircle, Plus, Info
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Navbar from './Navbar'

const Investments = () => {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      const response = await api.get('/investments/my-investments')
      setInvestments(response.data.data)
    } catch (error) {
      console.error('Failed to fetch investments:', error)
      toast.error('Failed to load investments')
    } finally {
      setLoading(false)
    }
  }

  const handleInvestment = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) < 10) {
      toast.error('Minimum investment amount is $10')
      return
    }

    setProcessing(true)
    try {
      await api.post('/investments', {
        amount: parseFloat(investmentAmount),
        plan: selectedPlan
      })
      
      toast.success('Investment created successfully!')
      setShowInvestmentModal(false)
      setInvestmentAmount('')
      fetchInvestments()
    } catch (error) {
      console.error('Investment error:', error)
      toast.error(error.response?.data?.error || 'Investment failed')
    } finally {
      setProcessing(false)
    }
  }

  const investmentPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      icon: Shield,
      minAmount: 100,
      maxAmount: 1000,
      dailyROI: 2,
      duration: 30,
      color: 'from-blue-500 to-cyan-500',
      features: ['2% Daily ROI', '30 Days Duration', 'Level 1-2 Commission']
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      icon: TrendingUp,
      minAmount: 1000,
      maxAmount: 5000,
      dailyROI: 2.5,
      duration: 60,
      color: 'from-purple-500 to-pink-500',
      features: ['2.5% Daily ROI', '60 Days Duration', 'Level 1-3 Commission']
    },
    {
      id: 'vip',
      name: 'VIP Plan',
      icon: Zap,
      minAmount: 5000,
      maxAmount: 50000,
      dailyROI: 3,
      duration: 90,
      color: 'from-amber-500 to-orange-500',
      features: ['3% Daily ROI', '90 Days Duration', 'Level 1-4 Commission']
    }
  ]

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investments</h1>
          <p className="text-gray-600">Manage your investment portfolio and explore new opportunities</p>
        </div>

        {/* Investment Plans */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Investment Plans</h2>
            <button
              onClick={() => setShowInvestmentModal(true)}
              className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Investment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investmentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">{plan.dailyROI}%</div>
                  <div className="text-sm text-gray-600">Daily ROI</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min Investment</span>
                    <span className="font-semibold">${plan.minAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max Investment</span>
                    <span className="font-semibold">${plan.maxAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{plan.duration} days</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    setShowInvestmentModal(true)
                  }}
                  className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Invest Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Investments */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Active Investments</h2>
          
          {investments.filter(inv => inv.status === 'active').length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Investments</h3>
              <p className="text-gray-600 mb-4">Start your first investment to begin earning</p>
              <button
                onClick={() => setShowInvestmentModal(true)}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Make Your First Investment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Plan</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Earned</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Start Date</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">End Date</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investments
                    .filter(inv => inv.status === 'active')
                    .map((investment, index) => (
                      <tr key={investment._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            investment.plan === 'vip' ? 'bg-amber-100 text-amber-800' :
                            investment.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {investment.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900">${investment.amount.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-green-600">${investment.totalEarned?.toFixed(2) || '0.00'}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {new Date(investment.startDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {new Date(investment.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Investment</h3>
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {investmentPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <plan.icon className={`w-6 h-6 mx-auto mb-2 ${
                        selectedPlan === plan.id ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className="text-sm font-medium">{plan.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter amount"
                />
                {selectedPlan && (
                  <p className="text-xs text-gray-500 mt-2">
                    Min: ${investmentPlans.find(p => p.id === selectedPlan)?.minAmount}, 
                    Max: ${investmentPlans.find(p => p.id === selectedPlan)?.maxAmount}
                  </p>
                )}
              </div>

              {selectedPlan && investmentAmount && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium">{investmentPlans.find(p => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily ROI</span>
                      <span className="font-medium">{investmentPlans.find(p => p.id === selectedPlan)?.dailyROI}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Daily Return</span>
                      <span className="font-medium text-green-600">
                        ${(parseFloat(investmentAmount) * (investmentPlans.find(p => p.id === selectedPlan)?.dailyROI || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvestmentModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvestment}
                  disabled={processing || !investmentAmount}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Confirm Investment'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Investments