import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/arbitrage/Header';
import { AdBanner } from '../components/arbitrage/AdBanner';
import { FileInfoCard } from '../components/arbitrage/FileInfoCard';
import { 
  Check, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  ArrowRight, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRtl } = useLanguage();

  // 10-second countdown for the checkbox loading
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isVerifyingClick, setIsVerifyingClick] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // 10 second timer for checkbox loading
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setIsCaptchaLoaded(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCaptchaLoaded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  // Back button interception: "If user click back button in download page redirect him to open page."
  useEffect(() => {
    // Push an extra state so popping it triggers popstate
    try {
      window.history.pushState(null, '', window.location.href);
    } catch (_) {}

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      navigate('/open');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleCheckboxClick = () => {
    if (!isCaptchaLoaded || isChecked || isVerifyingClick) return;
    setIsVerifyingClick(true);
    // Simulating quick verification check mark
    setTimeout(() => {
      setIsVerifyingClick(false);
      setIsChecked(true);
    }, 600);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked || isRedirecting) return;
    setIsRedirecting(true);
    setTimeout(() => {
      navigate('/open');
    }, 500);
  };

  const formattedLoadingText = t.securityCheckLoading.replace('{s}', secondsRemaining.toString());

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 selection:bg-blue-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
          {/* Top Ad Banner */}
          <AdBanner type="leaderboard" id="download-top-ad" />

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.downloadPageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
              {t.downloadPageSubtitle}
            </p>
          </div>

          {/* File summary */}
          <FileInfoCard />

          {/* Human Verification Box (Requested 10-second loading with spinner at place of checkbox) */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                  {t.securityCheckTitle}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Cloudflare / reCAPTCHA v3
              </span>
            </div>

            {/* Captcha Box Widget */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center min-h-[140px] transition-all">
              {!isCaptchaLoaded ? (
                /* Loading state: Spinner rotates in place of the checkbox for 10 seconds */
                <div className="flex flex-col items-center gap-3 text-center py-2">
                  <div className="relative flex items-center justify-center">
                    {/* Rotating spinner */}
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="absolute text-[11px] font-bold text-blue-700">
                      {secondsRemaining}s
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      {formattedLoadingText}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Checking browser environment before unlocking verification checkbox...
                    </p>
                  </div>
                  {/* Progress bar */}
                  <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
                    <div 
                      className="bg-blue-600 h-1.5 transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((10 - secondsRemaining) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* Loaded State: Spinner turns into real verification checkbox */
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
                  <div 
                    onClick={handleCheckboxClick}
                    className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked 
                        ? 'bg-emerald-50/60 border-emerald-300' 
                        : 'bg-white border-slate-300 hover:border-blue-400 hover:shadow-xs'
                    }`}
                  >
                    {/* The Checkbox Box */}
                    <div 
                      id="recaptcha-checkbox"
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                          : isVerifyingClick
                            ? 'bg-slate-50 border-blue-500'
                            : 'bg-white border-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {isVerifyingClick ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : isChecked ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : null}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 leading-none">
                        {isChecked ? t.verifiedHuman : t.iAmNotRobot}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">
                        {isChecked ? 'Verification successful' : 'Click to verify you are not an automated robot'}
                      </span>
                    </div>
                  </div>

                  {/* Logo / Badge */}
                  <div className="flex items-center sm:flex-col items-center sm:items-end text-right text-slate-400">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>reCAPTCHA</span>
                    </div>
                    <div className="text-[9px] text-slate-400">Privacy - Terms</div>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction helper */}
            <p className="text-center text-xs text-slate-500 mt-3">
              {t.verificationInstructions}
            </p>

            {/* Verify Button */}
            <div className="mt-4">
              <button
                id="btn-verify-download"
                type="button"
                disabled={!isChecked || isRedirecting}
                onClick={handleVerifySubmit}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isChecked && !isRedirecting
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-md shadow-blue-500/20'
                    : isRedirecting
                      ? 'bg-emerald-600 text-white cursor-wait'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.verifyButtonSuccess}</span>
                  </>
                ) : isChecked ? (
                  <>
                    <span>{t.verifyButtonReady}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>{isCaptchaLoaded ? t.verifyButtonReady : t.verifyButtonWaiting}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle / Bottom Native Ad Banner */}
          <AdBanner type="native" id="download-native-ad" />

          {/* Navigation link for quick test / user back link */}
          <div className="text-center pb-6">
            <button
              type="button"
              onClick={() => navigate('/open')}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              (Direct Mirror Server Link: Open Page)
            </button>
          </div>
        </main>
      </div>

      <footer className="w-full bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CloudVault CDN • All Rights Reserved</span>
          <span className="text-[11px] text-slate-400">
            Encrypted Content Delivery Platform
          </span>
        </div>
      </footer>
    </div>
  );
};
