import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, TrendingUp, Coins, Copy, Check, ExternalLink, 
  Share2, ChevronLeft, LayoutDashboard, Sparkles, CheckCircle2, 
  AlertCircle, X, Users, HelpCircle 
} from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PromoterPanel() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [checkingPromoter, setCheckingPromoter] = useState(true);
  const [promoterData, setPromoterData] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);

  // Platform Setting States
  const [platformSettings, setPlatformSettings] = useState({
    testPrice: 30,
    promoterCommission: 5,
    studentDiscount: 5
  });

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [upiNumber, setUpiNumber] = useState('');
  const [desiredCode, setDesiredCode] = useState('');
  const [codeValidating, setCodeValidating] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Copy feedbacks
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Withdrawal States
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalSuccessMessage, setWithdrawalSuccessMessage] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  // Check if current user is registered as a promoter
  useEffect(() => {
    async function checkRegistration() {
      if (authLoading) return;

      // Fetch dynamic settings first
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
        console.error('Error fetching platform settings:', err);
      }

      if (!user) {
        setCheckingPromoter(false);
        return;
      }

      try {
        const docRef = doc(db, 'Promoters', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPromoterData(docSnap.data());
          // Fetch sales for this promoter
          fetchSales(user.uid);
          // Fetch withdrawal requests
          fetchWithdrawals(user.uid);
        } else {
          setFullName(user.displayName || '');
        }
      } catch (err) {
        console.error('Error checking promoter status:', err);
      } finally {
        setCheckingPromoter(false);
      }
    }
    checkRegistration();
  }, [user, authLoading]);

  // Fetch successful sales
  const fetchSales = async (promoterUid: string) => {
    setLoadingSales(true);
    try {
      const q = query(
        collection(db, 'UserPurchases'),
        where('promoterUserId', '==', promoterUid)
      );
      const querySnapshot = await getDocs(q);
      const salesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort sales by purchasedAt descending
      salesList.sort((a: any, b: any) => {
        const dateA = a.purchasedAt?.seconds || 0;
        const dateB = b.purchasedAt?.seconds || 0;
        return dateB - dateA;
      });
      setSales(salesList);
    } catch (err) {
      console.error('Error fetching referral sales:', err);
    } finally {
      setLoadingSales(false);
    }
  };

  // Fetch promoter's own withdrawals info
  const fetchWithdrawals = async (promoterUid: string) => {
    setLoadingWithdrawals(true);
    try {
      const q = query(
        collection(db, 'WithdrawalRequests'),
        where('promoterId', '==', promoterUid)
      );
      const querySnapshot = await getDocs(q);
      const wList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      wList.sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setWithdrawalRequests(wList);
    } catch (err) {
      console.error('Error fetching withdrawal requests:', err);
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  // Handle send withdrawal request action
  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoterData) return;

    setWithdrawalError('');
    setWithdrawalSuccessMessage('');

    const amountNum = Number(withdrawalAmount);
    if (!withdrawalAmount || isNaN(amountNum) || amountNum <= 0) {
      setWithdrawalError('कृपया एक वैध राशि दर्ज करें / Please enter a valid amount.');
      return;
    }

    const totalCommissions = sales.length * platformSettings.promoterCommission;
    const withdrawnCommissions = promoterData.withdrawnAmount || 0;
    const availableBalance = totalCommissions - withdrawnCommissions;

    if (amountNum > availableBalance) {
      setWithdrawalError(`आपकी उपलब्ध सीमा ₹${availableBalance} है। / Max withdrawable limit is ₹${availableBalance}`);
      return;
    }

    if (!promoterData.upiNumber) {
      setWithdrawalError('कृपया पहले अपना UPI आईडी सहेजें / Please setup your UPI for receiving payments first.');
      return;
    }

    setSubmittingWithdrawal(true);
    try {
      const requestId = 'req_' + Math.random().toString(36).substring(2, 11);
      const requestPayload = {
        requestId,
        promoterId: user.uid,
        promoterName: promoterData.name,
        amount: amountNum,
        upiNumber: promoterData.upiNumber,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'WithdrawalRequests', requestId), requestPayload);
      
      setWithdrawalSuccessMessage(`Request successfully sent for ₹${amountNum}`);
      setWithdrawalAmount('');
      
      // Refresh withdrawals
      await fetchWithdrawals(user.uid);
    } catch (err) {
      console.error('Error sending withdrawal request:', err);
      setWithdrawalError('अनुरोध भेजने में तकनीकी खराबी / Error sending withdrawal request.');
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  // Real-time unique promo code check
  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setDesiredCode(rawValue);
    setCodeError('');
    setCodeSuccess('');

    if (rawValue.length < 3) {
      if (rawValue.length > 0) {
        setCodeError('प्रमोकोड कम से कम 3 अक्षर/संख्या का होना चाहिए।');
      }
      return;
    }

    if (rawValue.length > 15) {
      setCodeError('प्रमोकोड 15 अक्षरों से अधिक नहीं हो सकता।');
      return;
    }

    setCodeValidating(true);
    try {
      const promotersRef = collection(db, 'Promoters');
      const q = query(promotersRef, where('promoCode', '==', rawValue));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setCodeError('यह प्रमोकोड पहले से लिया जा चुका है। कृपया दूसरा चुनें।');
      } else {
        setCodeSuccess('बधाई हो! यह प्रमोकोड उपलब्ध है। ✔');
      }
    } catch (err) {
      console.error('Error checking promo code:', err);
    } finally {
      setCodeValidating(false);
    }
  };

  // Register promoter
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (desiredCode.length < 3) {
      setCodeError('प्रमोकोड आवश्यक है।');
      return;
    }

    if (codeError) return;

    setSubmitting(true);
    try {
      // Re-verify uniqueness quickly
      const promotersRef = collection(db, 'Promoters');
      const q = query(promotersRef, where('promoCode', '==', desiredCode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setCodeError('यह प्रमोकोड किसी और ने ले लिया है। दूसरा चुनें।');
        setSubmitting(false);
        return;
      }

      const promoterDataToSave = {
        userId: user.uid,
        name: fullName || user.displayName || 'Promoter',
        promoCode: desiredCode,
        upiNumber: upiNumber.trim(),
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'Promoters', user.uid), promoterDataToSave);
      setPromoterData({
        ...promoterDataToSave,
        createdAt: new Date().toISOString()
      });
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error registering promoter:', err);
      alert('पंजीकरण में त्रुटि हुई। कृपया पुन: प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  // Copy promotional code to clipboard
  const copyPromoCode = () => {
    if (!promoterData) return;
    navigator.clipboard.writeText(promoterData.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy promotional link to clipboard
  const copyPromoLink = () => {
    if (!promoterData) return;
    const referralUrl = `${window.location.origin}/?ref=${promoterData.promoCode}`;
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (authLoading || checkingPromoter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const referralLink = promoterData ? `${window.location.origin}/?ref=${promoterData.promoCode}` : '';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back to Dashboard */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            बैक टू डैशबोर्ड / Back to Dashboard
          </button>

          {/* Guest State: Explain the Program */}
          {!user && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 text-center space-y-6 shadow-sm"
            >
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">
                  MOCKIA.IN PROMOTERS PROGRAM
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-1">Promoter Program - Mockia.in</h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                  क्या आप शिक्षक, कोचिंग संस्थान संचालक, या सोशल मीडिया ग्रुप एडमिन हैं? Mockia.in प्रमोटर बनें, अपने छात्रों को <b>₹{platformSettings.studentDiscount} की सीधी छूट</b> दिलाएं और प्रत्येक सफल सेल पर <b>₹{platformSettings.promoterCommission} का कमीशन</b> कमाएं!
                </p>
              </div>

              {/* Three benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">₹{platformSettings.promoterCommission} प्रति सेल कमीशन</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">आपके रेफ़रल कोड से कोई भी छात्र मॉक टेस्ट अनलॉक करेगा, तो आपको सीधे ₹{platformSettings.promoterCommission} का कमीशन मिलेगा।</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">छात्रों को ₹{platformSettings.studentDiscount} की बचत</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">छात्रों को ₹{platformSettings.testPrice} का प्रीमियम मॉक टेस्ट सिर्फ ₹{platformSettings.testPrice - platformSettings.studentDiscount} में मिलेगा। उनके लिए यह एक बेहतरीन बचत है।</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">रियल-टाइम ट्रैकिंग</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">आपके डैशबोर्ड पर तुरंत सफल रेफरल्स और कुल कमाई दिखाई देगी। कोई छुपा हुआ शुल्क नहीं।</p>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => navigate('/auth')}
                  className="px-8 py-3.5 bg-blue-600 text-white font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  लॉगिन करें और प्रमोटर बनें / Login to Join
                </button>
              </div>
            </motion.div>
          )}

          {/* User Logged in but NOT Registered Promoter */}
          {user && !promoterData && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-sm"
            >
              <div className="space-y-2 mb-6 text-center border-b border-slate-100 pb-5">
                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h1 className="text-xl font-black text-slate-900">प्रमोटर रजिस्ट्रेशन / Become a Promoter</h1>
                <p className="text-xs text-slate-400">कृपया अपना कस्टमाइज्ड प्रमोकोड सेट करें और शुरू करें।</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Promoter Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    प्रमोटर का नाम / Full Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="जैसे: Dheerendra Tiwari"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                {/* UPI ID field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    UPI number for receiving payments
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={128}
                    value={upiNumber}
                    onChange={(e) => setUpiNumber(e.target.value)}
                    placeholder="जैसे: 9876543210@paytm या name@upi"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>

                {/* Promo Code Custom Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      पसंदीदा प्रमोकोड / Custom Promo Code
                    </label>
                    <span className="text-[10px] text-blue-500 font-bold uppercase">अंग्रेजी व अंक / A-Z, 0-9 ONLY</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={desiredCode}
                      onChange={handleCodeChange}
                      placeholder="जैसे: MOCKIA5, SHIVAJI5"
                      className="w-full uppercase px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold tracking-wider"
                    />
                    {codeValidating && (
                      <div className="absolute right-4 top-3 h-5 w-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    )}
                  </div>
                  
                  {codeError && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium pt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {codeError}
                    </p>
                  )}
                  {codeSuccess && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium pt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      {codeSuccess}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                    * इस प्रमोकोड का उपयोग करके छात्रों को मॉक टेस्ट में <b>₹{platformSettings.studentDiscount} की छूट</b> मिलेगी, और आपको <b>₹{platformSettings.promoterCommission} का श्रेय (कमीशन)</b> मिलेगा।
                  </p>
                </div>

                {/* Agreement T&C */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-3">
                  <span className="text-blue-500 pt-0.5 shrink-0">💡</span>
                  <div className="text-xs text-slate-500 leading-relaxed space-y-1">
                    <p className="font-bold text-slate-700">अनिवार्य नियम / Agreement Terms:</p>
                    <p>• आप प्रत्येक सफल अनलॉक (भुगतान सफल होने) पर ₹{platformSettings.promoterCommission} कमाएंगे।</p>
                    <p>• भुगतान हर महीने के अंत में या ₹100 होने के बाद सीधे आपके यूपीआई (UPI) या बैंक खाते में किया जाएगा।</p>
                    <p>• भुगतान अनुरोध या किसी भी सहायता के लिए <a href="mailto:Dheerendrat939@gmail.com" className="text-blue-600 font-bold hover:underline">Dheerendrat939@gmail.com</a> पर संपर्क करें।</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || desiredCode.length < 3 || !!codeError || codeValidating}
                    className="w-full py-3.5 bg-blue-600 text-white font-black text-[11px] tracking-widest uppercase rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none shadow-lg shadow-blue-500/10"
                  >
                    {submitting ? 'प्रोसेस हो रहा है...' : 'प्रमोटर अकाउंट बनाएं / Setup Promoter Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Active Registered Promoter Dashboard */}
          {user && promoterData && (
            <div className="space-y-6">
              {user.email === 'qzquiz50@gmail.com' && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-blue-950 px-5 py-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-bold text-xs shadow-sm border border-amber-400/20">
                  <span>🛠️ आप एडमिन हैं! प्रमोटरों के पेंडिंग भुगतान अनुरोध यहाँ प्रबंधित करें।</span>
                  <button 
                    onClick={() => navigate('/promoterswithdrawalrequests')}
                    className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    भुगतान डेस्क / Go to Desk
                  </button>
                </div>
              )}

              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-500 text-blue-950 font-black text-[8px] uppercase tracking-widest rounded">
                        Mockia Partner
                      </span>
                      <span className="text-[10px] text-blue-200 font-bold">Registered Active Promoter</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">स्वागत है, {promoterData.name}!</h1>
                    <p className="text-xs text-blue-200/80 font-medium">अपना कोड साझा करें और छात्रों को बेहतर सेवा प्रदान करते हुए लाभ कमाएं।</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    {promoterData.upiNumber && (
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center md:text-left">
                        <p className="text-[9px] font-black tracking-widest text-[#4ade80] uppercase">UPI FOR PAYMENTS</p>
                        <p className="text-xs font-bold font-mono">{promoterData.upiNumber}</p>
                      </div>
                    )}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center md:text-left">
                      <p className="text-[9px] font-black tracking-widest text-blue-300 uppercase">CONTACT SUPPORT</p>
                      <p className="text-xs font-bold font-mono">Dheerendrat939@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Total Sales */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Referral Sales</p>
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{sales.length}</h3>
                    <p className="text-xs text-slate-400 font-medium">सफल रेफरल (Unlocks)</p>
                  </div>
                </div>

                {/* Earnings */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Commissions</p>
                    <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">₹{sales.length * platformSettings.promoterCommission}.00</h3>
                    <p className="text-xs text-slate-400 font-medium">अर्जित कुल कमीशन (₹{platformSettings.promoterCommission}/सेल)</p>
                  </div>
                </div>

                {/* Already Withdrawn amount */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Withdrawn Amount</p>
                    <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">₹{promoterData.withdrawnAmount || 0}.00</h3>
                    <p className="text-xs text-slate-400 font-medium font-sans">भुगतान किया जा चुका / Paid Out</p>
                  </div>
                </div>

                {/* Available for Withdrawal */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 ring-2 ring-blue-600/10">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-sans">Available Balance</p>
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-blue-600 tracking-tight">₹{(sales.length * platformSettings.promoterCommission) - (promoterData.withdrawnAmount || 0)}.00</h3>
                    <p className="text-xs text-slate-500 font-medium font-sans">निकासी योग्य राशि / Available</p>
                  </div>
                </div>
              </div>

              {/* Code Panel & Link Share */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Promo Code Copy Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎟</span> आपका प्रमोकोड / YOUR PROMO CODE
                    </h3>
                    <p className="text-xs text-slate-400">छात्र इस कोड को पेमेंट करते वक्त एंटर करेंगे जिससे उन्हें ₹{platformSettings.studentDiscount} की छूट मिलेगी।</p>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="font-mono text-xl font-black text-blue-700 tracking-widest">{promoterData.promoCode}</span>
                    <button 
                      onClick={copyPromoCode}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold leading-none flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 active:scale-95"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode ? 'कॉपी हुआ!' : 'कॉपी / Copy'}
                    </button>
                  </div>
                </div>

                {/* Promo Link Share Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔗</span> शेयर लिंक / REF SHARE LINK
                    </h3>
                    <p className="text-xs text-slate-400">इस लिंक से प्रवेश करने वाले छात्रों का प्रमोकोड पेमेंट बॉक्स में अपने-आप भरा मिलेगा।</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 gap-3">
                    <div className="font-mono text-[11px] text-slate-650 break-all select-all flex-1 py-1">
                      {referralLink}
                    </div>
                    <button 
                      onClick={copyPromoLink}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold leading-none flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                      {copiedLink ? 'लिंक कॉपी हुआ!' : 'कॉपी लिंक'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Withdrawal Request & History Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left side: Request Form */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div className="space-y-1.5 pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Coins className="w-4 h-4" />
                      </span>
                      पेमेंट निकासी अनुरोध / Payout Withdrawal
                    </h3>
                    <p className="text-xs text-slate-400">
                      अपना कमीशन सीधे अपने सहेजे गए यूपीआई ({promoterData.upiNumber || "कोई यूपीआई आईडी नहीं है"}) पर प्राप्त करने के लिए अनुरोध भेजें।
                    </p>
                  </div>

                  <form onSubmit={handleRequestWithdrawal} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                        निकासी राशि (₹ में) / Withdrawal Amount (INR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-slate-400 font-bold text-sm">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          max={(sales.length * platformSettings.promoterCommission) - (promoterData.withdrawnAmount || 0)}
                          placeholder="जैसे: 150"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        निकासी योग्य अधिकतम राशि: <b>₹{(sales.length * platformSettings.promoterCommission) - (promoterData.withdrawnAmount || 0)}</b>
                      </p>
                    </div>

                    {withdrawalError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{withdrawalError}</span>
                      </div>
                    )}

                    {withdrawalSuccessMessage && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{withdrawalSuccessMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingWithdrawal || ((sales.length * platformSettings.promoterCommission) - (promoterData.withdrawnAmount || 0)) <= 0}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-1.5 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                    >
                      {submittingWithdrawal ? 'प्रोसेस हो रहा है...' : 'पेमेंट निकालें / Request Withdrawal'}
                    </button>
                  </form>
                </div>

                {/* Right side: Requests Status History */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-start gap-3">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="p-1.5 bg-slate-50 text-slate-600 rounded-lg">
                        <Trophy className="w-4 h-4" />
                      </span>
                      निकासी इतिहास / Withdrawal History
                    </h3>
                    <p className="text-xs text-slate-400">आपके द्वारा भेजे गए सभी भुगतान अनुरोधों की स्थिति।</p>
                  </div>

                  {loadingWithdrawals ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                  ) : withdrawalRequests.length === 0 ? (
                    <div className="text-center py-10 space-y-2 text-slate-400">
                      <HelpCircle className="w-8 h-8 mx-auto stroke-1" />
                      <p className="text-xs font-bold">कोई भुगतान अनुरोध नहीं मिला।</p>
                      <p className="text-[10px]">अपनी अर्जित राशि निकालने के लिए बाईं ओर फॉर्म भरें।</p>
                    </div>
                  ) : (
                    <div className="max-h-[250px] overflow-y-auto space-y-3 pr-1">
                      {withdrawalRequests.map((req) => (
                        <div key={req.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between gap-2.5 text-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">₹{req.amount}</span>
                              <span className="text-[10px] font-mono text-slate-400">({req.requestId})</span>
                            </div>
                            <p className="text-[9px] text-slate-400">
                              {req.createdAt?.seconds 
                                ? new Date(req.createdAt.seconds * 1000).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })
                                : 'अभी'
                              }
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {req.status === 'pending' && (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-lg text-[9px] uppercase tracking-wider border border-amber-100 animate-pulse">
                                वेटिंग / Pending
                              </span>
                            )}
                            {req.status === 'approved' && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-[9px] uppercase tracking-wider border border-emerald-100">
                                स्वीकृत / Approved
                              </span>
                            )}
                            {req.status === 'rejected' && (
                              <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold rounded-lg text-[9px] uppercase tracking-wider border border-rose-100">
                                अस्वीकृत / Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sales References */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-slate-900">रेफ़रल बिक्री विवरण / Successful Sales Referrals</h3>
                    <p className="text-[10px] text-slate-400">आपके प्रमोकोड का उपयोग करने वाले सफल छात्रों की सूची।</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Transactions
                  </div>
                </div>

                {loadingSales ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : sales.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-350 border border-slate-100">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-600 text-sm">कोई रेफ़रल बिक्री अभी तक नहीं मिली है।</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">अपने दोस्तों या विद्यार्थियों को WhatsApp, Telegram पर अपना रेफ़रल लिंक/प्रमोकोड शेयर करें ताकि वे टेस्ट डिस्काउंट पर परचेस कर सकें!</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="py-3 px-2">क्रमांक / S.No.</th>
                          <th className="py-3 px-2">परीक्षार्थी / Candidate ID</th>
                          <th className="py-3 px-2 font-mono">परीक्षा कोड / Exam Key</th>
                          <th className="py-3 px-2">दिनांक / Date</th>
                          <th className="py-3 px-2">भुगतान / Price Paid</th>
                          <th className="py-3 px-2 text-right">कमीशन / Earnings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                        {sales.map((sale, idx) => (
                          <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-2 text-slate-400">{idx + 1}</td>
                            <td className="py-3 px-4 font-mono truncate max-w-[120px] text-slate-500">
                              {sale.userId ? `USER-${sale.userId.substring(0, 8).toUpperCase()}` : 'Anonymous Candidate'}
                            </td>
                            <td className="py-3 px-2 font-mono font-bold text-slate-800">{sale.testId}</td>
                            <td className="py-3 px-2 text-slate-500">
                              {sale.purchasedAt?.seconds 
                                ? new Date(sale.purchasedAt.seconds * 1000).toLocaleString('hi-IN', { dateStyle: 'medium', timeStyle: 'short' })
                                : 'Immediate'
                              }
                            </td>
                            <td className="py-3 px-2">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded font-bold">
                                ₹{(sale.amountPaid || 500) / 100}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right text-emerald-600 font-black">₹{platformSettings.promoterCommission}.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
