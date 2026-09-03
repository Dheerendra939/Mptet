import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/arbitrage/Header';
import { AdBanner } from '../components/arbitrage/AdBanner';
import { FileInfoCard } from '../components/arbitrage/FileInfoCard';
import { 
  ArrowRight, 
  Loader2, 
  Timer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

export const ContinuePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // 15 seconds countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setCanContinue(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanContinue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const handleContinueClick = () => {
    if (!canContinue || isRedirecting) return;
    setIsRedirecting(true);
    setTimeout(() => {
      navigate('/file');
    }, 400);
  };

  const waitButtonText = t.waitCountdownButton.replace('{s}', secondsRemaining.toString());

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 selection:bg-blue-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
          {/* Top Leaderboard Ad */}
          <AdBanner type="leaderboard" id="continue-top-ad" />

          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>{canContinue ? t.sessionSecured : t.generatingDirectToken}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.continuePageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
              {t.continuePageSubtitle}
            </p>
          </div>

          {/* File summary */}
          <FileInfoCard />

          {/* Blue Counting Button Card (Wait 15 seconds to continue) */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm text-center flex flex-col items-center gap-5">
            {/* Visual timer countdown circle */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-blue-600 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * (15 - secondsRemaining)) / 15}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {canContinue ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
                ) : (
                  <>
                    <span className="text-2xl font-black text-blue-600 font-mono">
                      {secondsRemaining}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">sec</span>
                  </>
                )}
              </div>
            </div>

            <div className="max-w-md">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {canContinue ? t.sessionSecured : `Please wait ${secondsRemaining}s...`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {canContinue 
                  ? 'Your direct high-speed download link is unlocked. Click Continue to download your file.' 
                  : 'High-speed cloud servers are reserving dedicated bandwidth for your connection.'}
              </p>
            </div>

            {/* Requested Blue Counting Button */}
            <div className="w-full max-w-md">
              <button
                id="btn-continue"
                type="button"
                disabled={!canContinue || isRedirecting}
                onClick={handleContinueClick}
                className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all cursor-pointer select-none shadow-md ${
                  canContinue && !isRedirecting
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-500/30 ring-4 ring-blue-500/20'
                    : isRedirecting
                      ? 'bg-blue-700 text-white cursor-wait'
                      : 'bg-blue-500/80 text-white cursor-not-allowed opacity-90 shadow-blue-500/10'
                }`}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading File...</span>
                  </>
                ) : canContinue ? (
                  <>
                    <span>{t.continueButtonReady}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Timer className="w-5 h-5 animate-pulse" />
                    <span>{waitButtonText}</span>
                  </>
                )}
              </button>
            </div>

            {/* Micro verification badge */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>End-to-End Encrypted Tunnel • Zero Waiting Queue</span>
            </div>
          </div>

          {/* Ad slot in page */}
          <AdBanner type="box" id="continue-box-ad" />
        </main>
      </div>

      <footer className="w-full bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CloudVault CDN • High Speed Pipeline</span>
          <span className="text-[11px] text-slate-400">
            Encrypted Content Delivery Platform
          </span>
        </div>
      </footer>
    </div>
  );
};
