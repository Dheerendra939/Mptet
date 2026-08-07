import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Mail, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
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

        <h1 className="text-4xl font-black text-slate-900 mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Email</p>
                <p className="text-slate-500 text-sm">Dheerendrat939@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Phone</p>
                <p className="text-slate-500 text-sm">+91 62676 52785</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Address</p>
                <p className="text-slate-500 text-sm">Tinsa, Jabalpur, Madhya Pradesh 482051</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-3xl text-white">
            <h2 className="text-xl font-bold mb-4">Support Hours</h2>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Our support team is available from Monday to Saturday, 10:00 AM to 6:00 PM (IST).
            </p>
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Response Time</p>
              <p className="text-lg font-black italic">Under 24 Hours</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
