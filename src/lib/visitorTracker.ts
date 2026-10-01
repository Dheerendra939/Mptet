import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  increment, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

export interface SiteOverviewStats {
  totalVisitors: number;
  totalPageViews: number;
  lastUpdated?: any;
}

export interface DailyVisitorStats {
  date: string;
  uniqueVisitors: number;
  pageViews: number;
  lastUpdated?: any;
}

export interface VisitorLogEvent {
  id?: string;
  visitorId: string;
  path: string;
  toolName?: string | null;
  date: string;
  timestamp?: any;
  createdAt: string;
  referrer: string;
  deviceType: string;
  browser: string;
  os: string;
  isNewVisitor: boolean;
  isFirstToday: boolean;
}

// Generate or retrieve persistent anonymous visitor ID
export function getOrCreateVisitorId(): { vid: string; isNew: boolean } {
  let vid = '';
  let isNew = false;
  try {
    vid = localStorage.getItem('mockia_vid') || '';
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('mockia_vid', vid);
      isNew = true;
    }
  } catch (e) {
    vid = 'v_' + Math.random().toString(36).substring(2, 9);
    isNew = true;
  }
  return { vid, isNew };
}

// Standard UTC Date string YYYY-MM-DD
export function getTodayKey(): string {
  const d = new Date();
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Device, browser, and OS detection
function getDeviceInfo() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let deviceType = 'Desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Chrome';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr\//i.test(ua)) browser = 'Opera';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';

  let os = 'Windows';
  if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/windows/i.test(ua)) os = 'Windows';

  return { deviceType, browser, os };
}

let lastTrackedPath = '';
let lastTrackedTime = 0;

/**
 * Tracks a page visit on the website.
 * Increments Total Visitors (if first time ever), Today's Visitors (if first time today),
 * Total Page Views, and logs the visit event.
 */
export async function trackPageVisit(path: string, toolName?: string) {
  try {
    const now = Date.now();
    // Debounce rapid repeat triggers on identical path within 3.5 seconds
    if (lastTrackedPath === path && (now - lastTrackedTime) < 3500) {
      return;
    }
    lastTrackedPath = path;
    lastTrackedTime = now;

    const { vid, isNew } = getOrCreateVisitorId();
    const todayKey = getTodayKey();

    let isFirstToday = false;
    try {
      const lastVisitDate = localStorage.getItem('mockia_last_visit_date');
      if (lastVisitDate !== todayKey) {
        isFirstToday = true;
        localStorage.setItem('mockia_last_visit_date', todayKey);
      }
    } catch (e) {
      isFirstToday = true;
    }

    const deviceInfo = getDeviceInfo();
    let referrer = 'Direct';
    try {
      if (document.referrer) {
        referrer = new URL(document.referrer).hostname || 'Referral';
      }
    } catch (e) {}

    // 1. Update Global Overview Counters
    const overviewRef = doc(db, 'SiteAnalytics', 'overview');
    const overviewUpdates: any = {
      totalPageViews: increment(1),
      lastUpdated: serverTimestamp()
    };
    if (isNew) {
      overviewUpdates.totalVisitors = increment(1);
    }
    await setDoc(overviewRef, overviewUpdates, { merge: true });

    // 2. Update Daily Stats Document
    const dailyRef = doc(db, 'SiteDailyStats', todayKey);
    const dailyUpdates: any = {
      date: todayKey,
      pageViews: increment(1),
      lastUpdated: serverTimestamp()
    };
    if (isFirstToday) {
      dailyUpdates.uniqueVisitors = increment(1);
    }
    await setDoc(dailyRef, dailyUpdates, { merge: true });

    // 3. Record Recent Visitor Log
    const eventCol = collection(db, 'VisitorEvents');
    await addDoc(eventCol, {
      visitorId: vid,
      path: path || '/',
      toolName: toolName || null,
      date: todayKey,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      referrer,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      isNewVisitor: isNew,
      isFirstToday
    });
  } catch (error) {
    // Non-blocking catch to ensure website navigation remains completely seamless
    console.debug('Visitor tracking logged:', error);
  }
}

/**
 * Real-time subscription to Overview Stats (Total Visitors & Total Page Views)
 */
export function subscribeOverview(onUpdate: (stats: SiteOverviewStats) => void) {
  const overviewRef = doc(db, 'SiteAnalytics', 'overview');
  return onSnapshot(overviewRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      onUpdate({
        totalVisitors: Math.max(Number(data.totalVisitors || 0), 1),
        totalPageViews: Math.max(Number(data.totalPageViews || 0), 1),
        lastUpdated: data.lastUpdated
      });
    } else {
      // Default initial state if no visits yet
      onUpdate({
        totalVisitors: 0,
        totalPageViews: 0
      });
    }
  }, (err) => {
    console.warn('Overview listener error:', err);
  });
}

/**
 * Real-time subscription to Today's Stats (Today Unique Visitors & Today Page Views)
 */
export function subscribeTodayStats(dateKey: string, onUpdate: (stats: DailyVisitorStats) => void) {
  const dailyRef = doc(db, 'SiteDailyStats', dateKey);
  return onSnapshot(dailyRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      onUpdate({
        date: dateKey,
        uniqueVisitors: Math.max(Number(data.uniqueVisitors || 0), 1),
        pageViews: Math.max(Number(data.pageViews || 0), 1),
        lastUpdated: data.lastUpdated
      });
    } else {
      onUpdate({
        date: dateKey,
        uniqueVisitors: 0,
        pageViews: 0
      });
    }
  }, (err) => {
    console.warn('Today stats listener error:', err);
  });
}

/**
 * Fetch recent visitor events log
 */
export async function fetchRecentEvents(limitCount = 30): Promise<VisitorLogEvent[]> {
  try {
    const eventCol = collection(db, 'VisitorEvents');
    const q = query(eventCol, orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const events: VisitorLogEvent[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      events.push({
        id: docSnap.id,
        visitorId: data.visitorId || 'anon',
        path: data.path || '/',
        toolName: data.toolName,
        date: data.date || '',
        timestamp: data.timestamp,
        createdAt: data.createdAt || (data.timestamp ? new Date(data.timestamp.seconds * 1000).toISOString() : new Date().toISOString()),
        referrer: data.referrer || 'Direct',
        deviceType: data.deviceType || 'Desktop',
        browser: data.browser || 'Browser',
        os: data.os || 'OS',
        isNewVisitor: !!data.isNewVisitor,
        isFirstToday: !!data.isFirstToday
      });
    });
    return events;
  } catch (error) {
    console.warn('Failed to fetch recent visitor events:', error);
    return [];
  }
}

/**
 * Fetch daily trend data for the last N days
 */
export async function fetchDailyHistory(days = 7): Promise<DailyVisitorStats[]> {
  try {
    const dailyCol = collection(db, 'SiteDailyStats');
    const q = query(dailyCol, orderBy('date', 'desc'), limit(days));
    const snap = await getDocs(q);
    const list: DailyVisitorStats[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        date: data.date || d.id,
        uniqueVisitors: Number(data.uniqueVisitors || 0),
        pageViews: Number(data.pageViews || 0),
        lastUpdated: data.lastUpdated
      });
    });
    return list.reverse(); // chronological order
  } catch (error) {
    console.warn('Failed to fetch daily history:', error);
    return [];
  }
}
