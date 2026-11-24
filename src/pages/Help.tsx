import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const FAQS = [
  {
    q: 'How do I start a voice examination?',
    a: 'Open the Exam Center, choose MCQ or Descriptive mode, pick a test, and select Start Evaluation. Allow microphone permissions when prompted.'
  },
  {
    q: 'Which voice commands are supported?',
    a: 'Use "Option A", "Option B", "Option C", "Option D", "Next", "Previous", "Repeat Question", "Repeat Options", "Clear Answer", and "Finish Test".'
  },
  {
    q: 'Can I generate tests from my own notes?',
    a: 'Yes. Visit the AI Generator, upload a TXT, PDF, or DOCX study file, configure difficulty, and launch directly into the Exam Room.'
  },
  {
    q: 'How does TTS and STT stay synchronized?',
    a: 'While questions or options are read aloud, speech recognition pauses automatically to avoid feedback loops, then resumes immediately once narration finishes.'
  }
];

const GUIDES = [
  {
    id: 'guide',
    num: '01',
    label: 'Quick Start Guide',
    detail: 'Step-by-step setup for microphone access, pre-exam audio briefings, and hands-free question navigation.'
  },
  {
    id: 'voice',
    num: '02',
    label: 'Voice Accuracy Tips',
    detail: 'Speak clearly after options finish reading, pause briefly between commands, and adjust speech rate in Accessibility Settings.'
  },
  {
    id: 'support',
    num: '03',
    label: 'Accessibility Support',
    detail: 'Enable High Contrast Mode or Large Font Size anytime from the Accessibility page—settings sync automatically to your account.'
  }
];

export function Help() {
  const { highContrast } = useAccessibility();
  const [selectedGuide, setSelectedGuide] = useState<string>('guide');

  const activeGuide = GUIDES.find((g) => g.id === selectedGuide) || GUIDES[0];

  return (
    <div className="space-y-14">
      <section className="space-y-4 max-w-3xl">
        <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
          Help{' '}
          <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Center.</span>
        </h1>
        <p className={cn('text-base md:text-lg', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
          Guides, voice command references, and answers for your examination workspace.
        </p>
      </section>

      {/* Interactive 3-Column Editorial Guide Selector */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((box) => {
            const isActive = selectedGuide === box.id;
            return (
              <button
                key={box.id}
                onClick={() => setSelectedGuide(box.id)}
                className={cn(
                  'p-7 rounded-2xl border text-left transition-colors space-y-3 cursor-pointer',
                  isActive
                    ? highContrast
                      ? 'bg-white text-black border-white'
                      : 'bg-[#1E1D1B] border-[#1E1D1B] text-[#EFEAE4]'
                    : highContrast
                      ? 'bg-black border-white/30 text-white hover:border-[#FF6B4A]'
                      : 'bg-[#FAF8F5] border-[#1E1D1B]/12 text-[#1E1D1B] hover:border-[#E85A3C]'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-mono font-semibold block',
                    isActive
                      ? highContrast
                        ? 'text-black'
                        : 'text-[#E85A3C]'
                      : highContrast
                        ? 'text-[#FF6B4A]'
                        : 'text-[#E85A3C]'
                  )}
                >
                  {box.num}.
                </span>
                <span className="font-display font-bold text-lg block">{box.label}</span>
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            'p-7 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4',
            highContrast ? 'bg-black border-white/40' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
          )}
        >
          <p className={cn('text-sm leading-relaxed max-w-2xl', highContrast ? 'text-white/85' : 'text-[#5E5A54]')}>
            <strong className={highContrast ? 'text-white' : 'text-[#1E1D1B]'}>{activeGuide.label}:</strong>{' '}
            {activeGuide.detail}
          </p>
          <Link
            to="/exams"
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 hover:underline underline-offset-4',
              highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
            )}
          >
            <span>Try in Exam Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* FAQs */}
        <section className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-display font-bold">Frequently Asked Questions</h2>
          <div
            className={cn(
              'divide-y border-y',
              highContrast ? 'divide-white/20 border-white/25' : 'divide-[#1E1D1B]/10 border-[#1E1D1B]/12'
            )}
          >
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-6 space-y-2">
                <h3 className="font-display font-bold text-base">{faq.q}</h3>
                <p className={cn('text-sm leading-relaxed', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Voice Reference */}
        <aside className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-display font-bold">Voice Command Reference</h2>
          <div
            className={cn(
              'p-8 rounded-2xl border space-y-7',
              highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
            )}
          >
            <div className="space-y-3">
              <p className={cn('text-xs font-medium', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                Navigation Commands
              </p>
              <div className={cn('divide-y border-y', highContrast ? 'divide-white/20 border-white/20' : 'divide-[#1E1D1B]/10 border-[#1E1D1B]/10')}>
                {[
                  { cmd: '“Next”', note: 'Next question' },
                  { cmd: '“Previous”', note: 'Previous question' },
                  { cmd: '“Repeat Question”', note: 'Replay question audio' },
                  { cmd: '“Repeat Options”', note: 'Replay MCQ options' },
                ].map((item) => (
                  <div key={item.cmd} className="py-3 flex items-center justify-between text-xs gap-3">
                    <code className={cn('font-mono font-semibold', highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]')}>
                      {item.cmd}
                    </code>
                    <span className={highContrast ? 'text-white/70' : 'text-[#5E5A54]'}>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className={cn('text-xs font-medium', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                Answer & Submission Commands
              </p>
              <div className={cn('divide-y border-y', highContrast ? 'divide-white/20 border-white/20' : 'divide-[#1E1D1B]/10 border-[#1E1D1B]/10')}>
                {[
                  { cmd: '“Option A / B / C / D”', note: 'Select MCQ choice' },
                  { cmd: '“Clear Answer”', note: 'Reset descriptive text' },
                  { cmd: '“Finish Test”', note: 'Open submission prompt' },
                  { cmd: '“Yes” / “No”', note: 'Confirm or cancel submit' },
                ].map((item) => (
                  <div key={item.cmd} className="py-3 flex items-center justify-between text-xs gap-3">
                    <code className={cn('font-mono font-semibold', highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]')}>
                      {item.cmd}
                    </code>
                    <span className={highContrast ? 'text-white/70' : 'text-[#5E5A54]'}>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
