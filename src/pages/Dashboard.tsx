import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, FileText, BarChart3, BookMarked, ArrowRight, BookOpen, School, Pencil, Zap, Clock, HelpCircle, Play, Plus, Sparkles, Lock, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customGkTests, setCustomGkTests] = useState<any[]>([]);
  const [loadingGk, setLoadingGk] = useState(false);
  const [customMptetTests, setCustomMptetTests] = useState<any[]>([]);
  const [loadingMptet, setLoadingMptet] = useState(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  const [unlockedTests, setUnlockedTests] = useState<string[]>([]);
  const [platformSettings, setPlatformSettings] = useState({
    testPrice: 30,
    promoterCommission: 5,
    studentDiscount: 5
  });

  // Promo and Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [promoVal, setPromoVal] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState<any>(null);

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

  const handlePayment = async () => {
    if (!selectedTest) return;

    const testVargId = selectedTest.vargId || 'gk';
    const testSubject = selectedTest.subject || 'general';
    const currentPrice = selectedTest.price ?? platformSettings.testPrice;

    // Check if it is explicitly free or if the calculated/discounted price is 0
    const finalPrice = promoApplied 
      ? Math.max(0, currentPrice - platformSettings.studentDiscount)
      : currentPrice;

    const isFreeTest = selectedTest.isFree || finalPrice === 0;

    if (isFreeTest) {
      try {
        const purchasePayload: any = {
          userId: user?.uid,
          testId: `${testVargId}_${testSubject}_${selectedTest.id}`,
          vargId: testVargId,
          subject: testSubject,
          purchasedAt: serverTimestamp(),
          paymentId: 'FREE_REGISTRATION_OK'
        };

        if (promoApplied) {
          purchasePayload.amountPaid = 0;
          purchasePayload.promoCode = promoApplied.promoCode;
          purchasePayload.promoterUserId = promoApplied.userId;
        }

        // Store purchase in Firestore
        await addDoc(collection(db, 'UserPurchases'), purchasePayload);
        
        setUnlockedTests([...unlockedTests, `${testVargId}_${testSubject}_${selectedTest.id}`]);
        setIsCheckoutOpen(false);
        alert('सफलतापूर्वक अनलॉक हो गया है! / Registration Successful!');
      } catch (error) {
        console.error('Error saving free registration/purchase:', error);
        alert('पंजीकरण करने में विफलता। कृपया पुन: प्रयास करें।');
      }
      return;
    }

    // Ensure Razorpay is loaded
    if (!(window as any).Razorpay) {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert('Failed to load payment gateway. Please check your internet connection.');
        return;
      }
    }

    const payableAmountInMin = promoApplied 
      ? Math.max(0, currentPrice - platformSettings.studentDiscount) * 100 
      : currentPrice * 100;

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
            testId: `${testVargId}_${testSubject}_${selectedTest.id}`,
            vargId: testVargId,
            subject: testSubject,
            purchasedAt: serverTimestamp(),
            paymentId: response.razorpay_payment_id
          };

          if (promoApplied) {
            purchasePayload.promoCode = promoApplied.promoCode;
            purchasePayload.amountPaid = Math.max(0, currentPrice - platformSettings.studentDiscount) * 100;
            purchasePayload.promoterUserId = promoApplied.userId;
          } else {
            purchasePayload.promoCode = null;
            purchasePayload.amountPaid = currentPrice * 100;
            purchasePayload.promoterUserId = null;
          }

          // Store purchase in Firestore
          await addDoc(collection(db, 'UserPurchases'), purchasePayload);
          
          setUnlockedTests([...unlockedTests, `${testVargId}_${testSubject}_${selectedTest.id}`]);
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

  useEffect(() => {
    async function fetchCustomGkTests() {
      setLoadingGk(true);
      try {
        const q = query(
          collection(db, 'CustomMockTests'),
          where('vargId', '==', 'gk')
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            questions: data.questionsCount,
            time: data.time,
            difficulty: 'Medium',
            price: data.price,
            isFree: data.isFree,
            vargId: 'gk',
            subject: 'general',
            isCustom: true
          };
        });
        setCustomGkTests(fetched);
        setConnectionError(false);
      } catch (err: any) {
        console.error('Error fetching custom GK tests:', err);
        setConnectionError(true);
        try {
          handleFirestoreError(err, OperationType.GET, 'CustomMockTests');
        } catch (e) {
          // Prevent crash, handled through UI state
        }
      } finally {
        setLoadingGk(false);
      }
    }

    async function fetchCustomMptetTests() {
      setLoadingMptet(true);
      try {
        const q = query(
          collection(db, 'CustomMockTests'),
          where('vargId', 'in', ['varg1', 'varg2', 'varg3'])
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title,
            questions: data.questionsCount,
            time: data.time,
            difficulty: 'Medium',
            price: data.price,
            isFree: data.isFree,
            vargId: data.vargId,
            subject: data.subject,
            isCustom: true
          };
        });
        setCustomMptetTests(fetched);
        setConnectionError(false);
      } catch (err: any) {
        console.error('Error fetching custom MPTET tests:', err);
        setConnectionError(true);
        try {
          handleFirestoreError(err, OperationType.GET, 'CustomMockTests');
        } catch (e) {
          // Prevent crash, handled through UI state
        }
      } finally {
        setLoadingMptet(false);
      }
    }

    fetchCustomGkTests();
    fetchCustomMptetTests();
  }, [user]);

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'My Mock Tests', icon: FileText, active: false },
    { label: 'Performance', icon: BarChart3, active: false },
    { label: 'Study Material', icon: BookMarked, active: false },
  ];

  const categories = [
    { 
      id: 'varg1', 
      title: 'MPTET Varg 1', 
      subtitle: 'High School Teacher', 
      icon: School, 
      color: 'blue', 
      path: '/varg1/subjects',
      description: 'Advanced preparation for 16 major high school subjects.'
    },
    { 
      id: 'varg2', 
      title: 'MPTET Varg 2', 
      subtitle: 'Middle School Teacher', 
      icon: GraduationCap, 
      color: 'indigo', 
      path: '/varg2/subjects',
      description: 'Comprehensive coverage for 6 middle school core subjects.'
    },
    { 
      id: 'varg3', 
      title: 'MPTET Varg 3', 
      subtitle: 'Primary Teacher', 
      icon: Pencil, 
      color: 'emerald', 
      path: '/varg3/tests',
      description: 'Foundational mock tests focused on child development and pedagogy.'
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 gap-8 hidden lg:flex">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
            {menuItems.map((item) => (
              <button
                key={item.label}
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
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  Select <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Category</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">Hello {user?.displayName?.split(' ')[0] || 'Teacher'}, which preparation track are we on today?</p>
              </div>
            </header>

            {user?.email === 'qzquiz50@gmail.com' && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-[2rem] p-6 space-y-4 sm:space-y-0 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-white/10">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded">ADMIN ACCESS / व्यवस्थापक नियंत्रण</span>
                  <h3 className="font-black text-xl pt-1 tracking-tight">प्रशासक डैशबोर्ड / Actions Dashboard</h3>
                  <p className="text-xs opacity-95">प्रमोटर भुगतान निकासी, नवीन मॉक टेस्ट निर्माण और प्रश्न पत्र संकलन प्रबंधित करें।</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => navigate('/create-mock')}
                    className="w-full sm:w-auto px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                    id="btn-admin-create-mock"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    नया मॉक टेस्ट बनाएं / Create Mock
                  </button>
                  <button
                    onClick={() => navigate('/promoterswithdrawalrequests')}
                    className="w-full sm:w-auto px-5 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                    id="btn-admin-withdrawal-requests"
                  >
                    भुगतान डेस्क / Enter Desk
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {connectionError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex items-start gap-3 shadow-sm alert-offline-sync animate-fade-in" id="alert-offline-notice">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider">सर्वर कनेक्ट करने का प्रयास जारी है… / Reconnecting to Service…</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    नया बनाया गया मॉक टेस्ट प्रदर्शित होने में कभी-कभी Google Cloud सर्वर कोल्ड-स्टार्ट के कारण एकाध मिनट लग सकता है। जब तक डेटा लोड नहीं हो जाता, पुरानी जानकारी ऑफ़लाइन मोड में संचित रहेगी। कृपया थोड़े समय में पेज रिफ्रेश (F5) करें।
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-6 pt-2 border-t border-slate-200">
                {/* Select Category Divider Header */}
                <div className="pt-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-blue-600">📚</span> MPTET Exam Subjects / परीक्षा संवर्ग
                  </h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Select from our 3 primary teacher certification divisions / अपना इच्छित परीक्षा वर्ग चुनें:
                  </p>
                </div>

                {/* Varg Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      whileHover={{ y: -8, shadow: '0 20px 40px -15px rgba(0,0,0,0.3)' }}
                      onClick={() => navigate(cat.path)}
                      className="relative bg-blue-900 text-white rounded-[2rem] p-6 cursor-pointer group transition-all overflow-hidden border border-white/5"
                    >
                      {/* Decorative background shape */}
                      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-600 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      <div className="relative z-10 font-sans">
                        <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-white/10 text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 border border-white/10">
                          <cat.icon className="w-6 h-6" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">{cat.subtitle}</p>
                          <h3 className="text-xl font-black leading-tight tracking-tight">{cat.title}</h3>
                          <p className="text-blue-200/60 text-xs leading-relaxed font-semibold line-clamp-2 pr-4">{cat.description}</p>
                        </div>

                        <div className="mt-6 flex items-center justify-end pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                            SELECT TRACK
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* 4th Card: GK Questions / सामान्य ज्ञान */}
                  {customGkTests.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ y: -8, shadow: '0 20px 40px -15px rgba(0,0,0,0.3)' }}
                      onClick={() => navigate('/varg/gk/tests')}
                      className="relative bg-slate-900 text-white rounded-[2rem] p-6 cursor-pointer group transition-all overflow-hidden border border-white/5 hover:border-amber-500/30"
                    >
                      {/* Decorative background shape */}
                      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-500 blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500" />
                      
                      <div className="relative z-10 flex flex-col justify-between h-full font-sans">
                        <div>
                          <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                              Practice / अभ्यास
                            </p>
                            <h3 className="text-xl font-black leading-tight tracking-tight flex items-center gap-2">
                              GK Questions / सामान्य ज्ञान
                            </h3>
                            <p className="text-xs leading-relaxed font-semibold line-clamp-2 pr-4 text-slate-400">
                              सामान्य ज्ञान अभ्यास मॉक टेस्ट सीरीज उपलब्ध है।
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                            {customGkTests.length} TESTS AVAILABLE
                          </span>
                          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-amber-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                            VIEW TESTS
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Additional Dynamic / Custom MPTET Tests */}
                {customMptetTests.length > 0 && (
                  <div className="space-y-4 pt-10 pb-12 border-t border-slate-200">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Dynamic MPTET Custom Tests / जोड़ी गई नवीन परीक्षाएँ
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                      {customMptetTests.map((test) => {
                        const testVargId = test.vargId || 'varg1';
                        const testSubject = test.subject || 'general';
                        const testKey = `${testVargId}_${testSubject}_${test.id}`;
                        const isAdmin = user?.email === 'qzquiz50@gmail.com';
                        const isUnlocked = test.isFree || unlockedTests.includes(testKey) || isAdmin;

                        return (
                          <div 
                            key={test.id}
                            className="relative bg-blue-900 border border-white/5 rounded-[1.5rem] p-5 hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden"
                          >
                            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-600 blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
                            
                            <div className="relative z-10 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/10">
                                  {test.isFree ? 'FREE' : `₹${test.price}`}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/10">
                                  {test.vargId === 'varg1' ? 'Varg 1' : test.vargId === 'varg2' ? 'Varg 2' : 'Varg 3'}
                                </span>
                                {test.subject && (
                                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/10 text-slate-300">
                                    {test.subject.toUpperCase()}
                                  </span>
                                )}
                                {!isUnlocked && (
                                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-blue-300 text-[8px] font-black uppercase tracking-widest border border-white/5">
                                    <Lock className="w-2 h-2" />
                                    Premium
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-white tracking-tight text-sm line-clamp-2 leading-snug group-hover:text-blue-200 transition-colors">
                                {test.title}
                              </h4>
                            </div>

                            <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-3 text-blue-200/50 text-[10px] font-bold">
                                <span className="flex items-center gap-1">
                                  <HelpCircle className="w-3 h-3 text-blue-300" />
                                  {test.questions} Qs
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-blue-300" />
                                  {test.time} Min
                                </span>
                              </div>
                              {isUnlocked ? (
                                <button
                                  onClick={() => navigate(`/varg/${test.vargId}/exam/${test.id}${test.subject ? `/${test.subject}` : ''}`)}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 shadow-md shadow-blue-500/20"
                                >
                                  Start <Play className="w-2.5 h-2.5 fill-current" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => openCheckout(test)}
                                  className="px-4 py-2 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-amber-950 rounded-xl font-black text-[10px] tracking-widest uppercase hover:shadow-[0_8px_25px_-5px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-1 active:scale-95 border border-amber-300/30"
                                >
                                  <Zap className="w-3.5 h-3.5 fill-amber-950/40 mr-0.5" />
                                  Unlock Now <span className="text-[11px] ml-1">₹{test.price ?? platformSettings.testPrice}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Footer />
          </div>
        </main>

      </div>

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
                <p className="text-[11px] sm:text-xs text-slate-400">MPTET {selectedTest.vargId === 'gk' ? 'GK' : selectedTest.vargId === 'varg1' ? 'Varg 1' : selectedTest.vargId === 'varg2' ? 'Varg 2' : 'Varg 3'} • {selectedTest.subject ? selectedTest.subject.charAt(0).toUpperCase() + selectedTest.subject.slice(1) : 'General'} Mock Test</p>
              </div>

              {/* Price breakdown */}
              {(() => {
                const displayOrigPrice = selectedTest.price ?? platformSettings.testPrice;
                const displayNetPayable = promoApplied 
                  ? Math.max(0, displayOrigPrice - platformSettings.studentDiscount)
                  : displayOrigPrice;

                return (
                  <>
                    <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-150 space-y-2 sm:space-y-2.5">
                      <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span>वास्तविक मूल्य / Original Price</span>
                        <span>₹{displayOrigPrice}.00</span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between items-center text-[11px] sm:text-xs text-emerald-600 font-bold">
                          <span>🎟 प्रमोकोड छूट / Promo Discount ({promoApplied.promoCode})</span>
                          <span>- ₹{platformSettings.studentDiscount}.00</span>
                        </div>
                      )}

                      <hr className="border-slate-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider">कुल भुगतान / Net Payable</span>
                        <span className="text-lg sm:text-xl font-black text-blue-600 font-mono">
                          ₹{displayNetPayable.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Promocode Apply Input */}
                    <div className="space-y-1.5">
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

                    {/* Actions */}
                    <div className="space-y-2 pt-1">
                      <button 
                        onClick={handlePayment}
                        className={`w-full py-3 sm:py-3.5 text-white font-black text-[11px] sm:text-xs uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all shadow-lg transform active:scale-95 ${
                          selectedTest.isFree || displayNetPayable === 0
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/10'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
                        }`}
                      >
                        {selectedTest.isFree || displayNetPayable === 0 ? (
                          'निशुल्क अनलॉक करें / Unlock for Free'
                        ) : (
                          `₹${displayNetPayable} का भुगतान करें / Proceed to Pay`
                        )}
                      </button>
                      <p className="text-[8px] sm:text-[9px] text-slate-400 text-center leading-relaxed font-semibold font-sans">
                        {selectedTest.isFree || displayNetPayable === 0 ? (
                          '* यह टेस्ट बिल्कुल मुफ्त है। अनलॉक बटन पर क्लिक करके अभ्यास शुरू करें।'
                        ) : (
                          '* सुरक्षित और पारदर्शी पेमेंट Razorpay क्रेडेंशियल्स द्वारा संचालित है।'
                        )}
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
