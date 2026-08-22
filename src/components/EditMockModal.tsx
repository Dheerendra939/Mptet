import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, AlertCircle, Trash2, Plus, Edit3, Code, List, 
  HelpCircle, Clock, DollarSign, Sparkles, Save, CheckCircle2, Copy
} from 'lucide-react';
import { doc, updateDoc, setDoc, addDoc, collection, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Question } from '../types';
import { generateFullMockTest, attachPartATo120Paper } from '../data/mockQuestions';

export interface EditMockModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: any; // { id, title, price, isFree, time, questions, vargId, subject, isCustom, ... }
  vargId: string;
  subject?: string;
  onSaved?: () => void;
}

export default function EditMockModal({
  isOpen,
  onClose,
  test,
  vargId,
  subject,
  onSaved
}: EditMockModalProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'json'>('settings');

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(30);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [time, setTime] = useState<number>(150);
  const [questionsList, setQuestionsList] = useState<Array<{
    id?: number | string;
    section?: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
  }>>([]);
  const [questionsJson, setQuestionsJson] = useState<string>('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  // Initialize or load test data when opened
  useEffect(() => {
    if (!isOpen || !test) return;

    setLoading(true);
    setSaveSuccess(false);
    setErrorMessage('');
    setJsonError(null);
    setActiveTab('settings');

    setTitle(test.title || '');
    setPrice(test.price !== undefined ? Number(test.price) : 30);
    setIsFree(Boolean(test.isFree));
    setTime(test.time ? Number(test.time) : (vargId === 'gk' ? 20 : 150));

    // Load questions
    async function loadTestQuestions() {
      try {
        let qs: any[] = [];
        if (test.isCustom && test.rawQuestions) {
          qs = typeof test.rawQuestions === 'string' ? JSON.parse(test.rawQuestions) : test.rawQuestions;
        } else if (test.isCustom && test.questions && Array.isArray(test.questions)) {
          qs = test.questions;
        } else {
          // Default test or built-in test
          let generated = generateFullMockTest(vargId, subject || 'general', test.id);
          if (generated.length === 120) {
            generated = attachPartATo120Paper(generated);
          }
          qs = generated.map((q, idx) => ({
            id: idx + 1,
            section: q.section || 'General',
            questionText: q.questionText,
            options: q.options || [],
            correctAnswer: q.correctAnswer || ''
          }));
        }

        setQuestionsList(qs);
        const jsonString = JSON.stringify(
          qs.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            ...(q.section ? { section: q.section } : {})
          })), 
          null, 
          2
        );
        setQuestionsJson(jsonString);
      } catch (err) {
        console.error('Error parsing questions for edit:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTestQuestions();
  }, [isOpen, test, vargId, subject]);

  // Sync isFree with price
  const handleFreeToggle = (checked: boolean) => {
    setIsFree(checked);
    if (checked) {
      setPrice(0);
    } else if (price === 0) {
      setPrice(30);
    }
  };

  // Sync questionsList to JSON
  const syncListToJson = (list: any[]) => {
    setQuestionsList(list);
    const jsonString = JSON.stringify(
      list.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        ...(q.section ? { section: q.section } : {})
      })), 
      null, 
      2
    );
    setQuestionsJson(jsonString);
    setJsonError(null);
  };

  // Validate and parse JSON when edited in JSON tab
  const handleJsonChange = (text: string) => {
    setQuestionsJson(text);
    const trimmed = text.trim();
    if (!trimmed) {
      setJsonError('JSON cannot be empty.');
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        setJsonError('Error: Content must be a JSON Array of question objects [ ... ].');
        return;
      }

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.questionText || typeof item.questionText !== 'string') {
          setJsonError(`Error at item #${i + 1}: questionText is missing or invalid.`);
          return;
        }
        if (!Array.isArray(item.options) || item.options.length < 2) {
          setJsonError(`Error at item #${i + 1}: options array must contain at least 2 choices.`);
          return;
        }
        if (!item.correctAnswer || typeof item.correctAnswer !== 'string') {
          setJsonError(`Error at item #${i + 1}: correctAnswer string is missing.`);
          return;
        }
      }

      setJsonError(null);
      setQuestionsList(parsed.map((q, idx) => ({
        id: idx + 1,
        section: q.section || 'General',
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer
      })));
    } catch (err: any) {
      setJsonError(`Invalid JSON Syntax: ${err.message}`);
    }
  };

  // Question editing helpers
  const handleUpdateQuestionText = (index: number, newText: string) => {
    const updated = [...questionsList];
    updated[index] = { ...updated[index], questionText: newText };
    syncListToJson(updated);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, newOptVal: string) => {
    const updated = [...questionsList];
    const oldOpt = updated[qIndex].options[optIndex];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = newOptVal;

    let newCorrect = updated[qIndex].correctAnswer;
    if (newCorrect === oldOpt) {
      newCorrect = newOptVal;
    }

    updated[qIndex] = {
      ...updated[qIndex],
      options: newOptions,
      correctAnswer: newCorrect
    };
    syncListToJson(updated);
  };

  const handleSetCorrectAnswer = (qIndex: number, selectedOpt: string) => {
    const updated = [...questionsList];
    updated[qIndex] = { ...updated[qIndex], correctAnswer: selectedOpt };
    syncListToJson(updated);
  };

  const handleAddQuestion = () => {
    const newQ = {
      id: questionsList.length + 1,
      section: 'General',
      questionText: 'नया प्रश्न यहाँ लिखें...',
      options: ['विकल्प 1', 'विकल्प 2', 'विकल्प 3', 'विकल्प 4'],
      correctAnswer: 'विकल्प 1'
    };
    const updated = [...questionsList, newQ];
    syncListToJson(updated);
    setSelectedQuestionIndex(updated.length - 1);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questionsList.length <= 1) {
      alert('कम से कम 1 प्रश्न होना आवश्यक है।');
      return;
    }
    const updated = questionsList.filter((_, i) => i !== index).map((q, idx) => ({
      ...q,
      id: idx + 1
    }));
    syncListToJson(updated);
    if (selectedQuestionIndex >= updated.length) {
      setSelectedQuestionIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questionsList[index];
    const duplicated = {
      ...target,
      id: questionsList.length + 1,
      questionText: `${target.questionText} (Copy)`
    };
    const updated = [...questionsList];
    updated.splice(index + 1, 0, duplicated);
    const reindexed = updated.map((q, idx) => ({ ...q, id: idx + 1 }));
    syncListToJson(reindexed);
    setSelectedQuestionIndex(index + 1);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage('कृपया टेस्ट का शीर्षक दर्ज करें।');
      setActiveTab('settings');
      return;
    }

    if (questionsList.length === 0) {
      setErrorMessage('मॉक टेस्ट में कम से कम 1 प्रश्न होना आवश्यक है।');
      setActiveTab('questions');
      return;
    }

    if (jsonError) {
      setErrorMessage(`JSON में त्रुटि है: ${jsonError}`);
      setActiveTab('json');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const sanitizedQuestions = questionsList.map(q => ({
        questionText: q.questionText.trim(),
        options: q.options.map(o => o.trim()),
        correctAnswer: q.correctAnswer.trim(),
        ...(q.section ? { section: q.section } : {})
      }));

      const finalPrice = isFree ? 0 : Math.max(0, Math.floor(Number(price)) || 0);
      const finalTime = Math.max(1, Math.floor(Number(time)) || 20);

      const payload: Record<string, any> = {
        title: title.trim(),
        vargId: vargId.toLowerCase(),
        subject: (subject || 'general').toLowerCase(),
        time: finalTime,
        questionsCount: sanitizedQuestions.length,
        price: finalPrice,
        isFree: Boolean(isFree),
        questions: JSON.stringify(sanitizedQuestions),
        updatedAt: serverTimestamp()
      };

      if (test.isCustom && test.id && test.id !== '1') {
        // Update existing Firestore custom mock test
        const docRef = doc(db, 'CustomMockTests', test.id);
        await updateDoc(docRef, payload);
      } else {
        // Saving Test #1 or creating a persistent record
        const docId = test.isCustom ? test.id : `custom_${vargId}_${(subject || 'general').toLowerCase()}_${Date.now()}`;
        payload.createdAt = serverTimestamp();
        if (auth.currentUser?.uid) payload.authorId = auth.currentUser.uid;
        if (auth.currentUser?.email) payload.authorEmail = auth.currentUser.email;
        
        await setDoc(doc(db, 'CustomMockTests', docId), payload);
      }

      setSaveSuccess(true);
      if (onSaved) onSaved();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error updating mock test:', err);
      setErrorMessage(err?.message || 'मॉक टेस्ट सहेजने में विफल। कृपया पुन: प्रयास करें।');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTest = async () => {
    if (!test.isCustom || !test.id) {
      alert('डिफ़ॉल्ट टेस्ट को हटाया नहीं जा सकता, आप इसे केवल संपादित कर सकते हैं।');
      return;
    }

    if (!window.confirm(`क्या आप वाकई इस टेस्ट "${test.title}" को हमेशा के लिए हटाना चाहते हैं?`)) {
      return;
    }

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'CustomMockTests', test.id));
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error deleting test:', err);
      alert('हटाने में विफलता: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !test) return null;

  const filteredQuestions = questionsList.filter((q, idx) => {
    if (!searchQuery.trim()) return true;
    const qNum = String(idx + 1);
    const textMatch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    return qNum.includes(searchQuery) || textMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl sm:rounded-[2rem] w-full max-w-5xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-white my-auto"
        id="modal-edit-mock-test"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase tracking-wider border border-blue-500/30">
                  {vargId?.toUpperCase()} • {subject || 'General'}
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Admin Editor
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                मॉक टेस्ट संपादित करें (Edit Mock Test)
              </h2>
            </div>
          </div>

          <button
            id="btn-close-edit-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/50 px-4 gap-2 shrink-0">
          <button
            id="tab-edit-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            1. शीर्षक एवं मूल्य (Title & Price)
          </button>

          <button
            id="tab-edit-questions"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'questions'
                ? 'border-amber-400 text-amber-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            2. प्रश्नोत्तर संपादक ({questionsList.length} Qs)
          </button>

          <button
            id="tab-edit-json"
            onClick={() => setActiveTab('json')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'json'
                ? 'border-amber-400 text-amber-400 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            3. JSON कोड एडिटर
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {saveSuccess ? (
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3 my-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-emerald-300">
                सफलतापूर्वक अपडेट किया गया! / Successfully Updated Mock Test!
              </h3>
              <p className="text-xs text-emerald-200/80">
                टेस्ट का नया शीर्षक, मूल्य और प्रश्न तुरंत लाइव हो चुके हैं।
              </p>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {/* TAB 1: SETTINGS (Title, Price, Time) */}
              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                      Mock Test Title / टेस्ट का शीर्षक *
                    </label>
                    <input
                      id="input-edit-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="उदा: MPTET Varg 1 Hindi Full Mock Test #01"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-white font-bold text-sm"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-xl border border-white/5">
                    <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                      Test Price / टेस्ट का मूल्य (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-amber-400">₹</span>
                      <input
                        id="input-edit-price"
                        type="number"
                        min="0"
                        value={price}
                        disabled={isFree}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-white font-mono font-bold text-sm disabled:opacity-50"
                      />
                    </div>

                    <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                      <input
                        id="checkbox-edit-free"
                        type="checkbox"
                        checked={isFree}
                        onChange={(e) => handleFreeToggle(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 bg-slate-700 border-white/20"
                      />
                      <span className="text-xs font-bold text-emerald-400">
                        यह टेस्ट सभी के लिए फ्री रखें (Free for all)
                      </span>
                    </label>
                  </div>

                  {/* Time Duration */}
                  <div className="space-y-1.5 bg-slate-800/40 p-4 rounded-xl border border-white/5">
                    <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                      Duration / समय अवधि (मिनट में) *
                    </label>
                    <div className="relative">
                      <input
                        id="input-edit-time"
                        type="number"
                        min="1"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-white font-mono font-bold text-sm"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        मिनट (Min)
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">
                      मानक समय: वर्ग 1, 2, 3 हेतु 150 मिनट, GK टेस्ट हेतु 20 मिनट।
                    </p>
                  </div>

                  {/* Quick Summary Card */}
                  <div className="md:col-span-2 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        {questionsList.length}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">कुल प्रश्न लोड किए गए (Total Questions)</p>
                        <p className="text-[10px] text-blue-300">
                          प्रश्नों को देखने व संपादित करने के लिए 'प्रश्नोत्तर संपादक' टैब पर क्लिक करें।
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('questions')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                    >
                      प्रश्न संपादित करें &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: QUESTIONS VISUAL EDITOR */}
              {activeTab === 'questions' && (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="प्रश्न संख्या या कीवर्ड खोजें..."
                        className="w-full px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="btn-add-question"
                        onClick={handleAddQuestion}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        + नया प्रश्न जोड़ें (Add Question)
                      </button>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                    {filteredQuestions.map((q, idx) => {
                      const actualIndex = questionsList.findIndex(item => item === q);
                      const currentIdx = actualIndex !== -1 ? actualIndex : idx;

                      return (
                        <div
                          key={currentIdx}
                          className="bg-slate-800/70 border border-white/10 rounded-xl p-4 space-y-3 transition-all hover:border-amber-400/30"
                        >
                          {/* Question Top Header */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-400 font-black text-xs font-mono">
                                #{currentIdx + 1}
                              </span>
                              {q.section && (
                                <span className="text-[10px] text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded">
                                  {q.section}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDuplicateQuestion(currentIdx)}
                                title="Duplicate Question"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all text-xs"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(currentIdx)}
                                title="Delete Question"
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 transition-all text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Question Text */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              प्रश्न (Question Text):
                            </label>
                            <textarea
                              rows={2}
                              value={q.questionText}
                              onChange={(e) => handleUpdateQuestionText(currentIdx, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                              placeholder="प्रश्न का विवरण यहाँ लिखें..."
                            />
                          </div>

                          {/* Options */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              विकल्प और सही उत्तर चुनें (Select Correct Answer):
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = q.correctAnswer === opt;
                                return (
                                  <div
                                    key={optIdx}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                      isCorrect
                                        ? 'bg-emerald-950/40 border-emerald-500/50'
                                        : 'bg-slate-900/50 border-white/5'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleSetCorrectAnswer(currentIdx, opt)}
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                                        isCorrect
                                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40'
                                          : 'bg-white/10 text-slate-400 hover:bg-white/20'
                                      }`}
                                      title={isCorrect ? 'Correct Answer' : 'Click to make this the correct answer'}
                                    >
                                      {isCorrect ? <Check className="w-3.5 h-3.5" /> : String.fromCharCode(65 + optIdx)}
                                    </button>

                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => handleUpdateOption(currentIdx, optIdx, e.target.value)}
                                      className="flex-1 px-2 py-1 bg-transparent text-xs text-white focus:outline-none font-medium"
                                      placeholder={`Option ${optIdx + 1}`}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: JSON CODE EDITOR */}
              {activeTab === 'json' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">
                      प्रश्नों का संपूर्ण JSON एरे (Full JSON Array)
                    </span>
                    <button
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(questionsJson);
                          setQuestionsJson(JSON.stringify(parsed, null, 2));
                        } catch (_) {}
                      }}
                      className="text-[10px] text-amber-400 hover:underline font-bold"
                    >
                      Format / Beautify JSON
                    </button>
                  </div>

                  <textarea
                    rows={14}
                    value={questionsJson}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-emerald-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    placeholder="[ { questionText: '...', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' } ]"
                  />

                  {jsonError && (
                    <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {jsonError}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-950/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {test.isCustom && (
              <button
                id="btn-delete-mock-test"
                onClick={handleDeleteTest}
                disabled={saving}
                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                टेस्ट हटाएं (Delete Test)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-cancel-edit-modal"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
            >
              रद्द करें (Cancel)
            </button>

            <button
              id="btn-save-mock-test"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'सहेज रहे हैं...' : 'परिवर्तन सहेजें (Save Changes)'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
