import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div className="space-y-4 max-w-xs">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.svg" 
              alt="Mockia Logo" 
              className="w-8 h-8 rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="font-black text-lg tracking-tight text-slate-900">Mockia.in</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Madhya Pradesh's premium platform for competitive exam mock tests. 
            Empowering the next generation of educators.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/contact-us" className="text-slate-500 text-xs hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/about-us" className="text-slate-500 text-xs hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/promoters" className="text-slate-500 text-xs hover:text-blue-600 font-bold flex items-center gap-1 transition-colors"><span className="text-amber-500">🏆</span> Promoters Panel</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-slate-500 text-xs hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 text-xs hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-slate-500 text-xs hover:text-blue-600 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h3 className="font-bold text-slate-900 text-sm">Owner Details</h3>
            <p className="text-slate-500 text-[10px] leading-relaxed font-black uppercase tracking-widest mb-1 text-blue-600 flex items-center gap-1.5">
              <span className="bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm">OWNER</span>
              Dheerendra Tiwari
            </p>
            <p className="text-slate-500 text-[10px] leading-relaxed">
              Tinsa, Jabalpur,<br />
              Madhya Pradesh, 482051
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-[10px] font-medium tracking-wider">
          © Mockia.in. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-6">
          <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay Trusted" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
