import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Bookmark, Send, Clock, AlertCircle, RefreshCw, Eye, EyeOff, LayoutDashboard, Layout } from 'lucide-react';
import { cn, getSafeEntryId } from '../lib/utils';
import { collection, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { generateFullMockTest, attachPartATo120Paper } from '../data/mockQuestions';
import { Question, QuestionStatus } from '../types';

export default function ExamInterface() {
  const { vargId, testId, subject } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string | number, string>>({});
  const [status, setStatus] = useState<Record<string | number, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(150 * 60); // 150 minutes
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  // Security Check & Data Initialization
  useEffect(() => {
    async function initializeTest() {
      if (!vargId) return;
      
      setVerifying(true);
      
      // 0. Unique attempt lock verification (for logged in users)
      if (user) {
        const entryId = getSafeEntryId(user.uid, vargId, subject, testId);
        const isAdmin = user.email === 'qzquiz50@gmail.com';
        try {
          if (!isAdmin) {
            const leaderSnap = await getDoc(doc(db, 'Leaderboards', entryId));
            if (leaderSnap.exists()) {
              setAlreadyAttempted(true);
              setVerifying(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Leaderboard check error:', err);
        }
      }

      try {
        // 1. Verify Access (Simulated for dev, usually checks Firestore purchases)
        setIsUnlocked(true);
        
        // 2. Generate/Load Questions automatically
        let loadedQuestions: Question[] = [];
        let durationSeconds = 150 * 60;

        if (testId && testId !== '1') {
          try {
            const docRef = doc(db, 'CustomMockTests', testId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const testData = docSnap.data();
              const parsedQuestions = JSON.parse(testData.questions);
              loadedQuestions = parsedQuestions.map((q: any, idx: number) => ({
                id: idx + 1,
                section: q.section || 'General',
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer
              }));
              durationSeconds = (testData.time || 150) * 60;
            }
          } catch (e) {
            console.error("Error loading custom mock test questions from Firestore:", e);
          }
        }

        if (loadedQuestions.length === 0) {
          loadedQuestions = generateFullMockTest(vargId, subject || 'general', testId);
          if (vargId === 'gk' || subject === 'gk') {
            durationSeconds = 20 * 60;
          } else {
            durationSeconds = 150 * 60;
          }
        }

        if (loadedQuestions.length === 120) {
          loadedQuestions = attachPartATo120Paper(loadedQuestions);
        }

        setQuestions(loadedQuestions);
        setTimeLeft(durationSeconds);
        
        // 3. Initialize Status
        const initialStatus: Record<string | number, QuestionStatus> = {};
        loadedQuestions.forEach((q) => {
          initialStatus[q.id] = 'not-visited';
        });
        if (loadedQuestions.length > 0) {
          initialStatus[loadedQuestions[0].id] = 'not-answered';
        }
        setStatus(initialStatus);
        setCurrentIndex(0);

      } catch (err) {
        console.error('Initialization failed:', err);
      } finally {
        setVerifying(false);
      }
    }
    initializeTest();
  }, [user, vargId, subject]);

  // Timer logic
  useEffect(() => {
    if (questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      handleSubmit(true);
    }
  }, [timeLeft, questions.length]);

  const [showPalette, setShowPalette] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(3, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleAnswerSelect = (option: string) => {
    const qId = questions[currentIndex].id;
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSaveAndNext = () => {
    const qId = questions[currentIndex].id;
    const newStatus = { ...status };
    
    if (answers[qId]) {
      newStatus[qId] = 'answered';
    } else {
      newStatus[qId] = 'not-answered';
    }

    setStatus(newStatus);
    
    if (currentIndex < questions.length - 1) {
      const nextId = questions[currentIndex + 1].id;
      if (newStatus[nextId] === 'not-visited') {
        newStatus[nextId] = 'not-answered';
        setStatus(newStatus);
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMarkForReview = () => {
    const qId = questions[currentIndex].id;
    setStatus({ ...status, [qId]: 'marked-for-review' });
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const handleSubmit = async (skipConfirm: boolean = false) => {
    if (skipConfirm || showConfirmSubmit) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setShowConfirmSubmit(false);
      
      // Calculate score
      let score = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          score += 1;
        }
      });

      // Get or create persistent user ID (handles guests and authenticated users)
      let currentUid = user?.uid;
      if (!currentUid) {
        try {
          currentUid = localStorage.getItem('mockia_guest_uid') || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          localStorage.setItem('mockia_guest_uid', currentUid);
        } catch {
          currentUid = `guest_${Date.now()}`;
        }
      }

      const entryId = getSafeEntryId(currentUid, vargId, subject, testId);
      
      // 1. Always cache submission locally first for 100% offline resilience
      try {
        localStorage.setItem('mockia_last_result', JSON.stringify({
          submissionId: entryId,
          score,
          vargId: vargId || 'unknown',
          subject: subject || 'general',
          testId: testId || 'unknown',
          totalQuestions: questions.length,
          timestamp: new Date().toISOString(),
          answers,
          questions,
        }));
      } catch (storageErr) {
        console.warn('Could not cache result locally:', storageErr);
      }

      // 2. Attempt cloud leaderboard sync in Firestore with timeout safety
      try {
        let finalScore = score;
        try {
          const docSnap = await getDoc(doc(db, 'Leaderboards', entryId));
          if (docSnap.exists()) {
            const existingData = docSnap.data();
            const existingScore = typeof existingData?.totalScore === 'number' ? existingData.totalScore : 0;
            if (existingScore > score) {
              finalScore = existingScore;
            }
          }
        } catch (e) {
          console.warn("Could not check existing leaderboard score:", e);
        }

        const payload = {
          userId: String(currentUid).substring(0, 120),
          userName: (user?.displayName || user?.email?.split('@')[0] || 'Aspirant').substring(0, 80),
          photoURL: user?.photoURL || null,
          vargId: String(vargId || 'unknown').substring(0, 40),
          subject: String(subject || 'general').substring(0, 40),
          testId: String(testId || 'unknown').substring(0, 60),
          totalScore: Math.max(0, finalScore),
          submittedAt: serverTimestamp(),
        };

        const savePromise = setDoc(doc(db, 'Leaderboards', entryId), payload);
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 4000));
        await Promise.race([savePromise, timeoutPromise]);
      } catch (error) {
        console.warn('Online sync note (will proceed to result smoothly):', error);
      }

      // 3. Always smoothly navigate to result page
      navigate('/result', { 
        state: { 
          submissionId: entryId,
          score, 
          vargId: vargId || 'unknown', 
          subject: subject || 'general',
          testId: testId || 'unknown',
          totalQuestions: questions.length,
          answers,
          questions
        } 
      });
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const sections = vargId === 'gk'
    ? ['GK']
    : vargId === 'varg3' 
      ? ['CDP', 'Language 1', 'Language 2', 'Maths', 'EVS']
      : ['Part A', 'Part B'];

  const getSectionQuestions = (sectionName: string) => {
    if (vargId === 'gk') return questions;
    return questions.filter(q => q.section === sectionName || (sectionName === 'Part A' && parseInt(String(q.id)) <= 30) || (sectionName === 'Part B' && parseInt(String(q.id)) > 30));
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center space-y-6">
        <RefreshCw className="w-16 h-16 text-blue-400 animate-spin" />
        <h2 className="text-2xl font-bold">Initializing Exam Engine</h2>
        <p className="text-slate-400">Please wait while we load the questions for your Mockia.in test...</p>
      </div>
    );
  }

  if (alreadyAttempted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-rose-500 blur-3xl opacity-20" />
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-rose-500 tracking-tight">प्रयास की सीमा समाप्त! / Attempt Limit Exceeded</h3>
            <p className="text-xs text-slate-300 font-bold leading-relaxed">
              आप इस लाइव/मॉक टेस्ट को केवल एक ही बार प्रयास कर सकते हैं। आप पहले ही इस टेस्ट को पूरा और सबमिट कर चुके हैं।
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              You can only attempt this online test once. You have already submitted answers for this test key.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              डैशबोर्ड पर जाएं / Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center space-y-6">
        <h2 className="text-2xl font-bold">No Custom Mock Questions Found</h2>
        <p className="text-slate-400">The requested test questions are not populated or incorrect.</p>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-blue-600 rounded text-xs font-bold font-mono">DASHBOARD</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Navigation */}
      <header className="h-12 bg-indigo-900 flex items-center justify-between px-3 md:px-4 shrink-0 text-white shadow-lg z-[60] border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded border border-white/5">
            <School className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xs md:text-sm tracking-tight uppercase">ESB ONLINE EXAM</h1>
            <div className="flex items-center gap-2">
              <span className="text-[8px] bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-300 font-bold uppercase tracking-widest border border-indigo-700">0-001</span>
              <span className="text-[8px] text-indigo-200 font-bold uppercase tracking-widest truncate max-w-[80px] sm:max-w-none">{vargId?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
               <Clock className="w-3.5 h-3.5" />
               <span className="font-mono text-sm md:text-lg tracking-tighter leading-none">{formatTime(timeLeft)}</span>
             </div>
             <p className="text-[7px] text-indigo-400 font-black uppercase tracking-widest mt-0.5">शेष समय</p>
          </div>
        </div>
      </header>

      {/* Main Interface Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Main Body */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Section Selector */}
          <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-1 shrink-0 overflow-x-auto no-scrollbar">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => {
                  const firstInSection = questions.findIndex(q => 
                    q.section === section || 
                    (section === 'Part A' && parseInt(String(q.id)) <= 30) ||
                    (section === 'Part B' && parseInt(String(q.id)) > 30)
                  );
                  if (firstInSection !== -1) setCurrentIndex(firstInSection);
                }}
                className={cn(
                  "px-3 h-full text-[9px] font-bold uppercase tracking-widest transition-all border-x border-slate-200 -mb-px whitespace-nowrap",
                  (currentQ.section === section || 
                   (section === 'Part A' && parseInt(String(currentQ.id)) <= 30) ||
                   (section === 'Part B' && parseInt(String(currentQ.id)) > 30))
                    ? "bg-white text-blue-700 border-b-2 border-b-blue-600"
                    : "text-slate-500 bg-slate-100 hover:bg-slate-200"
                )}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
            {/* Main Question Column */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-2 md:p-4 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-3">
                  {/* Question Info Header */}
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-900/10">
                        {currentQ.id}
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Question</p>
                        <p className="text-[10px] font-bold text-slate-700 leading-none">Objective</p>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[100px] flex items-center">
                    <h2 className="text-sm md:text-base text-slate-900 leading-relaxed font-bold">
                      {currentQ.questionText}
                    </h2>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentQ.options.map((option, idx) => {
                      const label = String.fromCharCode(65 + idx);
                      const isSelected = answers[currentQ.id] === option;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(option)}
                          className={cn(
                            "w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 group/opt relative overflow-hidden",
                            isSelected 
                              ? "bg-blue-900 border-blue-900 text-white shadow-lg" 
                              : "bg-white border-slate-200 hover:border-blue-400"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 shrink-0 rounded-lg border flex items-center justify-center font-black text-[10px] transition-all",
                            isSelected 
                              ? "bg-white/10 border-white/20 text-white" 
                              : "bg-slate-50 border-slate-200 text-slate-400 group-hover/opt:bg-blue-50 group-hover/opt:border-blue-200"
                          )}>
                            {label}
                          </div>
                          <span className={cn(
                            "text-xs font-bold leading-tight",
                            isSelected ? "text-white" : "text-slate-600"
                          )}>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-white border-t border-slate-200 p-2 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2 shrink-0 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex w-full md:w-auto gap-1.5 leading-none">
                  <button 
                    onClick={handleMarkForReview}
                    className="flex-1 md:flex-none bg-amber-500 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 shadow-sm shadow-amber-200"
                  >
                    Mark
                  </button>
                  <button 
                    onClick={() => setShowPalette(true)}
                    className="flex-1 md:flex-none bg-blue-900 text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-md shadow-blue-900/10"
                  >
                    Palette
                  </button>
                </div>

                <div className="flex w-full md:w-auto gap-2">
                  <button 
                    onClick={handlePrevious}
                    disabled={currentIndex === 0 || isSubmitting}
                    className="flex-1 md:flex-none bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-30 transition-all active:scale-95 shadow-md shadow-emerald-100"
                  >
                    Prev
                  </button>
                  <button 
                    onClick={handleSaveAndNext}
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none bg-emerald-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-md shadow-emerald-100 disabled:opacity-50 transition-all active:scale-95"
                  >
                    Save & Next
                  </button>
                  <button 
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 md:flex-none bg-rose-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-md shadow-rose-600/10 transition-all active:scale-95",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? '...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>

            {/* Question Palette Overlay (Slide-over panel) */}
            <AnimatePresence>
              {showPalette && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowPalette(false)}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                  />
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute top-0 right-0 h-full w-full max-w-[320px] bg-white z-50 shadow-2xl flex flex-col"
                  >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-900 text-white">
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-widest">Question Palette</h2>
                        <p className="text-[10px] text-blue-300 font-bold mt-0.5">Quick jump to any question</p>
                      </div>
                      <button 
                        onClick={() => setShowPalette(false)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, i) => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentIndex(i);
                              setShowPalette(false);
                            }}
                            className={cn(
                              "h-10 w-full rounded-xl flex items-center justify-center text-[11px] font-black border-2 transition-all relative",
                              currentIndex === i ? "ring-2 ring-blue-600 ring-offset-2 z-10 scale-110" : "",
                              status[q.id] === 'not-visited' ? "bg-white text-slate-400 border-slate-100" :
                              status[q.id] === 'not-answered' ? "bg-rose-500 text-white border-rose-600" :
                              status[q.id] === 'answered' ? "bg-emerald-500 text-white border-emerald-600" :
                              "bg-amber-500 text-white border-amber-600"
                            )}
                          >
                            {q.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Color Legend</p>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Answered
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <div className="w-3 h-3 rounded-full bg-rose-500"></div> Unanswered
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div> Marked
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                          <div className="w-3 h-3 rounded-full border border-slate-200"></div> Not Visited
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Submission Confirmation Modal */}
        <AnimatePresence>
            {showConfirmSubmit && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowConfirmSubmit(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl space-y-6"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">Final Submission?</h3>
                    <p className="text-sm text-slate-500">You have answered <b>{Object.keys(answers).length}</b> out of {questions.length} questions. Once submitted, you cannot change your answers.</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      disabled={isSubmitting}
                      onClick={() => setShowConfirmSubmit(false)}
                      className="flex-1 py-2.5 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
                    >
                      Cancel / Review
                    </button>
                    <button 
                      disabled={isSubmitting}
                      onClick={() => handleSubmit(true)}
                      className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-700 rounded-lg transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Yes, Submit'
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
}

function School(props: any) {
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
      <path d="m4 6 8-4 8 4" />
      <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
      <path d="M18 5v17" />
      <path d="M6 5v17" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  );
}
