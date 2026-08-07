import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-16 bg-blue-900 flex items-center justify-between pl-4 pr-4 text-white shrink-0 z-50 shadow-lg relative">
      <div 
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => navigate('/dashboard')}
      >
        <img 
          src="/logo.svg" 
          alt="Mockia Logo" 
          className="w-9 h-9 rounded-lg shadow-sm border border-white/10 transition-transform group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-white">
          Mockia<span className="text-blue-400">.in</span>
        </span>
      </div>

      <div className="flex items-center gap-6" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-colors focus:outline-none group"
        >
          <div className="flex flex-col items-end">
            <span className="text-sm sm:text-lg font-black tracking-tight truncate max-w-[120px] sm:max-w-[200px]">
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-blue-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </div>
          
          <div className="relative">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email?.split('@')[0] || 'User')}&background=random`} 
              alt="Profile" 
              className="w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full border-2 border-blue-400/50 shadow-lg object-cover transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-6 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <p className="text-slate-900 font-black text-sm truncate">
                  {user?.displayName || 'User Account'}
                </p>
                <p className="text-slate-500 text-[10px] font-medium truncate">
                  {user?.email}
                </p>
              </div>
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
