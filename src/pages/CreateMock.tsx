import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, LayoutDashboard, FileText, CheckCircle2, AlertCircle, 
  HelpCircle, Play, Sparkles, BookOpen, Clock, Zap, Plus, ArrowRight 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SUBJECTS_VARG1 = [
  'Hindi', 'English', 'Sanskrit', 'Urdu', 'Mathematics', 'Physics', 'Biology', 
  'Chemistry', 'Home Science', 'Commerce', 'History', 'Geography', 
  'Political Science', 'Economics', 'Agriculture', 'Sociology'
];

const SUBJECTS_VARG2 = [
  'Mathematics', 'Science', 'Social Science', 'Hindi', 'English', 'Sanskrit'
];

export default function CreateMock() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [vargId, setVargId] = useState('gk');
  const [subject, setSubject] = useState('gk');
  const [time, setTime] = useState(20);
  const [questionsCount, setQuestionsCount] = useState(20);
  const [price, setPrice] = useState(30);
  const [isFree, setIsFree] = useState(false);
  const [questionsJson, setQuestionsJson] = useState('');

  // Status and feedback states
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonValid, setJsonValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Automatically update general subject based on varg selection
  useEffect(() => {
    if (vargId === 'varg3') {
      setSubject('general');
      setTime(150);
    } else if (vargId === 'gk') {
      setSubject('gk');
      setTime(20);
    } else {
      const firstSubject = vargId === 'varg1' ? SUBJECTS_VARG1[0] : SUBJECTS_VARG2[0];
      setSubject(firstSubject.toLowerCase());
      setTime(150);
    }
  }, [vargId]);

  // Sync isFree check with price inputs
  useEffect(() => {
    if (isFree) {
      setPrice(0);
    } else if (price === 0) {
      setPrice(30);
    }
  }, [isFree]);

  // Format Helper / Sample JSON Generator
  const sampleJsonPlaceholder = JSON.stringify([
  {
    "questionText": "वर्तमान में भारत के राष्ट्रपति कौन हैं?",
    "options": ["द्रौपदी मुर्मू", "रामनाथ कोविंद", "प्रणब मुखर्जी", "प्रतिभा पाटिल"],
    "correctAnswer": "द्रौपदी मुर्मू"
  },
  {
    "questionText": "मध्य प्रदेश की राजधानी कहाँ है?",
    "options": ["भोपाल", "इंदौर", "जबलपुर", "ग्वालियर"],
    "correctAnswer": "भोपाल"
  }
], null, 2);

  const handleFillSample = () => {
    setQuestionsJson(sampleJsonPlaceholder);
    validateJson(sampleJsonPlaceholder);
  };

  const validateJson = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setJsonError(null);
      setJsonValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        setJsonError('Error: Real content must be a JSON Array [ ... ] of question objects.');
        setJsonValid(false);
        return;
      }

      if (parsed.length === 0) {
        setJsonError('Error: At least 1 question object must be defined in the array.');
        setJsonValid(false);
        return;
      }

      // Check format of items
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.questionText || typeof item.questionText !== 'string') {
          setJsonError(`Error at item ${i + 1}: questionText is missing or not a string.`);
          setJsonValid(false);
          return;
        }
        if (!Array.isArray(item.options) || item.options.length < 2) {
          setJsonError(`Error at item ${i + 1}: options must be an array with at least 2 choice strings.`);
          setJsonValid(false);
          return;
        }
        if (!item.correctAnswer || typeof item.correctAnswer !== 'string') {
          setJsonError(`Error at item ${i + 1}: correctAnswer is missing or not a string.`);
          setJsonValid(false);
          return;
        }
        if (!item.options.includes(item.correctAnswer)) {
          setJsonError(`Warning at item ${i + 1}: Correct answer "${item.correctAnswer}" must exactly match one of the choices listed in options.`);
          setJsonValid(false);
          return;
        }
      }

      setQuestionsCount(parsed.length);
      setJsonError(null);
      setJsonValid(true);
    } catch (err: any) {
      setJsonError(`Invalid JSON Syntax: ${err.message}`);
      setJsonValid(false);
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setQuestionsJson(text);
    validateJson(text);
  };

  const handleCreateMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!title.trim()) {
      setGeneralError('Please enter a descriptive title for this test.');
      return;
    }

    if (!questionsJson.trim() || !jsonValid) {
      setGeneralError('Please paste a valid, zero-error JSON questions block.');
      return;
    }

    setSaving(true);
    try {
      const parsed = JSON.parse(questionsJson);
      
      const payload = {
        title: title.trim(),
        vargId,
        subject: subject.toLowerCase(),
        time: Math.max(1, Math.floor(Number(time)) || 20),
        questionsCount: parsed.length,
        price: isFree ? 0 : Math.max(0, Math.floor(Number(price)) || 30),
        isFree: Boolean(isFree),
        questions: JSON.stringify(parsed),
        joinedCount: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'CustomMockTests'), payload);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving mock test:', err);
      setGeneralError(err.message || 'Firestore connection issue. Please check your rules configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] transition-all"
          id="btn-back-to-dashboard"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </button>

        <header className="space-y-1.5 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]" id="lbl-admin-action">
            <Sparkles className="w-2.5 h-2.5 animate-spin" />
            ADMIN PANEL / व्यवस्थापक डेस्क
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight" id="title-create-mock">
            Create Custom Mock Test / नया मॉक टेस्ट बनाएं
          </h1>
          <p className="text-slate-500 text-sm font-medium opacity-95">
            Configure mock test metadata, set a price (or keep it free), and paste quiz questions in JSON layout.
          </p>
        </header>

        {saveSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-8 text-center space-y-4 max-w-2xl mx-auto shadow-xl shadow-emerald-500/5 my-12"
            id="success-card"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-emerald-900 tracking-tight">सफलतापूर्वक सहेजा गया / Successfully Created Mock Test!</h3>
            <p className="text-sm text-emerald-600 font-medium">
              आपका टेस्ट लाइव हो चुका है। कुछ ही पलों में आप मुख्य डैशबोर्ड पर पुन: निर्देशित होंगे...
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Settings Left Column */}
            <form onSubmit={handleCreateMockSubmit} className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-200 p-6 space-y-6 shadow-sm flex flex-col justify-between" id="form-create-mock">
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                
                {/* Title Input */}
                <div className="col-span-12 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="input-mock-title">
                    Mock Test Title / टेस्ट का शीर्षक *
                  </label>
                  <input
                    id="input-mock-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="जैसे: GK Special Super Mock Test #03"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm font-bold"
                    required
                  />
                </div>

                {/* Category Selector */}
                <div className="col-span-12 sm:col-span-6 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="select-varg">
                    Class Category / परीक्षा श्रेणी *
                  </label>
                  <select
                    id="select-varg"
                    value={vargId}
                    onChange={(e) => setVargId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="gk">General Knowledge (GK Upcoming)</option>
                    <option value="varg1">MPTET Varg 1 (High School)</option>
                    <option value="varg2">MPTET Varg 2 (Middle School)</option>
                    <option value="varg3">MPTET Varg 3 (Primary School)</option>
                  </select>
                </div>

                {/* Subject Selector */}
                <div className="col-span-12 sm:col-span-6 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="select-subject">
                    Subject / विषय
                  </label>
                  {vargId === 'varg1' ? (
                    <select
                      id="select-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm font-bold"
                    >
                      {SUBJECTS_VARG1.map((sub) => (
                        <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                      ))}
                    </select>
                  ) : vargId === 'varg2' ? (
                    <select
                      id="select-subject-varg2"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm font-bold"
                    >
                      {SUBJECTS_VARG2.map((sub) => (
                        <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="input-subject-read"
                      type="text"
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-sm font-bold"
                      value={vargId === 'gk' ? 'General Knowledge' : 'General subjects combined'}
                      readOnly
                    />
                  )}
                </div>

                {/* Duration */}
                <div className="col-span-12 sm:col-span-6 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="input-duration">
                    Duration (Minutes) / समयावधि (मिनट) *
                  </label>
                  <input
                    id="input-duration"
                    type="number"
                    min="1"
                    max="1000"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm font-bold"
                    required
                  />
                </div>

                {/* Question Count Display */}
                <div className="col-span-12 sm:col-span-6 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="input-questions-count">
                    Questions Found / प्रश्न संख्या (डिटेक्टेड)
                  </label>
                  <input
                    id="input-questions-count"
                    type="text"
                    value={`${questionsCount} Questions`}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-700 font-black rounded-xl text-sm"
                    readOnly
                  />
                </div>

                {/* Unlock Pricing Field */}
                <div className="col-span-12 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Unlock Price Plan / मूल्य निर्धारण</p>
                      <p className="text-[10px] text-slate-400">Make it free or configure an unlock amount.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer" id="switch-pricing">
                      <input 
                        type="checkbox" 
                        checked={isFree} 
                        onChange={(e) => setIsFree(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-2.5 text-xs font-black text-slate-800 tracking-tight uppercase">MARK FREE (मुफ़्त)</span>
                    </label>
                  </div>

                  {!isFree ? (
                    <div className="space-y-1.5 shrink-0 animate-fadeIn">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                        <input
                          id="input-price"
                          type="number"
                          min="1"
                          max="5000"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          placeholder="30"
                          className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm font-bold"
                          required={!isFree}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 p-2 rounded-xl animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      यह मॉक टेस्ट विद्यार्थियों के लिए नि:शुल्क रहेगा। (Free of cost)
                    </p>
                  )}
                </div>

                {/* Pasting Box */}
                <div className="col-span-12 space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider" htmlFor="textarea-json">
                      Paste Questions (JSON format) / प्रश्न ब्लॉक *
                    </label>
                    <button 
                      type="button"
                      onClick={handleFillSample}
                      className="text-[10px] text-blue-600 hover:text-blue-700 font-black tracking-tight flex items-center gap-1 hover:underline"
                      id="btn-fill-sample"
                    >
                      <Plus className="w-3 h-3" />
                      ऑटो-भरें सैंपल प्रश्न (Fill Sample)
                    </button>
                  </div>
                  <textarea
                    id="textarea-json"
                    value={questionsJson}
                    onChange={handleJsonChange}
                    placeholder={`[ \n  {\n    "questionText": "Question description here...",\n    "options": ["Choice A", "Choice B", "Choice C", "Choice D"],\n    "correctAnswer": "Choice A"\n  }\n]`}
                    className="w-full h-80 px-4 py-3 bg-[#0f172a] text-emerald-400 font-mono text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all border border-slate-700 shadow-inner resize-y leading-relaxed"
                    required
                  />

                  {jsonError ? (
                    <p className="text-[11px] text-rose-500 font-bold flex items-start gap-1.5 bg-rose-50 border border-rose-100 p-3 rounded-xl leading-relaxed" id="lbl-json-error">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{jsonError}</span>
                    </p>
                  ) : jsonValid ? (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 p-3 rounded-xl" id="lbl-json-success">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      JSON syntax formatting completely valid! Ready to create.
                    </p>
                  ) : null}
                </div>

              </div>

              {generalError && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold leading-normal" id="lbl-general-error">
                  {generalError}
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !jsonValid}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  id="btn-submit-mock"
                >
                  {saving ? 'सहेज रहे हैं / Saving...' : 'मॉक टेस्ट सहेजें / Create Mock Test'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>

            {/* Instruction Side Manual Right Column */}
            <aside className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900 text-white rounded-[2rem] border border-white/5 p-5 relative overflow-hidden shadow-sm" id="instructions-container">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-600 blur-3xl opacity-20" />
                
                <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  JSON Schema Manual
                </h3>
                
                <div className="space-y-4 text-xs font-medium text-slate-300 leading-relaxed">
                  <p>
                    Ensure your pasted questions strictly conform to a standard JSON Array format matching the specification below.
                  </p>
                  
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/5">
                    <p className="font-bold text-white mb-1.5">प्रत्येक प्रश्न का प्रारूप (Format per Question):</p>
                    <ul className="list-disc list-inside space-y-2 mt-1">
                      <li><code className="text-emerald-400 font-mono font-bold">questionText</code>: <span className="opacity-90">String value of the statement.</span></li>
                      <li><code className="text-emerald-400 font-mono font-bold">options</code>: <span className="opacity-90">Array of choices (Strings). Recommended limit is 4.</span></li>
                      <li><code className="text-emerald-400 font-mono font-bold">correctAnswer</code>: <span className="opacity-90">Must match one of your options.</span></li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-blue-300">Important Rules:</p>
                    <div className="text-[11px] space-y-1.5 list-decimal pl-1">
                      <p>1. Never include trailing commas on the last item of lists or objects.</p>
                      <p>2. Double quotes <code className="text-yellow-400">" "</code> must be used for property keys and values.</p>
                      <p>3. Dynamic questions count will be automatically calculated when valid JSON structure is pasted.</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="button" 
                      onClick={handleFillSample}
                      className="w-full text-center py-2.5 bg-white/10 hover:bg-white/15 text-white font-black text-[10px] tracking-wider uppercase rounded-xl transition-all"
                      id="btn-quick-sample"
                    >
                      Copy Sample Questions Layout
                    </button>
                  </div>
                </div>
              </div>

              {/* Realtime Example Preview */}
              {jsonValid && (
                <div className="bg-sky-50 border border-sky-200 text-sky-950 rounded-[2rem] p-5 space-y-3.5" id="preview-panel">
                  <h4 className="text-[10px] font-black text-sky-700 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Interactive Live Preview
                  </h4>
                  <div className="bg-white/90 rounded-2xl p-4 border border-sky-100 space-y-3 shadow-inner">
                    <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-widest bg-sky-200/50 text-sky-800">
                      Sample Generated view
                    </span>
                    <h5 className="font-black text-sm text-slate-900 tracking-tight leading-snug">
                      {JSON.parse(questionsJson)[0]?.questionText}
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {JSON.parse(questionsJson)[0]?.options?.map((opt: string, i: number) => {
                        const isCorrect = opt === JSON.parse(questionsJson)[0]?.correctAnswer;
                        return (
                          <div 
                            key={i} 
                            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                              isCorrect 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-slate-50 border-slate-150 text-slate-700'
                            }`}
                          >
                            <span className="mr-1.5 font-bold opacity-50">{(i + 1)}.</span>
                            {opt}
                            {isCorrect && <span className="float-right text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Correct Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </aside>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
