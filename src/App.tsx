import React, { useState, useEffect } from 'react';
import {
  Buddy,
  ChatMessage,
  StreakState,
  ChallengeType,
} from './types';
import {
  BUDDY_PROFILES,
  INITIAL_MESSAGES_BY_BUDDY,
  generateScriptedBuddyReply,
} from './data/seedData';
import {
  loadStreakState,
  recordQualifyingActivity,
  getInitialSeededStreak,
  saveStreakState,
} from './utils/streak';
import { Header } from './components/Header';
import { BuddyCard } from './components/BuddyCard';
import { StreakCard } from './components/StreakCard';
import { ChatArea } from './components/ChatArea';
import { ChallengesDeck } from './components/ChallengesDeck';
import { DramaModal } from './components/DramaModal';
import { EscapeRoomModal } from './components/EscapeRoomModal';
import { ImprovModal } from './components/ImprovModal';
import { Toast, ToastData } from './components/Toast';
import { MessageSquare, Users, Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';

const CHAT_STORAGE_PREFIX = 'duo_pals_chat_';
const ACTIVE_BUDDY_KEY = 'duo_pals_active_buddy';

export default function App() {
  // 1. Streak State
  const [streakState, setStreakState] = useState<StreakState>(() => loadStreakState());

  // 2. Active Buddy State
  const [currentBuddy, setCurrentBuddy] = useState<Buddy>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_BUDDY_KEY);
      const found = BUDDY_PROFILES.find((b) => b.id === savedId);
      return found || BUDDY_PROFILES[0];
    } catch {
      return BUDDY_PROFILES[0];
    }
  });

  // 3. Chat Messages State (keyed per buddy)
  const [messagesByBuddy, setMessagesByBuddy] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const initial: Record<string, ChatMessage[]> = {};
      for (const b of BUDDY_PROFILES) {
        const saved = localStorage.getItem(`${CHAT_STORAGE_PREFIX}${b.id}`);
        if (saved) {
          initial[b.id] = JSON.parse(saved);
        } else {
          initial[b.id] = INITIAL_MESSAGES_BY_BUDDY[b.id] || [];
        }
      }
      return initial;
    } catch {
      return INITIAL_MESSAGES_BY_BUDDY;
    }
  });

  // 4. UI States
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);
  const [isBuddyTyping, setIsBuddyTyping] = useState(false);
  const [starterIndex, setStarterIndex] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeType>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<'chat' | 'buddy_challenges'>('chat');

  // Sync active buddy to localStorage
  const handleSelectBuddy = (newBuddy: Buddy) => {
    setCurrentBuddy(newBuddy);
    try {
      localStorage.setItem(ACTIVE_BUDDY_KEY, newBuddy.id);
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
    setToast({
      id: String(Date.now()),
      type: 'info',
      title: `Switched to ${newBuddy.name}`,
      message: `Practicing verbally with ${newBuddy.name} in ${newBuddy.city}, ${newBuddy.country}!`,
    });
  };

  // Helper to persist chat messages
  const persistChatMessages = (buddyId: string, updatedMessages: ChatMessage[]) => {
    setMessagesByBuddy((prev) => {
      const next = { ...prev, [buddyId]: updatedMessages };
      try {
        localStorage.setItem(`${CHAT_STORAGE_PREFIX}${buddyId}`, JSON.stringify(updatedMessages));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return next;
    });
  };

  // Helper to trigger streak increment
  const triggerQualifyingActivity = (sourceDescription: string) => {
    const result = recordQualifyingActivity(streakState);
    setStreakState(result.newState);

    if (result.didIncrement) {
      setToast({
        id: String(Date.now()),
        type: 'streak',
        title: '🔥 Streak Extended!',
        message: `Your verbal conversation is logged. Streak is now ${result.newState.currentStreak} days!`,
      });
    } else {
      setToast({
        id: String(Date.now()),
        type: 'success',
        title: 'Activity Recorded',
        message: 'Your verbal practice is saved! Daily goal is already safe.',
      });
    }
  };

  // Sending a chat message
  const handleSendMessage = (userText: string, isVoice?: boolean) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Create User Message
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      buddyId: currentBuddy.id,
      text: userText,
      language: 'es',
      translation: `Demo translation · your buddy can help you polish it: "${userText}"`,
      timestamp,
      isSpokenVoice: isVoice,
    };

    const currentMessages = messagesByBuddy[currentBuddy.id] || [];
    const updatedWithUser = [...currentMessages, userMessage];
    persistChatMessages(currentBuddy.id, updatedWithUser);

    // 2. Count streak qualifying activity immediately
    triggerQualifyingActivity('Sent message');

    // 3. Trigger scripted reciprocal buddy reply after a brief realistic pause (~650ms)
    setIsBuddyTyping(true);
    setTimeout(() => {
      const buddyReply = generateScriptedBuddyReply(userText, currentBuddy);
      const replyTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const buddyMessage: ChatMessage = {
        id: `msg-buddy-${Date.now()}`,
        sender: 'buddy',
        buddyId: currentBuddy.id,
        text: buddyReply.text,
        language: 'en',
        translation: buddyReply.translation,
        timestamp: replyTimestamp,
      };

      const finalMessages = [...updatedWithUser, buddyMessage];
      persistChatMessages(currentBuddy.id, finalMessages);
      setIsBuddyTyping(false);
    }, 700);
  };


  // Completing Drama Challenge
  const handleCompleteDrama = (summaryMessage: string) => {
    setCompletedChallenges((prev) => Array.from(new Set([...prev, 'drama'])));
    triggerQualifyingActivity('Drama Replay Challenge');

    // Post to buddy chat
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `drama-${Date.now()}`,
      sender: 'user',
      buddyId: currentBuddy.id,
      text: summaryMessage,
      language: 'es',
      translation: 'Demo polish: "I just survived a dramatic telenovela scene in Drama Replay! Reached all 3 acts with a happy ending."',
      timestamp,
      isChallengeResult: true,
      challengeTitle: 'Drama Replay: Telenovela Completed',
    };

    const currentList = messagesByBuddy[currentBuddy.id] || [];
    const updated = [...currentList, userMessage];
    persistChatMessages(currentBuddy.id, updated);

    // Buddy responds warmly in chat
    setTimeout(() => {
      const buddyMessage: ChatMessage = {
        id: `drama-reply-${Date.now()}`,
        sender: 'buddy',
        buddyId: currentBuddy.id,
        text: `¡Bravo! Surviving a full dramatic scene in Spanish is such a huge confidence builder. You’re really getting the hang of emotional cadence!`,
        language: 'en',
        translation: `¡Bravo! Sobrevivir a una escena dramática completa en español aumenta muchísimo la confianza. ¡Realmente le estás agarrando el ritmo a la cadencia emocional!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      persistChatMessages(currentBuddy.id, [...updated, buddyMessage]);
    }, 600);
  };

  // Completing Escape Room Challenge
  const handleCompleteEscape = (summaryMessage: string) => {
    setCompletedChallenges((prev) => Array.from(new Set([...prev, 'escape'])));
    triggerQualifyingActivity('No-English Escape Room');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `escape-${Date.now()}`,
      sender: 'user',
      buddyId: currentBuddy.id,
      text: summaryMessage,
      language: 'es',
      translation: 'Demo polish: "I managed to escape the secret library using only Spanish! Deciphered the 3 clues without translation tools."',
      timestamp,
      isChallengeResult: true,
      challengeTitle: 'No-English Escape Room Solved',
    };

    const currentList = messagesByBuddy[currentBuddy.id] || [];
    const updated = [...currentList, userMessage];
    persistChatMessages(currentBuddy.id, updated);

    // Buddy responds enthusiastically
    setTimeout(() => {
      const buddyMessage: ChatMessage = {
        id: `escape-reply-${Date.now()}`,
        sender: 'buddy',
        buddyId: currentBuddy.id,
        text: `¡Increíble! Reading clues in Spanish without switching back to English is true immersion. Congratulations on escaping the library!`,
        language: 'en',
        translation: `¡Increíble! Leer pistas en español sin volver al inglés es verdadera inmersión. ¡Felicitaciones por escapar de la biblioteca!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      persistChatMessages(currentBuddy.id, [...updated, buddyMessage]);
    }, 600);
  };

  // Completing Improv Challenge
  const handleCompleteImprov = (userResponse: string, scenarioTitle: string) => {
    setCompletedChallenges((prev) => Array.from(new Set([...prev, 'improv'])));
    triggerQualifyingActivity('Improv Portal Challenge');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `improv-${Date.now()}`,
      sender: 'user',
      buddyId: currentBuddy.id,
      text: userResponse,
      language: 'es',
      translation: `Demo translation · Improv line: "${userResponse}"`,
      timestamp,
      isChallengeResult: true,
      challengeTitle: `Improv Challenge: ${scenarioTitle}`,
    };

    const currentList = messagesByBuddy[currentBuddy.id] || [];
    const updated = [...currentList, userMessage];
    persistChatMessages(currentBuddy.id, updated);

    // Buddy responds to the improv line
    setTimeout(() => {
      const buddyMessage: ChatMessage = {
        id: `improv-reply-${Date.now()}`,
        sender: 'buddy',
        buddyId: currentBuddy.id,
        text: `Haha, that improv response made me smile! Thinking and typing fast in Spanish is the exact skill you need for real-life conversations. Keep it up!`,
        language: 'en',
        translation: `¡Jaja, esa respuesta de improvisación me hizo sonreír! Pensar y escribir rápido en español es exactamente la habilidad que necesitas para conversaciones de la vida real. ¡Sigue así!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      persistChatMessages(currentBuddy.id, [...updated, buddyMessage]);
    }, 600);
  };

  // Reset Demo button for judging / testing convenience
  const handleResetDemoState = () => {
    const seededStreak = getInitialSeededStreak();
    saveStreakState(seededStreak);
    setStreakState(seededStreak);

    // Reset messages to seed
    for (const b of BUDDY_PROFILES) {
      try {
        localStorage.removeItem(`${CHAT_STORAGE_PREFIX}${b.id}`);
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    }
    setMessagesByBuddy(INITIAL_MESSAGES_BY_BUDDY);
    setCompletedChallenges([]);
    setCurrentBuddy(BUDDY_PROFILES[0]);

    setToast({
      id: String(Date.now()),
      type: 'info',
      title: 'Demo State Reset',
      message: 'Initial 4-day streak restored (yesterday completed). Send any message to see it advance to 5!',
    });
  };

  const activeMessages = messagesByBuddy[currentBuddy.id] || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] text-stone-900 selection:bg-emerald-200">
      {/* 1. Header with brand, streak, and daily goal */}
      <Header streakState={streakState} />

      {/* Hero Welcome & Subtitle Bar */}
      <section className="bg-stone-100/60 border-b border-stone-200/70 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Practice verbally with a person. Speak aloud.</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                🎙️ Verbal Voice Active
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5 max-w-2xl">
              Break the speaking freeze verbally: Speak <strong className="text-stone-900 font-semibold">Spanish</strong> into your microphone, get real-time speech transcription, hear native pronunciation, and play three voice-activated interactive challenges!
            </p>
          </div>

          {/* Quick Demo Reset for Hackathon Judges */}
          <button
            onClick={handleResetDemoState}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 bg-white border border-stone-300 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer shadow-2xs"
            title="Reset streak to 4 days (yesterday) to test the 4 → 5 advance!"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </section>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 pt-4 w-full">
        <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-xl text-xs font-bold text-stone-700">
          <button
            onClick={() => setMobileActiveTab('chat')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileActiveTab === 'chat'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat & Practice</span>
          </button>
          <button
            onClick={() => setMobileActiveTab('buddy_challenges')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileActiveTab === 'buddy_challenges'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Buddy & Challenges</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Reciprocal Chat (7 cols on desktop) */}
          <section
            className={`lg:col-span-7 space-y-4 ${
              mobileActiveTab === 'chat' ? 'block' : 'hidden lg:block'
            }`}
          >
            <ChatArea
              currentBuddy={currentBuddy}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              isBuddyTyping={isBuddyTyping}
              starterIndex={starterIndex}
              onCycleStarter={() => setStarterIndex((prev) => prev + 1)}
              autoSpeakReplies={autoSpeakReplies}
              onToggleAutoSpeak={() => setAutoSpeakReplies((prev) => !prev)}
            />
          </section>

          {/* Right Column: Buddy Card, Streak Card, and Challenges Deck (5 cols on desktop) */}
          <aside
            className={`lg:col-span-5 space-y-5 ${
              mobileActiveTab === 'buddy_challenges' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Matched Buddy Card */}
            <BuddyCard
              currentBuddy={currentBuddy}
              onSelectBuddy={handleSelectBuddy}
            />

            {/* Streak & 7-Day Calendar Card */}
            <StreakCard streakState={streakState} />

            {/* 3 Playable Conversation Challenges */}
            <ChallengesDeck
              onOpenChallenge={(type) => setActiveChallenge(type)}
              completedChallenges={completedChallenges}
            />
          </aside>
        </div>
      </main>

      {/* Modals for Challenges - conditionally rendered so onClose instantly removes them */}
      {activeChallenge === 'drama' && (
        <DramaModal
          isOpen={true}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleCompleteDrama}
        />
      )}

      {activeChallenge === 'escape' && (
        <EscapeRoomModal
          isOpen={true}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleCompleteEscape}
        />
      )}

      {activeChallenge === 'improv' && (
        <ImprovModal
          isOpen={true}
          onClose={() => setActiveChallenge(null)}
          onComplete={handleCompleteImprov}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Simple, Clean Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-4 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">duo pals</span>
            <span>·</span>
            <span>Safe simulated language exchange demo</span>
          </div>
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fictional demo buddies · No real external accounts or network calls required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
