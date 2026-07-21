"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Code as CodeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-borderCustom/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
            <CodeIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-white">National Internship</span>
            <span className="text-sm font-medium text-primary">Portal</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-white ${pathname === link.path ? 'text-white' : 'text-textMuted'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-borderCustom"></div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="text-sm font-bold text-textMuted hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Register
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
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors ${pathname === link.path ? 'text-primary' : 'text-textMuted hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-borderCustom/50 my-2" />
              <button
                onClick={() => { router.push('/login'); setIsOpen(false); }}
                className="text-lg font-medium text-left text-textMuted hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { router.push('/signup'); setIsOpen(false); }}
                className="py-3 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary/90 transition-all mt-2 text-center"
              >
                Register
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
