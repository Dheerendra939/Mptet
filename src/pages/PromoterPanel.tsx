import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, TrendingUp, Coins, Copy, Check, ExternalLink, 
  Share2, ChevronLeft, LayoutDashboard, Sparkles, CheckCircle2, 
  AlertCircle, X, Users, HelpCircle, Percent, Clock, ArrowUpRight,
  ShieldCheck, RefreshCw, Send
} from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  const [regCommissionPercent, setRegCommissionPercent] = useState<number>(20);
  const [codeValidating, setCodeValidating] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Commission Setting / Change States for Registered Promoter
  const [requestedPercentInput, setRequestedPercentInput] = useState<number>(20);
  const [submittingCommission, setSubmittingCommission] = useState(false);
  const [commissionSuccessMsg, setCommissionSuccessMsg] = useState('');
  const [commissionErrorMsg, setCommissionErrorMsg] = useState('');

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

  // Quick preset percentages
  const commissionPresets = [10, 15, 20, 25, 30, 40, 50];

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
        console.warn('Using default platform settings due to network/cache state.');
      }

      if (!user) {
        setCheckingPromoter(false);
        return;
      }

      try {
        const docRef = doc(db, 'Promoters', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPromoterData(data);
          // Pre-populate commission input with either requested or current commission
          setRequestedPercentInput(data.requestedCommissionPercent || data.commissionPercent || 20);
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
      const salesList = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
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
      const wList = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
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

  // Helper to calculate earnings for a single sale
  const getSaleCommissionAmount = (sale: any) => {
    if (typeof sale.promoterCommissionAmount === 'number') {
      return sale.promoterCommissionAmount;
    }
    // Fallback: Use sale's percentage or promoter active percentage or default
    const percent = sale.promoterCommissionPercent ?? (promoterData?.commissionPercent || 20);
    const pricePaid = typeof sale.amountPaid === 'number' 
      ? sale.amountPaid / 100 
      : (platformSettings.testPrice - platformSettings.studentDiscount);
    return Math.round((pricePaid * percent) / 100);
  };

  // Calculate total lifetime commissions earned
  const totalCommissionsEarned = sales.reduce((acc, s) => acc + getSaleCommissionAmount(s), 0);
  const withdrawnAmount = promoterData?.withdrawnAmount || 0;
  const availableBalance = Math.max(0, totalCommissionsEarned - withdrawnAmount);
  
  // Active commission rate in percentage
  const activeCommissionPercent = typeof promoterData?.commissionPercent === 'number'
    ? promoterData.commissionPercent
    : (promoterData?.commissionStatus === 'approved' && promoterData?.requestedCommissionPercent 
        ? promoterData.requestedCommissionPercent 
        : Math.round((platformSettings.promoterCommission / platformSettings.testPrice) * 100) || 20);

  // Handle request for commission rate percentage change and admin approval
  const handleSendCommissionForApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoterData) return;

    setCommissionErrorMsg('');
    setCommissionSuccessMsg('');

    const percentNum = Number(requestedPercentInput);
    if (isNaN(percentNum) || percentNum < 1 || percentNum > 90) {
      setCommissionErrorMsg('कृपया 1% से 90% के बीच वैध कमीशन प्रतिशत चुनें।');
      return;
    }

    setSubmittingCommission(true);
    try {
      const promoterRef = doc(db, 'Promoters', user.uid);
      const payload: any = {
        requestedCommissionPercent: percentNum,
        commissionStatus: 'pending',
        email: user.email || promoterData.email || '',
        name: promoterData.name || user.displayName || 'Promoter',
        promoCode: promoterData.promoCode,
        commissionRequestedAt: serverTimestamp()
      };

      await updateDoc(promoterRef, payload);

      setPromoterData({
        ...promoterData,
        requestedCommissionPercent: percentNum,
        commissionStatus: 'pending',
        commissionRequestedAt: new Date().toISOString()
      });

      setCommissionSuccessMsg(`✅ ${percentNum}% प्रति सेल कमीशन का अनुरोध सफलतापूर्वक एडमिन को भेज दिया गया है। एडमिन द्वारा स्वीकृति के बाद यह लागू हो जाएगा!`);
    } catch (err: any) {
      console.error('Error submitting commission request:', err);
      setCommissionErrorMsg('अनुरोध भेजने में तकनीकी त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmittingCommission(false);
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
      
      setWithdrawalSuccessMessage(`अनुरोध सफलतापूर्वक भेजा गया! ₹${amountNum} का भुगतान जल्द ही आपके UPI पर ट्रांसफर होगा।`);
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

  // Register promoter with desired initial commission percentage
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

      const commissionNum = Number(regCommissionPercent) || 20;

      const promoterDataToSave: any = {
        userId: user.uid,
        name: fullName || user.displayName || 'Promoter',
        email: user.email || '',
        promoCode: desiredCode,
        upiNumber: upiNumber.trim(),
        commissionPercent: 15, // standard starting baseline until admin approves
        requestedCommissionPercent: commissionNum,
        commissionStatus: 'pending',
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
            id="back-to-dashboard-btn"
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
                <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-1">प्रमोटर पार्टनर प्रोग्राम</h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                  क्या आप शिक्षक, कोचिंग संस्थान संचालक, या सोशल मीडिया ग्रुप एडमिन हैं? Mockia.in प्रमोटर बनें, अपनी पसंद का <b>कमीशन प्रतिशत (% per sale)</b> तय करें, अपने छात्रों को <b>₹{platformSettings.studentDiscount} की छूट</b> दिलाएं और हर सेल पर आकर्षक कमाई करें!
                </p>
              </div>

              {/* Three benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Percent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">कमीशन प्रतिशत आप तय करें</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    10%, 20%, 30% या अपनी पसंद का कमीशन प्रतिशत प्रति सेल सेट करें और एडमिन अनुमोदन के लिए भेजें।
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">छात्रों को ₹{platformSettings.studentDiscount} की सीधी छूट</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    छात्रों को ₹{platformSettings.testPrice} का प्रीमियम मॉक टेस्ट सिर्फ ₹{platformSettings.testPrice - platformSettings.studentDiscount} में मिलेगा।
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">तुरंत UPI पेमेंट्स</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    लाइव बिक्री ट्रैकिंग के साथ एक क्लिक में अपने बैंक / UPI पर अर्जित कमीशन की तुरंत निकासी करें।
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  id="guest-login-promoter-btn"
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
                <p className="text-xs text-slate-400">अपना कस्टमाइज्ड प्रमोकोड और इच्छित कमीशन प्रतिशत (%) सेट करें।</p>
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
                    भुगतान प्राप्त करने हेतु UPI आईडी / UPI Address
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={128}
                    value={upiNumber}
                    onChange={(e) => setUpiNumber(e.target.value)}
                    placeholder="जैसे: 9876543210@paytm या name@okhdfcbank"
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
                      placeholder="जैसे: MOCKIA20, SHIVAJI10"
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
                </div>

                {/* Commission % Selection for Registration */}
                <div className="space-y-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-blue-600" />
                      इच्छित कमीशन प्रतिशत (% प्रति सेल) / Desired Commission %
                    </label>
                    <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-lg">
                      {regCommissionPercent}%
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {commissionPresets.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setRegCommissionPercent(pct)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          regCommissionPercent === pct
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-slate-600 flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-blue-100/60">
                    <span>अनुमानित कमाई (₹{platformSettings.testPrice - platformSettings.studentDiscount} की सेल पर):</span>
                    <span className="font-black text-emerald-600">
                      ₹{Math.round(((platformSettings.testPrice - platformSettings.studentDiscount) * regCommissionPercent) / 100)}.00 प्रति सेल
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    * पंजीकरण के बाद आपका कमीशन प्रतिशत एडमिन अनुमोदन (Admin Approval) के लिए प्रस्तुत किया जाएगा।
                  </p>
                </div>

                {/* Agreement T&C */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-3">
                  <span className="text-blue-500 pt-0.5 shrink-0">💡</span>
                  <div className="text-xs text-slate-500 leading-relaxed space-y-1">
                    <p className="font-bold text-slate-700">अनिवार्य नियम / Agreement Terms:</p>
                    <p>• आपके प्रमोकोड से छात्र को ₹{platformSettings.studentDiscount} की तत्काल छूट मिलेगी।</p>
                    <p>• आप अपने स्वीकृत कमीशन प्रतिशत (%) के आधार पर प्रत्येक सफल बिक्री पर कमाई करेंगे।</p>
                    <p>• किसी भी समय अपना कमीशन प्रतिशत बदलकर एडमिन अनुमोदन के लिए भेज सकते हैं।</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="submit-promoter-reg-btn"
                    type="submit"
                    disabled={submitting || desiredCode.length < 3 || !!codeError || codeValidating}
                    className="w-full py-3.5 bg-blue-600 text-white font-black text-[11px] tracking-widest uppercase rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    {submitting ? 'प्रोसेस हो रहा है...' : 'प्रमोटर अकाउंट बनाएं एवं अनुमोदन भेजें'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Active Registered Promoter Dashboard */}
          {user && promoterData && (
            <div className="space-y-6">
              {/* Admin Link Banner if current user is admin */}
              {user.email === 'qzquiz50@gmail.com' && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-blue-950 px-5 py-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-bold text-xs shadow-sm border border-amber-400/20">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    आप एडमिन हैं! प्रमोटरों के कमीशन अनुमोदन एवं भुगतान अनुरोध यहाँ प्रबंधित करें।
                  </span>
                  <button 
                    id="go-to-admin-desk-btn"
                    onClick={() => navigate('/promoterswithdrawalrequests')}
                    className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0"
                  >
                    एडमिन डेस्क / Go to Admin Desk
                  </button>
                </div>
              )}

              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-amber-400 text-blue-950 font-black text-[9px] uppercase tracking-widest rounded-md">
                        Mockia Partner
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-[10px] rounded-md flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        सक्रिय कमीशन: {activeCommissionPercent}%
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">स्वागत है, {promoterData.name}!</h1>
                    <p className="text-xs text-blue-200/80 font-medium">अपना कोड शेयर करें, छात्र छूट पाएंगे और आप प्रति सेल {activeCommissionPercent}% कमीशन कमाएंगे।</p>
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

              {/* Commission Percentage Configuration & Admin Approval Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-7 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">
                          कमीशन प्रतिशत दर सेट करें / Set Commission Percentage Per Sale
                        </h2>
                        <p className="text-xs text-slate-400">
                          अपनी इच्छित कमीशन दर सेट करें और अनुमोदन के लिए एडमिन को भेजें।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Status Badge */}
                  <div className="shrink-0">
                    {promoterData.commissionStatus === 'pending' && (
                      <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>अनुरोध लंबित: {promoterData.requestedCommissionPercent}% (Pending Admin Approval)</span>
                      </div>
                    )}
                    {promoterData.commissionStatus === 'approved' && (
                      <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>स्वीकृत दर: {activeCommissionPercent}% प्रति सेल (Approved)</span>
                      </div>
                    )}
                    {promoterData.commissionStatus === 'rejected' && (
                      <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>अनुरोध अस्वीकृत (Rejected) - पुनः सेट करें</span>
                      </div>
                    )}
                    {!promoterData.commissionStatus && (
                      <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <span>वर्तमान दर: {activeCommissionPercent}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form to submit new commission percentage */}
                <form onSubmit={handleSendCommissionForApproval} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">
                      नया कमीशन प्रतिशत चुनें या दर्ज करें / Select or Enter Commission (%)
                    </label>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                      {commissionPresets.map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setRequestedPercentInput(pct)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            requestedPercentInput === pct
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}

                      {/* Custom Input */}
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs font-bold text-slate-400">कस्टम:</span>
                        <div className="relative w-28">
                          <input
                            type="number"
                            min="1"
                            max="90"
                            required
                            value={requestedPercentInput}
                            onChange={(e) => setRequestedPercentInput(Number(e.target.value))}
                            className="w-full pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="e.g. 25"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculator Simulation Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-150">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">₹30 के टेस्ट पर कमाई (₹5 छूट बाद)</p>
                      <p className="text-sm font-black text-emerald-600 font-mono">
                        ₹{Math.round((25 * requestedPercentInput) / 100)}.00 / सेल ({requestedPercentInput}%)
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">₹50 के टेस्ट पर कमाई</p>
                      <p className="text-sm font-black text-emerald-600 font-mono">
                        ₹{Math.round((45 * requestedPercentInput) / 100)}.00 / सेल ({requestedPercentInput}%)
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">₹100 के टेस्ट पर कमाई</p>
                      <p className="text-sm font-black text-emerald-600 font-mono">
                        ₹{Math.round((95 * requestedPercentInput) / 100)}.00 / सेल ({requestedPercentInput}%)
                      </p>
                    </div>
                  </div>

                  {/* Feedback Messages */}
                  {commissionSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{commissionSuccessMsg}</span>
                    </div>
                  )}

                  {commissionErrorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{commissionErrorMsg}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      💡 सबमिट करने के बाद आपका अनुरोध सीधे एडमिन रिव्यू में जाएगा। एडमिन द्वारा पुष्टि होते ही नई दर तुरंत सक्रिय हो जाएगी।
                    </p>
                    <button
                      id="send-commission-approval-btn"
                      type="submit"
                      disabled={submittingCommission}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      {submittingCommission ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>अनुमोदन के लिए भेजें / Send for Approval</span>
                    </button>
                  </div>
                </form>
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

                {/* Lifetime Commissions */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                    <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">₹{totalCommissionsEarned}.00</h3>
                    <p className="text-xs text-slate-400 font-medium">अर्जित कुल कमीशन ({activeCommissionPercent}%)</p>
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
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">₹{withdrawnAmount}.00</h3>
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
                    <h3 className="text-2xl font-black text-blue-600 tracking-tight">₹{availableBalance}.00</h3>
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
                      id="copy-promocode-btn"
                      onClick={copyPromoCode}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold leading-none flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
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
                      id="copy-promolink-btn"
                      onClick={copyPromoLink}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold leading-none flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
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
                          max={availableBalance}
                          placeholder="जैसे: 150"
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        निकासी योग्य अधिकतम राशि: <b>₹{availableBalance}</b>
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
                      id="submit-withdrawal-req-btn"
                      type="submit"
                      disabled={submittingWithdrawal || availableBalance <= 0}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-1.5 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none cursor-pointer"
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
                          <th className="py-3 px-2">कमीशन %</th>
                          <th className="py-3 px-2 text-right">कमीशन राशि / Earnings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                        {sales.map((sale, idx) => {
                          const commAmount = getSaleCommissionAmount(sale);
                          const commPct = sale.promoterCommissionPercent ?? activeCommissionPercent;
                          return (
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
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold font-mono">
                                  ₹{typeof sale.amountPaid === 'number' ? sale.amountPaid / 100 : 25}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded font-bold text-[10px]">
                                  {commPct}%
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right text-emerald-600 font-black font-mono">
                                ₹{commAmount}.00
                              </td>
                            </tr>
                          );
                        })}
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
