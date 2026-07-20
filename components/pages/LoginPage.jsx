"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Mail, Lock, Briefcase, GraduationCap, ShieldAlert, Shield, KeyRound, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/common/Navbar.jsx';

export default function LoginPage() {
  const router = useRouter();
  
  // viewMode can be: 'login', 'forgot_email', 'reset_password'
  const [viewMode, setViewMode] = useState('login');
  
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LOGIN HANDLER ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Enforce that the selected tab matches their actual role
      const role = data.user.role;
      const expectedRole = userType.toUpperCase();
      
      if (role !== expectedRole) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error(Account type mismatch. Please select the  + role.charAt(0) + role.slice(1).toLowerCase() +  tab to log in.);
      }

      if (role === 'STUDENT') {
        router.push('/dashboard');
      } else if (role === 'MENTOR') {
        router.push('/mentor');
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- SEND VERIFICATION CODE HANDLER ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setSuccessMsg(data.message || 'Verification code sent to your email.');
      setViewMode('reset_password');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RESET PASSWORD HANDLER ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: resetCode, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccessMsg('Password has been reset successfully! You can now log in.');
      setViewMode('login');
      setPassword('');
      setResetCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 pt-20">
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-background to-background opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-3xl z-10 relative shadow-2xl"
      >
        <AnimatePresence mode="wait">
          
          {/* =========================================================
              VIEW: LOGIN
             ========================================================= */}
          {viewMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 text-white">Welcome Back</h2>
                <p className="text-textMuted">Log in to your account.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
                  <KeyRound className="w-5 h-5 shrink-0" />
                  <p>{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="flex bg-black/40 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('student');
                      setEmail('');
                      setPassword('');
                      clearMessages();
                    }}
                    className={lex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all  + (userType === 'student' ? 'bg-primary text-white shadow-lg' : 'text-textMuted hover:text-white')}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('mentor');
                      setEmail('');
                      setPassword('');
                      clearMessages();
                    }}
                    className={lex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all  + (userType === 'mentor' ? 'bg-accent text-white shadow-lg' : 'text-textMuted hover:text-white')}
                  >
                    <Briefcase className="w-4 h-4" />
                    Mentor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('admin');
                      setEmail('');
                      setPassword('');
                      clearMessages();
                    }}
                    className={lex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all  + (userType === 'admin' ? 'bg-red-500 text-white shadow-lg' : 'text-textMuted hover:text-white')}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address" 
                      className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" 
                      className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      setViewMode('forgot_email');
                      clearMessages();
                      setPassword('');
                    }}
                    className="text-sm text-textMuted hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              <p className="text-center text-textMuted mt-6 text-sm">
                Don't have an account?{' '}
                <button onClick={() => router.push('/signup')} className="text-primary hover:underline font-semibold">
                  Sign up
                </button>
              </p>
            </motion.div>
          )}

          {/* =========================================================
              VIEW: FORGOT PASSWORD (EMAIL)
             ========================================================= */}
          {viewMode === 'forgot_email' && (
            <motion.div
              key="forgot_email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setViewMode('login')}
                className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-6 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold mb-2 text-white">Reset Password</h2>
                <p className="text-textMuted">Enter your email address and we'll send you a verification code.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email" 
                    className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            </motion.div>
          )}

          {/* =========================================================
              VIEW: FORGOT PASSWORD (VERIFY & RESET)
             ========================================================= */}
          {viewMode === 'reset_password' && (
            <motion.div
              key="reset_password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setViewMode('forgot_email')}
                className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-6 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Change Email
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold mb-2 text-white">Enter Code</h2>
                <p className="text-textMuted">We've sent a 6-digit code to <strong className="text-white">{email}</strong>.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
                  <KeyRound className="w-5 h-5 shrink-0" />
                  <p>{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <ShieldAlert className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
                    <input 
                      type="text" 
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="6-digit verification code" 
                      className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted tracking-[0.5em] text-center font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      maxLength={6}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password" 
                      className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
