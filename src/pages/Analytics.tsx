import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import {
  Clock,
  Lightbulb,
  Target,
  ArrowRight,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const WEEKLY_DATA = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 85 },
  { name: 'Thu', score: 78 },
  { name: 'Fri', score: 90 },
  { name: 'Sat', score: 88 },
  { name: 'Sun', score: 94 },
];

const MONTHLY_DATA = [
  { name: 'Wk 1', score: 70 },
  { name: 'Wk 2', score: 76 },
  { name: 'Wk 3', score: 84 },
  { name: 'Wk 4', score: 91 },
];

const SUBJECT_DATA = [
  { subject: 'Science', accuracy: 92, fill: '#E85A3C' },
  { subject: 'English', accuracy: 88, fill: '#1E1D1B' },
  { subject: 'History', accuracy: 85, fill: '#2D6A4F' },
  { subject: 'Math', accuracy: 78, fill: '#B45309' },
];

export function Analytics() {
  const { highContrast } = useAccessibility();
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  const chartData = timeframe === '7d' ? WEEKLY_DATA : MONTHLY_DATA;

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeframe: timeframe === '7d' ? 'Last 7 Days' : 'Last 30 Days',
      performanceTrend: chartData,
      subjectAccuracy: SUBJECT_DATA.map(({ subject, accuracy }) => ({ subject, accuracy })),
      summary: {
        completionRate: '98%',
        studyStreak: '14 Days',
        timeManagement: 'Efficient',
        weakTopics: 3
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voxexam-analytics-${timeframe}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadLearningPath = () => {
    const content = [
      'VoxExam Pro — Personalized Learning Strategy',
      '===========================================',
      '',
      '1. Hybrid Cloud Deployment Models',
      '   Review multi-cloud architectures and shared security boundaries.',
      '',
      '2. Pacing & Time Management',
      '   Current average: 45s per question. Target: 35s per question.',
      '',
      '3. Mathematics Progression',
      '   Strong foundation achieved. Proceed to Advanced Calculus practice sets.'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voxexam-learning-strategy.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-14">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
            Performance{' '}
            <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Analytics.</span>
          </h1>
          <p className={cn('text-base md:text-lg', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
            Detailed progression across voice-based examinations and subject mastery.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-colors whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer',
            highContrast
              ? 'border-white text-white hover:bg-white hover:text-black'
              : 'border-[#1E1D1B] text-[#1E1D1B] hover:bg-[#1E1D1B] hover:text-[#EFEAE4]'
          )}
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </section>

      {/* Charts Row — Fixed ResponsiveContainer dimensions (zero -1 warnings) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div
          className={cn(
            'lg:col-span-8 p-8 rounded-2xl border space-y-6 min-w-0',
            highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-display font-bold">Performance Trend</h2>
            <div
              className={cn(
                'inline-flex p-1 rounded-full border text-xs',
                highContrast ? 'border-white/30 bg-black' : 'border-[#1E1D1B]/12 bg-[#EFEAE4]'
              )}
            >
              <button
                type="button"
                onClick={() => setTimeframe('7d')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  timeframe === '7d'
                    ? highContrast
                      ? 'bg-white text-black'
                      : 'bg-[#1E1D1B] text-[#EFEAE4]'
                    : highContrast
                      ? 'text-white/75'
                      : 'text-[#5E5A54]'
                )}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('30d')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  timeframe === '30d'
                    ? highContrast
                      ? 'bg-white text-black'
                      : 'bg-[#1E1D1B] text-[#EFEAE4]'
                    : highContrast
                      ? 'text-white/75'
                      : 'text-[#5E5A54]'
                )}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="w-full min-w-0 h-[320px]">
            <ResponsiveContainer width="100%" height={320} minWidth={0}>
              <LineChart data={chartData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={highContrast ? '#333333' : '#DDD6CD'}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: highContrast ? '#CCCCCC' : '#78726A', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  domain={[50, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: highContrast ? '#CCCCCC' : '#78726A', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: highContrast ? '1px solid #FFFFFF' : '1px solid #DDD6CD',
                    backgroundColor: highContrast ? '#000000' : '#FFFFFF',
                    color: highContrast ? '#FFFFFF' : '#1E1D1B',
                    boxShadow: 'none',
                    padding: '10px 14px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={highContrast ? '#FF6B4A' : '#E85A3C'}
                  strokeWidth={3}
                  dot={{ r: 5, fill: highContrast ? '#FF6B4A' : '#E85A3C', strokeWidth: 2, stroke: highContrast ? '#000' : '#FAF8F5' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={cn(
            'lg:col-span-4 p-8 rounded-2xl border space-y-6 min-w-0',
            highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
          )}
        >
          <h2 className="text-lg font-display font-bold">Accuracy by Subject</h2>
          <div className="w-full min-w-0 h-[320px]">
            <ResponsiveContainer width="100%" height={320} minWidth={0}>
              <BarChart data={SUBJECT_DATA} layout="vertical" margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="subject"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: highContrast ? '#FFFFFF' : '#1E1D1B', fontSize: 13, fontWeight: 600 }}
                  width={76}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: highContrast ? '1px solid #FFFFFF' : '1px solid #DDD6CD',
                    backgroundColor: highContrast ? '#000000' : '#FFFFFF',
                    color: highContrast ? '#FFFFFF' : '#1E1D1B',
                    boxShadow: 'none',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={22}>
                  {SUBJECT_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={highContrast ? '#FF6B4A' : entry.fill}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Personalized Strategy + Key Metrics */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div
          className={cn(
            'lg:col-span-7 p-8 md:p-10 rounded-2xl border flex flex-col justify-between gap-8',
            highContrast
              ? 'bg-black border-white text-white'
              : 'bg-[#1E1D1B] border-[#1E1D1B] text-[#EFEAE4]'
          )}
        >
          <div className="space-y-3">
            <p className="text-xs font-mono font-semibold text-[#E85A3C]">
              Learning Insights
            </p>
            <h2 className="text-3xl font-display font-extrabold text-[#EFEAE4] leading-tight">
              Personalized Learning Strategy
            </h2>
          </div>

          <div className="divide-y divide-white/12">
            {[
              {
                icon: Lightbulb,
                text: 'Your accuracy in Hybrid Cloud deployment models is lower than average. Focus on multi-cloud architectures.'
              },
              {
                icon: Clock,
                text: 'You average 45 seconds per question. Aim for 35 seconds to build extra review time.'
              },
              {
                icon: Target,
                text: 'Strong momentum in Mathematics. You are ready for Advanced Calculus practice sets.'
              }
            ].map((tip, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                <tip.icon className="w-4 h-4 text-[#E85A3C] shrink-0 mt-1" />
                <p className="text-sm leading-relaxed text-[#EFEAE4]/85">{tip.text}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleDownloadLearningPath}
            className="w-full py-3.5 px-6 rounded-full bg-[#E85A3C] text-white font-semibold text-sm hover:bg-[#D1482B] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Download Learning Strategy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
          {[
            { label: 'Completion Rate', value: '98%', note: 'All assigned tests' },
            { label: 'Study Streak', value: '14 Days', note: 'Consecutive days' },
            { label: 'Time Pacing', value: 'Efficient', note: '45s avg / question' },
            { label: 'Focus Topics', value: '3 Areas', note: 'Targeted review' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'p-7 rounded-2xl border flex flex-col justify-between gap-8',
                highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
              )}
            >
              <p className={cn('text-xs font-medium', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                {stat.label}
              </p>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-display font-extrabold tabular-nums">
                  {stat.value}
                </p>
                <p className={cn('text-xs', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
                  {stat.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
