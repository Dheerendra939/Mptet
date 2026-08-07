import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
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

        <h1 className="text-4xl font-black text-slate-900 mb-8">Refund & Cancellation</h1>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="text-slate-500 text-sm italic mb-8">Last Updated: May 19, 2024</p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">1. Digital Products Policy</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Dheerendra Tiwari offers non-tangible, irrevocable digital goods (mock tests). We do not provide refunds after the product is purchased, which you acknowledge prior to purchasing any product on the website.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">2. Cancellation</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            You may stop using our services at any time. However, any payments already made for active test series or premium plans are non-refundable.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">3. Technical Issues</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            In case of duplicate payments or technical errors where the service was not rendered despite a successful payment, please contact us within 48 hours for a resolution or manual activation of the service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-4">4. Shipping & Delivery</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            All services provided on this platform are digital. There is no physical shipping involved. Access to mock tests is provided instantly upon successful payment.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RefundPolicy;
