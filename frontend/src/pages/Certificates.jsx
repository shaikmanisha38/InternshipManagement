import React from 'react';
import { ShieldCheck, Download, Share2 } from 'lucide-react';

const Linkedin = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { motion } from 'framer-motion';

export default function Certificates() {
  const isCompleted = false; // set to true when 8 weeks are complete

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Cryptographic Certificate Vault</h1>
        <p className="text-textMuted">View and verify your completion credentials on the public ledger.</p>
      </div>

      {!isCompleted ? (
        <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-borderCustom mt-12">
          <ShieldCheck className="w-16 h-16 text-textMuted/40 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">Certificate Locked</h2>
          <p className="text-textMuted max-w-lg mx-auto mb-8 leading-relaxed">
            Your cryptographic performance certificate will be generated automatically upon successful completion of the 8-week curriculum and final AI code sweep.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold text-sm text-textMuted">
            Current Status: Week 3 In Progress
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 rounded-3xl border border-secondary/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full" />
          
          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="flex-1 w-full border border-borderCustom rounded-xl overflow-hidden shadow-2xl bg-white aspect-[1.414/1] flex flex-col items-center justify-center text-black p-8 relative">
              <div className="absolute inset-2 border-4 border-double border-gray-300 pointer-events-none" />
              <ShieldCheck className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-500 mb-6">Automated Internship Portal</h3>
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Certificate of Completion</h2>
              <p className="text-gray-500 mb-6">This certifies that</p>
              <p className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-2 px-12">Alice Chen</p>
              <p className="text-sm text-gray-600 max-w-sm text-center">
                has successfully completed the 8-week rigorous engineering roadmap, demonstrating proficiency in Git workflows, advanced architectures, and modern web deployment.
              </p>
            </div>
            
            <div className="w-full md:w-64 space-y-4 shrink-0">
              <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20 mb-6">
                <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Status</p>
                <p className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Verified on Ledger
                </p>
                <p className="text-[10px] text-textMuted mt-2 font-mono break-all">
                  Tx: 0x8f2a...9b42
                </p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] text-white rounded-xl font-bold hover:bg-[#084e96] transition-colors shadow-lg">
                <Linkedin className="w-4 h-4" /> Add to LinkedIn
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 glass rounded-xl font-bold hover:bg-white/5 transition-colors">
                <Share2 className="w-4 h-4" /> Share Link
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
