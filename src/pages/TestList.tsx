import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, LayoutDashboard, FileText, BarChart3, BookMarked, Play, Clock, HelpCircle, Trophy, Lock, Zap, X, AlertCircle, CheckCircle2, Pencil } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditMockModal from '../components/EditMockModal';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

// Add type for Razorpay
// declare window: any; // Removed due to build error

export default function TestList() {
  const { pathname } = useLocation();
  const { subject } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [unlockedTests, setUnlockedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Platform settings config
  const [platformSettings, setPlatformSettings] = useState({
    testPrice: 30,
    promoterCommission: 5,
    studentDiscount: 5
  });

  useEffect(() => {
    async function fetchPlatformSettings() {
      try {
        const settingsRef = doc(db, 'Settings', 'platform');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const sData = settingsSnap.data();
          setPlatformSettings({
            testPrice: sData.testPrice ?? 30,
            promoterCommission: sData.promoterCommission ?? 5,
            studentDiscount: sData.studentDiscount ?? 5
          });
        }
      } catch (err) {
        console.warn('Using default platform settings due to network/cache state.');
      }
    }
    fetchPlatformSettings();
  }, []);

  // Promo and Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [promoVal, setPromoVal] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState<any>(null);

  const isVarg1 = pathname.includes('/varg1');
  const isVarg2 = pathname.includes('/varg2');
  const isVarg3 = pathname.includes('/varg3');
  const isGk = pathname.includes('/gk');
  
  const vargLabel = isGk ? 'GK Practice' : (isVarg1 ? 'Varg 1' : isVarg2 ? 'Varg 2' : 'Varg 3');
  const vargId = isGk ? 'gk' : (isVarg1 ? 'varg1' : isVarg2 ? 'varg2' : 'varg3');
  const subjectLabel = isGk ? 'सामान्य ज्ञान' : (subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'General');
  const title = isGk ? 'GK Questions / सामान्य ज्ञान मॉक टेस्ट' : `MPTET ${vargLabel} - ${subjectLabel} Tests`;

  useEffect(() => {
    async function fetchPurchases() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'UserPurchases'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const purchasedIds = querySnapshot.docs.map(doc => doc.data().testId);
        setUnlockedTests(purchasedIds);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        try {
          handleFirestoreError(error, OperationType.GET, 'UserPurchases');
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, [user]);

  // If there's a stored referral in localStorage, auto-fill and verify it on checkout open
  useEffect(() => {
    if (isCheckoutOpen) {
      const savedReferral = localStorage.getItem('referrerPromoCode');
      if (savedReferral) {
        setPromoVal(savedReferral);
        handleApplyPromo(savedReferral);
      }
    }
  }, [isCheckoutOpen]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyPromo = async (codeToApply: string) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    if (!cleanCode) return;

    setPromoLoading(true);
    setPromoError('');
    setPromoApplied(null);

    try {
      const q = query(
        collection(db, 'Promoters'),
        where('promoCode', '==', cleanCode)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const promoterDoc = querySnapshot.docs[0];
        setPromoApplied(promoterDoc.data());
        setPromoError('');
      } else {
        setPromoError('अमान्य प्रमोकोड। कृपया सही कोड दर्ज करें।');
      }
    } catch (err) {
      console.error('Error verifying promoter code:', err);
      setPromoError('तकनीकी त्रुटि। कृपया पुन: प्रयास करें।');
      try {
        handleFirestoreError(err, OperationType.GET, 'Promoters');
      } catch (_) {}
    } finally {
      setPromoLoading(false);
    }
  };

  const openCheckout = (test: any) => {
    setSelectedTest(test);
    setPromoVal('');
    setPromoError('');
    setPromoApplied(null);
    setIsCheckoutOpen(true);
  };

  const getSelectedTestPriceInfo = () => {
    if (!selectedTest) return { basePrice: 0, finalPrice: 0, isGkExpired: false };
    
    const basePrice = selectedTest.price ?? platformSettings.testPrice;
    
    const finalPrice = promoApplied 
      ? Math.max(0, basePrice - platformSettings.studentDiscount) 
      : basePrice;
          
    return { basePrice, finalPrice, isGkExpired: false };
  };

  const handlePayment = async () => {
    if (!selectedTest) return;

    // Ensure Razorpay is loaded
    if (!(window as any).Razorpay) {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert('Failed to load payment gateway. Please check your internet connection.');
        return;
      }
    }

    const { basePrice, finalPrice, isGkExpired } = getSelectedTestPriceInfo();
    const payableAmountInMin = finalPrice * 100;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SqPoGL5YHv2fKo',
      amount: payableAmountInMin,
      currency: 'INR',
      name: 'Mockia.in',
      description: `Unlock ${selectedTest.title}`,
      handler: async function (response: any) {
        try {
          const purchasePayload: any = {
            userId: user?.uid,
            testId: `${vargId}_${subject || 'general'}_${selectedTest.id}`,
            vargId,
            subject: subject || 'general',
            purchasedAt: serverTimestamp(),
            paymentId: response.razorpay_payment_id
          };

          if (promoApplied && !isGkExpired && basePrice !== 1) {
            purchasePayload.promoCode = promoApplied.promoCode;
            purchasePayload.amountPaid = payableAmountInMin;
            purchasePayload.promoterUserId = promoApplied.userId;
          } else {
            purchasePayload.promoCode = null;
            purchasePayload.amountPaid = payableAmountInMin;
            purchasePayload.promoterUserId = null;
          }

          // Store purchase in Firestore
          await addDoc(collection(db, 'UserPurchases'), purchasePayload);
          
          setUnlockedTests([...unlockedTests, `${vargId}_${subject || 'general'}_${selectedTest.id}`]);
          setIsCheckoutOpen(false);
          alert('Payment Successful! Test Unlocked.');
        } catch (error) {
          console.error('Error saving purchase:', error);
          alert('Payment successful but failed to unlock test. Please contact support.');
        }
      },
      prefill: {
        name: user?.displayName || '',
        email: user?.email || '',
      },
      theme: {
        color: '#1e3a8a',
      },
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: false, path: '/dashboard' },
    { label: 'My Mock Tests', icon: FileText, active: true },
    { label: 'Performance', icon: BarChart3, active: false },
    { label: 'Study Material', icon: BookMarked, active: false },
  ];

  const [customTests, setCustomTests] = useState<any[]>([]);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCustomTests = useCallback(async () => {
    try {
      const q = vargId === 'gk'
        ? query(collection(db, 'CustomMockTests'), where('vargId', '==', 'gk'))
        : query(
            collection(db, 'CustomMockTests'),
            where('vargId', '==', vargId),
            where('subject', '==', (subject || 'general').toLowerCase())
          );
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title,
          questions: data.questionsCount,
          rawQuestions: data.questions,
          time: data.time,
          difficulty: 'Medium',
          price: data.price,
          isFree: data.isFree,
          isCustom: true
        };
      });
      setCustomTests(fetched);
    } catch (err) {
      console.error('Error fetching custom tests:', err);
      try {
        handleFirestoreError(err, OperationType.GET, 'CustomMockTests');
      } catch (_) {}
    }
  }, [vargId, subject]);

  useEffect(() => {
    fetchCustomTests();
  }, [fetchCustomTests]);

  const handleOpenEdit = (test: any) => {
    setEditingTest(test);
    setIsEditModalOpen(true);
  };

  const tests = vargId === 'gk'
    ? customTests
    : [
        { id: '1', title: `${subjectLabel} Full Mock Test #01`, questions: 150, time: 150, difficulty: 'Medium', isFree: false, price: undefined },
        ...customTests
      ];

  const handleBack = () => {
    if (isVarg3) navigate('/dashboard');
    else if (isVarg1) navigate('/varg1/subjects');
    else if (isVarg2) navigate('/varg2/subjects');
    else navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 gap-8 hidden lg:flex">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  item.active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all" />
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-400 mb-1">PRO PLAN</p>
            <p className="text-xs font-medium leading-relaxed opacity-80 mb-3">Unlock 500+ premium mock tests & detailed analysis.</p>
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
              <Zap className="w-3 h-3 fill-current" />
              Upgrade Now
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <button 
              onClick={handleBack}
              className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] transition-all mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            <header className="space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">
                <Trophy className="w-2.5 h-2.5" />
                Available Tests
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
              <p className="text-slate-500 text-sm font-medium opacity-90">Prepare with our full-length mock tests designed by experts.</p>
            </header>

            <div className="space-y-3 pb-12">
              {tests.map((test, i) => {
                const testKey = `${vargId}_${subject || 'general'}_${test.id}`;
                const isAdmin = user?.email === 'qzquiz50@gmail.com';
                const isUnlocked = unlockedTests.includes(testKey) || test.isFree || isAdmin;
                const displayPrice = test.price ?? platformSettings.testPrice;

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative bg-blue-900 border border-white/5 rounded-[1.5rem] p-5 flex flex-col md:flex-row items-center justify-between gap-5 hover:shadow-lg transition-all group overflow-hidden"
                  >
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-600 blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex-1 space-y-3 w-full">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          test.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                          test.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {test.difficulty}
                        </span>
                        {test.isFree ? (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/10">
                            Free
                          </div>
                        ) : !isUnlocked ? (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-blue-300 text-[8px] font-black uppercase tracking-widest border border-white/5">
                            <Lock className="w-2 h-2" />
                            Premium
                          </div>
                        ) : null}

                        {/* Admin Edit Button above/on each mock test card */}
                        {isAdmin && (
                          <button
                            id={`btn-edit-test-${test.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(test);
                            }}
                            className="px-2.5 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-amber-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-amber-300 transition-all transform active:scale-95 cursor-pointer ml-auto"
                            title="Edit test price, title, and questions"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                            Edit Test / संपादित करें
                          </button>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-black text-white tracking-tight group-hover:text-blue-200 transition-colors leading-tight">{test.title}</h3>
                      
                      <div className="flex items-center gap-4 text-blue-200/50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-blue-300">
                            <HelpCircle className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[7px] font-black text-blue-400 uppercase tracking-tighter">QUESTIONS</p>
                            <p className="text-xs font-bold text-white leading-none">{test.questions} Qs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-blue-300">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[7px] font-black text-blue-400 uppercase tracking-tighter">DURATION</p>
                            <p className="text-xs font-bold text-white leading-none">{test.time} Min</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-3 md:pt-0">
                      {isUnlocked ? (
                        <button 
                          onClick={() => navigate(`/varg/${vargId}/exam/${test.id}${subject ? `/${subject}` : ''}`)}
                          className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[11px] tracking-widest uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transform group-hover:scale-105 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Begin Test
                        </button>
                      ) : (
                        <button 
                          onClick={() => openCheckout(test)}
                          className="w-full md:w-auto px-6 py-3 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-amber-950 rounded-2xl font-black text-[11px] tracking-widest uppercase hover:shadow-[0_8px_25px_-5px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2.5 transform group-hover:scale-105 active:scale-95 border border-amber-300/30"
                        >
                          <Zap className="w-3.5 h-3.5 fill-amber-950/40" />
                          Unlock Now <span className="text-[13px] ml-1">₹{displayPrice}</span>
                        </button>
                      )}

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/result', { state: { vargId, subject: subject || 'general', testId: test.id, totalQuestions: test.questions } });
                        }}
                        className="w-full md:w-auto px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
                      >
                        <BarChart3 className="w-3 h-3" />
                        Rank
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <Footer />
          </div>
        </main>
      </div>

      {/* Edit Mock Test Modal for Admin */}
      <EditMockModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        test={editingTest}
        vargId={vargId}
        subject={subject}
        onSaved={fetchCustomTests}
      />

      {/* Checkout modal overlay */}
      {isCheckoutOpen && selectedTest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-[2rem] w-full max-w-md p-5 sm:p-6 border border-slate-100 shadow-2xl relative space-y-4 sm:space-y-5 my-auto max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Close */}
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Container Content */}
            <div className="overflow-y-auto pr-1 space-y-4 sm:space-y-5 scrollbar-thin">
              {/* Header / Summary */}
              <div className="space-y-1.5 pt-4 sm:pt-2">
                <span className="inline-block text-[8px] sm:text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">
                  Secure Checkout / सुरक्षित भुगतान
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-normal font-sans">
                  {selectedTest.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">MPTET {vargLabel} • {subjectLabel} Mock Test</p>
              </div>

              {/* Price breakdown */}
              {(() => {
                const { basePrice, finalPrice, isGkExpired } = getSelectedTestPriceInfo();
                return (
                  <>
                    <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-150 space-y-2 sm:space-y-2.5 font-sans">
                      <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span>वास्तविक मूल्य / Original Price</span>
                        <span className={promoApplied && basePrice !== finalPrice ? 'line-through' : ''}>₹{basePrice}.00</span>
                      </div>

                      {promoApplied && basePrice !== finalPrice && (
                        <div className="flex justify-between items-center text-[11px] sm:text-xs text-emerald-600 font-bold">
                          <span className="flex items-center gap-1">🎟 प्रमोकोड छूट / Promo Discount ({promoApplied.promoCode})</span>
                          <span>- ₹{platformSettings.studentDiscount}.00</span>
                        </div>
                      )}

                      <hr className="border-slate-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider">कुल भुगतान / Net Payable</span>
                        <span className="text-lg sm:text-xl font-black text-blue-600 font-mono">
                          ₹{finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Promocode Apply Input */}
                    {!isGkExpired && basePrice !== 1 && (
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          यदि आपके पास प्रमोकोड है तो दर्ज करें / Have a Promo Code?
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={promoVal} 
                            onChange={(e) => setPromoVal(e.target.value)}
                            placeholder="जैसे: TIWARI5"
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 font-mono text-xs sm:text-sm uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold tracking-wider"
                            disabled={promoLoading}
                          />
                          <button 
                            onClick={() => handleApplyPromo(promoVal)}
                            disabled={promoLoading || !promoVal.trim()}
                            className="px-3 sm:px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] sm:text-xs font-black transition-all uppercase tracking-wider shrink-0 disabled:bg-slate-200 disabled:text-slate-400"
                          >
                            {promoLoading ? 'जांचें...' : 'लागू करें / Apply'}
                          </button>
                        </div>

                        {promoError && (
                          <p className="text-[11px] sm:text-xs text-rose-500 font-bold flex items-center gap-1.5 pt-0.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {promoError}
                          </p>
                        )}

                        {promoApplied && (
                          <p className="text-[11px] sm:text-xs text-emerald-600 font-bold flex items-center gap-1.5 pt-0.5 animate-bounce">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            बधाई हो! ₹{platformSettings.studentDiscount} की बचत लागू की गई है।
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2 pt-1 font-sans">
                      <button 
                        onClick={handlePayment}
                        className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transform active:scale-95"
                      >
                        ₹{finalPrice} का भुगतान करें / Proceed to Pay
                      </button>
                      <p className="text-[8px] sm:text-[9px] text-slate-400 text-center leading-relaxed font-semibold font-sans">
                        * सुरक्षित और पारदर्शी पेमेंट Razorpay क्रेडेंशियल्स द्वारा संचालित है।
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
