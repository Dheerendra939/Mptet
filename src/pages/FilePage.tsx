import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/arbitrage/Header';
import { AdBanner } from '../components/arbitrage/AdBanner';
import { FileInfoCard } from '../components/arbitrage/FileInfoCard';
import { 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  FileArchive, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  ArrowLeft,
  HardDrive
} from 'lucide-react';

export const FilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const handleDownloadClick = () => {
    setDownloadStarted(true);
    setDownloadProgress(20);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Trigger actual file download
          try {
            const content = `Mockia CloudVault High-Speed Package\nStatus: Verified\nSecurity: Passed\nDownloaded on: ${new Date().toLocaleString()}`;
            const blob = new Blob([content], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CloudVault_Setup_Package_x64.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch (e) {
            console.log('Download trigger completed');
          }
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 selection:bg-red-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
          {/* Top Leaderboard Ad */}
          <AdBanner type="leaderboard" id="file-top-ad" />

          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct CDN Mirror Connected</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.filePageTitle}
            </h1>
          </div>

          {/* File summary */}
          <FileInfoCard />

          {/* Big Red Download Button Section with requested text above */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shadow-xs">
              <Download className="w-8 h-8 animate-bounce" />
            </div>

            {/* Requested text: "your file is ready to download text above" */}
            <div className="space-y-1">
              <p 
                id="file-ready-text"
                className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight"
              >
                {t.yourFileIsReadyText}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                File has been scanned for malware, verified with SHA-256 integrity, and cached on high-speed CDN edge nodes.
              </p>
            </div>

            {/* Download Progress Bar if active */}
            {downloadStarted && (
              <div className="w-full max-w-md bg-slate-100 rounded-xl p-3 border border-slate-200 text-left">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Transfer Speed: 1.2 GB/s</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-red-600 h-2 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                {downloadProgress === 100 && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.downloadStartedText}
                  </p>
                )}
              </div>
            )}

            {/* Big Red Download Button */}
            <div className="w-full max-w-md">
              <button
                id="btn-big-red-download"
                type="button"
                onClick={handleDownloadClick}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-lg sm:text-xl text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-red-600/30 ring-4 ring-red-600/20 flex items-center justify-center gap-3 uppercase tracking-wider select-none"
              >
                <Download className="w-6 h-6 stroke-[2.5]" />
                <span>{downloadStarted && downloadProgress === 100 ? t.downloadAgainButton : t.bigRedDownloadButton}</span>
              </button>
            </div>

            {/* Badges and metadata */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-1 rounded">
                <Lock className="w-3 h-3 text-slate-600" />
                {t.checksumSha256}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                SSL Verified
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                {t.highSpeedBandwidth}
              </span>
            </div>

            {/* Quick restart / Return navigation */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/download')}
                className="text-xs text-slate-500 hover:text-slate-800 underline flex items-center gap-1 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Start New Download Session</span>
              </button>
            </div>
          </div>

          {/* Ad slot in page */}
          <AdBanner type="native" id="file-bottom-ad" />
        </main>
      </div>

      <footer className="w-full bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CloudVault CDN • Direct Mirror Node</span>
          <span className="text-[11px] text-slate-400">
            Encrypted Content Delivery Platform
          </span>
        </div>
      </footer>
    </div>
  );
};
