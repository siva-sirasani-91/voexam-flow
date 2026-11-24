import React, { useState } from 'react';
import {
  Play,
  ArrowRight,
  ArrowLeft,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { ExamType, Difficulty } from '@/types';

const EXAMS_LIBRARY = [
  {
    id: 'mcq-1',
    title: 'Computer Science Fundamentals',
    type: ExamType.MCQ,
    duration: 15,
    questions: 4,
    difficulty: Difficulty.EASY,
    description: 'Core concepts of primary memory, processors, cloud models, and networking.'
  },
  {
    id: 'mcq-2',
    title: 'Advanced React Architecture',
    type: ExamType.MCQ,
    duration: 30,
    questions: 4,
    difficulty: Difficulty.HARD,
    description: 'Design patterns, performance optimization, and deep dive into reconciliation.'
  },
  {
    id: 'desc-1',
    title: 'Cloud Systems Design',
    type: ExamType.DESCRIPTIVE,
    duration: 45,
    questions: 4,
    difficulty: Difficulty.MEDIUM,
    description: 'Design scalable cloud architectures and articulate security tradeoffs aloud.'
  },
  {
    id: 'desc-2',
    title: 'History of AI & Ethics',
    type: ExamType.DESCRIPTIVE,
    duration: 60,
    questions: 4,
    difficulty: Difficulty.HARD,
    description: 'Analytical essay responses on artificial intelligence governance and ethics.'
  },
  {
    id: 'mcq-3',
    title: 'Web Security 101',
    type: ExamType.MCQ,
    duration: 10,
    questions: 4,
    difficulty: Difficulty.MEDIUM,
    description: 'Practical security concepts and defensive patterns for modern web systems.'
  }
];

export function ExamCenter() {
  const { highContrast } = useAccessibility();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ExamType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = EXAMS_LIBRARY.filter(
    (exam) =>
      (!selectedType || exam.type === selectedType) &&
      (exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStartExam = (exam: (typeof EXAMS_LIBRARY)[number]) => {
    navigate('/exams/active', {
      state: {
        examId: exam.id,
        examTitle: exam.title,
        examType: exam.type,
        durationMinutes: exam.duration,
      }
    });
  };

  return (
    <div className="space-y-14">
      {/* Editorial Header */}
      <section className="space-y-4 max-w-3xl">
        {selectedType && (
          <button
            onClick={() => {
              setSelectedType(null);
              setSearchQuery('');
            }}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer',
              highContrast ? 'text-white/80 hover:text-[#FF6B4A]' : 'text-[#5E5A54] hover:text-[#E85A3C]'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to exam modes</span>
          </button>
        )}

        <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
          {selectedType === ExamType.MCQ ? (
            <>
              Multiple Choice{' '}
              <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Exams.</span>
            </>
          ) : selectedType === ExamType.DESCRIPTIVE ? (
            <>
              Descriptive{' '}
              <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Exams.</span>
            </>
          ) : (
            <>
              Exam{' '}
              <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Center.</span>
            </>
          )}
        </h1>

        <p className={cn('text-base md:text-lg', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
          {selectedType === null
            ? 'Select an assessment format to begin your voice-enabled evaluation.'
            : `Choose an available ${selectedType.toUpperCase()} assessment below to enter the exam room.`}
        </p>
      </section>

      {!selectedType ? (
        /* Two-Column Swiss Editorial Mode Selection */
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => setSelectedType(ExamType.MCQ)}
            className={cn(
              'p-10 md:p-12 rounded-2xl border text-left transition-colors group flex flex-col justify-between min-h-[300px] cursor-pointer',
              highContrast
                ? 'bg-black border-white hover:border-[#FF6B4A]'
                : 'bg-[#FAF8F5] border-[#1E1D1B]/12 hover:border-[#E85A3C]'
            )}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>01. Format</span>
                <span className={highContrast ? 'text-white/60' : 'text-[#78726A]'}>
                  3 Tests Available
                </span>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-display font-bold group-hover:text-[#E85A3C] transition-colors">
                  MCQ Examination
                </h2>
                <p className={cn('text-sm leading-relaxed max-w-md', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                  Structured multiple-choice assessments with automatic question narration and voice command selection (“Option A–D”).
                </p>
              </div>
            </div>

            <div
              className={cn(
                'pt-8 flex items-center gap-2 text-sm font-semibold',
                highContrast ? 'text-[#FF6B4A]' : 'text-[#1E1D1B] group-hover:text-[#E85A3C]'
              )}
            >
              <span>Browse MCQ assessments</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            onClick={() => setSelectedType(ExamType.DESCRIPTIVE)}
            className={cn(
              'p-10 md:p-12 rounded-2xl border text-left transition-colors group flex flex-col justify-between min-h-[300px] cursor-pointer',
              highContrast
                ? 'bg-black border-white hover:border-[#FF6B4A]'
                : 'bg-[#FAF8F5] border-[#1E1D1B]/12 hover:border-[#E85A3C]'
            )}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>02. Format</span>
                <span className={highContrast ? 'text-white/60' : 'text-[#78726A]'}>
                  2 Tests Available
                </span>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-display font-bold group-hover:text-[#E85A3C] transition-colors">
                  Descriptive Examination
                </h2>
                <p className={cn('text-sm leading-relaxed max-w-md', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                  Long-form written responses with live speech-to-text dictation and automatic punctuation for accessible writing.
                </p>
              </div>
            </div>

            <div
              className={cn(
                'pt-8 flex items-center gap-2 text-sm font-semibold',
                highContrast ? 'text-[#FF6B4A]' : 'text-[#1E1D1B] group-hover:text-[#E85A3C]'
              )}
            >
              <span>Browse Descriptive assessments</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </section>
      ) : (
        /* Exam Library List */
        <section className="space-y-8">
          <div className="relative max-w-md">
            <Search
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4',
                highContrast ? 'text-white/60' : 'text-[#78726A]'
              )}
            />
            <input
              type="text"
              placeholder="Filter assessments by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-11 pr-5 py-3 rounded-full border text-sm outline-none transition-colors',
                highContrast
                  ? 'bg-black border-white/40 text-white focus:border-[#FF6B4A]'
                  : 'bg-[#FAF8F5] border-[#1E1D1B]/15 text-[#1E1D1B] focus:border-[#E85A3C]'
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className={cn(
                  'p-8 rounded-2xl border flex flex-col justify-between gap-8 transition-colors',
                  highContrast
                    ? 'bg-black border-white'
                    : 'bg-[#FAF8F5] border-[#1E1D1B]/12 hover:border-[#1E1D1B]/30'
                )}
              >
                <div className="space-y-4">
                  <div
                    className={cn(
                      'flex items-center gap-2 text-xs font-medium capitalize',
                      highContrast ? 'text-white/70' : 'text-[#78726A]'
                    )}
                  >
                    <span className={highContrast ? 'text-[#FF6B4A] font-semibold' : 'text-[#E85A3C] font-semibold uppercase'}>
                      {exam.type}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{exam.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{exam.duration}m</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{exam.questions} Questions</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold">{exam.title}</h3>
                    <p className={cn('text-sm leading-relaxed', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                      {exam.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleStartExam(exam)}
                  className={cn(
                    'w-full py-3.5 px-6 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer',
                    highContrast
                      ? 'bg-white text-black hover:bg-[#FF6B4A]'
                      : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
                  )}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Exam</span>
                </button>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div
              className={cn(
                'py-20 text-center rounded-2xl border',
                highContrast ? 'border-white/25 text-white/70' : 'border-[#1E1D1B]/10 text-[#78726A]'
              )}
            >
              <h3 className="text-lg font-display font-bold">No assessments found</h3>
              <p className="text-sm mt-1">Try adjusting your search keywords.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
