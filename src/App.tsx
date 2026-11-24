import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Shell } from './components/layout/Shell';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import { Dashboard } from './pages/Dashboard';
import { ExamCenter } from './pages/ExamCenter';
import { ExamRoom } from './pages/ExamRoom';
import { AIGenerator } from './pages/AIGenerator';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Notifications } from './pages/Notifications';
import { Help } from './pages/Help';
import { auth } from './lib/firebase';
import { Loader2 } from 'lucide-react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isReady, highContrast } = useAccessibility();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !isReady) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          highContrast ? 'bg-black text-white' : 'bg-[#EFEAE4] text-[#1E1D1B]'
        }`}
      >
        <Loader2
          className={`w-8 h-8 animate-spin ${
            highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
          }`}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<AuthGuard><Shell><Dashboard /></Shell></AuthGuard>} />
          <Route path="/exams" element={<AuthGuard><Shell><ExamCenter /></Shell></AuthGuard>} />
          <Route path="/exams/active" element={<AuthGuard><Shell><ExamRoom /></Shell></AuthGuard>} />
          <Route path="/generator" element={<AuthGuard><Shell><AIGenerator /></Shell></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard><Shell><Analytics /></Shell></AuthGuard>} />
          <Route path="/notifications" element={<AuthGuard><Shell><Notifications /></Shell></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Shell><Settings /></Shell></AuthGuard>} />
          <Route path="/help" element={<AuthGuard><Shell><Help /></Shell></AuthGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AccessibilityProvider>
  );
}
