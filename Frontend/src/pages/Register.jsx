import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, Tag, Building2, TrendingUp,
  Shield, Users, Award, CheckCircle, ArrowRight, Check, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const newErrors = validateStep(step);
    if (Object.keys(newErrors).length === 0) {
      setStep(prev => prev + 1);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    const newErrors = validateStep(1);
    const step2Errors = validateStep(2);
    const allErrors = { ...newErrors, ...step2Errors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        toast.success('Account created successfully! Welcome to InvestFlow!');
        navigate('/');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Unable to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <React.Fragment key={stepNum}>
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
              transition-all duration-300
              ${step >= stepNum 
                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-400'
              }
              ${step === stepNum ? 'ring-4 ring-blue-500/20 scale-110' : ''}
            `}>
              {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
            </div>
            {stepNum < 3 && (
              <div className={`
                w-20 h-1 mx-2
                transition-all duration-300
                ${step > stepNum ? 'bg-linear-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const StepLabels = () => (
    <div className="flex justify-between mb-2 px-2 max-w-xs mx-auto">
      <span className={`text-xs font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
        Personal Info
      </span>
      <span className={`text-xs font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
        Security
      </span>
      <span className={`text-xs font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
        Complete
      </span>
    </div>
  );

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Daily Returns",
      description: "Earn 2-3% daily ROI on your investments"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Referral Program",
      description: "Get 10% commission on referrals"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Secure Platform",
      description: "Bank-level security & encryption"
    },
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      title: "Trusted",
      description: "50,000+ satisfied investors"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">InvestFlow</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <Link
                to="/login"
                className="px-6 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Side - Details */}
          <div className="flex flex-col justify-center">
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Start Building Your
                  <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                    Financial Future
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 mb-10">
                  Join thousands of investors who are growing their wealth with our proven investment strategies. 
                  Get started with just $100 and watch your capital grow.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                

                {/* Testimonials */}
                <div className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-xl">
                  <p className="text-gray-700 italic mb-3">
                    "InvestFlow helped me grow my initial investment by 300% in just 6 months. 
                    The platform is intuitive and the returns are consistent."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      SJ
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Investor since 2022</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="w-full md:max-w-md">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600">
                    Enter your details to get started
                  </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                  <StepLabels />
                  <StepIndicator />
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full mt-6 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            placeholder="••••••••"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Referral Code (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                            placeholder="Enter referral code"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          Continue
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Review & Complete
                        </h3>
                        <p className="text-gray-600">
                          Verify your information and accept terms
                        </p>
                      </div>

                      <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-semibold text-gray-900">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold text-gray-900">{formData.email}</span>
                        </div>
                        {formData.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-semibold text-gray-900">{formData.phone}</span>
                          </div>
                        )}
                        {formData.referralCode && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Referral Code:</span>
                            <span className="font-semibold text-gray-900">{formData.referralCode}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="h-5 w-5 mt-1 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                              Terms of Service
                            </a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                              Privacy Policy
                            </a>
                          </label>
                        </div>

                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="marketing"
                            className="h-5 w-5 mt-1 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="marketing" className="ml-3 text-sm text-gray-700">
                            I want to receive investment tips and updates via email
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                        >
                          Edit 
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={loading || !acceptedTerms}
                          className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              Complete 
                              <CheckCircle className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  © 2026 InvestFlow. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register;