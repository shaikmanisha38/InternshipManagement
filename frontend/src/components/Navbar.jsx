import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Code as CodeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-borderCustom/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
            <CodeIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Intern Portal</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-white ${
                    isActive ? 'text-white' : 'text-textMuted'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="h-6 w-px bg-borderCustom"></div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-textMuted hover:text-white transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-textMuted hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-borderCustom/50 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium transition-colors ${
                      isActive ? 'text-primary' : 'text-textMuted hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <hr className="border-borderCustom/50 my-2" />
              <button 
                onClick={() => { navigate('/login'); setIsOpen(false); }}
                className="text-lg font-medium text-left text-textMuted hover:text-white transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => { navigate('/signup'); setIsOpen(false); }}
                className="py-3 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary/90 transition-all mt-2 text-center"
              >
                Sign up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
