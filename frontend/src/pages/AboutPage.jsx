import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Users, Code, LineChart, 
  Database, Server, Layout, Cpu, Mail, Phone, 
  User, Award, ClipboardCheck, ArrowRight
} from 'lucide-react';
import { GithubOutlined as Github, LinkedinOutlined as Linkedin } from '@ant-design/icons';
import Navbar from '../components/Navbar';

export default function AboutPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/register');
  const handleContactUs = () => navigate('/contact');

  return (
    <div className="min-h-screen bg-background text-textMuted overflow-hidden relative font-sans pt-20">
      <Navbar />
      
      {/* Background Effects matching Home Page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* 1. HERO SHOWCASE SECTION */}
        <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              AI-Powered <span className="text-primary">Internship Management</span> Platform
            </h1>
            <p className="text-lg md:text-xl text-textMuted leading-relaxed max-w-2xl mx-auto font-medium">
              Automate internship workflows, monitor student progress, evaluate code using AI, and generate certificates automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={handleContactUs}
                className="px-8 py-3.5 glass text-white font-bold rounded-xl hover:bg-white/5 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* 2. OUR MISSION BLOCK */}
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-12 border-l-4 border-l-primary flex items-center">
            <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              "Our mission is to simplify internship management through automation and artificial intelligence. We help colleges, mentors, and organizations track student learning efficiently while reducing manual work."
            </blockquote>
          </div>
        </section>

        {/* 3. COGNITIVE PIPELINE MATRIX */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Manual Friction vs. Automated Optimization</h2>
            <p className="text-textMuted max-w-2xl mx-auto">See how we transform chaotic manual processes into seamless operational pipelines.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Problem Column */}
            <div className="glass rounded-2xl p-8 border border-red-500/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <XCircle className="text-red-400 w-5 h-5" />
                </div>
                The Problem We Solve
              </h3>
              <ul className="space-y-4">
                {[
                  "Manual attendance tracking",
                  "Disconnected manual task monitoring",
                  "Subjective manual code reviews",
                  "Delayed manual certificate generation",
                  "Total lack of centralized student monitoring"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 text-red-400 font-bold">❌</span>
                    <span className="text-textMuted font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Column */}
            <div className="glass rounded-2xl p-8 border border-secondary/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                  <CheckCircle className="text-secondary w-5 h-5" />
                </div>
                Our Solution
              </h3>
              <ul className="space-y-4">
                {[
                  "Daily automated task assignment engine",
                  "Native GitHub ecosystem integration",
                  "Instant AI-powered code evaluation mechanics",
                  "Continuous micro-progress tracking pipelines",
                  "Structured weekly assessment runs",
                  "Automatic, cryptographically secure certificates"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 text-secondary font-bold">✅</span>
                    <span className="text-textMuted font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* 4. THE INTERACTIVE ROADMAP FLOW */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-textMuted max-w-2xl mx-auto">A seamless chronological journey from onboarding to graduation.</p>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-borderCustom -translate-y-1/2 hidden lg:block z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 relative z-10">
              {[
                { id: 1, title: 'Student Registration', desc: 'Secure profile creation' },
                { id: 2, title: 'Internship Assigned', desc: 'Mentor & role mapped' },
                { id: 3, title: 'Daily Tasks', desc: 'Automated assignments' },
                { id: 4, title: 'GitHub Verification', desc: 'Code commits synced' },
                { id: 5, title: 'AI Evaluation', desc: 'Instant code review' },
                { id: 6, title: 'Weekly Assessment', desc: 'Knowledge validated' },
                { id: 7, title: 'Certificate Gen', desc: 'Auto-issued on completion' },
              ].map((step) => (
                <div key={step.id} className="glass p-5 rounded-2xl flex flex-col items-center text-center relative group hover:-translate-y-1 transition-transform border border-borderCustom">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mb-4 border border-primary/30">
                    {step.id}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-textMuted font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TRIPLE-TIER BENEFIT ENGINE */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Tailored Workflows by Role</h2>
            <p className="text-textMuted max-w-2xl mx-auto">Optimized experiences for every stakeholder in the ecosystem.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 border-t-4 border-primary hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 border border-primary/30">
                <User className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">For Students</h3>
              <ul className="space-y-3">
                {['Structured learning', 'Instant AI feedback', 'Portfolio development', 'Performance tracking'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-textMuted font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-8 border-t-4 border-accent hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6 border border-accent/30">
                <ClipboardCheck className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">For Mentors</h3>
              <ul className="space-y-3">
                {['Student analytics', 'Automated code evaluations', 'Effortless progress tracking panels'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-textMuted font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-2xl p-8 border-t-4 border-secondary hover:border-secondary/50 transition-colors">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 border border-secondary/30">
                <Award className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">For Organizations</h3>
              <ul className="space-y-3">
                {['End-to-end internship automation', 'Reduced manual work hours', 'Enterprise-grade reporting'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-textMuted font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. INTEGRATION CORE & ECOSYSTEM STACK */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-10 md:p-16 border border-borderCustom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Infrastructure & Ecosystem</h2>
              <p className="text-textMuted max-w-2xl mx-auto">Powered by modern, scalable, and secure technologies.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: 'React / Next.js', icon: Layout },
                { name: 'NestJS', icon: Server },
                { name: 'PostgreSQL', icon: Database },
                { name: 'GitHub API', icon: Code },
                { name: 'OpenAI / Gemini', icon: Cpu },
                { name: 'Tailwind CSS', icon: Layout },
              ].map((tech, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl hover:scale-105 transition-transform cursor-default border border-white/5">
                  <tech.icon className="w-8 h-8 text-white mb-3" />
                  <span className="text-white font-bold text-sm text-center">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. GOVERNANCE & CONNECTIONS ROOM */}
        <footer className="glass border-t border-borderCustom py-16 mt-16">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            
            {/* Team Section */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Our Team</h3>
              <div className="space-y-6">
                {[
                  { name: 'Dr. Sarah Chen', role: 'Project Owner', initial: 'S' },
                  { name: 'Michael Rodriguez', role: 'Senior Mentor', initial: 'M' },
                  { name: 'Alex Johnson', role: 'Core Contributor', initial: 'A' },
                ].map((member, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-borderCustom">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                      {member.initial}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{member.name}</p>
                      <p className="text-textMuted font-medium text-sm">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Connect With Us</h3>
              <div className="bg-white/5 p-8 rounded-2xl border border-borderCustom">
                <ul className="space-y-5">
                  <li>
                    <a href="mailto:contact@internportal.com" className="flex items-center gap-4 text-textMuted hover:text-white font-bold transition-colors">
                      <Mail className="w-5 h-5 text-white" /> contact@internportal.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="flex items-center gap-4 text-textMuted hover:text-white font-bold transition-colors">
                      <Phone className="w-5 h-5 text-white" /> +1 (555) 123-4567
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-4 text-textMuted hover:text-white font-bold transition-colors">
                      <Linkedin className="w-5 h-5 text-white" /> LinkedIn Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-4 text-textMuted hover:text-white font-bold transition-colors">
                      <Github className="w-5 h-5 text-white" /> GitHub Repository
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </footer>
      </div>

    </div>
  );
}
