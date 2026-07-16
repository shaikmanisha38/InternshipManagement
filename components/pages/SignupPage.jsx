"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

import { User, Mail, Lock, Briefcase, GraduationCap, ShieldAlert } from 'lucide-react';
import Navbar from '@/components/common/Navbar.jsx';

export default function SignupPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [userType, setUserType] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'employee') {
      setUserType('employee');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role: userType === 'employee' ? 'MENTOR' : 'STUDENT'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Success! Redirect to login
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 pt-20">
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-3xl z-10 relative shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2 text-white">Create an Account</h2>
          <p className="text-textMuted">Join our platform today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Toggle */}
          <div className="flex bg-black/40 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                userType === 'student' ? 'bg-primary text-white shadow-lg' : 'text-textMuted hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType('employee')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                userType === 'employee' ? 'bg-accent text-white shadow-lg' : 'text-textMuted hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Employee
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" 
                className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 mt-6 disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-textMuted mt-6 text-sm">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-primary hover:underline font-semibold">
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
