import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Timer,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Speaker
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { VoiceController } from '@/components/VoiceController';
import { ExamType, Difficulty, Question } from '@/types';

const DEFAULT_DESCRIPTIVE_EXAM = {
  id: 'ex1',
  title: 'Cloud Computing & AI Architecture',
  type: ExamType.DESCRIPTIVE,
  difficulty: Difficulty.MEDIUM,
  durationMinutes: 45,
  questions: [
    {
      id: 'q1',
      text: 'Explain the difference between Public, Private, and Hybrid cloud models. Provide specific use cases for each.',
      points: 20
    },
    {
      id: 'q2',
      text: 'How does Artificial Intelligence enhance the scalability of modern cloud infrastructures?',
      points: 20
    },
    {
      id: 'q3',
      text: 'Discuss the potential ethical implications of deploying AI in public sector decision-making.',
      points: 20
    },
    {
      id: 'q4',
      text: 'Describe the shared responsibility model in cloud security. Who is responsible for what?',
      points: 20
    }
  ] as Question[]
};

const DEFAULT_MCQ_QUESTIONS: Question[] = [
  { id: 'q1', text: 'Which of the following is a primary memory?', options: ['RAM', 'Hard Disk', 'SSD', 'Optical Drive'], points: 5 },
  { id: 'q2', text: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Processing Unit', 'Central Power Unit'], points: 5 },
  { id: 'q3', text: 'Which cloud service model provides a virtual machine?', options: ['SaaS', 'PaaS', 'IaaS', 'DaaS'], points: 5 },
  { id: 'q4', text: 'What is the primary benefit of Edge Computing?', options: ['Lower Latency', 'Unlimited Storage', 'No Internet Required', 'Lower Cost'], points: 5 }
];

const RESERVED_DESCRIPTIVE_COMMANDS = [
  'next',
  'next question',
  'previous',
  'previous question',
  'repeat',
  'repeat question',
  'read question',
  'clear answer',
  'finish',
  'finish test',
  'submit',
  'submit exam',
  'yes',
  'no',
  'confirm',
  'cancel'
];

export function ExamRoom() {
  const { highContrast, speechSpeed, speechPitch } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const routeState = (location.state as {
    examId?: string;
    examTitle?: string;
    examType?: ExamType;
    durationMinutes?: number;
    customExam?: {
      title: string;
      type: ExamType;
      durationMinutes?: number;
      questions: Question[];
    };
  } | null) || {};

  const activeExam = useMemo(() => {
    if (routeState.customExam && routeState.customExam.questions?.length > 0) {
      return {
        id: 'custom-ai-exam',
        title: routeState.customExam.title,
        type: routeState.customExam.type,
        difficulty: Difficulty.MEDIUM,
        durationMinutes: routeState.customExam.durationMinutes || 15,
        questions: routeState.customExam.questions
      };
    }

    const isMcq =
      routeState.examType === ExamType.MCQ ||
      Boolean(routeState.examId?.includes('mcq'));

    if (isMcq) {
      return {
        ...DEFAULT_DESCRIPTIVE_EXAM,
        id: routeState.examId || 'mcq-1',
        title: routeState.examTitle || 'Computer Science Quiz',
        type: ExamType.MCQ,
        durationMinutes: routeState.durationMinutes || 10,
        questions: DEFAULT_MCQ_QUESTIONS
      };
    }

    return {
      ...DEFAULT_DESCRIPTIVE_EXAM,
      id: routeState.examId || DEFAULT_DESCRIPTIVE_EXAM.id,
      title: routeState.examTitle || DEFAULT_DESCRIPTIVE_EXAM.title,
      durationMinutes: routeState.durationMinutes || DEFAULT_DESCRIPTIVE_EXAM.durationMinutes
    };
  }, [
    routeState.customExam,
    routeState.examId,
    routeState.examTitle,
    routeState.examType,
    routeState.durationMinutes
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(activeExam.durationMinutes * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQuestion = activeExam.questions[currentQuestionIndex];

  const handleVoiceResult = useCallback(
    (text: string) => {
      if (examStarted && !isFinishing && activeExam.type === ExamType.DESCRIPTIVE) {
        const cleanedLower = text.toLowerCase().trim().replace(/[.,!?]/g, '');
        if (RESERVED_DESCRIPTIVE_COMMANDS.includes(cleanedLower)) {
          return;
        }

        setAnswers((prev) => {
          const currentAnswer = prev[currentQuestion.id] || '';
          let formattedText = text.trim();
          if (formattedText.length > 0) {
            formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
            if (!['.', '?', '!'].includes(formattedText.slice(-1))) {
              formattedText += '.';
            }
          }
          return {
            ...prev,
            [currentQuestion.id]: currentAnswer + (currentAnswer ? ' ' : '') + formattedText
          };
        });
      }
    },
    [currentQuestion.id, activeExam.type, examStarted, isFinishing]
  );

  const {
    status: voiceStatus,
    transcript,
    start: startListening,
    stop: stopListening,
    speak,
    cancelSpeak,
    resetTranscript
  } = useVoiceCommands({
    onResult: handleVoiceResult,
    autoStart: false,
    onCommandMatch: (command) => {
      const text = command.toLowerCase().trim();

      if (!examStarted) return;

      // CONFIRM SUBMISSION MODAL
      if (isFinishing) {
        if (
          text.includes('yes') ||
          text.includes('confirm') ||
          text.includes('submit')
        ) {
          setIsFinishing(false);
          stopListening();
          cancelSpeak();
          navigate('/analytics');
          return;
        }

        if (text.includes('no') || text.includes('cancel') || text.includes('go back')) {
          setIsFinishing(false);
          startListening();
          return;
        }
        return;
      }

      // NEXT
      if (text.includes('next')) {
        if (currentQuestionIndex < activeExam.questions.length - 1) {
          handleNext();
        }
        return;
      }

      // PREVIOUS
      if (text.includes('previous')) {
        handlePrev();
        return;
      }

      // REPEAT OPTIONS
      if (text.includes('repeat options') || text.includes('read options')) {
        if (activeExam.type === ExamType.MCQ) {
          readOptions();
        }
        return;
      }

      // REPEAT QUESTION
      if (text.includes('repeat') || text.includes('read question')) {
        readQuestion();
        return;
      }

      // CLEAR ANSWER (Descriptive)
      if (text.includes('clear answer') && activeExam.type === ExamType.DESCRIPTIVE) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: '' }));
        speak('Answer cleared.', { rate: speechSpeed, pitch: speechPitch });
        return;
      }

      // FINISH TEST
      if (text.includes('finish') || text.includes('submit exam')) {
        setIsFinishing(true);
        speak('Do you want to submit exam? Say yes or no.', {
          rate: speechSpeed,
          pitch: speechPitch
        });
        return;
      }

      // MCQ OPTIONS (single clean speak inside handleOptionSelect — no duplicate TTS!)
      if (activeExam.type === ExamType.MCQ) {
        if (
          text.includes('option a') ||
          text === 'a' ||
          text.includes('a option') ||
          text.includes('select a') ||
          text.includes('choose a')
        ) {
          handleOptionSelect(0);
          return;
        }

        if (
          text.includes('option b') ||
          text === 'b' ||
          text.includes('b option') ||
          text.includes('select b') ||
          text.includes('choose b')
        ) {
          handleOptionSelect(1);
          return;
        }

        if (
          text.includes('option c') ||
          text === 'c' ||
          text.includes('c option') ||
          text.includes('select c') ||
          text.includes('choose c')
        ) {
          handleOptionSelect(2);
          return;
        }

        if (
          text.includes('option d') ||
          text === 'd' ||
          text.includes('d option') ||
          text.includes('select d') ||
          text.includes('choose d')
        ) {
          handleOptionSelect(3);
          return;
        }
      }
    }
  });

  const isListening = voiceStatus === 'listening';

  // Ensure microphone and TTS cleanly stop whenever leaving ExamRoom
  useEffect(() => {
    return () => {
      stopListening();
      cancelSpeak();
    };
  }, [stopListening, cancelSpeak]);

  const readOptions = useCallback(() => {
    if (!currentQuestion.options) return;
    const optionsText = currentQuestion.options
      .map((opt, i) => `Option ${String.fromCharCode(65 + i)}. ${opt}`)
      .join('. ');
    speak(`The options are: ${optionsText}`, {
      rate: speechSpeed,
      pitch: speechPitch,
      onEnd: () => {
        startListening();
      }
    });
  }, [currentQuestion.options, speak, startListening, speechSpeed, speechPitch]);

  const readQuestion = useCallback(() => {
    stopListening();
    speak(`Question ${currentQuestionIndex + 1}. ${currentQuestion.text}`, {
      rate: speechSpeed,
      pitch: speechPitch,
      onEnd: () => {
        if (activeExam.type === ExamType.MCQ) {
          readOptions();
        } else {
          startListening();
        }
      }
    });
  }, [
    currentQuestionIndex,
    currentQuestion.text,
    speak,
    activeExam.type,
    startListening,
    stopListening,
    readOptions,
    speechSpeed,
    speechPitch
  ]);

  const handleOptionSelect = useCallback(
    (idx: number) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx.toString() }));
      speak(`Option ${String.fromCharCode(65 + idx)} selected.`, {
        rate: speechSpeed,
        pitch: speechPitch
      });
    },
    [currentQuestion.id, speak, speechSpeed, speechPitch]
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < activeExam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, activeExam.questions.length]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Clear live transcript display when moving between questions
  useEffect(() => {
    resetTranscript();
  }, [currentQuestionIndex, resetTranscript]);

  // Active exam countdown timer
  useEffect(() => {
    if (!examStarted) return;
    if (timeLeft <= 0) {
      setIsFinishing(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-exam TTS briefing on landing
  useEffect(() => {
    if (!examStarted) {
      const briefing =
        activeExam.type === ExamType.MCQ
          ? `Welcome to the MCQ examination. The exam duration is ${activeExam.durationMinutes} minutes. Say Option A, Option B, Option C, or Option D to answer. Say Next or Previous to navigate. Say Finish Test when completed.`
          : `Welcome to the descriptive examination. The exam duration is ${activeExam.durationMinutes} minutes. Speak your answers clearly. Your voice will automatically convert into text. Say Next or Previous to navigate. Say Finish Test when completed.`;

      speak(briefing, {
        rate: speechSpeed,
        pitch: speechPitch,
        onEnd: () => {
          stopListening();
        }
      });
    }
  }, [examStarted, speak, stopListening, activeExam.durationMinutes, activeExam.type, speechSpeed, speechPitch]);

  // Auto-read question when exam starts or question index changes
  useEffect(() => {
    if (examStarted) {
      readQuestion();
    }
  }, [currentQuestionIndex, examStarted, readQuestion]);

  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-12">
        <div className="space-y-5">
          <div
            className={cn(
              'flex flex-wrap items-center gap-3 text-xs font-medium',
              highContrast ? 'text-white/75' : 'text-[#5E5A54]'
            )}
          >
            <span className={highContrast ? 'text-[#FF6B4A] font-semibold uppercase' : 'text-[#E85A3C] font-semibold uppercase'}>
              {activeExam.type}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{activeExam.durationMinutes} Minutes</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{activeExam.questions.length} Questions</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Speaker className="w-3.5 h-3.5" />
              Reading Rules & Regulations
            </span>
          </div>

          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
            {activeExam.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={cn(
              'p-8 rounded-2xl border space-y-4',
              highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Mic className={cn('w-4 h-4', highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]')} />
              <h2 className="text-base font-display font-bold">Voice Navigation</h2>
            </div>
            <ul className={cn('text-sm space-y-2.5', highContrast ? 'text-white/80' : 'text-[#5E5A54]')}>
              <li>Say “Next” to advance to the next question</li>
              <li>Say “Previous” to review the prior question</li>
              <li>Say “Repeat Question” to listen again</li>
            </ul>
          </div>

          <div
            className={cn(
              'p-8 rounded-2xl border space-y-4',
              highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
            )}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle className={cn('w-4 h-4', highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]')} />
              <h2 className="text-base font-display font-bold">Answering</h2>
            </div>
            <ul className={cn('text-sm space-y-2.5', highContrast ? 'text-white/80' : 'text-[#5E5A54]')}>
              {activeExam.type === ExamType.MCQ ? (
                <>
                  <li>Say “Option A”, “Option B”, “Option C”, or “Option D”</li>
                  <li>Say “Repeat Options” to hear all choices again</li>
                </>
              ) : (
                <>
                  <li>Speak naturally to dictate your response live</li>
                  <li>Say “Clear Answer” to start a response fresh</li>
                </>
              )}
              <li className={cn('font-semibold', highContrast ? 'text-white' : 'text-[#1E1D1B]')}>
                Say “Finish Test” when ready to submit
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              setExamStarted(true);
              startListening();
            }}
            className={cn(
              'px-10 py-4 rounded-full font-semibold text-base transition-colors cursor-pointer',
              highContrast
                ? 'bg-white text-black hover:bg-[#FF6B4A]'
                : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
            )}
          >
            Start Evaluation
          </button>
        </div>
      </div>
    );
  }

  const isLowTime = timeLeft < 180;

  return (
    <div className="space-y-8">
      {/* Header Bar with Visible Countdown Timer */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b',
          highContrast ? 'border-white/30' : 'border-[#1E1D1B]/12'
        )}
      >
        <div className="space-y-1">
          <p className={cn('text-xs font-medium', highContrast ? 'text-white/70' : 'text-[#78726A]')}>
            Voice Control Enabled · Question {currentQuestionIndex + 1} of {activeExam.questions.length}
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
            {activeExam.title}
          </h1>
        </div>

        <div
          aria-live="polite"
          className={cn(
            'px-5 py-2.5 rounded-xl border inline-flex items-center gap-3 font-mono font-bold text-xl tabular-nums transition-colors self-start sm:self-auto',
            isLowTime
              ? highContrast
                ? 'border-[#FF6B4A] bg-[#FF6B4A] text-black'
                : 'border-[#B91C1C]/30 bg-[#FEE2E2]/70 text-[#B91C1C]'
              : highContrast
                ? 'border-white bg-black text-white'
                : 'border-[#1E1D1B]/15 bg-[#FAF8F5] text-[#1E1D1B]'
          )}
        >
          <Timer className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
          {isLowTime && <span className="text-xs font-sans font-semibold">Low time</span>}
        </div>
      </div>

      {/* Hairline Progress Track */}
      <div
        className={cn(
          'h-1 w-full rounded-full overflow-hidden',
          highContrast ? 'bg-white/20' : 'bg-[#1E1D1B]/10'
        )}
      >
        <motion.div
          className={cn('h-full', highContrast ? 'bg-[#FF6B4A]' : 'bg-[#E85A3C]')}
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / activeExam.questions.length) * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={cn(
                'p-8 md:p-10 rounded-2xl border space-y-8',
                highContrast
                  ? 'bg-black border-white'
                  : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
              )}
            >
              <div className="space-y-2">
                <span
                  className={cn(
                    'text-xs font-mono font-semibold',
                    highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                  )}
                >
                  Question {String(currentQuestionIndex + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold leading-snug">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="space-y-3">
                {activeExam.type === ExamType.MCQ ? (
                  currentQuestion.options?.map((option: string, idx: number) => {
                    const isSelected = answers[currentQuestion.id] === idx.toString();
                    const label = String.fromCharCode(65 + idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={cn(
                          'w-full p-5 text-left rounded-xl border transition-colors flex items-center gap-4 group cursor-pointer',
                          isSelected
                            ? highContrast
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-[#1E1D1B] border-[#1E1D1B] text-[#EFEAE4]'
                            : highContrast
                              ? 'bg-black border-white/35 text-white hover:border-[#FF6B4A]'
                              : 'bg-white border-[#1E1D1B]/12 text-[#1E1D1B] hover:border-[#E85A3C]'
                        )}
                      >
                        <span
                          className={cn(
                            'w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold shrink-0 border transition-colors',
                            isSelected
                              ? highContrast
                                ? 'bg-black text-white border-black'
                                : 'bg-[#E85A3C] border-[#E85A3C] text-white'
                              : highContrast
                                ? 'border-white/30 text-white'
                                : 'bg-[#EFEAE4] border-[#1E1D1B]/10 text-[#1E1D1B] group-hover:border-[#E85A3C]'
                          )}
                        >
                          {label}
                        </span>
                        <span className="text-base font-medium flex-1">{option}</span>
                        {isSelected && <CheckCircle className="w-5 h-5 shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="relative">
                    <textarea
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                      }
                      className={cn(
                        'w-full h-72 p-6 rounded-xl border text-base leading-relaxed outline-none transition-colors resize-y',
                        highContrast
                          ? 'bg-black border-white text-white focus:border-[#FF6B4A]'
                          : 'bg-white border-[#1E1D1B]/15 text-[#1E1D1B] focus:border-[#E85A3C]'
                      )}
                      placeholder="Speak clearly or type your answer here..."
                    />
                    {isListening && (
                      <div
                        className={cn(
                          'absolute top-4 right-4 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border',
                          highContrast
                            ? 'bg-black border-[#4ADE80] text-[#4ADE80]'
                            : 'bg-[#FAF8F5] border-[#2D6A4F]/30 text-[#2D6A4F]'
                        )}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Listening</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-colors disabled:opacity-35 cursor-pointer',
                highContrast
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-[#1E1D1B]/20 text-[#1E1D1B] hover:border-[#1E1D1B]'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={readQuestion}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-colors cursor-pointer',
                highContrast
                  ? 'border-white/40 text-white hover:border-white'
                  : 'bg-[#FAF8F5] border-[#1E1D1B]/15 text-[#1E1D1B] hover:border-[#E85A3C]'
              )}
              title="Repeat Question"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Repeat</span>
            </button>

            {currentQuestionIndex === activeExam.questions.length - 1 ? (
              <button
                onClick={() => setIsFinishing(true)}
                className={cn(
                  'px-7 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer',
                  highContrast
                    ? 'bg-[#FF6B4A] text-black hover:bg-white'
                    : 'bg-[#E85A3C] text-white hover:bg-[#D1482B]'
                )}
              >
                Finish Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={cn(
                  'inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer',
                  highContrast
                    ? 'bg-white text-black hover:bg-[#FF6B4A]'
                    : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
                )}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: VoiceController + Question Index */}
        <aside className="lg:col-span-4 space-y-6">
          <VoiceController
            status={voiceStatus}
            onStart={startListening}
            onStop={stopListening}
            transcript={transcript}
          />

          <div
            className={cn(
              'p-6 rounded-2xl border space-y-4',
              highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
            )}
          >
            <h3 className="text-sm font-display font-bold">Question Index</h3>
            <div className="grid grid-cols-4 gap-2">
              {activeExam.questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      'aspect-square rounded-xl border text-xs font-mono font-bold transition-colors cursor-pointer',
                      isCurrent
                        ? highContrast
                          ? 'bg-white text-black border-white'
                          : 'bg-[#E85A3C] text-white border-[#E85A3C]'
                        : isAnswered
                          ? highContrast
                            ? 'border-[#4ADE80] text-[#4ADE80]'
                            : 'bg-[#1E1D1B] text-[#EFEAE4] border-[#1E1D1B]'
                          : highContrast
                            ? 'border-white/30 text-white/70'
                            : 'bg-white border-[#1E1D1B]/12 text-[#5E5A54] hover:border-[#1E1D1B]'
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={cn(
              'p-6 rounded-2xl border space-y-2',
              highContrast ? 'bg-black border-white/40' : 'bg-[#F7F4F0] border-[#1E1D1B]/10'
            )}
          >
            <h3 className="text-xs font-display font-bold flex items-center gap-2">
              <AlertTriangle className={cn('w-4 h-4', highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]')} />
              <span>Exam Integrity</span>
            </h3>
            <p className={cn('text-xs leading-relaxed', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
              Keep this window active during your assessment. Your responses are retained continuously as you progress.
            </p>
          </div>
        </aside>
      </div>

      {/* Finishing Confirmation Modal */}
      <AnimatePresence>
        {isFinishing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1E1D1B]/50 backdrop-blur-[2px]"
              onClick={() => setIsFinishing(false)}
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className={cn(
                'relative z-10 w-full max-w-lg p-8 md:p-10 rounded-2xl border space-y-8',
                highContrast
                  ? 'bg-black border-white text-white'
                  : 'bg-[#FAF8F5] border-[#1E1D1B]/15 text-[#1E1D1B]'
              )}
            >
              <div className="space-y-3">
                <p className={cn('text-xs font-mono font-semibold', highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]')}>
                  Confirm Submission
                </p>
                <h2 className="text-3xl font-display font-extrabold">Ready to submit?</h2>
                <p className={cn('text-sm leading-relaxed', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
                  You have answered{' '}
                  <span className="font-mono font-semibold tabular-nums">
                    {Object.values(answers).filter((v) => v !== '').length}
                  </span>{' '}
                  of{' '}
                  <span className="font-mono font-semibold tabular-nums">
                    {activeExam.questions.length}
                  </span>{' '}
                  questions. Say “Yes” to submit or “No” to return.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsFinishing(false)}
                  className={cn(
                    'py-3.5 px-6 rounded-full border text-sm font-semibold transition-colors cursor-pointer',
                    highContrast
                      ? 'border-white text-white hover:bg-white hover:text-black'
                      : 'border-[#1E1D1B]/20 text-[#1E1D1B] hover:border-[#1E1D1B]'
                  )}
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setIsFinishing(false);
                    stopListening();
                    cancelSpeak();
                    navigate('/analytics');
                  }}
                  className={cn(
                    'py-3.5 px-6 rounded-full text-sm font-semibold transition-colors cursor-pointer',
                    highContrast
                      ? 'bg-[#FF6B4A] text-black hover:bg-white'
                      : 'bg-[#E85A3C] text-white hover:bg-[#D1482B]'
                  )}
                >
                  Submit Exam
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
