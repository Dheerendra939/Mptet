import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Send, CheckCircle2, AlertCircle, Users, Sparkles,
  RefreshCw, CheckSquare, Square, Eye, Edit3, History, Shield,
  Search, ExternalLink, Zap, KeyRound, Copy, Check, Inbox
} from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { requestGmailAccessToken, sendGmailMessage } from '../lib/gmail';

interface Recipient {
  id: string;
  email: string;
  name: string;
  type: 'promoter' | 'buyer' | 'student' | 'user' | 'custom';
  sourceInfo?: string;
}

interface BroadcastLog {
  id: string;
  subject: string;
  recipientCount: number;
  successCount: number;
  failedCount: number;
  sentAt: any;
  senderEmail: string;
  templateType: string;
}

const EMAIL_TEMPLATES = [
  {
    id: 'new_test',
    label: '📢 नया मॉक टेस्ट जारी (New Mock Test Live)',
    subject: '🎯 MP Shikshak Exam: नया लाइव मॉक टेस्ट अब उपलब्ध है!',
    body: `<p>प्रिय <b>{name}</b>,</p>
<p>मध्यप्रदेश शिक्षक भर्ती परीक्षा की तैयारी को और भी सशक्त बनाने के लिए पोर्टल पर <b>नया मॉक टेस्ट</b> जारी कर दिया गया है।</p>
<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
  <h3 style="margin: 0 0 8px 0; color: #166534; font-size: 16px;">✨ नए टेस्ट की मुख्य विशेषताएं:</h3>
  <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px;">
    <li>नवीनतम परीक्षा पैटर्न एवं 150 बहुविकल्पीय प्रश्न (MCQs)</li>
    <li>वास्तविक समय रैंकिंग और विस्तृत उत्तर कुंजी (Answer Key)</li>
    <li>विषयवार विश्लेषण और त्वरित स्कोरकार्ड</li>
  </ul>
</div>
<p style="text-align: center; margin: 24px 0;">
  <a href="{app_url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">अभी टेस्ट शुरू करें (Start Test) &rarr;</a>
</p>
<p>शुभकामनाएं,<br/><b>MP Shikshak Exam Portal Team</b></p>`
  },
  {
    id: 'discount_offer',
    label: '🎁 विशेष छूट व प्रोमो कोड ऑफर (Special Discount Offer)',
    subject: '🔥 स्पेशल ऑफर: सभी मॉक टेस्ट सीरीज पर भारी छूट!',
    body: `<p>नमस्ते <b>{name}</b>,</p>
<p>आपके शिक्षक बनने के सपने को साकार करने के लिए हम लेकर आए हैं एक विशेष सीमित समय का डिस्काउंट ऑफर!</p>
<div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
  <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: bold;">सीमित समय के लिए स्पेशल डिस्काउंट</p>
  <div style="font-size: 24px; font-weight: 900; color: #b45309; letter-spacing: 2px; margin: 8px 0;">FLAT DISCOUNT AVAILABLE</div>
  <p style="margin: 0; font-size: 12px; color: #78350f;">पोर्टल पर जाकर तुरंत अपने विषय के टेस्ट सीरीज अनलॉक करें।</p>
</div>
<p style="text-align: center; margin: 24px 0;">
  <a href="{app_url}" style="background-color: #d97706; color: #ffffff; padding: 12px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">डिस्काउंट का लाभ उठाएं &rarr;</a>
</p>
<p>धन्यवाद,<br/><b>MP Shikshak Team</b></p>`
  },
  {
    id: 'exam_tips',
    label: '💡 परीक्षा तैयारी रणनीति व टिप्स (Preparation Strategy)',
    subject: '📚 MP शिक्षक पात्रता परीक्षा: उच्च स्कोर प्राप्त करने के महत्वपूर्ण सुझाव',
    body: `<p>प्रिय परीक्षार्थी <b>{name}</b>,</p>
<p>परीक्षा में सफलता के लिए निरंतर अभ्यास और सही रणनीति अत्यंत आवश्यक है। यहाँ कुछ महत्वपूर्ण सुझाव दिए जा रहे हैं:</p>
<ol style="padding-left: 20px; line-height: 1.8; color: #334155;">
  <li><b>नियमित मॉक टेस्ट अभ्यास:</b> समय प्रबंधन में सुधार के लिए प्रतिदिन कम से कम 1 पूरा मॉक टेस्ट हल करें।</li>
  <li><b>उत्तर कुंजी और गलतियों का विश्लेषण:</b> टेस्ट के बाद आंसर की देखकर कमजोर विषयों की पहचान करें।</li>
  <li><b>पेडागोजी और शिक्षणशास्त्र:</b> बाल विकास एवं शिक्षाशास्त्र के बुनियादी सिद्धांतों को गहराई से समझें।</li>
</ol>
<p style="text-align: center; margin: 24px 0;">
  <a href="{app_url}" style="background-color: #059669; color: #ffffff; padding: 12px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">फ्री व प्रीमियम टेस्ट दें &rarr;</a>
</p>
<p>सफलता की अग्रिम शुभकामनाओं सहित,<br/><b>MP Shikshak Mock Test Portal</b></p>`
  },
  {
    id: 'promoter_update',
    label: '💰 प्रमोटर कमीशन सूचना (Promoter Commission Notice)',
    subject: '💼 MP Shikshak Portal: प्रमोटर अर्निंग्स व कमीशन अपडेट',
    body: `<p>प्रिय प्रमोटर साथी <b>{name}</b>,</p>
<p>हमारे प्लेटफ़ॉर्म के साथ जुड़ने और छात्रों तक गुणवत्तापूर्ण मॉक टेस्ट पहुँचाने के लिए आपका धन्यवाद।</p>
<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
  <p style="margin: 0; color: #1e40af; font-size: 14px;">
    आप अपने प्रमोटर डैशबोर्ड में जाकर अपनी <b>लाइव रेफरल सेल्स</b>, <b>कमीशन बैलेंस</b> तथा <b>विथड्रॉवल स्थिति</b> चेक कर सकते हैं।
  </p>
</div>
<p style="text-align: center; margin: 24px 0;">
  <a href="{app_url}/promoter-panel" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">प्रमोटर पैनल खोलें &rarr;</a>
</p>
<p>सस्नेह,<br/><b>एडमिनिस्ट्रेशन टीम, MP Shikshak Portal</b></p>`
  },
  {
    id: 'custom',
    label: '✍️ कस्टम संदेश (Custom Blank Message)',
    subject: '📢 MP Shikshak Portal: महत्वपूर्ण सूचना',
    body: `<p>प्रिय <b>{name}</b>,</p>
<p>यहाँ अपना संदेश लिखें...</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="{app_url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">पोर्टल पर जाएं &rarr;</a>
</p>
<p>धन्यवाद,<br/><b>MP Shikshak Exam Portal</b></p>`
  }
];

