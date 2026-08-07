import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, ArrowRight, Zap, Target, BarChart3, UserCheck, User } from 'lucide-react';
import { cn } from '../lib/utils';
import Footer from '../components/Footer';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const features = [
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: "Targeted Mock Tests",
      desc: "Full length tests for Varg 1, 2, & 3."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Subject Mastery",
      desc: "Focused tests for elective subjects."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
      title: "Real-Time Ranking",
      desc: "Compare your score with Madhya Pradesh's best."
    }
  ];

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Google login issue:', err?.code || err?.message || err);
      const errCode = err?.code || '';
      if (errCode === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please allow pop-ups for this site or use "Continue as Guest" below.');
      } else if (errCode === 'auth/popup-closed-by-user') {
        setError('Sign-in pop-up was closed before completing. Please try again or sign in as Guest.');
      } else if (errCode === 'auth/cancelled-popup-request') {
        setError('Sign-in request was cancelled. Please try again.');
      } else if (errCode === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase Console. You can use "Continue as Guest" to test immediately.');
      } else if (errCode === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled in Firebase project. Please use "Continue as Guest" below.');
      } else {
        const cleanMsg = (err?.message || '')
          .replace(/^Firebase:\mn Error \(/, '')
          .replace(/^Firebase: Error \(/, '')
          .replace(/\)$/, '');
        setError(cleanMsg || 'Unable to sign in with Google. You can use "Continue as Guest" to proceed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Anonymous sign in failed, activating fallback demo session:', err);
      if (loginAsDemo) {
        loginAsDemo();
      }
      navigate('/dashboard');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        {/* Visual Side */}
        <div className="lg:w-2/5 bg-blue-900 flex flex-col justify-center p-4 lg:p-8 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 p-3">
          <BookOpen className="w-6 h-6 text-blue-400 opacity-20" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <img 
              src="/logo.svg" 
              alt="Mockia Logo" 
              className="w-10 h-10 rounded-xl shadow-lg border border-white/20 transition-transform hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-extrabold tracking-tight text-white">Mockia<span className="text-blue-400">.in</span></span>
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-black mb-3 leading-none tracking-tight">
            Master Every Exam <br />With Precision.
          </h1>
          <p className="text-blue-100 text-[12px] max-w-sm mb-4 leading-relaxed opacity-80 font-medium">
            Join thousands of aspirants using Madhya Pradesh's #1 platform for high-quality mock tests.
          </p>

          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx + 0.3 }}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all cursor-default"
              >
                <div className="shrink-0 p-1 bg-blue-500/20 rounded-lg">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-3.5 h-3.5" })}
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-white tracking-wide uppercase leading-none">{feature.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="lg:w-3/5 flex items-center justify-center p-6 bg-white lg:bg-slate-50 min-h-[300px]">
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[320px]"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-xl mb-3 text-xs font-medium leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-3">
            <button
              disabled={loading || guestLoading}
              onClick={handleGoogleLogin}
              className={cn(
                "w-full py-3.5 px-6 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-gray-50 hover:border-gray-300 shadow-sm relative overflow-hidden group text-sm",
                (loading || guestLoading) && "opacity-80 cursor-not-allowed"
              )}
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5 shrink-0"
              />
              {loading ? (
                <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <>
                  <span className="font-extrabold text-slate-800">Continue with Google</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-auto" />
                </>
              )}
            </button>

            <button
              disabled={loading || guestLoading}
              onClick={handleGuestLogin}
              className={cn(
                "w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-md text-sm active:scale-95",
                (loading || guestLoading) && "opacity-80 cursor-not-allowed"
              )}
            >
              {guestLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Continue as Guest</span>
                </>
              )}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest text-gray-400 font-black">
                <span className="bg-white lg:bg-slate-50 px-2 leading-none">Instant & Secure Access</span>
              </div>
            </div>

            <p className="text-[9px] text-center text-gray-400 leading-relaxed font-medium">
              By continuing, you agree to our <Link to="/terms" className="underline cursor-pointer">Terms</Link> and <Link to="/privacy-policy" className="underline cursor-pointer">Privacy</Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </>
);
}

