import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExternalLink, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface AdBannerProps {
  type?: 'leaderboard' | 'box' | 'native';
  id?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type = 'leaderboard', id = 'ad-banner-slot' }) => {
  const { t } = useLanguage();

  if (type === 'box') {
    return (
      <div 
        id={id}
        className="w-full max-w-[320px] mx-auto bg-slate-50/80 border border-dashed border-slate-300 rounded-xl p-4 text-center select-none my-4 shadow-sm"
      >
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          <span>{t.adBannerLabel}</span>
          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Sponsored</span>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-100 rounded-lg p-3.5 text-left flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Ultra Fast Cloud Storage</p>
              <p className="text-[11px] text-slate-500">100 GB Free Trial with 10Gbps line</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            Instant high-speed global CDN synchronization with enterprise AES-256 security.
          </p>
          <a
            href="#sponsor-link"
            onClick={(e) => e.preventDefault()}
            className="mt-1 text-center py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-xs rounded-md transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (type === 'native') {
    return (
      <div 
        id={id}
        className="w-full max-w-xl mx-auto my-3 bg-slate-50/70 border border-slate-200/90 rounded-xl p-3 select-none"
      >
        <div className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold mb-1.5 flex items-center gap-1.5">
          <span>{t.adBannerLabel}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-slate-500">Sponsored Link</span>
        </div>
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">High-Speed Fiber Network</div>
              <div className="text-[11px] text-slate-500">Uncapped bandwidth for lightning-fast transfers</div>
            </div>
          </div>
          <button 
            type="button" 
            className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            Explore
          </button>
        </div>
      </div>
    );
  }

  // Default Leaderboard
  return (
    <div 
      id={id}
      className="w-full max-w-2xl mx-auto my-3 bg-slate-50/70 border border-dashed border-slate-300/80 rounded-xl p-3 text-center select-none"
    >
      <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1.5 px-1">
        <span>{t.adBannerLabel}</span>
        <span className="text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded">Ad Placement</span>
      </div>
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-lg p-3 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white leading-tight">Next-Gen Dedicated Cloud Servers</p>
            <p className="text-[11px] text-slate-300 hidden sm:block">Instant setup with 99.99% uptime guarantee & DDoS protection</p>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 active:scale-95 px-3 py-1.5 rounded-md transition-all shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Start Free</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
