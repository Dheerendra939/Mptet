import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, GraduationCap, Users, Shield, Award, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">About Us</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
            We are Madhya Pradesh's leading digital platform dedicated to helping candidates excel in competitive examinations.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To provide high-quality, accessible, and affordable test preparation materials for aspirants across Madhya Pradesh. We believe that every student deserves the best tools to succeed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Community</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              With thousands of active users and a growing community of educators, we are building a collaborative ecosystem where aspirants share knowledge and achieve the results together.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Why Choose Mockia.in?</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Our platform is built by exam experts who have decoded the latest syllabus and patterns of various examinations including MPTET Varg 1, 2, and 3. We focus on:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
            <li className="flex items-center gap-3 text-slate-700 text-sm font-bold bg-slate-50 p-4 rounded-2xl">
              <Shield className="w-5 h-5 text-blue-600" /> Real Exam Interface
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-sm font-bold bg-slate-50 p-4 rounded-2xl">
              <Award className="w-5 h-5 text-blue-600" /> Expert Curated content
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-sm font-bold bg-slate-50 p-4 rounded-2xl">
              <Target className="w-5 h-5 text-blue-600" /> Detailed Performance Analysis
            </li>
            <li className="flex items-center gap-3 text-slate-700 text-sm font-bold bg-slate-50 p-4 rounded-2xl">
              <Zap className="w-5 h-5 text-blue-600" /> Instant Results & Ranking
            </li>
          </ul>
        </div>

        <div className="bg-blue-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent)]" />
          <h2 className="text-4xl font-black mb-4 relative z-10">Ready to start your journey?</h2>
          <p className="text-blue-100 text-lg mb-8 relative z-10 opacity-80">Join us today and become a certified government teacher.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-10 py-4 bg-white text-blue-900 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all relative z-10 shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
