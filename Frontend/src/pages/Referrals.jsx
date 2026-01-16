import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Share2, Copy, TrendingUp, UserPlus, Award,
  DollarSign, ChevronRight, CheckCircle, ExternalLink
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Navbar from './Navbar'

const Referrals = () => {
  const [referralStats, setReferralStats] = useState(null)
  const [referralTree, setReferralTree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const [statsResponse, treeResponse] = await Promise.all([
        api.get('/referrals/stats'),
        api.get('/referrals/tree')
      ])
      setReferralStats(statsResponse.data.data)
      setReferralTree(treeResponse.data.data)
    } catch (error) {
      console.error('Failed to load referral data:', error)
      toast.error('Failed to load referral data')
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    if (!referralStats?.referralLink) return
    
    setCopying(true)
    try {
      await navigator.clipboard.writeText(referralStats.referralLink)
      toast.success('Referral link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy link')
    } finally {
      setCopying(false)
    }
  }

  const commissionLevels = [
    { level: 1, percentage: '10%', description: 'Direct Referrals' },
    { level: 2, percentage: '6%', description: 'Level 2 Referrals' },
    { level: 3, percentage: '3%', description: 'Level 3 Referrals' },
    { level: 4, percentage: '1%', description: 'Level 4 Referrals' }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Network</h1>
          <p className="text-gray-600">Grow your network and earn commissions on referrals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Referral Link & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Referral Link Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Referral Link</h2>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralStats?.referralLink || ''}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                  <button
                    onClick={copyReferralLink}
                    disabled={copying}
                    className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {copying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Copying...
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => window.open(referralStats?.referralLink, '_blank')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </button>
                </div>

                {/* Share Buttons */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Share via:</p>
                  <div className="flex gap-3" onClick={()=>{
                    window.navigator.share({
                      title: 'Join InvestFlow',
                      text: 'Sign up using my referral link to start investing and earning commissions!',
                      url: referralStats?.referralLink
                    })
                  }}>
                    <button className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-colors">
                      WhatsApp
                    </button>
                    <button className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition-colors">
                      Telegram
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Structure */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Commission Structure</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {commissionLevels.map((item) => (
                  <div key={item.level} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">L{item.level}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{item.percentage}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Referral Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Direct Referrals</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {referralStats?.directReferrals || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Earnings</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${referralStats?.totalReferralEarnings?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Level-wise Earnings</h3>
                  <div className="space-y-3">
                    {referralStats?.levelEarnings?.map((level) => (
                      <div key={level._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">L{level._id}</span>
                          </div>
                          <span className="text-gray-700">Level {level._id}</span>
                        </div>
                        <div className="font-semibold text-gray-900">
                          ${level.totalAmount?.toFixed(2)}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 py-4">
                        No level earnings yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats & Tips */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Active Referrals</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {referralStats?.directReferrals || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Avg. Commission</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${referralStats?.levelEarnings?.[0]?.totalAmount ? 
                      (referralStats.levelEarnings[0].totalAmount / referralStats.directReferrals).toFixed(2) : 
                      '0.00'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Growth Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">+15%</span>
                </div>
              </div>
            </div>

            {/* Referral Tips */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Referral Tips</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Share Your Link</h4>
                    <p className="text-blue-100 text-sm">Share your referral link on social media and messaging apps</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Explain Benefits</h4>
                    <p className="text-blue-100 text-sm">Explain how your friends can benefit from joining</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Track Performance</h4>
                    <p className="text-blue-100 text-sm">Monitor which referrals are most active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Referrals</h2>
              
              {referralTree?.referrals?.length > 0 ? (
                <div className="space-y-3">
                  {referralTree.referrals.slice(0, 3).map((referral, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                          {referral.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{referral.name}</div>
                          <div className="text-xs text-gray-500">Level 1</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No referrals yet</p>
                  <p className="text-sm text-gray-400">Start sharing your link to earn commissions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referrals