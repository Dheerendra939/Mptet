import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-4xl font-black text-slate-900 mb-8">Terms & Conditions</h1>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="text-slate-500 text-sm italic mb-8">Last Updated: May 19, 2024</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">2. Use of Service</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            You agree to use the service for lawful purposes only. Unauthorized use or reproduction of the study material is strictly prohibited.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">3. User Accounts</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">4. Payment Policy</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            All payments are processed securely. Access to premium content is granted upon successful verification of payment.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">5. Intellectual Property</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            All content included on this site, such as text, graphics, logos, and images, is the property of Dheerendra Tiwari and protected by international copyright laws.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
