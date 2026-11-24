import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const PRIMARY_NAV = [
  { label: 'Overview', path: '/' },
  { label: 'Exams', path: '/exams' },
  { label: 'Generator', path: '/generator' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Accessibility', path: '/settings' },
  { label: 'Help', path: '/help' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, highContrast } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col transition-colors duration-200',
        highContrast
          ? 'bg-black text-white'
          : 'bg-[#EFEAE4] text-[#1E1D1B]'
      )}
    >
      {/* Minimal Swiss Editorial Top Navigation Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-colors duration-200',
          highContrast
            ? 'bg-black border-white/30'
            : 'bg-[#EFEAE4]/95 border-[#1E1D1B]/10 backdrop-blur-sm'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-8">
          {/* Left Zone: Small Geometric Monogram Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
            aria-label="VoxExam Pro Home"
          >
            <span
              className={cn(
                'w-9 h-9 rounded-full border flex items-center justify-center font-display font-extrabold text-xs tracking-tight transition-colors',
                highContrast
                  ? 'border-white text-white group-hover:bg-white group-hover:text-black'
                  : 'border-[#1E1D1B] text-[#1E1D1B] group-hover:bg-[#1E1D1B] group-hover:text-[#EFEAE4]'
              )}
            >
              VE
            </span>
            <span
              className={cn(
                'font-display font-bold text-base tracking-tight',
                highContrast ? 'text-white' : 'text-[#1E1D1B]'
              )}
            >
              VoxExam<span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>.</span>
            </span>
          </Link>

          {/* Right Zone: Simple Text Links + Account Controls */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-7" aria-label="Primary Navigation">
              {PRIMARY_NAV.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'text-sm font-medium whitespace-nowrap shrink-0 transition-colors relative py-1',
                      isActive
                        ? highContrast
                          ? 'text-[#FF6B4A]'
                          : 'text-[#E85A3C]'
                        : highContrast
                          ? 'text-white/80 hover:text-white'
                          : 'text-[#5E5A54] hover:text-[#1E1D1B]'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className={cn(
                          'absolute left-0 right-0 -bottom-0.5 h-[1.5px]',
                          highContrast ? 'bg-[#FF6B4A]' : 'bg-[#E85A3C]'
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div
              className={cn(
                'h-4 w-px shrink-0',
                highContrast ? 'bg-white/30' : 'bg-[#1E1D1B]/15'
              )}
              aria-hidden="true"
            />

            <div className="flex items-center gap-5 shrink-0">
              <Link
                to="/notifications"
                className={cn(
                  'p-2 rounded-full transition-colors',
                  location.pathname === '/notifications'
                    ? highContrast
                      ? 'text-[#FF6B4A]'
                      : 'text-[#E85A3C]'
                    : highContrast
                      ? 'text-white/80 hover:text-white'
                      : 'text-[#5E5A54] hover:text-[#1E1D1B]'
                )}
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className={cn(
                  'text-sm font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer',
                  highContrast
                    ? 'text-white/80 hover:text-[#FF6B4A]'
                    : 'text-[#5E5A54] hover:text-[#E85A3C]'
                )}
                title={user?.email ? `Sign out (${user.email})` : 'Sign out'}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={cn(
              'lg:hidden p-2.5 rounded-full border transition-colors',
              highContrast
                ? 'border-white text-white'
                : 'border-[#1E1D1B]/15 text-[#1E1D1B] hover:bg-[#1E1D1B]/5'
            )}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className={cn(
                'lg:hidden border-t px-6 py-6 space-y-4',
                highContrast
                  ? 'bg-black border-white/30'
                  : 'bg-[#F7F4F0] border-[#1E1D1B]/10'
              )}
            >
              <nav className="flex flex-col space-y-3">
                {[...PRIMARY_NAV, { label: 'Notifications', path: '/notifications' }].map(
                  (item) => {
                    const isActive =
                      item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'text-base font-medium py-1 transition-colors',
                          isActive
                            ? highContrast
                              ? 'text-[#FF6B4A]'
                              : 'text-[#E85A3C]'
                            : highContrast
                              ? 'text-white'
                              : 'text-[#1E1D1B]'
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                )}
              </nav>

              <div
                className={cn(
                  'pt-4 border-t flex items-center justify-between',
                  highContrast ? 'border-white/20' : 'border-[#1E1D1B]/10'
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user?.displayName || 'Student'}
                  </p>
                  <p
                    className={cn(
                      'text-xs truncate',
                      highContrast ? 'text-white/60' : 'text-[#5E5A54]'
                    )}
                  >
                    {mode === 'none' ? 'Standard Mode' : `${mode} Mode`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className={cn(
                    'text-sm font-medium flex items-center gap-1.5',
                    highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Editorial Canvas */}
      <main className="flex-1 w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-12 md:py-16">
          {children}
        </div>
      </main>

      {/* Quiet Editorial Footer */}
      <footer
        className={cn(
          'border-t mt-auto',
          highContrast ? 'border-white/20' : 'border-[#1E1D1B]/10'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className={cn('flex items-center gap-3', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
            <span className="font-display font-semibold">VoxExam Pro</span>
            <span aria-hidden="true">·</span>
            <span>{mode === 'none' ? 'Standard Mode' : `${mode} Accessibility Mode`}</span>
            {user?.displayName && (
              <>
                <span aria-hidden="true">·</span>
                <span>{user.displayName}</span>
              </>
            )}
          </div>
          <div className={cn('flex items-center gap-6', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
            <Link to="/exams" className="hover:underline">
              Exams
            </Link>
            <Link to="/settings" className="hover:underline">
              Accessibility
            </Link>
            <Link to="/help" className="hover:underline">
              Voice Guide
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
