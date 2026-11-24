import React, { useState } from 'react';
import {
  LogIn,
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { EditorialStampBadge } from '@/components/EditorialStampBadge';

export function Login() {
  const { highContrast } = useAccessibility();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setInfoNotice(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login window was closed before completion. Please try again and keep the login window open.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site or try opening the app in a new tab.');
      } else if (err.code === 'auth/cancelled-by-user') {
        setError('Sign in process was cancelled.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        console.error('Authentication Error:', err);
        setError(`Sign in failed: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGoogleLogin();
  };

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col transition-colors',
        highContrast ? 'bg-black text-white' : 'bg-[#EFEAE4] text-[#1E1D1B]'
      )}
    >
      {/* Minimal Top Bar */}
      <header
        className={cn(
          'border-b',
          highContrast ? 'border-white/30' : 'border-[#1E1D1B]/10'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center font-display font-extrabold text-xs tracking-tight',
                highContrast ? 'border-white text-white' : 'border-[#1E1D1B] text-[#1E1D1B]'
              )}
            >
              VE
            </span>
            <span className="font-display font-bold text-base tracking-tight">
              VoxExam<span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>.</span>
            </span>
          </div>

          <span className={cn('text-xs font-medium', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
            Inclusive Voice Assessment
          </span>
        </div>
      </header>

      {/* Main Split Editorial Layout */}
      <main className="flex-1 flex items-center">
        <div className="max-w-[1280px] w-full mx-auto px-6 md:px-12 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          >
            {/* Left Editorial Column */}
            <div className="lg:col-span-7 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <h1 className="text-[clamp(2.75rem,5.4vw,4.5rem)] font-display font-extrabold leading-[1.03] tracking-[-0.035em]">
                  Exams built for{' '}
                  <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>
                    everyone.
                  </span>
                </h1>
                <EditorialStampBadge highContrast={highContrast} size={108} />
              </div>

              <p
                className={cn(
                  'text-base md:text-lg max-w-xl leading-relaxed',
                  highContrast ? 'text-white/80' : 'text-[#5E5A54]'
                )}
              >
                An accessible, AI-assisted examination workspace designed for hands-free voice control, live descriptive transcription, and calm focus.
              </p>

              <div
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t',
                  highContrast ? 'border-white/25' : 'border-[#1E1D1B]/12'
                )}
              >
                {[
                  { num: '01', title: 'Voice Control', desc: 'Hands-free MCQ & navigation' },
                  { num: '02', title: 'AI Generation', desc: 'Build tests from study notes' },
                  { num: '03', title: 'Inclusive Design', desc: 'High contrast & speech pacing' },
                ].map((item) => (
                  <div key={item.num} className="space-y-1.5">
                    <span
                      className={cn(
                        'text-xs font-mono font-semibold',
                        highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                      )}
                    >
                      {item.num}.
                    </span>
                    <h2 className="text-sm font-display font-bold">{item.title}</h2>
                    <p className={cn('text-xs leading-relaxed', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Flat Sign-In Card */}
            <div className="lg:col-span-5">
              <div
                className={cn(
                  'p-8 sm:p-10 rounded-2xl border space-y-8',
                  highContrast
                    ? 'bg-black border-white'
                    : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
                )}
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-bold">Sign in to workspace</h2>
                  <p className={cn('text-sm', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                    Continue with your Google account to access exams and saved accessibility preferences.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className={cn(
                      'p-4 rounded-xl border text-sm flex items-start gap-3',
                      highContrast
                        ? 'bg-black border-[#FF6B4A] text-[#FF6B4A]'
                        : 'bg-[#FEE2E2]/60 border-[#B91C1C]/20 text-[#991B1B]'
                    )}
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {infoNotice && (
                  <div
                    className={cn(
                      'p-4 rounded-xl border text-sm',
                      highContrast
                        ? 'border-white/40 text-white'
                        : 'bg-[#EFEAE4] border-[#1E1D1B]/15 text-[#1E1D1B]'
                    )}
                  >
                    {infoNotice}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className={cn(
                    'w-full py-4 px-6 rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer',
                    highContrast
                      ? 'bg-white text-black hover:bg-[#FF6B4A]'
                      : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.48-1.73 4.35-5.27 4.35-3.17 0-5.76-2.63-5.76-5.87s2.59-5.87 5.76-5.87c1.81 0 3.02.77 3.71 1.44l2.53-2.44C16.79 4.1 14.69 3.2 12.17 3.2 7.21 3.2 3.2 7.21 3.2 12.5s4.01 9.3 8.97 9.3c5.18 0 8.61-3.64 8.61-8.77 0-.59-.06-1.04-.14-1.48z"
                        />
                      </svg>
                      <span>Continue with Google Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={cn('w-full border-t', highContrast ? 'border-white/25' : 'border-[#1E1D1B]/10')} />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span
                      className={cn(
                        'px-3',
                        highContrast ? 'bg-black text-white/60' : 'bg-[#FAF8F5] text-[#78726A]'
                      )}
                    >
                      or institutional email SSO
                    </span>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-email"
                      className={cn('block text-xs font-medium', highContrast ? 'text-white/80' : 'text-[#5E5A54]')}
                    >
                      Institutional Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.edu"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors',
                        highContrast
                          ? 'bg-black border-white/40 text-white focus:border-[#FF6B4A]'
                          : 'bg-white border-[#1E1D1B]/15 text-[#1E1D1B] focus:border-[#E85A3C]'
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'w-full py-3.5 px-6 rounded-full border font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer',
                      highContrast
                        ? 'border-white text-white hover:bg-white hover:text-black'
                        : 'border-[#1E1D1B] text-[#1E1D1B] hover:bg-[#1E1D1B] hover:text-[#EFEAE4]'
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In via Google SSO</span>
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInfoNotice('Account access is managed via Google Workspace SSO. Use "Continue with Google Workspace" above.')
                    }
                    className={cn('hover:underline cursor-pointer', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}
                  >
                    Need sign-in help?
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInfoNotice('To register an educational institution, sign in with your Google Workspace administrator account.')
                    }
                    className={cn(
                      'font-semibold hover:underline cursor-pointer',
                      highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                    )}
                  >
                    Register school
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
