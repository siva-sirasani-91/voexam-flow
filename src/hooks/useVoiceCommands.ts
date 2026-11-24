import { useState, useEffect, useCallback, useRef } from 'react';
import { voiceManager, VoiceManagerState } from '../services/voiceManager';

interface UseVoiceCommandsOptions {
  onCommandMatch?: (command: string) => void;
  onResult?: (text: string, isFinal: boolean) => void;
  autoStart?: boolean;
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const [status, setStatus] = useState<VoiceManagerState>(voiceManager.getStatus());
  const [transcript, setTranscript] = useState('');

  const isListening = status === 'listening';

  const onCommandMatchRef = useRef(options.onCommandMatch);
  const onResultRef = useRef(options.onResult);

  useEffect(() => {
    onCommandMatchRef.current = options.onCommandMatch;
    onResultRef.current = options.onResult;
  }, [options.onCommandMatch, options.onResult]);

  useEffect(() => {
    voiceManager.setEvents({
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
      },
      onResult: (text, isFinal) => {
        setTranscript(text);
        onResultRef.current?.(text, isFinal);
      },
      onCommand: (rawCommand) => {
        const normalizedCommand = rawCommand
          .toLowerCase()
          .trim()
          .replace(/[.,!?]/g, '')
          .replace(/\s+/g, ' ');

        onCommandMatchRef.current?.(normalizedCommand);
      },
      onError: (error) => {
        console.error('Voice Error:', error);
      }
    });

    if (options.autoStart) {
      voiceManager.start();
    }

    return () => {
      voiceManager.setEvents({});
    };
  }, [options.autoStart]);

  const start = useCallback(() => {
    voiceManager.start();
  }, []);

  const stop = useCallback(() => {
    voiceManager.stop();
  }, []);

  const speak = useCallback((text: string, opts?: { onEnd?: () => void; rate?: number; pitch?: number }) => {
    voiceManager.speak(text, opts);
  }, []);

  const cancelSpeak = useCallback(() => {
    voiceManager.cancelSpeak();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    status,
    transcript,
    isListening,
    start,
    stop,
    speak,
    cancelSpeak,
    resetTranscript
  };
}