import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGE_NAMES, SupportedLanguage } from '../../i18n/translations';
import { ShieldCheck, Zap, Globe, ChevronDown, Check } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t, isDeviceDetected, deviceLanguageCode } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentLangMeta = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.en;

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Speed Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-wider">
              CV
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                {t.siteTitle}
              </span>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                {t.secureConnection}
              </span>
            </div>
          </div>
        </div>

        {/* Badges & Device Language Selector */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/70 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Fast CDN</span>
          </div>

          {/* Language Switcher with Device Language Auto-indicator */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title={`${t.deviceLanguage}: ${currentLangMeta.name}`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-sm leading-none">{currentLangMeta.flag}</span>
              <span className="hidden md:inline text-xs font-semibold">{currentLangMeta.nativeName}</span>
              {isDeviceDetected && (
                <span className="hidden lg:inline-block text-[9px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-mono">
                  Device: {deviceLanguageCode}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-56 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.deviceLanguage} (Detected: {deviceLanguageCode})
                  </div>
                  <div className="py-1">
                    {(Object.keys(LANGUAGE_NAMES) as SupportedLanguage[]).map((langKey) => {
                      const item = LANGUAGE_NAMES[langKey];
                      const isSelected = language === langKey;
                      return (
                        <button
                          key={langKey}
                          type="button"
                          onClick={() => {
                            setLanguage(langKey);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-50/80 text-blue-700 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{item.flag}</span>
                            <span>{item.nativeName}</span>
                            <span className="text-[11px] text-slate-400">({item.name})</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
