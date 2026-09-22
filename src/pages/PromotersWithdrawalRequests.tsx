import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, TrendingUp, Coins, Check, ArrowLeft, 
  Clock, AlertCircle, CheckCircle2, XCircle, Send, CreditCard,
  Percent, Users, ShieldCheck, Edit3, X, Sparkles, Filter, Search, Mail
} from 'lucide-react';
import { collection, query, getDocs, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminEmailSender from '../components/AdminEmailSender';

export default function PromotersWithdrawalRequests() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'commissions' | 'withdrawals' | 'emails' | 'settings'>('commissions');
  
  // Data states
  const [requests, setRequests] = useState<any[]>([]);
  const [promotersList, setPromotersList] = useState<any[]>([]);
  const [salesRecords, setSalesRecords] = useState<any[]>([]);
  const [promoterSalesCount, setPromoterSalesCount] = useState<Record<string, number>>({});
  const [promoterEarningsMap, setPromoterEarningsMap] = useState<Record<string, number>>({});

  // Processing states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string>('');
  const [successStatus, setSuccessStatus] = useState<string>('');

  // Editing custom commission state
  const [editingPromoterId, setEditingPromoterId] = useState<string | null>(null);
  const [customPercentInput, setCustomPercentInput] = useState<number>(20);
  const [savingCommission, setSavingCommission] = useState<boolean>(false);

  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Platform Setting States
  const [platformSettings, setPlatformSettings] = useState({
    testPrice: 30,
    promoterCommission: 5,
    studentDiscount: 5
  });
  const [testPriceInput, setTestPriceInput] = useState<number>(30);
  const [commissionInput, setCommissionInput] = useState<number>(5);
  const [discountInput, setDiscountInput] = useState<number>(5);
  const [updatingSettings, setUpdatingSettings] = useState<boolean>(false);

  // Access Control: qzquiz50@gmail.com only
  const isAdmin = user && user.email === 'qzquiz50@gmail.com';

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    if (isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorStatus('');
    try {
      // 0. Fetch Platform Configuration
      const settingsDocRef = doc(db, 'Settings', 'platform');
      const settingsSnap = await getDoc(settingsDocRef);
      let tPrice = 30;
      let pComm = 5;
      let sDisc = 5;
      if (settingsSnap.exists()) {
        const sData = settingsSnap.data();
        tPrice = sData.testPrice ?? 30;
        pComm = sData.promoterCommission ?? 5;
        sDisc = sData.studentDiscount ?? 5;
      } else {
        await setDoc(settingsDocRef, {
          testPrice: 30,
          promoterCommission: 5,
          studentDiscount: 5,
          updatedAt: serverTimestamp()
        });
      }
      setPlatformSettings({ testPrice: tPrice, promoterCommission: pComm, studentDiscount: sDisc });
      setTestPriceInput(tPrice);
      setCommissionInput(pComm);
      setDiscountInput(sDisc);

      // 1. Fetch all promoters
      const promotersSnapshot = await getDocs(collection(db, 'Promoters'));
      const pList: any[] = [];
      promotersSnapshot.docs.forEach(docSnap => {
        pList.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      setPromotersList(pList);

      // 2. Fetch all purchases to compute sales and earnings accurately
      const salesSnapshot = await getDocs(collection(db, 'UserPurchases'));
      const salesList: any[] = [];
      const salesCount: Record<string, number> = {};
      const earningsCount: Record<string, number> = {};

      salesSnapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        salesList.push(data);
        if (data.promoterUserId) {
          salesCount[data.promoterUserId] = (salesCount[data.promoterUserId] || 0) + 1;
          
          // Calculate earnings
          let commAmount = 0;
          if (typeof data.promoterCommissionAmount === 'number') {
            commAmount = data.promoterCommissionAmount;
          } else {
            const pct = data.promoterCommissionPercent || 20;
            const price = typeof data.amountPaid === 'number' ? data.amountPaid / 100 : (tPrice - sDisc);
            commAmount = Math.round((price * pct) / 100);
          }
          earningsCount[data.promoterUserId] = (earningsCount[data.promoterUserId] || 0) + commAmount;
        }
      });
      setSalesRecords(salesList);
      setPromoterSalesCount(salesCount);
      setPromoterEarningsMap(earningsCount);

      // 3. Fetch all withdrawal requests
      const requestsSnapshot = await getDocs(collection(db, 'WithdrawalRequests'));
      const reqList = requestsSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // Sort requests: Pending first, then by createdAt descending
      reqList.sort((a: any, b: any) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setRequests(reqList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setErrorStatus('डेटा लोड करने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // Save Platform Global Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    setErrorStatus('');
    setSuccessStatus('');
    try {
      const settingsDocRef = doc(db, 'Settings', 'platform');
      await setDoc(settingsDocRef, {
        testPrice: Number(testPriceInput),
        promoterCommission: Number(commissionInput),
        studentDiscount: Number(discountInput),
        updatedAt: serverTimestamp()
      });
      setPlatformSettings({
        testPrice: Number(testPriceInput),
        promoterCommission: Number(commissionInput),
        studentDiscount: Number(discountInput)
      });
      setSuccessStatus('प्लेटफ़ॉर्म सेटिंग्स सफलतापूर्वक सहेजी गईं!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorStatus('सेटिंग्स सहेजने में तकनीकी खराबी');
    } finally {
      setUpdatingSettings(false);
    }
  };

  // Approve Promoter Commission Percentage Request
  const handleApproveCommission = async (promoter: any, overridePercent?: number) => {
    if (!isAdmin) return;
    const targetPercent = overridePercent ?? (promoter.requestedCommissionPercent || promoter.commissionPercent || 20);
    setProcessingId(promoter.id);
    setErrorStatus('');
    setSuccessStatus('');

    try {
      const promoterRef = doc(db, 'Promoters', promoter.id);
      await updateDoc(promoterRef, {
        commissionPercent: Number(targetPercent),
        requestedCommissionPercent: Number(targetPercent),
        commissionStatus: 'approved',
        commissionApprovedAt: serverTimestamp(),
        commissionApprovedBy: user?.email || 'admin'
      });

      setSuccessStatus(`प्रमोटर "${promoter.name}" का कमीशन ${targetPercent}% सफलतापूर्वक स्वीकृत (Approve) किया गया!`);
      setEditingPromoterId(null);
      await fetchAdminData();
    } catch (err) {
      console.error('Error approving commission rate:', err);
      setErrorStatus('कमीशन दर स्वीकृत करने में तकनीकी खराबी।');
    } finally {
      setProcessingId(null);
    }
  };

  // Reject Promoter Commission Request
  const handleRejectCommission = async (promoter: any) => {
    if (!isAdmin) return;
    const confirmReject = window.confirm(`क्या आप प्रमोटर "${promoter.name}" द्वारा अनुरोधित ${promoter.requestedCommissionPercent}% कमीशन को अस्वीकार करना चाहते हैं?`);
    if (!confirmReject) return;

    setProcessingId(promoter.id);
    setErrorStatus('');
    setSuccessStatus('');

    try {
      const promoterRef = doc(db, 'Promoters', promoter.id);
      await updateDoc(promoterRef, {
        commissionStatus: 'rejected',
        commissionRejectedAt: serverTimestamp(),
        commissionRejectedBy: user?.email || 'admin'
      });

      setSuccessStatus(`प्रमोटर "${promoter.name}" का कमीशन अनुरोध अस्वीकृत (Rejected) कर दिया गया है।`);
      await fetchAdminData();
    } catch (err) {
      console.error('Error rejecting commission request:', err);
      setErrorStatus('अनुरोध अस्वीकार करने में तकनीकी खराबी।');
    } finally {
      setProcessingId(null);
    }
  };

  // Direct Update of Promoter Commission Rate by Admin
  const handleSaveCustomCommission = async (promoterId: string) => {
    if (!isAdmin) return;
    const num = Number(customPercentInput);
    if (isNaN(num) || num < 1 || num > 90) {
      setErrorStatus('कृपया 1% से 90% के बीच वैध कमीशन प्रतिशत दर्ज करें।');
      return;
    }

    setSavingCommission(true);
    setErrorStatus('');
    setSuccessStatus('');

    try {
      const promoterRef = doc(db, 'Promoters', promoterId);
      await updateDoc(promoterRef, {
        commissionPercent: num,
        requestedCommissionPercent: num,
        commissionStatus: 'approved',
        commissionApprovedAt: serverTimestamp(),
        commissionApprovedBy: user?.email || 'admin'
      });

      setSuccessStatus(`कमीशन दर सफलतापूर्वक ${num}% सेट कर दी गई!`);
      setEditingPromoterId(null);
      await fetchAdminData();
    } catch (err) {
      console.error('Error setting custom commission:', err);
      setErrorStatus('कमीशन दर अपडेट करने में तकनीकी खराबी।');
    } finally {
      setSavingCommission(false);
    }
  };

  // Approve Withdrawal Payout Request
  const handleApproveRequest = async (requestDoc: any) => {
    if (!isAdmin) return;
    setProcessingId(requestDoc.requestId);
    setErrorStatus('');
    setSuccessStatus('');

    try {
      const { requestId, promoterId, amount } = requestDoc;

      // 1. Update status in WithdrawalRequests
      const requestRef = doc(db, 'WithdrawalRequests', requestId);
      await updateDoc(requestRef, {
        status: 'approved',
        approvedAt: serverTimestamp()
      });

      // 2. Adjust promoter's withdrawnAmount in Promoters/{promoterId}
      const promoterRef = doc(db, 'Promoters', promoterId);
      const promoterSnap = await getDoc(promoterRef);
      
      let currentWithdrawn = 0;
      if (promoterSnap.exists()) {
        const pData = promoterSnap.data();
        currentWithdrawn = pData.withdrawnAmount || 0;
      }
      
      await setDoc(promoterRef, {
        withdrawnAmount: currentWithdrawn + amount
      }, { merge: true });

      setSuccessStatus(`अनुरोध स्वीकृत! ₹${amount} प्रमोटर ${requestDoc.promoterName} के अकाउंट से घटा दिया गया है।`);
      await fetchAdminData();
    } catch (err) {
      console.error('Error approving withdrawal request:', err);
      setErrorStatus('स्वीकृति प्रक्रिया में तकनीकी खराबी।');
    } finally {
      setProcessingId(null);
    }
  };

  // Reject Withdrawal Request
  const handleRejectRequest = async (requestDoc: any) => {
    if (!isAdmin) return;
    const confirmReject = window.confirm(`क्या आप ₹${requestDoc.amount} का विथड्रॉवल अनुरोध अस्वीकार करना चाहते हैं?`);
    if (!confirmReject) return;

    setProcessingId(requestDoc.requestId);
    setErrorStatus('');
    setSuccessStatus('');

    try {
      const { requestId } = requestDoc;
      const requestRef = doc(db, 'WithdrawalRequests', requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        rejectedAt: serverTimestamp()
      });

      setSuccessStatus(`अनुरोध अस्वीकार किया गया!`);
      await fetchAdminData();
    } catch (err) {
      console.error('Error rejecting withdrawal request:', err);
      setErrorStatus('अस्वीकृति प्रक्रिया में तकनीकी खराबी।');
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900">अनधिकृत प्रवेश / Unauthorized</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            यह पेज केवल <b>qzquiz50@gmail.com</b> के लिए सुलभ है। आपका वर्तमान ईमेल <b>{user?.email}</b> प्रमोटर कमीशन एवं भुगतान प्रबंधित करने के लिए अधिकृत नहीं है।
          </p>
          <button 
            id="unauthorized-back-btn"
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold font-sans transition-all cursor-pointer"
          >
            वापस डैशबोर्ड पर / Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSells = salesRecords.filter(s => !!s.promoterUserId).length;
  const totalCommissions = (Object.values(promoterEarningsMap) as number[]).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const pendingWithdrawals = requests.filter(r => r.status === 'pending');
  const approvedWithdrawals = requests.filter(r => r.status === 'approved');
  const pendingWithdrawalsAmount = pendingWithdrawals.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const approvedWithdrawalsAmount = approvedWithdrawals.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Commission rate requests
  const pendingCommissionPromoters = promotersList.filter(p => p.commissionStatus === 'pending');

  // Filtered promoters list based on search query
  const filteredPromoters = promotersList.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.promoCode && p.promoCode.toLowerCase().includes(q)) ||
      (p.upiNumber && p.upiNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back button */}
          <button 
            id="admin-back-btn"
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            बैक टू डैशबोर्ड / Back to Dashboard
          </button>

          {/* Heading */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Desk
                </span>
                <span className="text-xs text-slate-400 font-bold">qzquiz50@gmail.com</span>
              </div>

              {pendingCommissionPromoters.length > 0 && (
                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs rounded-full flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  {pendingCommissionPromoters.length} प्रमोटर कमीशन अनुमोदन लंबित!
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              प्रमोटर कमीशन अनुमोदन एवं भुगतान प्रबंधन
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              यहाँ आप प्रमोटर द्वारा प्रति सेल निर्धारित किए गए <b>कमीशन प्रतिशत (%)</b> को रिव्यू और <b>स्वीकृत (Approve)</b> या <b>संशोधित (Custom Set)</b> कर सकते हैं, तथा विथड्रॉवल भुगतान अनुरोधों को नियंत्रित कर सकते हैं।
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <button
                id="tab-commissions-btn"
                onClick={() => setActiveTab('commissions')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'commissions'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>कमीशन दर अनुमोदन ({pendingCommissionPromoters.length} Pending / {promotersList.length} Promoters)</span>
              </button>

              <button
                id="tab-withdrawals-btn"
                onClick={() => setActiveTab('withdrawals')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'withdrawals'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>विथड्रॉवल भुगतान ({pendingWithdrawals.length} Pending)</span>
              </button>

              <button
                id="tab-emails-btn"
                onClick={() => setActiveTab('emails')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'emails'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>ईमेल प्रेषक (Email Sender)</span>
              </button>

              <button
                id="tab-settings-btn"
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>प्लेटफ़ॉर्म सेटिंग्स</span>
              </button>
            </div>
          </div>

          {/* Overall Platform Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Total Referrals/Sales */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Platform Sells</p>
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{totalSells}</h3>
                <p className="text-xs text-slate-400 font-medium">कुल रेफरल बिक्री</p>
              </div>
            </div>

            {/* Total Commissions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Promoter Earnings</p>
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-emerald-600 tracking-tight">₹{totalCommissions}.00</h3>
                <p className="text-xs text-slate-400 font-medium">कुल प्रमोटर कमीशन</p>
              </div>
            </div>

            {/* Pending Commission Approvals */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Commission Requests</p>
                <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-600 tracking-tight">{pendingCommissionPromoters.length}</h3>
                <p className="text-xs text-slate-400 font-medium">लंबित कमीशन अनुमोदन</p>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Pending Payouts</p>
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-purple-600 tracking-tight">₹{pendingWithdrawalsAmount}.00</h3>
                <p className="text-xs text-slate-400 font-medium">{pendingWithdrawals.length} विथड्रॉवल अनुरोध</p>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorStatus && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorStatus}</span>
            </div>
          )}

          {successStatus && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successStatus}</span>
            </div>
          )}

          {/* TAB 1: COMMISSION APPROVALS & PROMOTER MANAGEMENT */}
          {activeTab === 'commissions' && (
            <div className="space-y-6">
              {/* Pending Approvals Spotlight Section */}
              {pendingCommissionPromoters.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
                    <span className="p-2 bg-amber-500 text-white rounded-xl">
                      <Clock className="w-5 h-5 animate-spin" />
                    </span>
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        ⚡ नए कमीशन प्रतिशत अनुरोध (Action Required: {pendingCommissionPromoters.length})
                      </h2>
                      <p className="text-xs text-slate-600">
                        प्रमोटरों ने प्रति सेल नया कमीशन प्रतिशत निर्धारित करके अनुमोदन के लिए भेजा है। नीचे सीधे Approve करें या कस्टम % सेट करें।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingCommissionPromoters.map((promoter) => {
                      const requestedPct = promoter.requestedCommissionPercent || 20;
                      const activePct = promoter.commissionPercent || 15;
                      const isProcessing = processingId === promoter.id;

                      return (
                        <div key={promoter.id} className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-black text-slate-900 text-sm">{promoter.name}</h3>
                              <p className="text-xs text-slate-500 font-mono">{promoter.email || promoter.id}</p>
                              <div className="flex items-center gap-2 pt-1">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-mono font-bold text-xs">
                                  कोड: {promoter.promoCode}
                                </span>
                                {promoter.upiNumber && (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-[10px]">
                                    UPI: {promoter.upiNumber}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="px-3 py-1 bg-amber-500 text-white rounded-xl font-black text-sm block">
                                {requestedPct}%
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block pt-0.5">
                                Requested
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-slate-400">वर्तमान सक्रिय दर: </span>
                              <span className="font-bold text-slate-700">{activePct}%</span>
                            </div>
                            <div>
                              <span className="text-slate-400">₹25 सेल पर: </span>
                              <span className="font-black text-emerald-600">₹{Math.round((25 * requestedPct) / 100)}.00</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleApproveCommission(promoter, requestedPct)}
                              disabled={isProcessing}
                              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer disabled:bg-slate-200"
                            >
                              {isProcessing ? (
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              <span>स्वीकार करें ({requestedPct}%)</span>
                            </button>

                            <button
                              onClick={() => {
                                setEditingPromoterId(promoter.id);
                                setCustomPercentInput(requestedPct);
                              }}
                              className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>संशोधित करें</span>
                            </button>

                            <button
                              onClick={() => handleRejectCommission(promoter)}
                              disabled={isProcessing}
                              className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              अस्वीकार
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Promoters Table Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      सभी पंजीकृत प्रमोटर्स एवं सक्रिय कमीशन दरें ({filteredPromoters.length})
                    </h2>
                    <p className="text-xs text-slate-400">यहाँ से किसी भी प्रमोटर का कमीशन प्रतिशत सीधे बदला जा सकता है।</p>
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="नाम, ईमेल या कोड खोजें..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {filteredPromoters.length === 0 ? (
                  <div className="text-center py-12 space-y-2 text-slate-400">
                    <Users className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs font-bold">कोई प्रमोटर नहीं मिला।</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                          <th className="py-3 px-3">प्रमोटर विवरण / Details</th>
                          <th className="py-3 px-3">प्रमोकोड / Code</th>
                          <th className="py-3 px-3 text-center">सक्रिय कमीशन % / Active Rate</th>
                          <th className="py-3 px-3 text-center">अनुरोध स्थिति / Status</th>
                          <th className="py-3 px-3 text-center">कुल बिक्री / Sells</th>
                          <th className="py-3 px-3 text-right">कुल कमाई / Earnings</th>
                          <th className="py-3 px-3 text-right">कमीशन संशोधन / Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {filteredPromoters.map((promoter) => {
                          const isEditing = editingPromoterId === promoter.id;
                          const salesCount = promoterSalesCount[promoter.id] || 0;
                          const earnings = promoterEarningsMap[promoter.id] || 0;
                          const activePct = promoter.commissionPercent || 20;

                          return (
                            <tr key={promoter.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-3">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-900">{promoter.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{promoter.email || promoter.id}</p>
                                  {promoter.upiNumber && (
                                    <p className="text-[10px] text-blue-600 font-mono">UPI: {promoter.upiNumber}</p>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-3 font-mono font-bold text-blue-700">
                                {promoter.promoCode}
                              </td>

                              <td className="py-3 px-3 text-center">
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg font-black text-xs">
                                  {activePct}% per sale
                                </span>
                              </td>

                              <td className="py-3 px-3 text-center">
                                {promoter.commissionStatus === 'pending' && (
                                  <div className="inline-flex flex-col items-center">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 font-bold rounded-md text-[9px] uppercase animate-pulse">
                                      {promoter.requestedCommissionPercent}% Pending
                                    </span>
                                  </div>
                                )}
                                {promoter.commissionStatus === 'approved' && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md text-[9px] uppercase">
                                    Approved
                                  </span>
                                )}
                                {promoter.commissionStatus === 'rejected' && (
                                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded-md text-[9px] uppercase">
                                    Rejected
                                  </span>
                                )}
                                {!promoter.commissionStatus && (
                                  <span className="text-[10px] text-slate-400">Default</span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-center">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold font-mono">
                                  {salesCount}
                                </span>
                              </td>

                              <td className="py-3 px-3 text-right font-black text-emerald-600 font-mono">
                                ₹{earnings}.00
                              </td>

                              <td className="py-3 px-3 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <div className="relative w-20">
                                      <input
                                        type="number"
                                        min="1"
                                        max="90"
                                        value={customPercentInput}
                                        onChange={(e) => setCustomPercentInput(Number(e.target.value))}
                                        className="w-full pl-2 pr-5 py-1 rounded-lg border border-blue-400 text-xs font-bold text-slate-900 focus:outline-none"
                                      />
                                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
                                    </div>
                                    <button
                                      onClick={() => handleSaveCustomCommission(promoter.id)}
                                      disabled={savingCommission}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                                    >
                                      {savingCommission ? '...' : 'Save'}
                                    </button>
                                    <button
                                      onClick={() => setEditingPromoterId(null)}
                                      className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-all cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    {promoter.commissionStatus === 'pending' && (
                                      <button
                                        onClick={() => handleApproveCommission(promoter)}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                      >
                                        <Check className="w-3 h-3" />
                                        Approve {promoter.requestedCommissionPercent}%
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setEditingPromoterId(promoter.id);
                                        setCustomPercentInput(promoter.requestedCommissionPercent || promoter.commissionPercent || 20);
                                      }}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      सेट %
                                    </button>
                                  </div>
                                )}
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

          {/* TAB 2: WITHDRAWAL REQUESTS */}
          {activeTab === 'withdrawals' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    भुगतान निकासी अनुरोध सूची / All Withdrawal Requests ({requests.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    प्रमोटर के UPI पर राशि ट्रांसफर करने के बाद 'Approve' पर क्लिक करें।
                  </p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100 text-slate-350">
                    <Clock className="w-6 h-6 stroke-1 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-600 text-sm">कोई भुगतान अनुरोध उपलब्ध नहीं है।</p>
                    <p className="text-xs text-slate-400">प्रमोटरों द्वारा नया अनुरोध सबमिट करने पर यहाँ दिखाई देगा।</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-150 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                        <th className="py-3 px-3">अनुरोध आईडी / Req ID</th>
                        <th className="py-3 px-3">प्रमोटर का नाम / Name</th>
                        <th className="py-3 px-3 text-center">कुल बिक्री / Sells</th>
                        <th className="py-3 px-3 text-right">कुल कमाई / Total Comm</th>
                        <th className="py-3 px-3 text-right">अनुरोधित राशि / Requested Amt</th>
                        <th className="py-3 px-4">UPI नंबर / UPI Address</th>
                        <th className="py-3 px-3 text-center">स्थिति / Status</th>
                        <th className="py-3 px-3 text-right">कार्यवाई / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      {requests.map((req) => {
                        const salesCount = promoterSalesCount[req.promoterId] || 0;
                        const totalCommission = promoterEarningsMap[req.promoterId] || 0;
                        const isPending = req.status === 'pending';

                        return (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-3 font-mono text-slate-500 font-bold">
                              {req.requestId}
                            </td>
                            <td className="py-4 px-3 font-sans">
                              <div className="space-y-0.5">
                                <p className="font-bold text-slate-900">{req.promoterName}</p>
                                <p className="text-[9px] font-mono text-slate-400">{req.promoterId}</p>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-black text-xs">
                                {salesCount} Sells
                              </span>
                            </td>
                            <td className="py-4 px-3 text-right text-emerald-600 font-black font-mono">
                              ₹{totalCommission}.00
                            </td>
                            <td className="py-4 px-3 text-right">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-xs font-mono">
                                ₹{req.amount}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-blue-700">
                              {req.upiNumber || 'Not Associated'}
                            </td>
                            <td className="py-4 px-3 text-center">
                              {req.status === 'pending' && (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-lg text-[9px] uppercase border border-amber-100 animate-pulse">
                                  Pending
                                </span>
                              )}
                              {req.status === 'approved' && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-[9px] uppercase border border-emerald-100">
                                  Approved
                                </span>
                              )}
                              {req.status === 'rejected' && (
                                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold rounded-lg text-[9px] uppercase border border-rose-100">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-3 text-right">
                              {isPending ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleApproveRequest(req)}
                                    disabled={processingId === req.requestId}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] leading-none transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-emerald-600/10 cursor-pointer"
                                  >
                                    {processingId === req.requestId ? (
                                      <span className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    Approve
                                  </button>

                                  <button
                                    onClick={() => handleRejectRequest(req)}
                                    disabled={processingId === req.requestId}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-[10px] leading-none transition-all cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">
                                  Processed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLATFORM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Coins className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-sans">
                  शुल्क और कमीशन सेटिंग्स / Platform Fees & Commission Control
                </h2>
              </div>

              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                    मॉक टेस्ट की आधार कीमत (₹) / Base Mock Test Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      required
                      value={testPriceInput}
                      onChange={(e) => setTestPriceInput(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800"
                      placeholder="जैसे: 30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                    डिफ़ॉल्ट कमीशन शुल्क (₹) / Default Commission
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      required
                      value={commissionInput}
                      onChange={(e) => setCommissionInput(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800"
                      placeholder="जैसे: 5"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                    प्रमोकोड डिस्काउंट (₹) / Student Discount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      required
                      value={discountInput}
                      onChange={(e) => setDiscountInput(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800"
                      placeholder="जैसे: 5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingSettings}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] tracking-widest uppercase rounded-xl transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-1.5 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none h-[40px] cursor-pointer"
                >
                  {updatingSettings ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      अपडेट करें / Save Settings
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Email Sender Broadcast Desk */}
          {activeTab === 'emails' && (
            <AdminEmailSender />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
