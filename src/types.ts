export interface Buddy {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  flag: string;
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  avatarBg: string;
  avatarEmoji: string;
  bio: string;
  interests: string[];
  greeting: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'buddy' | 'system';
  buddyId?: string;
  text: string;
  language: 'es' | 'en';
  translation: string;
  timestamp: string;
  isChallengeResult?: boolean;
  challengeTitle?: string;
}

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  history: string[]; // List of YYYY-MM-DD strings of recorded completions
  todayCompleted: boolean;
}

export type ChallengeType = 'drama' | 'escape' | 'improv' | null;

export interface DramaBeat {
  id: number;
  sceneTitle: string;
  context: string;
  buddyPrompt: string;
  options: {
    id: string;
    textSpanish: string;
    textEnglish: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface EscapeClue {
  id: number;
  title: string;
  clueSpanish: string;
  hint: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface ImprovScenario {
  id: string;
  title: string;
  emoji: string;
  situationSpanish: string;
  situationEnglish: string;
  promptSpeaker: string;
  promptQuestion: string;
  helpfulWords: { es: string; en: string }[];
}
