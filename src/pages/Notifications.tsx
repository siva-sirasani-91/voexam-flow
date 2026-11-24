import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    category: 'Schedule',
    title: 'New Exam Available',
    desc: 'Your "Advanced Algorithms" practice exam is ready in the Exam Center.',
    time: '2 hours ago',
    route: '/exams',
    read: false
  },
  {
    id: 2,
    category: 'Analytics',
    title: 'Performance Analysis Complete',
    desc: 'The performance report for your Cloud Computing exam has been compiled.',
    time: '5 hours ago',
    route: '/analytics',
    read: false
  },
  {
    id: 3,
    category: 'Accessibility',
    title: 'Voice Navigation Update',
    desc: 'Improved command pacing and confirmation clarity for hands-free assessments.',
    time: 'Yesterday',
    route: '/settings',
    read: true
  },
  {
    id: 4,
    category: 'Reminder',
    title: 'Weekly Practice Goal',
    desc: 'You have 2 remaining practice assessments scheduled for this week.',
    time: '2 days ago',
    route: '/exams',
    read: true
  }
];

export function Notifications() {
  const { highContrast } = useAccessibility();
  const navigate = useNavigate();
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openNotification = (id: number, route: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    navigate(route);
  };

  return (
    <div className="max-w-4xl space-y-12">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
            Notifications<span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>.</span>
          </h1>
          <p className={cn('text-base', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
            Updates on upcoming examinations, analytics reports, and voice enhancements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto',
              highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
            )}
          >
            <Check className="w-4 h-4" />
            <span>Mark all read ({unreadCount})</span>
          </button>
        )}
      </section>

      <div
        className={cn(
          'divide-y border-y',
          highContrast ? 'divide-white/20 border-white/25' : 'divide-[#1E1D1B]/10 border-[#1E1D1B]/12'
        )}
      >
        {items.map((notif) => (
          <div
            key={notif.id}
            className="py-7 flex flex-col sm:flex-row sm:items-start justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div
                className={cn(
                  'flex items-center gap-2 text-xs font-medium',
                  highContrast ? 'text-white/60' : 'text-[#78726A]'
                )}
              >
                <span className={cn(!notif.read && (highContrast ? 'text-[#FF6B4A] font-semibold' : 'text-[#E85A3C] font-semibold'))}>
                  {notif.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{notif.time}</span>
                {!notif.read && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className={highContrast ? 'text-white font-semibold' : 'text-[#1E1D1B] font-semibold'}>
                      Unread
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-xl font-display font-bold">{notif.title}</h2>
              <p className={cn('text-sm leading-relaxed', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                {notif.desc}
              </p>
            </div>

            <button
              onClick={() => openNotification(notif.id, notif.route)}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-colors cursor-pointer self-start',
                highContrast ? 'text-white hover:text-[#FF6B4A]' : 'text-[#1E1D1B] hover:text-[#E85A3C]'
              )}
            >
              <span>Open</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
