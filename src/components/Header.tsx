import React from 'react';
import { Layers, ArrowLeft, Search, Share2, Check } from 'lucide-react';
import { ToolDefinition } from '../types';

interface HeaderProps {
  activeTool?: ToolDefinition;
  onNavigateHome: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Header({
  activeTool,
  onNavigateHome,
  searchQuery = '',
  onSearchChange
}: HeaderProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Brand or Back Button */}
        <div className="flex items-center gap-3">
          {activeTool ? (
            <a
              href="/"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  onNavigateHome();
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs sm:text-sm font-medium transition-all group shadow-xs"
              title="Return to Directory"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>All 100 Tools</span>
            </a>
          ) : (
            <a
              href="/"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  onNavigateHome();
                }
              }}
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-4 h-4 text-slate-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    Mockia
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    100 Free Utilities
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Fast Calculators & Essential Online Tools
                </p>
              </div>
            </a>
          )}

          {/* Active Tool Breadcrumb Pill */}
          {activeTool && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-200 pl-3">
              <span className="text-slate-500">{activeTool.category}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-semibold truncate max-w-xs">{activeTool.title}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {!activeTool && onSearchChange && (
            <div className="relative w-44 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tools & calculators..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          )}

          {activeTool && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all shadow-xs"
              title="Share this tool"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Tool'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
