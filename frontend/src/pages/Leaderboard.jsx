import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Zap, Award } from 'lucide-react';

export default function Leaderboard() {
  const users = [
    { rank: 1, name: 'Alice Chen', points: 14500, streak: 12, commits: 145 },
    { rank: 2, name: 'Bob Smith', points: 13200, streak: 8, commits: 120 },
    { rank: 3, name: 'Charlie Davis', points: 12850, streak: 15, commits: 110 },
    { rank: 4, name: 'Diana Ross', points: 11900, streak: 5, commits: 95 },
    { rank: 5, name: 'Eve Martinez', points: 10400, streak: 3, commits: 80 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Team Leaderboard</h1>
          <p className="text-textMuted">Real-time ranking based on Daily Task XP across the 8-Week Roadmap.</p>
        </div>
        <div className="bg-primary/20 text-primary px-4 py-2 rounded-xl border border-primary/30 flex items-center gap-2 font-bold shadow-lg shadow-primary/10">
          <Trophy className="w-5 h-5" />
          Your Rank: #14
        </div>
      </div>

      {/* Top 3 Podium (Visual placeholder) */}
      <div className="flex justify-center items-end h-48 gap-4 mt-12 mb-8">
        <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.2}} className="w-32 bg-slate-800/50 rounded-t-2xl border-t-4 border-slate-400 p-4 text-center h-32 flex flex-col justify-end">
          <div className="text-slate-400 font-bold mb-2">#2 Bob</div>
        </motion.div>
        <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} className="w-32 bg-yellow-900/30 rounded-t-2xl border-t-4 border-yellow-500 p-4 text-center h-40 flex flex-col justify-end relative shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <Medal className="w-10 h-10 text-yellow-500 absolute -top-12 left-1/2 -translate-x-1/2" />
          <div className="text-yellow-500 font-bold mb-2">#1 Alice</div>
        </motion.div>
        <motion.div initial={{y: 50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.3}} className="w-32 bg-amber-900/30 rounded-t-2xl border-t-4 border-amber-700 p-4 text-center h-28 flex flex-col justify-end">
          <div className="text-amber-600 font-bold mb-2">#3 Charlie</div>
        </motion.div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-borderCustom">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-borderCustom">
              <th className="p-4 font-bold text-textMuted uppercase text-xs tracking-wider">Rank</th>
              <th className="p-4 font-bold text-textMuted uppercase text-xs tracking-wider">Intern</th>
              <th className="p-4 font-bold text-textMuted uppercase text-xs tracking-wider text-right">Points</th>
              <th className="p-4 font-bold text-textMuted uppercase text-xs tracking-wider text-right">Commits</th>
              <th className="p-4 font-bold text-textMuted uppercase text-xs tracking-wider text-right">Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="border-b border-borderCustom/50 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-lg">
                  {user.rank === 1 ? <span className="text-yellow-500">#1</span> : 
                   user.rank === 2 ? <span className="text-slate-400">#2</span> : 
                   user.rank === 3 ? <span className="text-amber-600">#3</span> : 
                   `#${user.rank}`}
                </td>
                <td className="p-4 font-semibold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-bg flex items-center justify-center text-xs text-white">
                    {user.name.charAt(0)}
                  </div>
                  {user.name}
                </td>
                <td className="p-4 text-right font-bold text-secondary font-mono">{user.points.toLocaleString()}</td>
                <td className="p-4 text-right font-medium text-textMuted">{user.commits}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-lg text-sm font-bold">
                    <Zap className="w-4 h-4" />
                    {user.streak}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Badges Section */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Badge Repository</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'First Push', desc: 'Valid push to main branch', color: 'text-primary border-primary/30 bg-primary/10' },
          { name: 'Bug Squasher', desc: 'Fixed 5 AI lint errors', color: 'text-secondary border-secondary/30 bg-secondary/10' },
          { name: 'Streak King', desc: '10 day commit streak', color: 'text-orange-500 border-orange-500/30 bg-orange-500/10' },
          { name: 'Test Master', desc: '80% coverage reached', color: 'text-accent border-accent/30 bg-accent/10', locked: true },
        ].map((badge, i) => (
          <div key={i} className={`p-6 rounded-2xl border text-center ${badge.locked ? 'bg-white/5 border-borderCustom opacity-50 grayscale' : badge.color}`}>
            <Award className="w-12 h-12 mx-auto mb-4" />
            <h3 className="font-bold mb-1">{badge.name}</h3>
            <p className="text-xs opacity-80">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
