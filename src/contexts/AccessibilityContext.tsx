import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AccessibilityState {
  mode: 'none' | 'visual' | 'physical' | 'speech';
  highContrast: boolean;
  largeFont: boolean;
  speechSpeed: number;
  speechPitch: number;
  voiceName: string;
}

interface AccessibilityContextType extends AccessibilityState {
  setMode: (mode: AccessibilityState['mode']) => void;
  setHighContrast: (val: boolean) => void;
  setLargeFont: (val: boolean) => void;
  setSpeechSpeed: (val: number) => void;
  setSpeechPitch: (val: number) => void;
  setVoiceName: (val: string) => void;
  isReady: boolean;
}

const DEFAULT_ACCESSIBILITY_STATE: AccessibilityState = {
  mode: 'none',
  highContrast: false,
  largeFont: false,
  speechSpeed: 1,
  speechPitch: 1,
  voiceName: '',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_ACCESSIBILITY_STATE);

  // Load from Firestore on Auth change safely without blocking app readiness
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.preferences) {
              setState(prev => ({ ...prev, ...data.preferences }));
            }
          } else {
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: 'student',
              preferences: DEFAULT_ACCESSIBILITY_STATE,
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error(`Accessibility Firestore sync (${OperationType.GET}) warning:`, error);
      } finally {
        setIsReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const updatePreference = async (updates: Partial<AccessibilityState>) => {
    setState(prev => ({ ...prev, ...updates }));

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await setDoc(userDocRef, { preferences: updates }, { merge: true });
      } catch (error) {
        console.error(`Accessibility Firestore sync (${OperationType.UPDATE}) warning:`, error);
      }
    }
  };

  const setMode = (mode: AccessibilityState['mode']) => updatePreference({ mode });
  const setHighContrast = (highContrast: boolean) => updatePreference({ highContrast });
  const setLargeFont = (largeFont: boolean) => updatePreference({ largeFont });
  const setSpeechSpeed = (speechSpeed: number) => updatePreference({ speechSpeed });
  const setSpeechPitch = (speechPitch: number) => updatePreference({ speechPitch });
  const setVoiceName = (voiceName: string) => updatePreference({ voiceName });

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    if (state.largeFont) root.classList.add('text-lg');
    else root.classList.remove('text-lg');

    if (state.mode === 'visual') root.classList.add('mode-visual');
    else root.classList.remove('mode-visual');
  }, [state.highContrast, state.largeFont, state.mode]);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        setMode,
        setHighContrast,
        setLargeFont,
        setSpeechSpeed,
        setSpeechPitch,
        setVoiceName,
        isReady
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
