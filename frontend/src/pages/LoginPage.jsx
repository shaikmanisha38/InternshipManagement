import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase, GraduationCap } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bypass authentication for now, route directly to dashboard
    navigate('/dashboard');
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2 text-white">Welcome Back</h2>
          <p className="text-textMuted">Log in to your account.</p>
        </div>

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
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
              <input 
                type="email" 
                required
                placeholder="Email Address" 
                className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-textMuted" />
              <input 
                type="password" 
                required
                placeholder="Password" 
                className="w-full bg-black/20 border border-borderCustom rounded-xl py-3 pl-12 pr-4 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-textMuted hover:text-primary transition-colors">
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-textMuted mt-6 text-sm">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-primary hover:underline font-semibold">
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
