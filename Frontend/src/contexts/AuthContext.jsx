// import React, { createContext, useState, useContext, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../services/api'
// import toast from 'react-hot-toast'

// // Create context
// const AuthContext = createContext()

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// // Auth provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       fetchUser()
//     } else {
//       setLoading(false)
//     }
//   }, [])

//   // Fetch user data
//   const fetchUser = async () => {
//     try {
//       const response = await api.get('/auth/me')
//       setUser(response.data.data)
//     } catch (error) {
//       console.error('Failed to fetch user:', error)
//       localStorage.removeItem('token')
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Login function
//   const login = async (email, password) => {
//     try {
//       const response = await api.post('/auth/login', { email, password })
//       const { token, user: userData } = response.data
      
//       // Store token
//       localStorage.setItem('token', token)
      
//       // Set default auth header
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
//       // Update user state
//       setUser(userData)
      
//       // Show success message
//       toast.success('Login successful!')
      
//       // Navigate to dashboard
//       navigate('/')
      
//       return { success: true }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Login failed'
//       toast.error(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   // Register function
//   const register = async (userData) => {
//     try {
//       const response = await api.post('/auth/register', userData)
//       const { token, user: userData } = response.data
      
//       // Store token
//       localStorage.setItem('token', token)
      
//       // Set default auth header
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
//       // Update user state
//       setUser(userData)
      
//       // Show success message
//       toast.success('Registration successful!')
      
//       // Navigate to dashboard
//       navigate('/')
      
//       return { success: true }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Registration failed'
//       toast.error(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   // Logout function
//   const logout = async () => {
//     try {
//       await api.get('/auth/logout')
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       // Clear token
//       localStorage.removeItem('token')
      
//       // Remove auth header
//       delete api.defaults.headers.common['Authorization']
      
//       // Clear user state
//       setUser(null)
      
//       // Show success message
//       toast.success('Logged out successfully')
      
//       // Navigate to login
//       navigate('/login')
//     }
//   }

//   // Update password
//   const updatePassword = async (currentPassword, newPassword) => {
//     try {
//       await api.put('/auth/updatepassword', { currentPassword, newPassword })
//       toast.success('Password updated successfully')
//       return { success: true }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Password update failed'
//       toast.error(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   // Context value
//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     updatePassword,
//     fetchUser
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

// Create context
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData } = response.data
      
      // Store token
      localStorage.setItem('token', token)
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Update user state
      setUser(userData)
      
      // Show success message
      toast.success('Login successful!')
      
      // Navigate to dashboard
      navigate('/')
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user: userData } = response.data
      
      // Store token
      localStorage.setItem('token', token)
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Update user state
      setUser(userData)
      
      // Show success message
      toast.success('Registration successful!')
      
      // Navigate to dashboard
      navigate('/')
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await api.get('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear token
      localStorage.removeItem('token')
      
      // Remove auth header
      delete api.defaults.headers.common['Authorization']
      
      // Clear user state
      setUser(null)
      
      // Show success message
      toast.success('Logged out successfully')
      
      // Navigate to login
      navigate('/login')
    }
  }

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/updatepassword', { currentPassword, newPassword })
      toast.success('Password updated successfully')
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password update failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updatePassword,
    fetchUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}