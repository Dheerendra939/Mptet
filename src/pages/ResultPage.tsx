import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Medal, Users, ChevronLeft, LayoutDashboard, Share2, Download } from 'lucide-react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { cn } from '../lib/utils';

interface LeaderboardEntry {
  id: string;
  userName: string;
  photoURL?: string;
  totalScore: number;
  userId: string;
  submittedAt: any;
}

const VARG_DISPLAY: Record<string, string> = {
  varg1: 'MPTET Varg 1',
  varg2: 'MPTET Varg 2',
  varg3: 'MPTET Varg 3',
  gk: 'GK / General Knowledge',
};

const SUBJECT_DISPLAY: Record<string, string> = {
  hindi: 'Hindi',
  english: 'English',
  sanskrit: 'Sanskrit',
  urdu: 'Urdu',
  mathematics: 'Mathematics',
  physics: 'Physics',
  biology: 'Biology',
  chemistry: 'Chemistry',
  'home science': 'Home Science',
  commerce: 'Commerce',
  history: 'History',
  geography: 'Geography',
  'political science': 'Political Science',
  economics: 'Economics',
  agriculture: 'Agriculture',
  sociology: 'Sociology',
  science: 'Science',
  'social science': 'Social Science',
};

const getExamTitle = (varg: string, sub: string) => {
  const vArgKey = (varg || '').toLowerCase();
  const subKey = (sub || '').toLowerCase();
  
  const vargLabel = VARG_DISPLAY[vArgKey] || (varg ? varg.toUpperCase() : 'MPTET');
  if (vArgKey === 'varg3') {
    return vargLabel;
  }
  
  if (!sub || subKey === 'general') {
    return vargLabel;
  }
  
  const subLabel = SUBJECT_DISPLAY[subKey] || sub.charAt(0).toUpperCase() + sub.slice(1);
  return `${vargLabel} - ${subLabel}`;
};

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const { score: stateScore, vargId, subject, testId, totalQuestions = 150, submissionId } = state || { score: null, vargId: 'unknown', subject: 'general', testId: 'unknown', totalQuestions: 150, submissionId: null };

  useEffect(() => {
    if (!vargId || !subject || !testId) return;

    // Fetch real-time leaderboard filtered by category, subject and test.
    // To bypass Firestore composite index requirements, we do not use orderBy
    // on the Firestore query, and instead sort the results client-side.
    const q = query(
      collection(db, 'Leaderboards'),
      where('vargId', '==', vargId),
      where('subject', '==', subject),
      where('testId', '==', testId),
      limit(250) // Fetch up to 250 entries to sort, ensuring a rich list
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];

      // Robust helper to extract timestamp values safely for comparison
      const getTimestampVal = (val: any) => {
        if (!val) return 0;
        if (typeof val.toMillis === 'function') return val.toMillis();
        if (val.seconds) return val.seconds * 1000 + (val.nanoseconds || 0) / 1000000;
        if (val instanceof Date) return val.getTime();
        if (typeof val === 'string' || typeof val === 'number') {
          return new Date(val).getTime();
        }
        return 0;
      };

      // Sort client-side: descending by totalScore, then ascending by submittedAt timestamp
      const sortedEntries = [...entries].sort((a, b) => {
        const scoreA = a.totalScore || 0;
        const scoreB = b.totalScore || 0;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return getTimestampVal(a.submittedAt) - getTimestampVal(b.submittedAt);
      });

      // Filter or slice to top 100
      setLeaderboard(sortedEntries.slice(0, 100));
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [vargId, subject, testId]);

  const handleBack = () => {
    if (vargId === 'varg3') {
      navigate('/varg3/tests');
    } else if (vargId !== 'unknown' && subject !== 'general') {
      navigate(`/${vargId}/tests/${subject.toLowerCase()}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Find user's entry in the leaderboard
  const userEntry = leaderboard.find(entry => entry.userId === user?.uid || (submissionId && entry.id === submissionId));
  const score = (stateScore !== null && stateScore !== undefined) ? stateScore : (userEntry ? userEntry.totalScore : null);
  
  const percentage = (score !== null && totalQuestions > 0) ? ((score / totalQuestions) * 100).toFixed(1) : null;
  
  // Find rank in the fetched leaderboard
  const rankIndex = leaderboard.findIndex(entry => entry.userId === user?.uid || (submissionId && entry.id === submissionId));
  const userRank = rankIndex !== -1 ? rankIndex + 1 : null;

  const handleShare = async () => {
    const examTitle = getExamTitle(vargId, subject);
    
    const shareText = score !== null 
      ? `📝 *Mockia.in ऑनलाइन मॉक टेस्ट स्कोरकार्ड* 📝\n\n📖 *परीक्षा/Exam:* ${examTitle}\n🎯 *स्कोर/Score:* ${score}/${totalQuestions}\n📊 *सटीकता/Accuracy:* ${percentage}%\n🏆 *लाइव रैंक/Live Rank:* #${userRank || '--'}\n\nआप भी Mockia.in पर मॉक टेस्ट देकर प्रयास करें और अपनी तैयारी को परखें। 👍\n\n🔗 https://mockia.in`
      : `🏆 *Mockia.in लाइव लीडरबोर्ड* 🏆\n\n📖 *परीक्षा/Exam:* ${examTitle}\n\nआप भी Mockia.in पर मॉक टेस्ट देकर प्रयास करें और अपनी तैयारी को परखें। 👍\n\n🔗 https://mockia.in`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mockia.in - Scorecard',
          text: shareText,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareText);
        alert('स्कोरकार्ड और लिंक कॉपी हो गया है! अब आप इसे सीधे व्हाट्सएप (WhatsApp) पर शेयर कर सकते हैं।');
        try {
          const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
          window.open(waUrl, '_blank');
        } catch (e) {
          // ignore window.open issues in sandbox frame environments
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        <button 
          onClick={handleBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all mb-4"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Result Header - Only show if score is provided (actual submission) */}
        {score !== null ? (
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-900 rounded-3xl p-6 md:p-10 text-white text-center shadow-xl relative overflow-hidden"
            >
              {/* Background elements */}
              <div className="absolute top-0 right-0 p-12 opacity-10 translate-x-1/3 -translate-y-1/3">
                <Trophy className="w-64 h-64" />
              </div>

              <div className="relative z-10 space-y-4">
                <p className="text-blue-200 font-bold uppercase tracking-[0.2em] text-[10px]">Exam Result</p>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Score: {score}</h1>
                <div className="flex flex-wrap justify-center gap-2 text-xs font-medium">
                  <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">{percentage}% Accuracy</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10">Rank #{userRank || '--'}</span>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 text-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    DASHBOARD
                  </button>
                  <button 
                    onClick={handleShare}
                    className="px-6 py-2 bg-blue-800 text-white rounded-lg font-bold border border-blue-700 hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    SHARE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button 
              onClick={handleShare}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold border border-blue-800 hover:bg-blue-800 transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Board
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="max-w-md mx-auto">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Medal className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</p>
              <p className="text-lg font-bold text-slate-900">{userRank ? `#${userRank}` : 'Unranked'}</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Rankings Board</h2>
              <p className="text-slate-500 text-[10px] md:text-xs">Top performers for category {vargId.toUpperCase()}</p>
            </div>
            <div className="w-fit bg-slate-50 px-2 py-1 rounded bg-blue-50/50 text-[9px] font-bold text-blue-400 uppercase tracking-widest border border-blue-100">
              Live Ranking
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50/90 backdrop-blur-sm">
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Rank</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Candidate</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaderboard.map((entry, index) => {
                  const isHighlighted = entry.id === submissionId || (!submissionId && entry.userId === user?.uid);
                  
                  return (
                    <motion.tr 
                      key={entry.id}
                      initial={isHighlighted ? { backgroundColor: 'transparent' } : {}}
                      animate={isHighlighted ? { backgroundColor: 'rgb(239 246 255)' } : {}}
                      className={cn(
                        "group hover:bg-slate-50/50 transition-colors cursor-default",
                        isHighlighted && "border-l-2 border-l-blue-600 shadow-inner"
                      )}
                    >
                      <td className="px-4 py-2">
                        <div className={cn(
                          "w-5 h-5 rounded flex items-center justify-center font-black text-[8px]",
                          index === 0 ? "bg-amber-100 text-amber-700" :
                          index === 1 ? "bg-slate-100 text-slate-600" :
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "text-slate-400"
                        )}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="relative w-5 h-5 shrink-0">
                            <img 
                              src={entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.userName)}&background=random`} 
                              className="w-full h-full rounded-full border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            {index < 3 && (
                              <div className={cn(
                                "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full flex items-center justify-center border border-white",
                                index === 0 ? "bg-amber-400" : index === 1 ? "bg-slate-300" : "bg-orange-400"
                              )}>
                                <Trophy className="w-1.5 h-1.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-800 leading-none">
                              {entry.userName}
                            </span>
                            {isHighlighted && (
                              <span className="text-[6px] text-blue-600 font-black uppercase tracking-tighter mt-0.5">YOU</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-mono text-[10px] font-black text-blue-900">
                        {entry.totalScore}/{totalQuestions}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            
            {leaderboard.length === 0 && !loading && (
              <div className="p-20 text-center space-y-4">
                <Medal className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-medium">No rankings available for this category yet.</p>
              </div>
            )}
            
            {loading && (
              <div className="p-20 text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 mx-auto animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center space-y-2">
          <p className="text-slate-400 text-sm">Testing analytics powered by Mockia.in Engine v3.0</p>
          <div className="flex justify-center items-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <span>Verified Results</span>
            <span>•</span>
            <span>CBT Simulation</span>
            <span>•</span>
            <span>2024 Exam Patterns</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
