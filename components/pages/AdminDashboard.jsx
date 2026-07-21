import React from 'react';
import { Users, AlertTriangle, CheckCircle2, TrendingUp, Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-textMuted">Platform overview, user management, and system analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Total Interns</h3>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">142</p>
        </div>
        
        <div className="glass p-6 rounded-2xl border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Completion Rate</h3>
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold">78%</p>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Churn Risk</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-accent">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Avg Code Score</h3>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">92/100</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6">Stagnation List (High Risk)</h2>
          <div className="space-y-4">
            {[
              { name: 'David Lee', days: 5, module: 'Week 2' },
              { name: 'Emma Wilson', days: 4, module: 'Week 3' },
              { name: 'Frank Ocean', days: 4, module: 'Week 3' },
            ].map((intern, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-borderCustom rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold">
                    {intern.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{intern.name}</h4>
                    <p className="text-xs text-textMuted">Stuck on {intern.module}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold text-sm block">{intern.days} days inactive</span>
                  <button className="text-xs text-primary font-bold hover:underline mt-1">Intervene</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance & Activity Tracking */}
        <div className="glass p-8 rounded-3xl border border-primary/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Attendance & Activity
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-textMuted font-bold">Daily Active Students</span>
                <span className="text-primary font-bold">85% (120/142)</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-textMuted font-bold">Task Completion Rate (Week 3)</span>
                <span className="text-accent font-bold">62%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-borderCustom">
              <h4 className="text-sm font-bold text-white mb-3">Recent Activity Logs</h4>
              <ul className="space-y-3">
                <li className="text-xs text-textMuted flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-white">Alice Chen</span> passed AI Evaluation for Week 3, Day 4.
                </li>
                <li className="text-xs text-textMuted flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span className="text-white">Bob Smith</span> failed Git Validation (Build Error).
                </li>
                <li className="text-xs text-textMuted flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-white">Charlie Davis</span> unlocked Week 4 modules.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border border-secondary/20 bg-secondary/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Manual Review Bypass
            </h2>
          </div>
          <p className="text-sm text-textMuted mb-6">
            Use this panel to manually override failed AI evaluations or Git validations for exceptional cases.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-background border border-borderCustom rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Search Intern</label>
              <input type="text" placeholder="e.g. Alice Chen" className="w-full bg-white/5 border border-borderCustom rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors" />
            </div>
            
            <div className="p-4 bg-background border border-borderCustom rounded-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Select Module</label>
              <select className="w-full bg-white/5 border border-borderCustom rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors appearance-none">
                <option>Week 1: Fundamentals</option>
                <option>Week 2: Advanced Concepts</option>
                <option>Week 3: Mini Modules</option>
                <option>Week 4: APIs & DBs</option>
                <option>Week 5: Main Project</option>
              </select>
            </div>

            <button className="w-full py-3 bg-secondary text-black font-bold rounded-xl hover:bg-secondary/90 transition-colors mt-2 shadow-lg shadow-secondary/20">
              Force Unlock Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
