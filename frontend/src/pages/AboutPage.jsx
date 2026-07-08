import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Building2, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      <Navbar />

      {/* Hero Image Banner */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Banner Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">About Us</h1>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <span className="text-white">/</span>
            <span className="text-white">About Us</span>
          </div>
        </div>
        
        {/* Decorative bottom bar (mimicking the yellow bar in screenshot) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
      </div>

      {/* Ambient Background for content */}
      <div className="absolute top-[600px] left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

        {/* Mission / Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-[2rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-32 h-32 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 mb-8">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-textMuted text-lg leading-relaxed">
              To eliminate the friction in early-career hiring by providing a standardized, AI-validated environment where students can prove their practical skills, making technical interviews obsolete.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-[2rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-32 h-32 text-accent" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 mb-8">
              <Users className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-textMuted text-lg leading-relaxed">
              A world where merit and demonstrable skill define career trajectories. We envision a global ecosystem where every dedicated student has a clear pathway to their dream job.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Whether you are a student looking to level up or a company seeking exceptional interns, the platform is ready for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/signup?type=student')}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Join as Student
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/signup?type=employee')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <Building2 className="w-5 h-5" />
                Join as Company
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
