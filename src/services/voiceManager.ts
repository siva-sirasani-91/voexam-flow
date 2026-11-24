export type VoiceManagerState =
  | 'idle'
  | 'listening'
  | 'error'
  | 'unsupported'
  | 'permission-denied';

export interface VoiceManagerEvents {
  onStatusChange?: (status: VoiceManagerState) => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onCommand?: (command: string) => void;
  onError?: (error: string) => void;
}

class VoiceManager {
  private static instance: VoiceManager;

  private recognition: any = null;
  private status: VoiceManagerState = 'idle';
  private events: VoiceManagerEvents = {};
  private manuallyStopped = true;
  private isRestarting = false;
  private isSpeaking = false;
  private speechToken = 0;
  private language = 'en-IN';
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private synth: SpeechSynthesis | null =
    typeof window !== 'undefined' ? window.speechSynthesis : null;

  private constructor() {
    this.initRecognition();
  }

  public static getInstance(): VoiceManager {
    if (!VoiceManager.instance) {
      VoiceManager.instance = new VoiceManager();
    }
    return VoiceManager.instance;
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.status = 'unsupported';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = 5;

    this.recognition.onstart = () => {
      this.status = 'listening';
      this.events.onStatusChange?.(this.status);
    };

    this.recognition.onend = () => {
      if (this.status !== 'permission-denied' && this.status !== 'unsupported') {
        this.status = 'idle';
        this.events.onStatusChange?.(this.status);
      }

      if (!this.manuallyStopped && !this.isSpeaking) {
        this.safeRestart();
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        console.error('VoiceManager Error:', event.error);
      }

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          this.status = 'permission-denied';
          this.manuallyStopped = true;
          break;
        case 'aborted':
        case 'no-speech':
          return;
        default:
          this.status = 'error';
      }

      this.events.onStatusChange?.(this.status);
      this.events.onError?.(event.error);
    };

    this.recognition.onresult = (event: any) => {
      if (this.isSpeaking) return;

      const result = event.results[event.results.length - 1];
      if (!result || !result[0]) return;

      const transcript = result[0].transcript.toLowerCase().trim();

      if (result.isFinal && transcript) {
        this.events.onResult?.(transcript, true);
        this.events.onCommand?.(transcript);
      }
    };
  }

  private recreateRecognition() {
    if (!this.recognition) return;

    try {
      this.recognition.onstart = null;
      this.recognition.onend = null;
      this.recognition.onerror = null;
      this.recognition.onresult = null;
      this.recognition.abort();
    } catch {
      // Ignore abort cleanup errors
    }

    this.recognition = null;
    this.initRecognition();
  }

  private clearRestartTimer() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    this.isRestarting = false;
  }

  private safeRestart() {
    if (this.isRestarting || this.manuallyStopped || this.isSpeaking) {
      return;
    }

    this.isRestarting = true;

    this.restartTimer = setTimeout(() => {
      this.restartTimer = null;
      try {
        if (this.manuallyStopped || this.isSpeaking) return;
        this.recreateRecognition();
        if (this.recognition && !this.manuallyStopped && !this.isSpeaking) {
          this.recognition.start();
        }
      } catch {
        // Ignore transient browser start errors
      } finally {
        this.isRestarting = false;
      }
    }, 450);
  }

  public setEvents(events: VoiceManagerEvents) {
    this.events = events;
  }

  public start() {
    if (!this.recognition) return;
    if (this.status === 'listening') return;

    this.manuallyStopped = false;
    this.clearRestartTimer();

    if (this.isSpeaking) {
      return;
    }

    try {
      this.recognition.start();
    } catch {
      this.safeRestart();
    }
  }

  public stop() {
    this.manuallyStopped = true;
    this.clearRestartTimer();

    if (!this.recognition) return;

    try {
      this.recognition.abort();
    } catch {
      // Ignore stop errors
    }

    if (this.status === 'listening') {
      this.status = 'idle';
      this.events.onStatusChange?.(this.status);
    }
  }

  public speak(
    text: string,
    options?: {
      onEnd?: () => void;
      rate?: number;
      pitch?: number;
    }
  ) {
    if (!this.synth || !text) {
      options?.onEnd?.();
      return;
    }

    const token = ++this.speechToken;
    this.clearRestartTimer();

    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }

    this.isSpeaking = true;

    // Pause STT while TTS speaks to prevent echo triggers
    if (this.recognition && this.status === 'listening') {
      try {
        this.recognition.abort();
      } catch {
        // Ignore abort errors
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language;
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;

    utterance.onend = () => {
      if (token !== this.speechToken) return;
      this.isSpeaking = false;
      options?.onEnd?.();

      if (!this.manuallyStopped && !this.isSpeaking) {
        this.safeRestart();
      }
    };

    utterance.onerror = () => {
      if (token !== this.speechToken) return;
      this.isSpeaking = false;

      if (!this.manuallyStopped && !this.isSpeaking) {
        this.safeRestart();
      }
    };

    this.synth.speak(utterance);
  }

  public cancelSpeak() {
    this.speechToken++;
    if (this.synth && (this.synth.speaking || this.synth.pending)) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
  }

  public setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public getStatus(): VoiceManagerState {
    return this.status;
  }
}

export const voiceManager = VoiceManager.getInstance();
