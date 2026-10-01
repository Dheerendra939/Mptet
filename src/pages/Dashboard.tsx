import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Calendar, 
  Eye, 
  TrendingUp, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  ArrowLeft, 
  Activity, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';
import { 
  SiteOverviewStats, 
  DailyVisitorStats, 
  VisitorLogEvent, 
  getTodayKey, 
  subscribeOverview, 
  subscribeTodayStats, 
  fetchRecentEvents, 
  fetchDailyHistory,
  trackPageVisit
} from '../lib/visitorTracker';
import { TOOLS_DATA } from '../data/toolsData';

interface DashboardProps {
  onBackToHome?: () => void;
}

export default function Dashboard({ onBackToHome }: DashboardProps) {
  const [todayKey] = useState<string>(() => getTodayKey());
  const [overview, setOverview] = useState<SiteOverviewStats>({ totalVisitors: 0, totalPageViews: 0 });
  const [todayStats, setTodayStats] = useState<DailyVisitorStats>({ date: todayKey, uniqueVisitors: 0, pageViews: 0 });
  const [recentEvents, setRecentEvents] = useState<VisitorLogEvent[]>([]);
  const [dailyHistory, setDailyHistory] = useState<DailyVisitorStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [testVisitSuccess, setTestVisitSuccess] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Manual & initial load
  const loadData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setRefreshing(true);
    try {
      const [events, history] = await Promise.all([
        fetchRecentEvents(30),
        fetchDailyHistory(7)
      ]);
      setRecentEvents(events);
      setDailyHistory(history);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.warn('Dashboard load error:', err);
    } finally {
      setLoading(false);
      if (showIndicator) {
        setTimeout(() => setRefreshing(false), 400);
      }
    }
  }, []);

  // Real-time Firestore subscriptions for Overview & Today
  useEffect(() => {
    const unsubOverview = subscribeOverview((data) => {
      setOverview(data);
      setLoading(false);
    });

    const unsubToday = subscribeTodayStats(todayKey, (data) => {
      setTodayStats(data);
    });

    loadData(false);

    return () => {
      unsubOverview();
      unsubToday();
    };
  }, [todayKey, loadData]);

  // Periodic polling for events table & history if auto-refresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Set document title for Dashboard
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Analytics & Visitor Dashboard — Mockia';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Trigger test visit to verify live tracking
  const handleTriggerTestVisit = async () => {
    try {
      const randomTool = TOOLS_DATA[Math.floor(Math.random() * TOOLS_DATA.length)];
      await trackPageVisit(`/tool/${randomTool.slug}`, randomTool.title);
      setTestVisitSuccess(`Simulated visit to "${randomTool.title}" logged!`);
      setTimeout(() => {
        loadData(false);
      }, 800);
      setTimeout(() => setTestVisitSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  // Compute breakdown stats
  const deviceCounts = recentEvents.reduce((acc, ev) => {
    const d = ev.deviceType || 'Desktop';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularPages = recentEvents.reduce((acc, ev) => {
    const p = ev.toolName || ev.path || '/';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedPopular = Object.entries(popularPages)
    .sort(([, countA], [, countB]) => Number(countB) - Number(countA))
    .slice(0, 5);

  const avgViewsPerVisitor = Number(overview.totalVisitors) > 0 
    ? (Number(overview.totalPageViews) / Number(overview.totalVisitors)).toFixed(1) 
    : '1.0';

  const todayViewsPerVisitor = Number(todayStats.uniqueVisitors) > 0
    ? (Number(todayStats.pageViews) / Number(todayStats.uniqueVisitors)).toFixed(1)
    : '1.0';

  // Format relative time helper
  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const then = new Date(isoString).getTime();
      const now = Date.now();
      const diffSec = Math.floor((now - then) / 1000);
      if (diffSec < 10) return 'Just now';
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tools Directory</span>
                </button>
              )}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                    Mockia Visitor Analytics
                  </h1>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Direct access URL: <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">mockia.in/dashboard</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Real-time Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Real-Time Sync</span>
              </div>

              {/* Auto Refresh Toggle */}
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                  autoRefresh
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Toggle 15s auto-refresh"
              >
                Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
              </button>

              {/* Manual Refresh Button */}
              <button
                type="button"
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-slate-900' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Banner with private note */}
        <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Private Visitor Tracking Active
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                No buttons or links to this dashboard are visible anywhere on the public website. You access it exclusively by typing or bookmarking <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">/dashboard</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleTriggerTestVisit}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Send a sample page visit into Firestore to test live updates"
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Simulate Test Visit</span>
            </button>
          </div>
        </div>

        {/* Feedback alert for simulated visit */}
        {testVisitSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testVisitSuccess}</span>
          </div>
        )}

        {/* Primary Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* 1. Total Visitors */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Visitors</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : (overview.totalVisitors || 0).toLocaleString()}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>All-time unique visitors</span>
              <span className="font-medium text-slate-700">Site-wide</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Avg views / visitor:</span>
              <span className="font-semibold text-slate-600">{avgViewsPerVisitor}</span>
            </div>
          </div>

          {/* 2. Today's Visitors */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Today Visitors</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>{loading ? '...' : (todayStats.uniqueVisitors || 0).toLocaleString()}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>Unique visitors today</span>
              <span className="font-medium text-slate-700 font-mono text-[11px]">{todayKey}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Today views / visitor:</span>
              <span className="font-semibold text-slate-600">{todayViewsPerVisitor}</span>
            </div>
          </div>

          {/* 3. Total Page Views */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Page Views</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : (overview.totalPageViews || 0).toLocaleString()}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>All tool views & visits</span>
              <span className="font-medium text-slate-700">100 Tools</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Engagement:</span>
              <span className="font-semibold text-slate-600">Calculators & Tools</span>
            </div>
          </div>

          {/* 4. Today's Page Views */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today Page Views</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {loading ? '...' : (todayStats.pageViews || 0).toLocaleString()}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>Total views logged today</span>
              <span className="font-medium text-slate-700">Live</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Last updated:</span>
              <span className="font-semibold text-slate-600">
                {lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>

        </div>

        {/* Middle Section: Daily Traffic Trend & Popular Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Daily Trend (2 Cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Daily Visitor Activity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unique visitors and page views over recent days
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
                  <span>Visitors</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                  <span>Views</span>
                </div>
              </div>
            </div>

            {dailyHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Traffic history will accumulate as visitors browse pages on mockia.in
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Bars */}
                {dailyHistory.map((item) => {
                  const maxDaily = Math.max(
                    ...dailyHistory.map(d => Math.max(d.uniqueVisitors, d.pageViews, 10))
                  );
                  const visitorPct = Math.min(100, Math.max(8, (item.uniqueVisitors / maxDaily) * 100));
                  const pageViewPct = Math.min(100, Math.max(8, (item.pageViews / maxDaily) * 100));
                  const isCurrentDay = item.date === todayKey;

                  return (
                    <div key={item.date} className="text-xs">
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span className={`font-mono ${isCurrentDay ? 'font-bold text-slate-900 flex items-center gap-1' : ''}`}>
                          {item.date} {isCurrentDay && <span className="text-[10px] text-emerald-600 font-sans font-semibold bg-emerald-50 px-1 rounded">Today</span>}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900">
                            {item.uniqueVisitors} <span className="font-normal text-slate-500">visitors</span>
                          </span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-600">
                            {item.pageViews} <span className="font-normal text-slate-400">views</span>
                          </span>
                        </div>
                      </div>

                      {/* Stacked Progress Bar */}
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-slate-900 h-full rounded-l-full transition-all duration-500"
                          style={{ width: `${visitorPct}%` }}
                          title={`Unique Visitors: ${item.uniqueVisitors}`}
                        />
                        <div
                          className="bg-slate-300 h-full rounded-r-full transition-all duration-500"
                          style={{ width: `${pageViewPct}%` }}
                          title={`Page Views: ${item.pageViews}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Insights & Breakdown (1 Col) */}
          <div className="space-y-6">
            
            {/* Top Visited Pages */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Top Visited Pages</span>
                <Compass className="w-4 h-4 text-slate-400" />
              </h3>

              {sortedPopular.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Page visit breakdown will appear here.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {sortedPopular.map(([name, count], idx) => (
                    <div key={name} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-4 text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                        <span className="font-medium text-slate-800 truncate" title={name}>
                          {name}
                        </span>
                      </div>
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px] shrink-0">
                        {count} visits
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Device & Client Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Visitor Devices</span>
                <Monitor className="w-4 h-4 text-slate-400" />
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Monitor className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                  <div className="font-bold text-slate-900">{deviceCounts['Desktop'] || 0}</div>
                  <div className="text-[10px] text-slate-500">Desktop</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Smartphone className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                  <div className="font-bold text-slate-900">{deviceCounts['Mobile'] || 0}</div>
                  <div className="text-[10px] text-slate-500">Mobile</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Globe className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                  <div className="font-bold text-slate-900">{deviceCounts['Tablet'] || 0}</div>
                  <div className="text-[10px] text-slate-500">Tablet</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Recent Visitor Log Stream */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" />
                <span>Live Recent Visits Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Individual page views logged in real time as users explore Mockia
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Showing last {recentEvents.length} visits
            </div>
          </div>

          {recentEvents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent visit events recorded yet. Navigate to any tool to see it appear live here!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3">Page / Tool Visited</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Device & Browser</th>
                    <th className="py-3 px-3">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEvents.map((ev, index) => (
                    <tr key={ev.id || index} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        <span className="font-mono text-[11px] text-slate-700">
                          {formatTimeAgo(ev.createdAt)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">
                          {ev.toolName || (ev.path === '/' ? 'Home Directory' : ev.path)}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                          {ev.path}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {ev.isNewVisitor ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            New Visitor
                          </span>
                        ) : ev.isFirstToday ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            First Today
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Repeat View
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5">
                          {ev.deviceType === 'Mobile' ? (
                            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{ev.deviceType}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{ev.browser} / {ev.os}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600">
                          {ev.referrer || 'Direct'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
