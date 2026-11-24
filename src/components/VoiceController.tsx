import React from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceManagerState } from '../services/voiceManager';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface VoiceControllerProps {
  status: VoiceManagerState;
  onStart: () => void;
  onStop: () => void;
  transcript?: string;
  className?: string;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  status,
  onStart,
  onStop,
  transcript,
  className = ''
}) => {
  const { highContrast } = useAccessibility();
  const isListening = status === 'listening';

  const getStatusDisplay = () => {
    switch (status) {
      case 'listening':
        return {
          label: 'Listening',
          color: highContrast ? 'text-[#4ADE80]' : 'text-[#2D6A4F]',
          icon: Mic,
          accentBg: highContrast ? 'bg-white text-black' : 'bg-[#2D6A4F] text-white',
        };
      case 'error':
        return {
          label: 'Voice Error',
          color: highContrast ? 'text-[#FF6B4A]' : 'text-[#B91C1C]',
          icon: AlertCircle,
          accentBg: highContrast ? 'bg-[#FF6B4A] text-black' : 'bg-[#B91C1C] text-white',
        };
      case 'permission-denied':
        return {
          label: 'Mic Blocked',
          color: highContrast ? 'text-[#FF6B4A]' : 'text-[#B91C1C]',
          icon: MicOff,
          accentBg: highContrast ? 'bg-[#FF6B4A] text-black' : 'bg-[#B91C1C] text-white',
        };
      case 'unsupported':
        return {
          label: 'Unsupported',
          color: highContrast ? 'text-white/60' : 'text-[#78726A]',
          icon: AlertCircle,
          accentBg: highContrast ? 'bg-white/20 text-white' : 'bg-[#DDD6CD] text-[#5E5A54]',
        };
      default:
        return {
          label: 'Voice Ready',
          color: highContrast ? 'text-white' : 'text-[#1E1D1B]',
          icon: MicOff,
          accentBg: highContrast ? 'bg-white/20 text-white' : 'bg-[#EFEAE4] text-[#1E1D1B]',
        };
    }
  };

  const display = getStatusDisplay();
  const Icon = display.icon;

  const handleMicClick = () => {
    if (status === 'listening') {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'p-5 rounded-2xl border transition-colors duration-200 space-y-4',
          highContrast
            ? 'bg-black border-white text-white'
            : 'bg-white border-[#1E1D1B]/10 text-[#1E1D1B]'
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              {isListening && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.45 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className={cn(
                    'absolute inset-0 rounded-full',
                    highContrast ? 'bg-[#4ADE80]' : 'bg-[#2D6A4F]'
                  )}
                />
              )}
              <div
                className={cn(
                  'relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  display.accentBg
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="min-w-0">
              <p className={cn('text-sm font-display font-bold truncate', display.color)}>
                {display.label}
              </p>
              <p className={cn('text-xs truncate', highContrast ? 'text-white/70' : 'text-[#5E5A54]')}>
                {isListening ? 'Say Option A–D, Next, Repeat' : 'Microphone paused'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleMicClick}
          disabled={status === 'unsupported'}
          className={cn(
            'w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap disabled:opacity-40 cursor-pointer',
            isListening
              ? highContrast
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-[#EFEAE4] text-[#1E1D1B] hover:bg-[#E4DDD4]'
              : highContrast
                ? 'bg-[#FF6B4A] text-black hover:bg-[#FF6B4A]/90'
                : 'bg-[#1E1D1B] text-[#EFEAE4] hover:bg-[#E85A3C]'
          )}
        >
          {isListening ? 'Stop Microphone' : 'Start Voice'}
        </button>
      </div>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'p-4 rounded-2xl border',
              highContrast
                ? 'bg-black border-white text-white'
                : 'bg-[#F7F4F0] border-[#1E1D1B]/10 text-[#1E1D1B]'
            )}
          >
            <p className={cn('text-xs font-medium mb-1', highContrast ? 'text-white/60' : 'text-[#78726A]')}>
              Live voice input
            </p>
            <p className={cn('text-sm font-mono break-words', highContrast ? 'text-white' : 'text-[#1E1D1B]')}>
              “{transcript}”
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};