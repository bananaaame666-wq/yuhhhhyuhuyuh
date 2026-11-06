/**
 * Duo Pals Verbal Engine: Web Speech API (Recognition + Synthesis) & Web Audio Sound Effects
 */

// Types for Web Speech API
export interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    item(index: number): {
      length: number;
      item(index: number): SpeechRecognitionResultItem;
      isFinal: boolean;
      [index: number]: SpeechRecognitionResultItem;
    };
    [index: number]: {
      length: number;
      item(index: number): SpeechRecognitionResultItem;
      isFinal: boolean;
      [index: number]: SpeechRecognitionResultItem;
    };
  };
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

// ---------------------------------------------------------------------------
// Web Audio Synthesizer (Instant, 100% reliable sound effects)
// ---------------------------------------------------------------------------
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'success' | 'correct' | 'wrong' | 'unlock' | 'mic-on' | 'applause'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'mic-on') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'correct') {
      // Pleasant dual chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc2.frequency.setValueAtTime(1046.5, now + 0.1); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === 'wrong') {
      // Gentle soft thud/buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'unlock') {
      // Mechanical unlocking clicks + chime
      [0, 0.08, 0.16].forEach((timeOffset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + idx * 250, now + timeOffset);
        gain.gain.setValueAtTime(0.15, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.12);
      });
    } else if (type === 'success' || type === 'applause') {
      // Fanfare celebratory arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    }
  } catch (err) {
    console.warn('AudioContext sound effect failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Text-to-Speech (TTS) Engine
// ---------------------------------------------------------------------------
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function speakText(
  text: string,
  lang: 'es-ES' | 'es-MX' | 'en-US' = 'es-ES',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (!isSpeechSynthesisSupported()) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return false;
  }

  stopSpeaking();

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    utterance.lang = lang;
    utterance.rate = 0.95; // slightly relaxed for clear pronunciation
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.slice(0, 2);
    const matchingVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()) || v.lang.toLowerCase().startsWith(langPrefix)
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
      }
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (currentUtterance === utterance) {
        currentUtterance = null;
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Failed to speak text:', err);
    onEnd?.();
    return false;
  }
}

// ---------------------------------------------------------------------------
// Speech Recognition Hook / Manager
// ---------------------------------------------------------------------------
export class SpeechListener {
  private recognition: any = null;
  private isListening = false;
  private lang: string;

  constructor(lang: string = 'es-MX') {
    this.lang = lang;
  }

  public isAvailable(): boolean {
    return isSpeechRecognitionSupported();
  }

  public start(callbacks: {
    onStart?: () => void;
    onInterim?: (text: string) => void;
    onResult: (finalText: string) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  }): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      callbacks.onError?.('SpeechRecognition not supported in this browser');
      return false;
    }

    try {
      this.stop(); // Stop any previous session

      const recognition = new SpeechRecognitionClass();
      this.recognition = recognition;
      recognition.lang = this.lang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      playSound('mic-on');

      recognition.onstart = () => {
        this.isListening = true;
        callbacks.onStart?.();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i][0];
          if (event.results[i].isFinal) {
            finalTranscript += item.transcript;
          } else {
            interimTranscript += item.transcript;
          }
        }

        if (interimTranscript) {
          callbacks.onInterim?.(interimTranscript);
        }
        if (finalTranscript) {
          callbacks.onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('SpeechRecognition error:', event.error);
        this.isListening = false;
        callbacks.onError?.(event.error);
      };

      recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      callbacks.onError?.(err?.message || 'Could not start microphone');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  public setLang(lang: string) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}

// ---------------------------------------------------------------------------
// String similarity helper for fuzzy spoken matching
// ---------------------------------------------------------------------------
export function cleanSpokenText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, '') // remove punctuation
    .trim();
}

export function checkSpokenMatch(spoken: string, targetPhrase: string): {
  isMatch: boolean;
  similarityRatio: number;
} {
  const cleanSpoken = cleanSpokenText(spoken);
  const cleanTarget = cleanSpokenText(targetPhrase);

  if (!cleanSpoken || !cleanTarget) {
    return { isMatch: false, similarityRatio: 0 };
  }

  // Exact or substring match
  if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
    return { isMatch: true, similarityRatio: 1.0 };
  }

  // Word overlap match
  const spokenWords = new Set(cleanSpoken.split(/\s+/).filter(w => w.length > 2));
  const targetWords = cleanTarget.split(/\s+/).filter(w => w.length > 2);

  if (targetWords.length === 0) {
    return { isMatch: true, similarityRatio: 1.0 };
  }

  let matchedWords = 0;
  for (const tw of targetWords) {
    if (spokenWords.has(tw) || Array.from(spokenWords).some(sw => sw.startsWith(tw) || tw.startsWith(sw))) {
      matchedWords++;
    }
  }

  const ratio = matchedWords / targetWords.length;
  // If at least 50% of the key words are detected, accept as correct spoken pronunciation!
  return {
    isMatch: ratio >= 0.5,
    similarityRatio: ratio,
  };
}
