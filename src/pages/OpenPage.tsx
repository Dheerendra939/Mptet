import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/arbitrage/Header';
import { AdBanner } from '../components/arbitrage/AdBanner';
import { FileInfoCard } from '../components/arbitrage/FileInfoCard';
import { 
  Server, 
  Download, 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Signal, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface ServerOption {
  id: number;
  nameKey: 'server1' | 'server2' | 'server3' | 'server4' | 'server5';
  speedBadgeKey: 'serverFastBadge' | 'serverUltraBadge' | 'serverEdgeBadge' | 'serverMirrorBadge' | 'serverGlobalBadge';
  region: string;
  ping: string;
  load: string;
  colorClass: string;
}

const SERVERS: ServerOption[] = [
  { id: 1, nameKey: 'server1', speedBadgeKey: 'serverFastBadge', region: 'North America (US-East)', ping: '12ms', load: '18%', colorClass: 'text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-50' },
  { id: 2, nameKey: 'server2', speedBadgeKey: 'serverUltraBadge', region: 'Europe Direct (Frankfurt)', ping: '18ms', load: '24%', colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50' },
  { id: 3, nameKey: 'server3', speedBadgeKey: 'serverEdgeBadge', region: 'Asia Pacific (Singapore)', ping: '25ms', load: '32%', colorClass: 'text-purple-600 border-purple-200 bg-purple-50/50 hover:bg-purple-50' },
  { id: 4, nameKey: 'server4', speedBadgeKey: 'serverMirrorBadge', region: 'Global Cloud CDN (Anycast)', ping: '9ms', load: '14%', colorClass: 'text-amber-600 border-amber-200 bg-amber-50/50 hover:bg-amber-50' },
  { id: 5, nameKey: 'server5', speedBadgeKey: 'serverGlobalBadge', region: 'P2P Decentralized Mirror', ping: '31ms', load: '28%', colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50' },
];

export const OpenPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeServer, setActiveServer] = useState<number | null>(null);
  const [connectingServerId, setConnectingServerId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Back button interception: "If user click back button redirect him to a new page named continue"
  useEffect(() => {
    try {
      window.history.pushState(null, '', window.location.href);
    } catch (_) {}

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Redirect directly to /continue as requested!
      navigate('/continue');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleServerClick = (server: ServerOption) => {
    setConnectingServerId(server.id);
    setStatusMessage(`${t.connectingToServer} (${t[server.nameKey]})`);

    setTimeout(() => {
      setConnectingServerId(null);
      setActiveServer(server.id);
      setStatusMessage(`${t.directDownloadTriggered} (${t[server.nameKey]})`);

      // Trigger automatic safe file download simulation
      try {
        const dummyContent = `Mockia CloudVault Secure File Package\nServer: ${t[server.nameKey]}\nSpeed: ${t[server.speedBadgeKey]}\nStatus: Verified\nTimestamp: ${new Date().toISOString()}`;
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CloudVault_Package_Server${server.id}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.log('Download trigger simulated');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-900 selection:bg-blue-500 selection:text-white">
      <div>
        <Header />

        <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4">
          {/* Top Leaderboard Ad */}
          <AdBanner type="leaderboard" id="open-top-ad" />

          {/* Header text */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Link Unlocked</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.openPageSubtitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any of the 5 mirror servers below to initiate your high-speed direct transfer.
            </p>
          </div>

          {/* File summary */}
          <FileInfoCard />

          {/* 5 Server Buttons Section */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                  5 High-Speed Download Mirrors
                </span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Signal className="w-3.5 h-3.5" />
                All Nodes Active
              </span>
            </div>

            {/* Status notification banner if clicked */}
            {statusMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium rounded-xl flex items-center gap-2 animate-fadeIn">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* The 5 Server Buttons */}
            <div className="flex flex-col gap-3">
              {SERVERS.map((server) => {
                const isConnecting = connectingServerId === server.id;
                const isCurrentActive = activeServer === server.id;

                return (
                  <button
                    key={server.id}
                    id={`btn-server-${server.id}`}
                    type="button"
                    disabled={isConnecting}
                    onClick={() => handleServerClick(server)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrentActive
                        ? 'border-blue-600 bg-blue-50/90 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${server.colorClass}`}>
                        {isConnecting ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                          <Server className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">
                            {t[server.nameKey]}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                            {t[server.speedBadgeKey]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {server.region} • Ping: <span className="font-mono text-emerald-600">{server.ping}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 text-xs font-bold transition-all shadow-xs">
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back action helper with exact redirect instruction */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="text-[11px]">
                {t.backRedirectNotice}
              </span>

              <button
                id="btn-open-back"
                type="button"
                onClick={() => navigate('/continue')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToSafety} → Continue</span>
              </button>
            </div>
          </div>

          {/* Ad slot in page */}
          <AdBanner type="native" id="open-bottom-ad" />
        </main>
      </div>

      <footer className="w-full bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 CloudVault CDN • Server Mirror Cluster</span>
          <span className="text-[11px] text-slate-400">
            Encrypted Content Delivery Platform
          </span>
        </div>
      </footer>
    </div>
  );
};
