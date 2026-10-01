import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HomeDirectoryView } from './components/HomeDirectoryView';
import { ToolFormView } from './components/ToolFormView';
import Dashboard from './pages/Dashboard';
import { TOOLS_DATA, findToolBySlugOrId } from './data/toolsData';
import { ToolDefinition, ToolCategory } from './types';
import { applyToolSEO, resetToDefaultSEO } from './lib/seo';
import { trackPageVisit } from './lib/visitorTracker';

function isDashboardRoute(): boolean {
  try {
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase().replace(/\/+$/, '');
    const searchParams = new URLSearchParams(window.location.search);

    if (
      pathname === '/dashboard' ||
      pathname.endsWith('/dashboard')
    ) {
      return true;
    }

    if (
      hash === '#/dashboard' ||
      hash === '#dashboard' ||
      hash.endsWith('/dashboard')
    ) {
      return true;
    }

    const pageParam = (searchParams.get('page') || searchParams.get('view') || searchParams.get('tab') || '').toLowerCase();
    if (pageParam === 'dashboard') {
      return true;
    }
  } catch (e) {
    console.warn('Error checking dashboard route', e);
  }
  return false;
}

function parseToolFromUrl(): ToolDefinition | null {
  try {
    if (isDashboardRoute()) return null;

    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    // Check query param first: ?tool=slug or ?id=slug
    const queryTool = searchParams.get('tool') || searchParams.get('id');
    if (queryTool) {
      const match = findToolBySlugOrId(queryTool);
      if (match) return match;
    }

    // Check hash: #/tool/slug or #/tools/slug
    if (hash && hash.startsWith('#')) {
      const hashClean = hash.replace(/^#\/?/, '');
      const parts = hashClean.split('/');
      const potentialSlug = parts[parts.length - 1];
      if (potentialSlug && potentialSlug !== 'dashboard') {
        const match = findToolBySlugOrId(potentialSlug);
        if (match) return match;
      }
    }

    // Check path: /tool/:slug or /tools/:slug or /:slug
    if (pathname && pathname !== '/' && !pathname.includes('/dashboard')) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        // Last segment
        const lastSegment = segments[segments.length - 1];
        if (lastSegment !== 'dashboard') {
          const match = findToolBySlugOrId(lastSegment);
          if (match) return match;
        }

        // If first segment was 'tool' or 'tools', check next segment
        if ((segments[0] === 'tool' || segments[0] === 'tools') && segments[1]) {
          const matchSub = findToolBySlugOrId(segments[1]);
          if (matchSub) return matchSub;
        }
      }
    }
  } catch (e) {
    console.warn('Error parsing tool from URL', e);
  }

  return null;
}

export default function App() {
  const [isDashboard, setIsDashboard] = useState<boolean>(() => isDashboardRoute());
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(() => parseToolFromUrl());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');

  // Track page visits across the entire website for real-time visitor analytics
  useEffect(() => {
    if (isDashboard) return;

    if (activeTool) {
      trackPageVisit(`/tool/${activeTool.slug}`, activeTool.title);
    } else {
      trackPageVisit('/', 'Home Directory');
    }
  }, [activeTool, isDashboard]);

  // Sync SEO and Document Title whenever activeTool or route changes
  useEffect(() => {
    if (isDashboard) return;

    const origin = window.location.origin;
    if (activeTool) {
      applyToolSEO(activeTool, origin);
    } else {
      resetToDefaultSEO(origin, TOOLS_DATA);
    }
  }, [activeTool, isDashboard]);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const dash = isDashboardRoute();
      setIsDashboard(dash);
      if (!dash) {
        const tool = parseToolFromUrl();
        setActiveTool(tool);
      } else {
        setActiveTool(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTool = useCallback((tool: ToolDefinition) => {
    setIsDashboard(false);
    setActiveTool(tool);
    try {
      const targetPath = `/tool/${tool.slug}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ toolId: tool.id }, '', targetPath);
      }
    } catch (e) {
      try {
        window.location.hash = `/tool/${tool.slug}`;
      } catch (err) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateHome = useCallback(() => {
    setIsDashboard(false);
    setActiveTool(null);
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    } catch (e) {
      try {
        window.location.hash = '';
      } catch (err) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // When visiting the secret dashboard page
  if (isDashboard) {
    return <Dashboard onBackToHome={handleNavigateHome} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-slate-200 selection:text-slate-900 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          activeTool={activeTool || undefined}
          onNavigateHome={handleNavigateHome}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content Area */}
        <main>
          {activeTool ? (
            /* Dedicated Single-Tool Full Form View */
            <ToolFormView
              tool={activeTool}
              onNavigateHome={handleNavigateHome}
              onSelectTool={handleSelectTool}
              allTools={TOOLS_DATA}
            />
          ) : (
            /* Tools Directory Hub */
            <HomeDirectoryView
              tools={TOOLS_DATA}
              onSelectTool={handleSelectTool}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}
        </main>
      </div>

      {/* Global Footer (Notice: NO dashboard link or button anywhere) */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Mockia</span>
            <span>—</span>
            <span>Worldwide Online Utility & Calculator Suite (100 Free Tools)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <a
              href="/"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleNavigateHome();
                }
              }}
              className="hover:text-slate-900 font-medium transition-colors"
            >
              All 100 Tools
            </a>
            <span>•</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              XML Sitemap
            </a>
            <span>•</span>
            <span>100% Free Forever</span>
            <span>•</span>
            <span>Instant Results</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
