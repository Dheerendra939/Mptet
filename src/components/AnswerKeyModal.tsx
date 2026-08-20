import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Search, 
  Printer, 
  Key, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { Question } from '../types';
import { cn } from '../lib/utils';

interface AnswerKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  userAnswers?: Record<string | number, string>;
  examTitle: string;
  score?: number | null;
  totalQuestions: number;
  loading?: boolean;
}

export default function AnswerKeyModal({
  isOpen,
  onClose,
  questions,
  userAnswers = {},
  examTitle,
  score,
  totalQuestions,
  loading = false
}: AnswerKeyModalProps) {
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showQuickNav, setShowQuickNav] = useState(false);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Compute question stats
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (!userAns) {
        unattempted += 1;
      } else if (userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });

    return {
      total: questions.length || totalQuestions,
      correct,
      incorrect,
      unattempted,
      accuracy: questions.length > 0 ? ((correct / questions.length) * 100).toFixed(1) : '0'
    };
  }, [questions, userAnswers, totalQuestions]);

  // Unique sections list
  const sections = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.section) set.add(q.section);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered questions list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const userAns = userAnswers[q.id];
      const isCorrect = userAns && userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      const isIncorrect = userAns && userAns.trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase();
      const isUnattempted = !userAns;

      // Filter by Status
      if (filterType === 'correct' && !isCorrect) return false;
      if (filterType === 'incorrect' && !isIncorrect) return false;
      if (filterType === 'unattempted' && !isUnattempted) return false;

      // Filter by Section
      if (selectedSection !== 'all' && q.section !== selectedSection) return false;

      // Filter by Search Query
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const textMatch = q.questionText.toLowerCase().includes(queryLower);
        const optionMatch = q.options?.some((opt) => opt.toLowerCase().includes(queryLower));
        const numMatch = String(q.id).includes(queryLower);
        if (!textMatch && !optionMatch && !numMatch) return false;
      }

      return true;
    });
  }, [questions, userAnswers, filterType, selectedSection, searchQuery]);

  const scrollToQuestion = (id: number) => {
    const el = questionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShowQuickNav(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full h-full md:h-[92vh] md:max-w-5xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          id="modal-answer-key"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 md:p-6 shrink-0 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    Answer Key 🔐
                  </span>
                  <span className="text-blue-200 text-xs font-semibold">
                    सटीक उत्तर कुंजी
                  </span>
                </div>
                <h2 className="text-lg md:text-2xl font-black tracking-tight text-white line-clamp-1">
                  {examTitle}
                </h2>
                <p className="text-xs text-blue-200/80">
                  कुल प्रश्न (Total Questions): <span className="font-bold text-white">{stats.total}</span> | पास मार्क / सटीक विश्लेषण
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  id="btn-print-answer-key"
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10 active:scale-95"
                  title="उत्तर कुंजी प्रिंट करें"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
                <button
                  id="btn-close-answer-key"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-all flex items-center justify-center border border-white/10 active:scale-95"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Score & Summary Banner (if user attempted) */}
            {score !== null && score !== undefined && (
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                  <span className="text-[10px] text-blue-200 font-bold block uppercase tracking-wider">कुल प्रश्न</span>
                  <span className="text-sm md:text-base font-black text-white">{stats.total}</span>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-2 border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">सही उत्तर</span>
                  <span className="text-sm md:text-base font-black text-emerald-400">+{stats.correct}</span>
                </div>
                <div className="bg-rose-500/10 rounded-xl p-2 border border-rose-500/20">
                  <span className="text-[10px] text-rose-300 font-bold block uppercase tracking-wider">गलत उत्तर</span>
                  <span className="text-sm md:text-base font-black text-rose-400">{stats.incorrect}</span>
                </div>
                <div className="bg-slate-500/10 rounded-xl p-2 border border-slate-500/20">
                  <span className="text-[10px] text-slate-300 font-bold block uppercase tracking-wider">अनुत्तरित</span>
                  <span className="text-sm md:text-base font-black text-slate-300">{stats.unattempted}</span>
                </div>
              </div>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 shrink-0 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  filterType === 'all'
                    ? "bg-blue-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                )}
              >
                सभी ({questions.length})
              </button>
              {score !== null && (
                <>
                  <button
                    onClick={() => setFilterType('correct')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                      filterType === 'correct'
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200"
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    सही ({stats.correct})
                  </button>
                  <button
                    onClick={() => setFilterType('incorrect')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                      filterType === 'incorrect'
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-white text-rose-700 hover:bg-rose-50 border border-slate-200"
                    )}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    गलत ({stats.incorrect})
                  </button>
                  <button
                    onClick={() => setFilterType('unattempted')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                      filterType === 'unattempted'
                        ? "bg-slate-700 text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    )}
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    छोड़े गए ({stats.unattempted})
                  </button>
                </>
              )}
            </div>

            {/* Search & Section & Quick Jump Toggles */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {sections.length > 1 && (
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">सभी भाग (All Sections)</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              )}

              <div className="relative flex-1 md:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="प्रश्न खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                onClick={() => setShowQuickNav(!showQuickNav)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0",
                  showQuickNav
                    ? "bg-blue-100 text-blue-900 border-blue-300"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                )}
                title="प्रश्नों पर सीधे जाएं"
              >
                1-{questions.length} ⚡
              </button>
            </div>
          </div>

          {/* Quick Jump Palette Overlay */}
          {showQuickNav && (
            <div className="bg-slate-100 border-b border-slate-200 p-3 shrink-0 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  प्रश्न सूची (Question Navigator) - क्लिक करके सीधे पहुंचें
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  🟢 सही &nbsp; 🔴 गलत &nbsp; ⚪ अनुत्तरित
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q) => {
                  const userAns = userAnswers[q.id];
                  const isCorrect = userAns && userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                  const isIncorrect = userAns && userAns.trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase();

                  return (
                    <button
                      key={q.id}
                      onClick={() => scrollToQuestion(q.id)}
                      className={cn(
                        "w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition-all",
                        isCorrect
                          ? "bg-emerald-500 text-white shadow-xs hover:bg-emerald-600"
                          : isIncorrect
                          ? "bg-rose-500 text-white shadow-xs hover:bg-rose-600"
                          : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-200"
                      )}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Question Content Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
            {loading ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-600">उत्तर कुंजी लोड हो रही है...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">कोई प्रश्न नहीं मिला</h4>
                <p className="text-xs text-slate-400">कृपया अपना सर्च शब्द या फ़िल्टर बदल कर देखें।</p>
                <button
                  onClick={() => {
                    setFilterType('all');
                    setSelectedSection('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-xl"
                >
                  फ़िल्टर रीसेट करें
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const userAns = userAnswers[q.id];
                const isAnswered = Boolean(userAns);
                const isCorrect = isAnswered && userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                const isIncorrect = isAnswered && !isCorrect;

                return (
                  <div
                    key={q.id}
                    ref={(el) => (questionRefs.current[q.id] = el)}
                    className={cn(
                      "bg-white rounded-2xl border p-4 md:p-6 transition-all shadow-sm",
                      isCorrect 
                        ? "border-emerald-200 shadow-emerald-500/5" 
                        : isIncorrect 
                        ? "border-rose-200 shadow-rose-500/5" 
                        : "border-slate-200"
                    )}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-blue-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                          Q{q.id}
                        </span>
                        {q.section && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            {q.section}
                          </span>
                        )}
                      </div>

                      {/* Status Tag */}
                      <div>
                        {isCorrect && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            सही उत्तर (+1)
                          </span>
                        )}
                        {isIncorrect && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            गलत उत्तर (0)
                          </span>
                        )}
                        {!isAnswered && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <MinusCircle className="w-3 h-3 text-slate-400" />
                            छोड़ा गया (Not Attempted)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed mb-4">
                      {q.questionText}
                    </h3>

                    {/* Options List */}
                    <div className="space-y-2.5">
                      {q.options?.map((option, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                        const isOptionCorrect = option.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        const isUserChoice = userAns && option.trim().toLowerCase() === userAns.trim().toLowerCase();

                        return (
                          <div
                            key={optIdx}
                            className={cn(
                              "p-3 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center justify-between gap-3",
                              isOptionCorrect
                                ? "bg-emerald-50/90 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                                : isUserChoice && !isOptionCorrect
                                ? "bg-rose-50/90 border-rose-500 text-rose-950 font-bold shadow-xs"
                                : "bg-slate-50 border-slate-200/80 text-slate-700"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0",
                                  isOptionCorrect
                                    ? "bg-emerald-600 text-white"
                                    : isUserChoice && !isOptionCorrect
                                    ? "bg-rose-600 text-white"
                                    : "bg-slate-200 text-slate-600"
                                )}
                              >
                                {optLetter}
                              </span>
                              <span className="leading-snug">{option}</span>
                            </div>

                            {/* Option Badges */}
                            <div className="shrink-0 flex items-center gap-1.5">
                              {isOptionCorrect && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                                  ✓ सही उत्तर (Correct)
                                </span>
                              )}
                              {isUserChoice && !isOptionCorrect && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                                  ✗ आपका उत्तर (Your Choice)
                                </span>
                              )}
                              {isUserChoice && isOptionCorrect && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                                  ✓ आपका चयन
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-white border-t border-slate-200 p-4 shrink-0 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              दिखाए जा रहे प्रश्न: <span className="font-bold text-slate-800">{filteredQuestions.length}</span> / {questions.length}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-900/10 active:scale-95"
            >
              बंद करें (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
