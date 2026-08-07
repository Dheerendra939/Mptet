import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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

        <h1 className="text-4xl font-black text-slate-900 mb-8">Privacy Policy</h1>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="text-slate-500 text-sm italic mb-8">Effective Date: May 19, 2024</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            We collect information when you register on our site, place an order, or subscribe to our newsletter. This includes your name, email address, and payment information processed through secure third-party gateways.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            The information we collect is used to personalize your experience, improve our website, process transactions, and send periodic emails regarding your order or other products and services.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">3. Data Security</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">4. Cookies</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            We use cookies to help us remember and process the items in your shopping cart and understand and save your preferences for future visits.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">5. Third-Party Disclosure</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Dheerendra Tiwari does not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist in operating the website and conducting business.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
