/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import VargSubjects from './pages/VargSubjects';
import TestList from './pages/TestList';
import ExamInterface from './pages/ExamInterface';
import ResultPage from './pages/ResultPage';
import PromoterPanel from './pages/PromoterPanel';
import PromotersWithdrawalRequests from './pages/PromotersWithdrawalRequests';
import CreateMock from './pages/CreateMock';
import ContactUs from './pages/legal/ContactUs';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import RefundPolicy from './pages/legal/RefundPolicy';
import AboutUs from './pages/legal/AboutUs';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import IFrameWarning from './components/IFrameWarning';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.email !== 'qzquiz50@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />;
}

export default function App() {
  // Screen orientation unlock helper for PWA / mobile rotation
  React.useEffect(() => {
    const unlockOrientation = async () => {
      if (typeof window !== 'undefined' && 'screen' in window && window.screen.orientation) {
        try {
          if (typeof (window.screen.orientation as any).unlock === 'function') {
            await (window.screen.orientation as any).unlock();
          }
        } catch (_) {
          // Handled silently
        }
      }
    };
    unlockOrientation();
    window.addEventListener('orientationchange', unlockOrientation);
    return () => window.removeEventListener('orientationchange', unlockOrientation);
  }, []);

  // Capture ?ref=CODE URL query parameters and store them in localStorage
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
        const cleanCode = refCode.trim().toUpperCase();
        localStorage.setItem('referrerPromoCode', cleanCode);
        console.log('Automatically cached referral promo code:', cleanCode);
      }
    } catch (e) {
      console.error('Error extracting referral code:', e);
    }
  }, []);

  return (
    <AuthProvider>
      <IFrameWarning />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route 
            path="/promoters" 
            element={
              <PromoterPanel />
            } 
          />

          <Route 
            path="/promoterswithdrawalrequests" 
            element={
              <ProtectedRoute>
                <PromotersWithdrawalRequests />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/create-mock" 
            element={
              <AdminRoute>
                <CreateMock />
              </AdminRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg1/subjects" 
            element={
              <ProtectedRoute>
                <VargSubjects />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg2/subjects" 
            element={
              <ProtectedRoute>
                <VargSubjects />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg3/tests" 
            element={
              <ProtectedRoute>
                <TestList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg1/tests/:subject" 
            element={
              <ProtectedRoute>
                <TestList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg2/tests/:subject" 
            element={
              <ProtectedRoute>
                <TestList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg/gk/tests" 
            element={
              <ProtectedRoute>
                <TestList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg/:vargId/exam/:testId" 
            element={
              <ProtectedRoute>
                <ExamInterface />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/varg/:vargId/exam/:testId/:subject" 
            element={
              <ProtectedRoute>
                <ExamInterface />
              </ProtectedRoute>
            } 
          />

          <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          
          {/* Legal Pages */}
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />

          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

