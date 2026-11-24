import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Eye,
  MousePointer2,
  Mic,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { voiceManager } from '@/services/voiceManager';

export function Settings() {
  const {
    mode,
    setMode,
    highContrast,
    setHighContrast,
    largeFont,
    setLargeFont,
    speechSpeed,
    setSpeechSpeed,
    speechPitch,
    setSpeechPitch
  } = useAccessibility();

  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const MODES = [
    { id: 'none' as const, label: 'Standard Mode', description: 'Balanced Swiss editorial interface for general assessment use.', icon: SettingsIcon },
    { id: 'visual' as const, label: 'Visually Impaired', description: 'Optimized spacing and structure for screen readers and high contrast.', icon: Eye },
    { id: 'physical' as const, label: 'Physically Disabled', description: 'Generous touch targets and hands-free voice command flow.', icon: MousePointer2 },
    { id: 'speech' as const, label: 'Speech Assistance', description: 'Clear narration pacing tailored for deliberate speech input.', icon: Mic },
  ];

  const handleTestVoice = () => {
    setIsTestingVoice(true);
    voiceManager.speak(
      'This is a preview of your current VoxExam speech speed and pitch settings.',
      {
        rate: speechSpeed,
        pitch: speechPitch,
        onEnd: () => setIsTestingVoice(false)
      }
    );
  };

  return (
    <div className="max-w-4xl space-y-14">
      <section className="space-y-4">
        <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-display font-extrabold leading-[1.06] tracking-[-0.03em]">
          Accessibility{' '}
          <span className={highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'}>Settings.</span>
        </h1>
        <p className={cn('text-base md:text-lg max-w-2xl', highContrast ? 'text-white/75' : 'text-[#5E5A54]')}>
          Tailor contrast, typography scale, and voice narration speed. Changes save automatically across your account.
        </p>
      </section>

      {/* Modes */}
      <section className="space-y-6">
        <h2 className="text-xl font-display font-bold">01. Accessibility Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MODES.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'p-6 text-left rounded-2xl border transition-colors flex items-start gap-4 cursor-pointer',
                  isActive
                    ? highContrast
                      ? 'bg-white text-black border-white'
                      : 'bg-[#1E1D1B] border-[#1E1D1B] text-[#EFEAE4]'
                    : highContrast
                      ? 'bg-black border-white/30 text-white hover:border-[#FF6B4A]'
                      : 'bg-[#FAF8F5] border-[#1E1D1B]/12 text-[#1E1D1B] hover:border-[#E85A3C]'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    isActive
                      ? highContrast
                        ? 'bg-black text-white'
                        : 'bg-[#E85A3C] text-white'
                      : highContrast
                        ? 'bg-white/10 text-white'
                        : 'bg-[#EFEAE4] text-[#1E1D1B]'
                  )}
                >
                  <m.icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-base">{m.label}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </div>
                  <p
                    className={cn(
                      'text-xs leading-relaxed',
                      isActive
                        ? highContrast
                          ? 'text-black/80'
                          : 'text-[#EFEAE4]/80'
                        : highContrast
                          ? 'text-white/70'
                          : 'text-[#5E5A54]'
                    )}
                  >
                    {m.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Visual & Voice Controls */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h2 className="text-xl font-display font-bold">02. Visual Display</h2>
          <div
            className={cn(
              'p-7 rounded-2xl border divide-y',
              highContrast
                ? 'bg-black border-white divide-white/20'
                : 'bg-[#FAF8F5] border-[#1E1D1B]/12 divide-[#1E1D1B]/10'
            )}
          >
            <div className="pb-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-display font-bold">High Contrast Mode</p>
                <p className={cn('text-xs', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                  Stark black & white contrast surface
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={highContrast}
                aria-label="Toggle High Contrast Mode"
                onClick={() => setHighContrast(!highContrast)}
                className={cn(
                  'w-12 h-7 rounded-full relative transition-colors shrink-0 cursor-pointer',
                  highContrast ? 'bg-[#FF6B4A]' : 'bg-[#1E1D1B]/20'
                )}
              >
                <span
                  className={cn(
                    'block absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            <div className="pt-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-display font-bold">Large Font Size</p>
                <p className={cn('text-xs', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                  Increase root reading typography scale
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={largeFont}
                aria-label="Toggle Large Font Size"
                onClick={() => setLargeFont(!largeFont)}
                className={cn(
                  'w-12 h-7 rounded-full relative transition-colors shrink-0 cursor-pointer',
                  largeFont
                    ? highContrast
                      ? 'bg-[#FF6B4A]'
                      : 'bg-[#E85A3C]'
                    : highContrast
                      ? 'bg-white/25'
                      : 'bg-[#1E1D1B]/20'
                )}
              >
                <span
                  className={cn(
                    'block absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                    largeFont ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-xl font-display font-bold">03. Voice Narration</h2>
          <div
            className={cn(
              'p-7 rounded-2xl border space-y-6',
              highContrast ? 'bg-black border-white' : 'bg-[#FAF8F5] border-[#1E1D1B]/12'
            )}
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <label htmlFor="speech-speed" className="font-display font-bold">
                  Speech Speed
                </label>
                <span
                  className={cn(
                    'font-mono font-semibold tabular-nums',
                    highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                  )}
                >
                  {speechSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                id="speech-speed"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#E85A3C] cursor-pointer"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <label htmlFor="speech-pitch" className="font-display font-bold">
                  Speech Pitch
                </label>
                <span
                  className={cn(
                    'font-mono font-semibold tabular-nums',
                    highContrast ? 'text-[#FF6B4A]' : 'text-[#E85A3C]'
                  )}
                >
                  {speechPitch.toFixed(1)}x
                </span>
              </div>
              <input
                id="speech-pitch"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-[#E85A3C] cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleTestVoice}
              className={cn(
                'w-full py-3 px-5 rounded-full border text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer',
                highContrast
                  ? 'border-white text-white hover:bg-white hover:text-black'
                  : 'border-[#1E1D1B] text-[#1E1D1B] hover:bg-[#1E1D1B] hover:text-[#EFEAE4]'
              )}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isTestingVoice ? 'Playing Voice Preview...' : 'Test Voice Settings'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
