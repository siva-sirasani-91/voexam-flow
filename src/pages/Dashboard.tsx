import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Mic,
  Check,
  Clock,
  Volume2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { auth } from '@/lib/firebase';
import { EditorialStampBadge } from '@/components/EditorialStampBadge';

const RECENT_EXAMS = [
  { id: 'mcq-1', title: 'Computer Science 101', date: '2 days ago', score: '92/100', status: 'Pass', type: 'MCQ' },
  { id: 'desc-1', title: 'Advanced Mathematics', date: '5 days ago', score: '78/100', status: 'Pass', type: 'Descriptive' },
  { id: 'mcq-3', title: 'World History', date: '1 week ago', score: '85/100', status: 'Pass', type: 'MCQ' },
];

const METRICS = [
  { label: 'Exams Completed', value: '12', detail: 'This semester' },
  { label: 'Average Score', value: '84%', detail: '+6% vs last month' },
  { label: 'Time Invested', value: '15.4h', detail: 'Active sessions' },
  { label: 'Voice Accuracy', value: '92%', detail: 'Command recognition' },
];

export function Dashboard() {
  const { highContrast } = useAccessibility();
  const navigate = useNavigate();
  const userName = auth.currentUser?.displayName?.split(' ')[0] || 'Student';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-20 md:space-y-24"
    >
      {/* Editorial Hero Header with Circular Curved-Text Heart Stamp Badge */}
      <section className="pt-2 md:pt-6 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-3xl space-y-6">
            <p
              className={cn(
                'text-sm font-medium',
                highContrast ? 'text-white/70' : 'text-[#5E5A54]'
              )}
            >
              Welcome back, {userName} · 2 pending assessments this week
            </p>

            <h1 className="text-[clamp(2.75rem,5.8vw,4.75rem)] font-display font-extrabold leading-[1.03] tracking-[-0.035em] text-balance">
              Voice-first exams crafted for{' '}
              <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>
                every learner.
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-6 shrink-0 self-start lg:self-end">
            <EditorialStampBadge highContrast={highContrast} size={116} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <Link
            to="/exams"
            className={cn(
              'inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap shrink-0',
              highContrast
                ? 'bg-white text-black hover:bg-[#FF6B4A]'
                : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
            )}
          >
            <span>Enter Exam Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/generator"
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 transition-colors whitespace-nowrap shrink-0',
              highContrast
                ? 'text-white hover:text-[#FF6B4A]'
                : 'text-[#1E1D1B] hover:text-[#E85A3C]'
            )}
          >
            <span>Generate Exam from Notes</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Two-Column Editorial Portfolio Showcase Grid: Desktop & Mobile Device Mockups */}
      <section aria-label="Workspace Showcase" className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Left Showcase Card: Desktop Device Mockup */}
        <article
          onClick={() => navigate('/exams')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/exams');
            }
          }}
          className="group cursor-pointer space-y-5 focus-visible:outline-none"
        >
          <div
            className={cn(
              'rounded-2xl border p-7 sm:p-10 aspect-[4/3] flex items-center justify-center overflow-hidden transition-colors duration-200',
              highContrast
                ? 'bg-black border-white group-hover:border-[#FF6B4A]'
                : 'bg-[#E5DFD6] border-[#1E1D1B]/10 group-hover:border-[#E85A3C]/50'
            )}
          >
            {/* Flat Minimalist Desktop Browser Mockup */}
            <div
              className={cn(
                'w-full max-w-[460px] rounded-xl border overflow-hidden transition-transform duration-300 group-hover:-translate-y-1',
                highContrast
                  ? 'bg-black border-white'
                  : 'bg-[#FAF8F5] border-[#1E1D1B]/15'
              )}
            >
              {/* Browser Top Bar */}
              <div
                className={cn(
                  'h-8 px-3.5 border-b flex items-center justify-between',
                  highContrast ? 'border-white/25 bg-black' : 'border-[#1E1D1B]/10 bg-[#F2EDE7]'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full', highContrast ? 'bg-white/40' : 'bg-[#1E1D1B]/20')} />
                  <span className={cn('w-2 h-2 rounded-full', highContrast ? 'bg-white/40' : 'bg-[#1E1D1B]/20')} />
                  <span className={cn('w-2 h-2 rounded-full', highContrast ? 'bg-white/40' : 'bg-[#1E1D1B]/20')} />
                </div>
                <span className={cn('text-[10px] font-mono', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                  voxexam.pro / exam-room
                </span>
                <span className={cn('text-[10px] font-mono tabular-nums font-semibold', highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]')}>
                  09:42
                </span>
              </div>

              {/* Mockup Body */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn('text-[11px] font-medium', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                    Question 01 / 04 · MCQ
                  </span>
                  <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium', highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]')}>
                    <Volume2 className="w-3 h-3" />
                    Voice Active
                  </span>
                </div>

                <p className={cn('text-sm sm:text-base font-display font-bold leading-snug', highContrast ? 'text-white' : 'text-[#1E1D1B]')}>
                  Which cloud service model provides virtualized computing resources over the internet?
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {[
                    { key: 'A', text: 'SaaS', active: false },
                    { key: 'B', text: 'PaaS', active: false },
                    { key: 'C', text: 'IaaS', active: true },
                    { key: 'D', text: 'DaaS', active: false },
                  ].map((opt) => (
                    <div
                      key={opt.key}
                      className={cn(
                        'px-3 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-between',
                        opt.active
                          ? highContrast
                            ? 'bg-[#FF6B4A] border-[#FF6B4A] text-black font-bold'
                            : 'bg-[#E85A3C] border-[#E85A3C] text-white font-semibold'
                          : highContrast
                            ? 'border-white/25 text-white/80'
                            : 'bg-white border-[#1E1D1B]/10 text-[#1E1D1B]'
                      )}
                    >
                      <span>
                        <span className="font-mono mr-1.5 opacity-70">{opt.key}</span>
                        {opt.text}
                      </span>
                      {opt.active && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-4 pt-1">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold group-hover:text-[#E85A3C] transition-colors">
                01. Voice Examination Room
              </h2>
              <p className={cn('text-sm', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                MCQ & Descriptive · Continuous Speech · Hands-Free Navigation
              </p>
            </div>
            <ArrowUpRight
              className={cn(
                'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                highContrast ? 'text-white' : 'text-[#1E1D1B]'
              )}
            />
          </div>
        </article>

        {/* Right Showcase Card: Mobile Device Mockup */}
        <article
          onClick={() => navigate('/analytics')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/analytics');
            }
          }}
          className="group cursor-pointer space-y-5 focus-visible:outline-none"
        >
          <div
            className={cn(
              'rounded-2xl border p-7 sm:p-10 aspect-[4/3] flex items-center justify-center overflow-hidden transition-colors duration-200',
              highContrast
                ? 'bg-black border-white group-hover:border-[#FF6B4A]'
                : 'bg-[#DFD7CC] border-[#1E1D1B]/10 group-hover:border-[#E85A3C]/50'
            )}
          >
            {/* Flat Minimalist Mobile Device Mockup */}
            <div
              className={cn(
                'w-[228px] sm:w-[244px] rounded-[28px] border-[3px] p-4 space-y-4 transition-transform duration-300 group-hover:-translate-y-1',
                highContrast
                  ? 'bg-black border-white'
                  : 'bg-[#FAF8F5] border-[#1E1D1B]'
              )}
            >
              {/* Speaker notch */}
              <div className="flex justify-center">
                <div
                  className={cn(
                    'w-14 h-1.5 rounded-full',
                    highContrast ? 'bg-white/30' : 'bg-[#1E1D1B]/15'
                  )}
                />
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className={cn('font-display font-bold', highContrast ? 'text-white' : 'text-[#1E1D1B]')}>
                  Voice Companion
                </span>
                <span className={cn('font-mono', highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]')}>
                  92% Acc
                </span>
              </div>

              {/* Voice Waveform Bars */}
              <div
                className={cn(
                  'rounded-xl border p-3.5 space-y-2.5',
                  highContrast ? 'border-white/25 bg-black' : 'border-[#1E1D1B]/10 bg-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center',
                      highContrast ? 'bg-[#FF6B4A] text-black' : 'bg-[#E85A3C] text-white'
                    )}
                  >
                    <Mic className="w-3 h-3" />
                  </div>
                  <span className={cn('text-[11px] font-medium', highContrast ? 'text-white' : 'text-[#1E1D1B]')}>
                    “Option C”
                  </span>
                </div>
                <div className="flex items-end gap-1 h-7 pt-1">
                  {[35, 65, 95, 50, 80, 45, 90, 60, 40, 75, 55, 30].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={cn(
                        'flex-1 rounded-full',
                        i % 3 === 0
                          ? highContrast
                            ? 'bg-[#FF6B4A]'
                            : 'bg-[#E85A3C]'
                          : highContrast
                            ? 'bg-white/30'
                            : 'bg-[#1E1D1B]/20'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Mini Progress Rows */}
              <div className="space-y-2">
                {[
                  { subject: 'Science', pct: '92%' },
                  { subject: 'History', pct: '85%' },
                ].map((row) => (
                  <div key={row.subject} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className={highContrast ? 'text-white/70' : 'text-[#5E5A54]'}>{row.subject}</span>
                      <span className="font-mono tabular-nums font-semibold">{row.pct}</span>
                    </div>
                    <div className={cn('h-1 rounded-full overflow-hidden', highContrast ? 'bg-white/20' : 'bg-[#1E1D1B]/10')}>
                      <div
                        style={{ width: row.pct }}
                        className={cn('h-full rounded-full', highContrast ? 'bg-white' : 'bg-[#1E1D1B]')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-4 pt-1">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold group-hover:text-[#E85A3C] transition-colors">
                02. Performance & Voice Analytics
              </h2>
              <p className={cn('text-sm', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                Weekly Trends · Subject Accuracy · Learning Path Insights
              </p>
            </div>
            <ArrowUpRight
              className={cn(
                'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                highContrast ? 'text-white' : 'text-[#1E1D1B]'
              )}
            />
          </div>
        </article>
      </section>

      {/* Hairline-Divided 4-Column Key Metrics Strip */}
      <section
        aria-label="Key Performance Metrics"
        className={cn(
          'grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y',
          highContrast ? 'border-white/30' : 'border-[#1E1D1B]/12'
        )}
      >
        {METRICS.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <p className={cn('text-xs font-medium', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
              {stat.label}
            </p>
            <p className="text-3xl md:text-4xl font-display font-extrabold tabular-nums tracking-tight">
              {stat.value}
            </p>
            <p className={cn('text-xs', highContrast ? 'text-white/50' : 'text-[#78726A]')}>
              {stat.detail}
            </p>
          </div>
        ))}
      </section>

      {/* Lower Editorial Grid: Recent Exams + Voice Quick Reference */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <div
            className={cn(
              'flex items-baseline justify-between pb-4 border-b',
              highContrast ? 'border-white/30' : 'border-[#1E1D1B]/12'
            )}
          >
            <h2 className="text-2xl font-display font-bold">Recent Examinations</h2>
            <Link
              to="/exams"
              className={cn(
                'text-sm font-medium hover:underline underline-offset-4',
                highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
              )}
            >
              View all exams
            </Link>
          </div>

          <div className={cn('divide-y', highContrast ? 'divide-white/20' : 'divide-[#1E1D1B]/10')}>
            {RECENT_EXAMS.map((exam) => (
              <button
                key={exam.id}
                onClick={() => navigate('/analytics')}
                className="w-full py-5 flex items-center justify-between gap-6 text-left group cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base font-display font-bold group-hover:text-[#E85A3C] transition-colors truncate">
                    {exam.title}
                  </h3>
                  <p className={cn('text-xs', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                    {exam.date} · {exam.type}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold tabular-nums">{exam.score}</p>
                    <p
                      className={cn(
                        'text-xs font-medium',
                        highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]'
                      )}
                    >
                      {exam.status}
                    </p>
                  </div>
                  <ArrowRight
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:translate-x-1',
                      highContrast ? 'text-white/60' : 'text-[#78726A] group-hover:text-[#E85A3C]'
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5 space-y-8">
          <div
            className={cn(
              'p-8 rounded-2xl border space-y-6',
              highContrast
                ? 'bg-black border-white'
                : 'bg-[#F7F4F0] border-[#1E1D1B]/10'
            )}
          >
            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold">Voice Command Guide</h2>
              <p className={cn('text-sm leading-relaxed', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                Navigate and answer assessments completely hands-free using natural speech commands.
              </p>
            </div>

            <div className={cn('divide-y border-y', highContrast ? 'divide-white/20 border-white/20' : 'divide-[#1E1D1B]/10 border-[#1E1D1B]/10')}>
              {[
                { cmd: '“Option A / B / C / D”', desc: 'Select MCQ answer' },
                { cmd: '“Next” / “Previous”', desc: 'Move between questions' },
                { cmd: '“Repeat Question”', desc: 'Hear prompt again' },
                { cmd: '“Finish Test”', desc: 'Review and submit' },
              ].map((row) => (
                <div key={row.cmd} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <code
                    className={cn(
                      'font-mono font-semibold',
                      highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                    )}
                  >
                    {row.cmd}
                  </code>
                  <span className={highContrast ? 'text-white/70' : 'text-[#5E5A54]'}>
                    {row.desc}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/help')}
              className={cn(
                'w-full py-3 px-5 rounded-full text-sm font-semibold border transition-colors cursor-pointer',
                highContrast
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-[#1E1D1B] text-[#1E1D1B] hover:bg-[#1E1D1B] hover:text-[#EFEAE4]'
              )}
            >
              Open Full Voice Guide
            </button>
          </div>

          <div
            className={cn(
              'p-6 rounded-2xl border flex items-center justify-between gap-4 text-xs',
              highContrast ? 'border-white/30 text-white' : 'bg-[#F7F4F0] border-[#1E1D1B]/10 text-[#5E5A54]'
            )}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>System Readiness</span>
            </div>
            <div className="flex items-center gap-3 font-medium">
              <span className={highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]'}>Network · Stable</span>
              <span aria-hidden="true">/</span>
              <span className={highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]'}>Audio · Ready</span>
            </div>
          </div>
        </aside>
      </section>
    </motion.div>
  );
}
