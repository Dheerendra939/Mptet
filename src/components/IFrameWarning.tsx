import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';

export default function IFrameWarning() {
  const [isMasked, setIsMasked] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      // Check if running in an iframe
      const isFramed = window.self !== window.top;
      
      if (isFramed) {
        // Retrieve parent referrer domain
        const referrer = document.referrer || '';
        
        // If referrer comes from an external custom domain (not AI Studio parent tools or self)
        const isGoogleOrRunApp = 
          referrer.includes('google.com') || 
          referrer.includes('run.app') || 
          referrer.includes('localhost') ||
          window.location.hostname.includes('localhost');
          
        if (!isGoogleOrRunApp || referrer.includes('mockia.in')) {
          setIsMasked(true);
        }
      }
    } catch (e) {
      // Security/CORS block reading top window can sometimes happen – meaning we are framed cross-origin
      setIsMasked(true);
    }
  }, []);

  const handleOpenSecurely = () => {
    // Open the direct host URL in a new window to bypass iframe restriction
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  if (!isMasked || isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3 shadow-md relative flex flex-col md:flex-row items-center justify-between gap-3 text-sm font-medium z-50 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="p-1 bg-white/20 rounded-lg shrink-0">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-bold block md:inline md:mr-1">Secure Mode Recommendation:</span>
          It looks like you are visiting via a forwarded domain (<code className="bg-black/15 px-1.5 py-0.5 rounded text-xs font-semibold font-mono">mockia.in</code> inside an iframe). 
          Browser security blocks payment gateways (Razorpay) and logins when loaded inside frames.
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
        <button
          onClick={handleOpenSecurely}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-orange-700 hover:bg-orange-50 transition-colors rounded-lg font-semibold text-xs shadow-sm cursor-pointer whitespace-nowrap"
        >
          Open App Directly
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
