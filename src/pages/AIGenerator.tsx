import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Pencil,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { GoogleGenAI, Type } from '@google/genai';
import { ExamType } from '@/types';

interface GeneratedQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface GeneratedExamData {
  title: string;
  questions: GeneratedQuestion[];
}

export function AIGenerator() {
  const { highContrast } = useAccessibility();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [examType, setExamType] = useState<'mcq' | 'descriptive'>('mcq');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedExam, setGeneratedExam] = useState<GeneratedExamData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const generateExam = async () => {
    if (!file) return;
    setIsGenerating(true);
    setError(null);
    setIsEditing(false);

    try {
      let sourceSnippet = `Document filename: ${file.name}`;
      if (file.name.toLowerCase().endsWith('.txt')) {
        const rawText = await file.text();
        if (rawText.trim()) {
          sourceSnippet = rawText.slice(0, 4000);
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured in this environment.');
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a ${difficulty} difficulty ${examType} academic exam based on the following study material:\n\n${sourceSnippet}\n\nCreate 5 clear questions with 4 options each and correct answer indices (0-3). Return valid JSON.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ['text', 'options', 'correctAnswer']
                }
              }
            },
            required: ['title', 'questions']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from AI generator.');
      }

      const data: GeneratedExamData = JSON.parse(responseText);
      setGeneratedExam(data);
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setError(err?.message || 'Unable to generate exam right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionTextChange = (idx: number, value: string) => {
    setGeneratedExam((prev) => {
      if (!prev) return prev;
      const updated = [...prev.questions];
      updated[idx] = { ...updated[idx], text: value };
      return { ...prev, questions: updated };
    });
  };

  const handleLaunchExam = () => {
    if (!generatedExam) return;
    navigate('/exams/active', {
      state: {
        customExam: {
          title: generatedExam.title,
          type: examType === 'mcq' ? ExamType.MCQ : ExamType.DESCRIPTIVE,
          durationMinutes: 15,
          questions: generatedExam.questions.map((q, i) => ({
            id: `gen-q-${i + 1}`,
            text: q.text,
            options: examType === 'mcq' ? q.options : undefined,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: 10
          }))
        }
      }
    });
  };

  return (
    <div className="space-y-14">
      <section className="space-y-4 max-w-3xl">
        <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
          AI Exam{' '}
          <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Generator.</span>
        </h1>
        <p className={cn('text-base md:text-lg', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
          Upload study material and generate a structured, voice-ready examination in seconds.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Upload & Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className={cn(
              'p-8 rounded-2xl border space-y-8',
              highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
            )}
          >
            <div className="space-y-3">
              <h2 className="text-sm font-display font-bold">01. Upload Material</h2>
              <label
                className={cn(
                  'flex flex-col items-center justify-center h-44 border border-dashed rounded-xl cursor-pointer transition-colors p-4 text-center',
                  file
                    ? highContrast
                      ? 'border-[#4ADE80] bg-black'
                      : 'border-[#2D6A4F] bg-white'
                    : highContrast
                      ? 'border-white/40 hover:border-[#FF6B4A]'
                      : 'border-[#1E1D1B]/25 bg-white hover:border-[#E85A3C]'
                )}
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                />
                <div className="flex flex-col items-center gap-2">
                  {file ? (
                    <FileText className={cn('w-8 h-8', highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]')} />
                  ) : (
                    <Upload className={cn('w-8 h-8', highContrast ? 'text-white/50' : 'text-[#78726A]')} />
                  )}
                  <span className="text-sm font-semibold max-w-[220px] truncate">
                    {file ? file.name : 'Select document'}
                  </span>
                  <span className={cn('text-xs', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                    PDF, DOCX, or TXT
                  </span>
                </div>
              </label>
            </div>

            <div className={cn('space-y-5 pt-6 border-t', highContrast ? 'border-white/20' : 'border-[#1E1D1B]/10')}>
              <h2 className="text-sm font-display font-bold">02. Exam Configuration</h2>

              <div className="space-y-2">
                <label className={cn('text-xs font-medium block', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        'py-2.5 px-3 rounded-lg text-xs font-semibold capitalize border transition-colors cursor-pointer',
                        difficulty === d
                          ? highContrast
                            ? 'bg-white text-black border-white'
                            : 'bg-[#1E1D1B] text-[#EFEAE4] border-[#1E1D1B]'
                          : highContrast
                            ? 'bg-black text-white/80 border-white/30 hover:border-white'
                            : 'bg-white text-[#5E5A54] border-[#1E1D1B]/12 hover:border-[#1E1D1B]'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={cn('text-xs font-medium block', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                  Assessment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mcq' as const, label: 'Multiple Choice' },
                    { id: 'descriptive' as const, label: 'Descriptive' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setExamType(t.id)}
                      className={cn(
                        'py-2.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap',
                        examType === t.id
                          ? highContrast
                            ? 'bg-[#FF6B4A] text-black border-[#FF6B4A]'
                            : 'bg-[#E85A3C] text-white border-[#E85A3C]'
                          : highContrast
                            ? 'bg-black text-white/80 border-white/30 hover:border-white'
                            : 'bg-white text-[#5E5A54] border-[#1E1D1B]/12 hover:border-[#1E1D1B]'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className={cn(
                  'p-4 rounded-xl border text-xs flex items-start gap-2.5',
                  highContrast
                    ? 'border-[#FF6B4A] text-[#FF6B4A]'
                    : 'bg-[#FEE2E2]/60 border-[#B91C1C]/20 text-[#991B1B]'
                )}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={generateExam}
              disabled={!file || isGenerating}
              className={cn(
                'w-full py-3.5 px-6 rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                highContrast
                  ? 'bg-white text-black hover:bg-[#FF6B4A]'
                  : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Exam...</span>
                </>
              ) : (
                <>
                  <span>Generate Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div
            className={cn(
              'p-6 rounded-2xl border text-xs leading-relaxed',
              highContrast ? 'border-white/30 text-white/75' : 'bg-[#F7F4F0] border-[#1E1D1B]/10 text-[#5E5A54]'
            )}
          >
            Key topics, definitions, and reasoning are extracted from your uploaded document to assemble a balanced voice-ready evaluation.
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {generatedExam ? (
              <motion.div
                key="generated"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'p-8 md:p-10 rounded-2xl border space-y-8',
                  highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
                )}
              >
                <div
                  className={cn(
                    'flex items-start justify-between gap-4 pb-6 border-b',
                    highContrast ? 'border-white/20' : 'border-[#1E1D1B]/10'
                  )}
                >
                  <div className="space-y-1">
                    <p className={cn('text-xs font-medium', highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]')}>
                      Ready to launch · {generatedExam.questions.length} Questions · {examType.toUpperCase()}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">{generatedExam.title}</h2>
                  </div>
                  <CheckCircle2
                    className={cn('w-7 h-7 shrink-0', highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]')}
                  />
                </div>

                <div className={cn('divide-y', highContrast ? 'divide-white/20' : 'divide-[#1E1D1B]/10')}>
                  {generatedExam.questions.map((q, idx) => (
                    <div key={idx} className="py-6 first:pt-0 space-y-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            'font-mono text-xs font-bold pt-1 shrink-0',
                            highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                          )}
                        >
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={q.text}
                            onChange={(e) => handleQuestionTextChange(idx, e.target.value)}
                            className={cn(
                              'flex-1 px-3 py-2 rounded-lg border text-sm font-medium outline-none',
                              highContrast
                                ? 'bg-black border-white text-white'
                                : 'bg-white border-[#1E1D1B]/20 text-[#1E1D1B] focus:border-[#E85A3C]'
                            )}
                          />
                        ) : (
                          <h3 className="text-base font-display font-bold leading-snug">{q.text}</h3>
                        )}
                      </div>

                      {examType === 'mcq' && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-7">
                          {q.options.map((opt, oidx) => {
                            const isCorrect = oidx === q.correctAnswer;
                            return (
                              <div
                                key={oidx}
                                className={cn(
                                  'px-4 py-2.5 rounded-lg border text-sm',
                                  isCorrect
                                    ? highContrast
                                      ? 'border-[#4ADE80] text-[#4ADE80] font-semibold'
                                      : 'bg-white border-[#2D6A4F]/40 text-[#2D6A4F] font-semibold'
                                    : highContrast
                                      ? 'border-white/20 text-white/75'
                                      : 'bg-white border-[#1E1D1B]/10 text-[#5E5A54]'
                                )}
                              >
                                <span className="font-mono mr-2">{String.fromCharCode(65 + oidx)}.</span>
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing((prev) => !prev)}
                    className={cn(
                      'w-full sm:flex-1 py-3.5 px-6 rounded-full border text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer',
                      highContrast
                        ? 'border-white text-white hover:bg-white hover:text-black'
                        : 'border-[#1E1D1B]/20 text-[#1E1D1B] hover:border-[#1E1D1B]'
                    )}
                  >
                    {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    <span>{isEditing ? 'Done Editing' : 'Edit Questions'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchExam}
                    className={cn(
                      'w-full sm:flex-1 py-3.5 px-6 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer',
                      highContrast
                        ? 'bg-[#FF6B4A] text-black hover:bg-white'
                        : 'bg-[#E85A3C] text-white hover:bg-[#D1482B]'
                    )}
                  >
                    <span>Save & Launch Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div
                key="empty"
                className={cn(
                  'min-h-[460px] flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-2xl',
                  highContrast ? 'border-white/30 text-white/70' : 'border-[#1E1D1B]/20 bg-[#F7F4F0]/60 text-[#78726A]'
                )}
              >
                <FileText className="w-10 h-10 opacity-40 mb-4" />
                <h2 className="text-xl font-display font-bold">No exam generated yet</h2>
                <p className="text-sm max-w-sm mt-2 leading-relaxed">
                  Upload a study document on the left, pick your difficulty and format, then select “Generate Exam”.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
