import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemoUser?: boolean;
  loginAsDemo?: () => void;
  logout?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.warn('Anonymous auth unavailable, activating fallback demo session:', err);
      const mockUser: any = {
        uid: 'demo-student-guest-101',
        email: 'guest@mockia.in',
        displayName: 'Guest Aspirant',
        photoURL: null,
        isAnonymous: true,
        emailVerified: true,
      };
      setDemoUser(mockUser);
    }
  };

  const logout = async () => {
    if (demoUser) {
      setDemoUser(null);
    }
    try {
      await auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  };

  const activeUser = firebaseUser || demoUser;

  return (
    <AuthContext.Provider value={{ user: activeUser, loading, isDemoUser: !!demoUser && !firebaseUser, loginAsDemo, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

