"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Search, Briefcase, Code, Trophy, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/common/Navbar.jsx';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative pt-20">
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full" />
      </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-borderCustom glass mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
              <span className="text-sm font-medium text-textMuted">Welcome to the Next-Gen Internship Portal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
            >
              Bridge the Gap Between <br />
              <span className="gradient-text">Talent and Opportunity</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-textMuted mb-12 max-w-2xl mx-auto"
            >
              The ultimate platform for students to find meaningful internships and for companies to hire top-tier, pre-vetted talent seamlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => router.push('/signup?type=student')}
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30"
              >
                <Search className="w-5 h-5" />
                Find an internship
              </button>
              <button 
                onClick={() => router.push('/signup?type=employee')}
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 glass text-white rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                <Briefcase className="w-5 h-5" />
                Hire an intern
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-textMuted"
            >
              Already have an account? <button onClick={() => router.push('/login')} className="text-primary hover:underline font-medium">Log in</button>
            </motion.div>
          </div>
        </div>

        {/* Feature Cards restored */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-3xl hover:border-primary/50 transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30">
              <Code className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Code Validation</h3>
            <p className="text-textMuted text-sm leading-relaxed">
              Real-time analysis parsing your commits and measuring code quality, giving immediate feedback without human intervention.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-3xl hover:border-accent/50 transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 border border-accent/30">
              <Trophy className="text-accent w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gamified Learning</h3>
            <p className="text-textMuted text-sm leading-relaxed">
              Earn XP points, conquer leaderboards, and claim badges based on your direct repository impact and velocity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-3xl hover:border-secondary/50 transition-colors duration-300"
          >
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 border border-secondary/30">
              <ShieldCheck className="text-secondary w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cryptographic Certificates</h3>
            <p className="text-textMuted text-sm leading-relaxed">
              Automated service renders a cryptographic signature over an elegant PDF format upon completion.
            </p>
          </motion.div>
        </div>
    </div>
  );
}