export default function AdminEmailSender() {
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [recipientFilter, setRecipientFilter] = useState<'all' | 'promoters' | 'buyers' | 'students' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data lists
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [customEmailsInput, setCustomEmailsInput] = useState('');
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  
  // Compose state
  const [selectedTemplateId, setSelectedTemplateId] = useState('new_test');
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [bodyHtml, setBodyHtml] = useState(EMAIL_TEMPLATES[0].body);
  const [senderName, setSenderName] = useState('MP Shikshak Portal (Mockia)');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  
  // OAuth & sending state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authorizing, setAuthorizing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number; success: number; failed: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('qzquiz50@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);

  // Broadcast History
  const [broadcastLogs, setBroadcastLogs] = useState<BroadcastLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // Load all recipients from database collections
  const fetchAllRecipients = async () => {
    setLoadingRecipients(true);
    const recipientMap = new Map<string, Recipient>();

    try {
      // 1. Fetch Users collection
      const usersSnap = await getDocs(collection(db, 'Users')).catch(() => null);
      if (usersSnap) {
        usersSnap.docs.forEach(docSnap => {
          const d = docSnap.data();
          if (d.email && d.email.includes('@')) {
            const emailKey = d.email.toLowerCase().trim();
            recipientMap.set(emailKey, {
              id: docSnap.id,
              email: emailKey,
              name: d.displayName || d.name || emailKey.split('@')[0],
              type: 'user',
              sourceInfo: 'Registered User'
            });
          }
        });
      }

      // 2. Fetch Promoters collection
      const promotersSnap = await getDocs(collection(db, 'Promoters')).catch(() => null);
      if (promotersSnap) {
        promotersSnap.docs.forEach(docSnap => {
          const d = docSnap.data();
          if (d.email && d.email.includes('@')) {
            const emailKey = d.email.toLowerCase().trim();
            recipientMap.set(emailKey, {
              id: docSnap.id,
              email: emailKey,
              name: d.name || emailKey.split('@')[0],
              type: 'promoter',
              sourceInfo: `Promoter (${d.promoCode || 'Code'})`
            });
          }
        });
      }

      // 3. Fetch UserPurchases collection
      const purchasesSnap = await getDocs(collection(db, 'UserPurchases')).catch(() => null);
      if (purchasesSnap) {
        purchasesSnap.docs.forEach(docSnap => {
          const d = docSnap.data();
          const pEmail = d.userEmail || d.email;
          if (pEmail && pEmail.includes('@')) {
            const emailKey = pEmail.toLowerCase().trim();
            const existing = recipientMap.get(emailKey);
            recipientMap.set(emailKey, {
              id: docSnap.id,
              email: emailKey,
              name: d.userName || existing?.name || emailKey.split('@')[0],
              type: 'buyer',
              sourceInfo: `Test Buyer (${d.subject || d.vargId || 'Purchased'})`
            });
          }
        });
      }

      // 4. Fetch Leaderboards collection
      const leaderboardsSnap = await getDocs(collection(db, 'Leaderboards')).catch(() => null);
      if (leaderboardsSnap) {
        leaderboardsSnap.docs.forEach(docSnap => {
          const d = docSnap.data();
          const sEmail = d.userEmail || d.email;
          if (sEmail && sEmail.includes('@')) {
            const emailKey = sEmail.toLowerCase().trim();
            if (!recipientMap.has(emailKey)) {
              recipientMap.set(emailKey, {
                id: docSnap.id,
                email: emailKey,
                name: d.userName || emailKey.split('@')[0],
                type: 'student',
                sourceInfo: 'Exam Candidate'
              });
            }
          }
        });
      }

      const list = Array.from(recipientMap.values());
      setRecipients(list);

      // By default, select all recipients
      setSelectedEmails(new Set(list.map(r => r.email)));
    } catch (err) {
      console.error('Error fetching registered recipients:', err);
    } finally {
      setLoadingRecipients(false);
    }
  };

  // Load history from Firestore
  const fetchBroadcastHistory = async () => {
    setLoadingHistory(true);
    try {
      const q = query(collection(db, 'EmailBroadcasts'), orderBy('sentAt', 'desc'), limit(30));
      const snap = await getDocs(q);
      const logs = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as BroadcastLog[];
      setBroadcastLogs(logs);
    } catch (err) {
      console.error('Error fetching email broadcast logs:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchAllRecipients();
    fetchBroadcastHistory();
  }, []);

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setBodyHtml(tmpl.body);
    }
  };

  // Connect / Authorize Gmail
  const handleAuthorizeGmail = async () => {
    setAuthorizing(true);
    setStatusMessage(null);
    try {
      const token = await requestGmailAccessToken();
      setAccessToken(token);
      setStatusMessage({
        type: 'success',
        text: 'Gmail अधिकृत हो गया! अब आप सीधे इस पैनल से पंजीकृत अभ्यर्थियों को ईमेल भेज सकते हैं।'
      });
    } catch (err: any) {
      console.error('Authorization failed:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Gmail अधिकृत करने में असमर्थ। कृपया पुनः प्रयास करें।'
      });
    } finally {
      setAuthorizing(false);
    }
  };

  // Filtered recipients
  const filteredRecipients = useMemo(() => {
    let list = recipients;
    if (recipientFilter === 'promoters') {
      list = list.filter(r => r.type === 'promoter');
    } else if (recipientFilter === 'buyers') {
      list = list.filter(r => r.type === 'buyer');
    } else if (recipientFilter === 'students') {
      list = list.filter(r => r.type === 'student' || r.type === 'buyer');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => r.email.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));
    }
    return list;
  }, [recipients, recipientFilter, searchQuery]);

  // Toggle selection
  const toggleRecipient = (email: string) => {
    setSelectedEmails(prev => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedEmails(prev => {
      const next = new Set(prev);
      filteredRecipients.forEach(r => next.add(r.email));
      return next;
    });
  };

  const handleDeselectAllVisible = () => {
    setSelectedEmails(prev => {
      const next = new Set(prev);
      filteredRecipients.forEach(r => next.delete(r.email));
      return next;
    });
  };

  // Process personalized body & subject
  const personalizeContent = (templateStr: string, recipientName: string, recipientEmail: string) => {
    const origin = window.location.origin;
    return templateStr
      .replace(/{name}/g, recipientName || 'अभ्यर्थी')
      .replace(/{email}/g, recipientEmail)
      .replace(/{app_url}/g, origin);
  };

  // Copy variable token
  const handleCopyVar = (v: string) => {
    navigator.clipboard.writeText(v);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  // Send Test Email to Self
  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      setStatusMessage({ type: 'error', text: 'कृपया वैध टेस्ट ईमेल पता दर्ज करें।' });
      return;
    }

    let token = accessToken;
    if (!token) {
      try {
        token = await requestGmailAccessToken();
        setAccessToken(token);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Gmail टोकन प्राप्त करने में असमर्थ: ' + (err.message || err) });
        return;
      }
    }

    setSendingTest(true);
    setStatusMessage(null);
    try {
      const pSubject = personalizeContent(subject, 'Admin Preview', testEmailAddress);
      const pHtml = personalizeContent(bodyHtml, 'Admin Preview', testEmailAddress);

      await sendGmailMessage(token, {
        to: testEmailAddress,
        recipientName: 'Admin',
        subject: pSubject,
        htmlContent: pHtml,
        senderName
      });

      setStatusMessage({
        type: 'success',
        text: `सफलतापूर्वक टेस्ट ईमेल भेजा गया: ${testEmailAddress}`
      });
    } catch (err: any) {
      console.error('Test email sending failed:', err);
      setStatusMessage({
        type: 'error',
        text: 'टेस्ट ईमेल भेजने में त्रुटि: ' + (err?.message || 'अज्ञात समस्या')
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Bulk Send Email to Selected Recipients
  const handleSendBroadcast = async () => {
    // Gather all target recipient items
    let targetList: { name: string; email: string }[] = [];

    if (recipientFilter === 'custom') {
      const parsed = customEmailsInput
        .split(/[\n,;]+/)
        .map(e => e.trim())
        .filter(e => e && e.includes('@'));
      if (parsed.length === 0) {
        setStatusMessage({ type: 'error', text: 'कृपया कम से कम एक वैध ईमेल पता दर्ज करें।' });
        return;
      }
      targetList = parsed.map(e => ({ name: e.split('@')[0], email: e }));
    } else {
      targetList = recipients
        .filter(r => selectedEmails.has(r.email))
        .map(r => ({ name: r.name, email: r.email }));
    }

    if (targetList.length === 0) {
      setStatusMessage({ type: 'error', text: 'कृपया ईमेल भेजने के लिए कम से कम एक प्राप्तकर्ता (Recipient) चुनें।' });
      return;
    }

    const confirmMsg = `क्या आप निश्चित हैं कि आप ${targetList.length} चयनित अभ्यर्थियों को यह ईमेल भेजना चाहते हैं?`;
    if (!window.confirm(confirmMsg)) return;

    let token = accessToken;
    if (!token) {
      try {
        token = await requestGmailAccessToken();
        setAccessToken(token);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Gmail Authorization आवश्यक है: ' + (err?.message || err) });
        return;
      }
    }

    setSending(true);
    setStatusMessage(null);
    let successCount = 0;
    let failedCount = 0;

    setSendProgress({
      current: 0,
      total: targetList.length,
      success: 0,
      failed: 0
    });

    for (let i = 0; i < targetList.length; i++) {
      const item = targetList[i];
      try {
        const pSubject = personalizeContent(subject, item.name, item.email);
        const pHtml = personalizeContent(bodyHtml, item.name, item.email);

        await sendGmailMessage(token, {
          to: item.email,
          recipientName: item.name,
          subject: pSubject,
          htmlContent: pHtml,
          senderName
        });
        successCount++;
      } catch (err) {
        console.error(`Failed sending to ${item.email}:`, err);
        failedCount++;
      }

      setSendProgress({
        current: i + 1,
        total: targetList.length,
        success: successCount,
        failed: failedCount
      });

      // Subtle throttling to respect rate limits
      if (i < targetList.length - 1) {
        await new Promise(r => setTimeout(r, 250));
      }
    }

    // Record Broadcast in Firestore
    try {
      await addDoc(collection(db, 'EmailBroadcasts'), {
        subject,
        recipientCount: targetList.length,
        successCount,
        failedCount,
        senderEmail: 'qzquiz50@gmail.com',
        templateType: selectedTemplateId,
        sentAt: serverTimestamp()
      });
      fetchBroadcastHistory();
    } catch (e) {
      console.warn('Could not record broadcast log in Firestore:', e);
    }

    setSending(false);
    setStatusMessage({
      type: successCount > 0 ? 'success' : 'error',
      text: `ईमेल प्रेषण पूर्ण हुआ! कुल भेजे गए: ${successCount}, विफल: ${failedCount}`
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Mail className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              ईमेल प्रेषक (Gmail Email Broadcast)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            पोर्टल पर पंजीकृत अभ्यर्थियों, प्रमोटर्स एवं टेस्ट खरीदारों को सीधे अपने Gmail खाते से संदेश भेजें।
          </p>
        </div>

        {/* Action / Mode Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            id="tab-email-compose"
            onClick={() => setActiveTab('compose')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'compose' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>संदेश कंपोज़ करें</span>
          </button>
          <button
            id="tab-email-history"
            onClick={() => {
              setActiveTab('history');
              fetchBroadcastHistory();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>प्रेषण इतिहास ({broadcastLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Gmail OAuth Authorization Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-slate-900">Google Workspace Gmail API</h4>
              {accessToken ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  अधिकृत (Connected)
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                  <KeyRound className="w-3 h-3" />
                  अनुमति आवश्यक
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ईमेल प्रेषक Google के सुरक्षित Gmail Send API का उपयोग करता है। प्रेषक का पता: <b>qzquiz50@gmail.com</b>
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            id="btn-authorize-gmail"
            onClick={handleAuthorizeGmail}
            disabled={authorizing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {authorizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                अधिकृत किया जा रहा है...
              </>
            ) : accessToken ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                टोकन रिफ्रेश करें
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                Gmail कनेक्ट करें
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <p className="flex-1">{statusMessage.text}</p>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700 text-xs uppercase tracking-wider font-bold"
            >
              हटाएं
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sending Progress Bar */}
      {sending && sendProgress && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
              <span>ईमेल भेजे जा रहे हैं...</span>
            </div>
            <span>
              {sendProgress.current} / {sendProgress.total} ({Math.round((sendProgress.current / (sendProgress.total || 1)) * 100)}%)
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(sendProgress.current / (sendProgress.total || 1)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">सफल: {sendProgress.success}</span>
            <span className="text-rose-400 font-semibold">विफल: {sendProgress.failed}</span>
          </div>
        </div>
      )}

      {/* MAIN COMPOSE VIEW */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recipient Selector (5 cols) */}
          <div className="lg:col-span-5 border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">प्राप्तकर्ता चुनें (Select Recipients)</h3>
              </div>
              <button
                id="btn-refresh-recipients"
                onClick={fetchAllRecipients}
                disabled={loadingRecipients}
                className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                title="रिफ्रेश सूची"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRecipients ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Audience category pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'सभी (All)' },
                { id: 'promoters', label: 'प्रमोटर्स' },
                { id: 'buyers', label: 'खरीदार (Paid)' },
                { id: 'students', label: 'परीक्षार्थी' },
                { id: 'custom', label: '✍️ कस्टम' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRecipientFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    recipientFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {recipientFilter !== 'custom' ? (
              <>
                {/* Search & Select/Deselect all */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="नाम या ईमेल खोजें..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span>
                      चयनित: <b className="text-blue-600 font-black">{selectedEmails.size}</b> / {recipients.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSelectAllVisible}
                        className="text-blue-600 hover:underline font-bold"
                      >
                        सभी चुनें
                      </button>
                      <span>•</span>
                      <button
                        onClick={handleDeselectAllVisible}
                        className="text-slate-400 hover:text-slate-600 font-bold"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recipient list container */}
                <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                  {loadingRecipients ? (
                    <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                      <span>पंजीकृत उपयोगकर्ता लोड हो रहे हैं...</span>
                    </div>
                  ) : filteredRecipients.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      कोई संपर्क नहीं मिला।
                    </div>
                  ) : (
                    filteredRecipients.map(recipient => {
                      const isSelected = selectedEmails.has(recipient.email);
                      return (
                        <div
                          key={recipient.email}
                          onClick={() => toggleRecipient(recipient.email)}
                          className={`p-2.5 flex items-center justify-between gap-2.5 text-xs cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="shrink-0 text-blue-600">
                              {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-300" />}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{recipient.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{recipient.email}</p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded shrink-0 ${
                            recipient.type === 'promoter'
                              ? 'bg-amber-100 text-amber-800'
                              : recipient.type === 'buyer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {recipient.type}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              /* Custom Emails Textarea */
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold text-slate-700">
                  कस्टम ईमेल पते (अल्पविराम या नई लाइन द्वारा अलग करें):
                </label>
                <textarea
                  rows={10}
                  value={customEmailsInput}
                  onChange={e => setCustomEmailsInput(e.target.value)}
                  placeholder={`student1@example.com\nstudent2@example.com\nteacher@school.org`}
                  className="w-full flex-1 p-3 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none"
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  आप यहाँ एकाधिक ईमेल पेस्ट कर सकते हैं। सिस्टम प्रत्येक को पृथक व्यक्तिगत संदेश भेजेगा।
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Email Composer (7 cols) */}
          <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-5 bg-white space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Template Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    ईमेल टेम्पलेट चुनें (Quick Templates)
                  </label>
                </div>
                <select
                  value={selectedTemplateId}
                  onChange={e => handleSelectTemplate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {EMAIL_TEMPLATES.map(tmpl => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Placeholders Toolbar */}
              <div className="flex items-center gap-1.5 flex-wrap bg-slate-50 border border-slate-200 rounded-xl p-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  डायनामिक टैग्स:
                </span>
                {['{name}', '{email}', '{app_url}'].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleCopyVar(v)}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:border-blue-300 text-blue-700 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="क्लिक करके कॉपी करें"
                  >
                    {copiedVar === v ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-slate-400" />}
                    {v}
                  </button>
                ))}
              </div>

              {/* Sender Name & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">प्रेषक का नाम (From Name)</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">विषय (Email Subject)</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Body Editor / Live Preview toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600">ईमेल सामग्री (HTML / संदेश)</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('edit')}
                      className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer ${
                        previewMode === 'edit' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      संपादित करें (Edit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('preview')}
                      className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer ${
                        previewMode === 'preview' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      पूर्वावलोकन (Preview)
                    </button>
                  </div>
                </div>

                {previewMode === 'edit' ? (
                  <textarea
                    rows={8}
                    value={bodyHtml}
                    onChange={e => setBodyHtml(e.target.value)}
                    className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  />
                ) : (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-[220px] overflow-y-auto">
                    <div
                      className="text-xs text-slate-800 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: personalizeContent(bodyHtml, 'राहुल शर्मा (Demo)', 'rahul@example.com')
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Test Email Row */}
              <div className="flex flex-col sm:flex-row items-center gap-2 justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                    टेस्ट ईमेल:
                  </span>
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={e => setTestEmailAddress(e.target.value)}
                    placeholder="qzquiz50@gmail.com"
                    className="w-full sm:w-56 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTest || sending}
                  className="w-full sm:w-auto px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {sendingTest ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                  <span>टेस्ट ईमेल भेजें</span>
                </button>
              </div>

              {/* Main Send Broadcast Button */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400 font-medium">
                  {recipientFilter === 'custom' ? (
                    <span>कस्टम सूची को संदेश भेजा जाएगा</span>
                  ) : (
                    <span>
                      <b>{selectedEmails.size}</b> प्राप्तकर्ताओं को भेजा जाएगा
                    </span>
                  )}
                </p>

                <button
                  type="button"
                  id="btn-send-broadcast-email"
                  onClick={handleSendBroadcast}
                  disabled={sending || (recipientFilter !== 'custom' && selectedEmails.size === 0)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {recipientFilter === 'custom'
                          ? 'कस्टम सूची को ईमेल भेजें'
                          : `${selectedEmails.size} अभ्यर्थियों को ईमेल भेजें`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>हालिया ईमेल प्रेषण इतिहास (Recent Broadcast Logs)</span>
            </h3>
            <button
              onClick={fetchBroadcastHistory}
              disabled={loadingHistory}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loadingHistory ? 'animate-spin' : ''}`} />
              रिफ्रेश
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">विषय (Subject)</th>
                    <th className="py-3 px-4">टेम्पलेट</th>
                    <th className="py-3 px-4 text-center">कुल प्राप्तकर्ता</th>
                    <th className="py-3 px-4 text-center">सफल</th>
                    <th className="py-3 px-4 text-center">विफल</th>
                    <th className="py-3 px-4 text-right">दिनांक व समय</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingHistory ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        इतिहास लोड हो रहा है...
                      </td>
                    </tr>
                  ) : broadcastLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        अभी तक कोई ईमेल प्रेषण लॉग दर्ज नहीं हुआ है।
                      </td>
                    </tr>
                  ) : (
                    broadcastLogs.map(log => {
                      const dateStr = log.sentAt?.toDate
                        ? log.sentAt.toDate().toLocaleString('hi-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })
                        : 'अभी';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">{log.subject}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                              {log.templateType || 'Custom'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold">{log.recipientCount}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-emerald-600 font-black">{log.successCount}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={log.failedCount > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}>
                              {log.failedCount}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">{dateStr}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
