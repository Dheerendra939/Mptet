import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, TrendingUp, Coins, Check, ArrowLeft, 
  Clock, AlertCircle, CheckCircle2, XCircle, Send, CreditCard 
} from 'lucide-react';
import { collection, query, getDocs, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PromotersWithdrawalRequests() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [promotersMap, setPromotersMap] = useState<Record<string, any>>({});
  const [promoterSalesCount, setPromoterSalesCount] = useState<Record<string, number>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string>('');
  const [successStatus, setSuccessStatus] = useState<string>('');

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
        // Autocreate settings doc with default values
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

      // 1. Fetch all promoters for detail matching
      const promotersSnapshot = await getDocs(collection(db, 'Promoters'));
      const pMap: Record<string, any> = {};
      promotersSnapshot.docs.forEach(docSnap => {
        pMap[docSnap.id] = docSnap.data();
      });
      setPromotersMap(pMap);

      // 2. Fetch all sales stats to compute total earnings dynamically
      const salesSnapshot = await getDocs(collection(db, 'UserPurchases'));
      const salesCount: Record<string, number> = {};
      salesSnapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        if (data.promoterUserId) {
          salesCount[data.promoterUserId] = (salesCount[data.promoterUserId] || 0) + 1;
        }
      });
      setPromoterSalesCount(salesCount);

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
      setErrorStatus('डेटा लोड करने में असमर्थ। कृपया रीलोड करें। / Unable to load requests, please reload.');
    } finally {
      setLoading(false);
    }
  };

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
      setSuccessStatus('प्लेटफ़ॉर्म सेटिंग्स सफलतापूर्वक सहेजी गईं! / Platform settings successfully saved!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorStatus('सेटिंग्स सहेजने में तकनीकी खराबी / Error saving settings.');
    } finally {
      setUpdatingSettings(false);
    }
  };

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

      setSuccessStatus(`अनुरोध स्वीकृत! ₹${amount} प्रमोटर ${requestDoc.promoterName} के कमीशन से घटा दिया गया है।`);
      
      // Refresh administration table
      await fetchAdminData();
    } catch (err) {
      console.error('Error approving request:', err);
      setErrorStatus('स्वीकृति प्रक्रिया में तकनीकी खराबी / Error processing approval.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestDoc: any) => {
    if (!isAdmin) return;
    const confirmReject = window.confirm(`क्या आप ₹${requestDoc.amount} का अनुरोध अस्वीकार करना चाहते हैं?`);
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
      console.error('Error rejecting request:', err);
      setErrorStatus('अस्वीकृति प्रक्रिया में तकनीकी खराबी / Error processing rejection.');
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
            यह पेज केवल <b>qzquiz50@gmail.com</b> के लिए सुलभ है। आपका वर्तमान ईमेल <b>{user?.email}</b> प्रमोटर भुगतान प्रबंधित करने के लिए अधिकृत नहीं है।
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold font-sans transition-all"
          >
            वापस डैशबोर्ड पर / Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate overall platform statistics
  const values = Object.values(promoterSalesCount) as number[];
  const totalSells = values.reduce((sum, val) => sum + val, 0);
  const totalCommissions = totalSells * 5;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');

  const pendingAmount = pendingRequests.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const approvedAmount = approvedRequests.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            बैक टू डैशबोर्ड / Back to Dashboard
          </button>

          {/* Heading */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white font-black text-[8px] uppercase tracking-widest rounded">
                Admin Desk
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Promoter Management</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              प्रमोटर भुगतान अनुरोध / Promoter Withdrawal Requests
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              यहाँ आप प्रमोटर द्वारा भेजे गए पेमेंट विथड्रॉवल अनुरोधों को देख सकते हैं। उनके यूपीआई पते पर राशि ट्रांसफर करने के बाद 'Approve (स्वीकार करें)' बटन पर क्लिक करें। स्वीकृति के बाद, उनके विथड्रॉवल अकाउंट कमीशन को स्वचालित रूप से पुनर्गठित कर दिया जाएगा।
            </p>
          </div>

          {/* Overall Platform Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Total Referrals/Sales */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Total Platform Sells</p>
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{totalSells}</h3>
                <p className="text-xs text-slate-400 font-medium">कुल बिक्री सेल्स संख्या</p>
              </div>
            </div>

            {/* Total Commissions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-sans">Total Commissions</p>
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">₹{totalCommissions}.00</h3>
                <p className="text-xs text-slate-400 font-medium">कुल प्रमोटर अर्जित राशि</p>
              </div>
            </div>

            {/* Pending Payout Requests */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest font-sans">Pending Requests</p>
                <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-600 tracking-tight">₹{pendingAmount}.00</h3>
                <p className="text-xs text-slate-400 font-medium">{pendingRequests.length} लंबित अनुरोध</p>
              </div>
            </div>

            {/* Disbursed Amount */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest font-sans">Disbursed Amount</p>
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-purple-600 tracking-tight">₹{approvedAmount}.00</h3>
                <p className="text-xs text-slate-400 font-medium">{approvedRequests.length} स्वीकृत भुगतान</p>
              </div>
            </div>
          </div>

          {/* Platform Settings Form Card / प्लेटफ़ॉर्म सेटिंग्स फॉर्म */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-105 pb-3">
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
                  मॉक टेस्ट की कीमत (₹) / Mock Test Price
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
                  प्रमोटर कमीशन शुल्क (₹) / Promoter Commission
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

          {/* Messages */}
          {errorStatus && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm">
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

          {/* Request List Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              भुगतान अनुरोध सूची / All Withdrawal Requests
            </h2>

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
                      <th className="py-3 px-3 text-center">कुल बिक्री / Total Sells</th>
                      <th className="py-3 px-3 text-right">कुल कमीशन / Total Comm</th>
                      <th className="py-3 px-3 text-right">निकासी योग्य राशि / Requested Amt</th>
                      <th className="py-3 px-4">UPI नंबर / UPI Address</th>
                      <th className="py-3 px-3 text-center">स्थिति / Status</th>
                      <th className="py-3 px-3 text-right">कार्यवाई / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {requests.map((req) => {
                      const salesCount = promoterSalesCount[req.promoterId] || 0;
                      const totalCommission = salesCount * platformSettings.promoterCommission;
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
                          <td className="py-4 px-3 text-right text-slate-700 font-black">
                            ₹{totalCommission}.00
                          </td>
                          <td className="py-4 px-3 text-right">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-xs">
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
                                {/* Approve Button */}
                                <button
                                  onClick={() => handleApproveRequest(req)}
                                  disabled={processingId === req.requestId}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] leading-none transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-emerald-600/10"
                                >
                                  {processingId === req.requestId ? (
                                    <span className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                  Approve
                                </button>

                                {/* Reject Button */}
                                <button
                                  onClick={() => handleRejectRequest(req)}
                                  disabled={processingId === req.requestId}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-[10px] leading-none transition-all"
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
