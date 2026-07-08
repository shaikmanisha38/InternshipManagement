import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Clock, Code2, Play, GitCommit, Bot, Lock, Unlock, Trophy } from 'lucide-react';

export default function DashboardHome() {
  const [taskState, setTaskState] = useState('idle'); // 'idle' | 'validating' | 'evaluating' | 'success'
  const [githubUrl, setGithubUrl] = useState('');

  const roadmap = [
    { title: 'Weeks 1-2: Fundamentals', status: 'completed', desc: 'Core concepts and basic architecture.' },
    { title: 'Weeks 3-4: Mini modules', status: 'active', desc: 'Building isolated components and APIs.' },
    { title: 'Weeks 5-6: Main project', status: 'locked', desc: 'Integrating modules into a cohesive app.' },
    { title: 'Week 7: Advanced features & testing', status: 'locked', desc: 'Performance, security, and unit tests.' },
    { title: 'Week 8: Final review & certificate', status: 'locked', desc: 'Project presentation and certification.' },
  ];

  const handleValidate = () => {
    if (!githubUrl) return;
    setTaskState('validating');
    
    // Mock the validation workflow
    setTimeout(() => {
      setTaskState('evaluating');
      setTimeout(() => {
        setTaskState('success');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome & Project Assignment */}
      <div className="glass p-8 rounded-3xl border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
            <p className="text-textMuted">You are currently assigned to:</p>
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary font-bold">
              <Code2 className="w-5 h-5" />
              Full-Stack E-Commerce Architecture
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-black/30 p-4 rounded-xl border border-borderCustom text-center min-w-[120px]">
              <div className="text-3xl font-black text-white">Day 18</div>
              <div className="text-xs text-textMuted uppercase font-bold tracking-wider mt-1">Timeline</div>
            </div>
            <div className="bg-black/30 p-4 rounded-xl border border-borderCustom text-center min-w-[120px]">
              <div className="text-3xl font-black text-accent">1,250</div>
              <div className="text-xs text-textMuted uppercase font-bold tracking-wider mt-1">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: 2-Month Roadmap */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            2-Month Roadmap
          </h2>
          <div className="glass p-6 rounded-2xl">
            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-borderCustom before:to-transparent">
              
              {roadmap.map((phase, idx) => (
                <div key={idx} className="relative flex items-start gap-4 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-background ${
                    phase.status === 'completed' ? 'border-primary text-primary' : 
                    phase.status === 'active' ? 'border-accent text-accent shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 
                    'border-borderCustom text-textMuted'
                  }`}>
                    {phase.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                     phase.status === 'active' ? <Play className="w-4 h-4 fill-current" /> : 
                     <Circle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      phase.status === 'completed' ? 'text-white' : 
                      phase.status === 'active' ? 'text-accent' : 
                      'text-textMuted'
                    }`}>{phase.title}</h3>
                    <p className="text-sm text-textMuted mt-1 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Right Col: Daily Task & Git Validation */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Current Daily Task
          </h2>
          
          {/* Active Task Card */}
          <div className="glass p-6 md:p-8 rounded-3xl border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-xs font-bold uppercase tracking-wider">
                Week 3, Day 4
              </span>
              <span className="px-3 py-1 bg-white/5 text-textMuted rounded-lg text-xs font-bold uppercase tracking-wider">
                Backend API
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Implement JWT Authentication Middleware</h3>
            <p className="text-textMuted mb-8 leading-relaxed">
              Create a secure middleware function in Express that extracts and verifies a JSON Web Token (JWT) from the Authorization header. If the token is valid, append the decoded user payload to the request object and pass control to the next handler. If invalid, return a 401 Unauthorized response.
            </p>

            <hr className="border-borderCustom/50 mb-8" />

            {/* GitHub Validation Flow */}
            <div className="bg-black/30 rounded-2xl p-6 border border-borderCustom">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <GitCommit className="w-5 h-5" />
                Submit Code for Verification
              </h4>
              
              {taskState === 'idle' && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="Paste GitHub Commit URL (e.g., https://github.com/user/repo/commit/xyz)"
                    className="flex-1 bg-black/40 border border-borderCustom rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                  <button 
                    onClick={handleValidate}
                    disabled={!githubUrl}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Run Validation
                  </button>
                </div>
              )}

              {taskState === 'validating' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-12 h-12 border-4 border-borderCustom border-t-primary rounded-full animate-spin mb-4"></div>
                  <h5 className="font-bold text-lg mb-2">Validating Git Commit...</h5>
                  <p className="text-textMuted text-sm">Checking repository access and commit hashes.</p>
                </motion.div>
              )}

              {taskState === 'evaluating' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <Bot className="w-12 h-12 text-accent mb-4 animate-bounce" />
                  <h5 className="font-bold text-lg mb-2 text-accent">AI is Evaluating Code...</h5>
                  <p className="text-textMuted text-sm">Analyzing code quality, security vulnerabilities, and logic correctness against the prompt.</p>
                </motion.div>
              )}

              {taskState === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h5 className="font-bold text-xl text-emerald-400 mb-2">Task Successfully Completed!</h5>
                  <p className="text-emerald-400/80 mb-6">Your code passed all automated tests and AI evaluation standards. +50 XP</p>
                  <button 
                    onClick={() => { setTaskState('idle'); setGithubUrl(''); }}
                    className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Unlock Next Task
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Locked Upcoming Task */}
          <div className="glass p-6 rounded-2xl border-borderCustom/50 opacity-60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-textMuted" />
                <span className="text-xs font-bold uppercase tracking-wider text-textMuted">Upcoming: Day 5</span>
              </div>
              <h4 className="font-bold text-white/50">Database Schema Design</h4>
            </div>
            <button disabled className="px-4 py-2 bg-white/5 rounded-lg text-sm font-medium text-textMuted cursor-not-allowed flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Locked
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
