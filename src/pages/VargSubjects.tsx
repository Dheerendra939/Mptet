import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, LayoutDashboard, FileText, BarChart3, BookMarked, ArrowRight, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SUBJECTS_VARG1 = [
  'Hindi', 'English', 'Sanskrit', 'Urdu', 'Mathematics', 'Physics', 'Biology', 
  'Chemistry', 'Home Science', 'Commerce', 'History', 'Geography', 
  'Political Science', 'Economics', 'Agriculture', 'Sociology'
];

const SUBJECTS_VARG2 = [
  'Mathematics', 'Science', 'Social Science', 'Hindi', 'English', 'Sanskrit'
];

const SUBJECT_DISPLAY: Record<string, string> = {
  'Hindi': 'हिन्दी',
  'English': 'English',
  'Sanskrit': 'संस्कृत',
  'Urdu': 'उर्दू',
  'Mathematics': 'गणित',
  'Physics': 'भौतिक विज्ञान',
  'Biology': 'जीव विज्ञान',
  'Chemistry': 'रसायन विज्ञान',
  'Home Science': 'गृह विज्ञान',
  'Commerce': 'वाणिज्य',
  'History': 'इतिहास',
  'Geography': 'भूगोल',
  'Political Science': 'राजनीति विज्ञान',
  'Economics': 'अर्थशास्त्र',
  'Agriculture': 'कृषि',
  'Sociology': 'समाजशास्त्र',
  'Science': 'विज्ञान',
  'Social Science': 'सामाजिक विज्ञान'
};

export default function VargSubjects() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isVarg1 = pathname.includes('/varg1');
  const vargCode = isVarg1 ? 'varg1' : 'varg2';
  const subjects = isVarg1 ? SUBJECTS_VARG1 : SUBJECTS_VARG2;
  const title = isVarg1 ? 'MPTET Varg 1 (High School)' : 'MPTET Varg 2 (Middle School)';

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: false, path: '/dashboard' },
    { label: 'My Mock Tests', icon: FileText, active: false },
    { label: 'Performance', icon: BarChart3, active: false },
    { label: 'Study Material', icon: BookMarked, active: false },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 gap-8 hidden lg:flex">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  item.active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all" />
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-400 mb-1">PRO PLAN</p>
            <p className="text-xs font-medium leading-relaxed opacity-80 mb-3">Unlock 500+ premium mock tests & detailed analysis.</p>
            <button className="w-full py-2 bg-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors">
              Upgrade Now
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] transition-all mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            <header className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
              <p className="text-slate-500 text-sm font-medium max-w-2xl opacity-90">Select your specialized subject to view available high-quality mock tests.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {subjects.map((subject, i) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => navigate(`/${vargCode}/tests/${subject.toLowerCase()}`)}
                  className="bg-blue-900 border border-white/10 p-5 rounded-[2rem] cursor-pointer group transition-all flex flex-col justify-between h-32 shadow-xl text-white relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 transform rotate-12 group-hover:rotate-0">
                    <BookOpen className="w-32 h-32" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center flex-1 justify-center -mt-2">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] group-hover:text-blue-200 transition-colors duration-300 px-4 leading-tight uppercase text-center">
                      {subject}
                    </h3>
                    <div className="w-8 h-1 bg-blue-500/40 rounded-full mt-2 group-hover:w-16 group-hover:bg-blue-400 transition-all duration-500" />
                  </div>

                  <div className="relative z-10 mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:text-white transition-all">
                      {isVarg1 ? 'VARG 1' : 'VARG 2'}
                    </span>
                    <div className="flex items-center gap-1.5 font-black text-[9px] uppercase tracking-widest text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                      VIEW TESTS
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
