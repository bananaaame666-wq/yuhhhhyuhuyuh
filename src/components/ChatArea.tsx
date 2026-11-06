import React, { useState, useRef, useEffect } from 'react';
import { Buddy, ChatMessage } from '../types';
import { CONVERSATION_STARTERS, CONVERSATION_STARTERS_BY_BUDDY } from '../data/seedData';
import {
  SpeechListener,
  speakText,
  stopSpeaking,
  isSpeechRecognitionSupported,
} from '../utils/speech';
import {
  Send,
  Globe,
  Sparkles,
  Shuffle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Info,
  Radio,
  X,
  Volume1,
} from 'lucide-react';

interface ChatAreaProps {
  currentBuddy: Buddy;
  messages: ChatMessage[];
  onSendMessage: (userText: string, isVoice?: boolean) => void;
  isBuddyTyping: boolean;
  starterIndex: number;
  onCycleStarter: () => void;
  autoSpeakReplies?: boolean;
  onToggleAutoSpeak?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentBuddy,
  messages,
  onSendMessage,
  isBuddyTyping,
  starterIndex,
  onCycleStarter,
  autoSpeakReplies = true,
  onToggleAutoSpeak,
}) => {
  const [inputText, setInputText] = useState('');
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechListenerRef = useRef<SpeechListener | null>(null);

  const availableStarters = CONVERSATION_STARTERS_BY_BUDDY[currentBuddy.id] || CONVERSATION_STARTERS;
  const currentStarter = availableStarters[starterIndex % availableStarters.length];

  // Initialize Speech Listener tailored to buddy's language
  useEffect(() => {
    const langCode =
      currentBuddy.id === 'jun'
        ? 'zh-CN'
        : currentBuddy.id === 'minho'
        ? 'ko-KR'
        : 'es-MX';
    speechListenerRef.current = new SpeechListener(langCode);
    return () => {
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, [currentBuddy.id]);

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBuddyTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = (inputText + (interimTranscript ? ` ${interimTranscript}` : '')).trim();
    if (!trimmed) return;

    if (isListeningMic) {
      speechListenerRef.current?.stop();
      setIsListeningMic(false);
    }

    onSendMessage(trimmed, !!interimTranscript);
    setInputText('');
    setInterimTranscript('');
  };

  const handleUseStarter = (starterText: string) => {
    setInputText(starterText);
    setInterimTranscript('');
    inputRef.current?.focus();
  };

  const toggleTranslation = (messageId: string) => {
    setExpandedTranslations((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const isTranslationVisible = (id: string) => {
    if (showAllTranslations) return true;
    return !!expandedTranslations[id];
  };

  // Play audio pronunciation for a message
  const handlePlayMessageAudio = (msg: ChatMessage) => {
    stopSpeaking();
    if (playingMessageId === msg.id) {
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(msg.id);
    const lang = msg.language === 'es' ? 'es-ES' : 'en-US';
    speakText(
      msg.text,
      lang,
      () => setPlayingMessageId(msg.id),
      () => setPlayingMessageId(null)
    );
  };

  // Microphone toggle
  const handleToggleMic = () => {
    if (isListeningMic) {
      speechListenerRef.current?.stop();
      setIsListeningMic(false);
      return;
    }

    const listener = speechListenerRef.current || new SpeechListener('es-MX');
    speechListenerRef.current = listener;

    const started = listener.start({
      onStart: () => {
        setIsListeningMic(true);
        setInterimTranscript('');
      },
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onResult: (finalText) => {
        setInputText((prev) => {
          const base = prev.trim();
          return base ? `${base} ${finalText}` : finalText;
        });
        setInterimTranscript('');
        setIsListeningMic(false);
      },
      onError: () => {
        setIsListeningMic(false);
      },
      onEnd: () => {
        setIsListeningMic(false);
      },
    });

    if (!started) {
      setIsListeningMic(false);
    }
  };

  return (
    <div className="duo-card flex flex-col h-[650px] sm:h-[720px] overflow-hidden p-0">
      {/* Duolingo Chat Header */}
      <div className="px-5 py-3.5 border-b-2 border-[#e5e5e5] bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-b-4 relative shadow-xs ${
              currentBuddy.id === 'jun'
                ? 'bg-[#e7f7ff] border-[#1899d6]'
                : currentBuddy.id === 'minho'
                ? 'bg-[#f3e8ff] border-[#a559d9]'
                : 'bg-[#e5f8d0] border-[#46a302]'
            }`}
          >
            <span>{currentBuddy.avatarEmoji}</span>
            <span className="absolute -bottom-1 -right-1 text-xs">{currentBuddy.flag}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#4b4b4b] text-base">
                Chat with {currentBuddy.name}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#46a302] bg-[#e5f8d0] px-2 py-0.5 rounded-full border border-[#b2e57b]">
                Buddy
              </span>
            </div>
            <p className="text-xs font-bold text-[#afafaf] mt-0.5">
              You write in <span className="text-[#58cc02] font-black">
                {currentBuddy.id === 'jun' ? 'Mandarin' : currentBuddy.id === 'minho' ? 'Korean' : 'Spanish'}
              </span> · {currentBuddy.name} writes in <span className="text-[#1cb0f6] font-black">English</span>
            </p>
          </div>
        </div>

        {/* Global Translation Toggle */}
        <button
          type="button"
          onClick={() => setShowAllTranslations((prev) => !prev)}
          className={`duo-btn-white px-3 py-1.5 text-xs font-extrabold flex items-center gap-1.5 ${
            showAllTranslations ? 'bg-[#e5f8d0] border-[#58cc02] text-[#46a302]' : ''
          }`}
          title="Toggle translation notes for all messages"
        >
          <Globe className="w-4 h-4 text-[#58cc02]" />
          <span className="hidden sm:inline">
            {showAllTranslations ? 'Translations ON' : 'Show Notes'}
          </span>
          <span className="sm:hidden">
            {showAllTranslations ? 'Notes ON' : 'Notes'}
          </span>
        </button>
      </div>

      {/* Reciprocal Helper Bar */}
      <div className="px-5 py-2 bg-[#f7f7f7] border-b-2 border-[#e5e5e5] text-xs font-bold text-[#777777] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px]">
          <Info className="w-4 h-4 text-[#58cc02] shrink-0" />
          <span>
            <strong>Reciprocal Rule:</strong> Write in your target language to build conversational courage!
          </span>
        </div>
        <span className="text-[11px] font-extrabold text-[#afafaf] hidden sm:inline">
          {messages.length} messages
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-[#f7f7f7]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isVisible = isTranslationVisible(msg.id);
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              {/* Speaker Label & Timestamp */}
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold text-[#afafaf] px-1">
                <span>
                  {isUser ? 'You (Practicing)' : `${currentBuddy.name} (Practicing English)`}
                </span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Duolingo Speech Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed transition-all relative ${
                  isUser
                    ? 'bg-[#58cc02] border-2 border-b-4 border-[#46a302] text-white rounded-tr-xs shadow-xs font-semibold'
                    : 'bg-white border-2 border-b-4 border-[#e5e5e5] text-[#4b4b4b] rounded-tl-xs shadow-xs font-semibold'
                }`}
              >
                {/* Challenge tag if from challenge */}
                {msg.isChallengeResult && (
                  <div className="mb-2 pb-1.5 border-b border-white/30 text-[11px] font-black flex items-center gap-1 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                    <span>{msg.challengeTitle || 'Challenge Completed!'}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <p className="text-[15px] font-bold whitespace-pre-wrap flex-1">
                    {msg.text}
                  </p>

                  {/* Audio Play Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayMessageAudio(msg)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isPlaying
                        ? isUser
                          ? 'bg-white text-[#58cc02] animate-pulse ring-2 ring-white'
                          : 'bg-[#58cc02] text-white animate-pulse'
                        : isUser
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-[#f7f7f7] hover:bg-[#e5e5e5] text-[#777777]'
                    }`}
                    title="Listen to audio pronunciation"
                  >
                    {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Translation Display */}
                {isVisible && (
                  <div
                    className={`mt-3 pt-2.5 text-xs border-t-2 transition-all ${
                      isUser
                        ? 'border-white/20 text-white/90 bg-[#4cae02]/60 -mx-4 -mb-3 px-4 py-2.5 rounded-b-2xl'
                        : 'border-[#f0f0f0] text-[#777777] bg-[#f7f7f7] -mx-4 -mb-3 px-4 py-2.5 rounded-b-2xl'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-[11px] mb-1 opacity-90 uppercase tracking-wide">
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isUser
                          ? 'Polish & Meaning:'
                          : 'Traducción / Meaning:'}
                      </span>
                    </div>
                    <p className="font-medium text-[12px] leading-snug">
                      {msg.translation}
                    </p>
                  </div>
                )}
              </div>

              {/* Translation Toggle Button */}
              <div className="mt-1 flex items-center gap-2 px-1">
                <button
                  type="button"
                  onClick={() => toggleTranslation(msg.id)}
                  className="text-[11px] font-extrabold text-[#afafaf] hover:text-[#58cc02] py-0.5 px-1.5 rounded transition-colors flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>{isVisible ? 'Hide translation' : 'Show translation'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Scripted Buddy Typing Indicator */}
        {isBuddyTyping && (
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#777777] bg-white border-2 border-b-4 border-[#e5e5e5] rounded-2xl px-4 py-3 w-fit shadow-xs animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58cc02] animate-ping" />
            <span>
              {currentBuddy.name} is typing a reply in English...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Conversation Starter Banner */}
      <div className="px-5 py-3 bg-[#fff5e6] border-t-2 border-[#ffd599] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-[#ff9600] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#e58500] block">
              Daily Practice Starter
            </span>
            <p className="text-xs font-extrabold text-[#4b4b4b] truncate">
              {currentStarter}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleUseStarter(currentStarter)}
            className="duo-btn-amber px-3 py-1.5 text-xs font-black"
            title="Copy question into message box"
          >
            Use starter
          </button>
          <button
            type="button"
            onClick={onCycleStarter}
            className="w-8 h-8 rounded-xl bg-white border-2 border-b-4 border-[#ffd599] text-[#ff9600] hover:bg-[#fff9e6] flex items-center justify-center transition-all cursor-pointer"
            title="Show another starter"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Composer Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t-2 border-[#e5e5e5] flex items-center gap-2.5"
      >
        <button
          type="button"
          onClick={handleToggleMic}
          className={`h-12 px-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-4 ${
            isListeningMic
              ? 'bg-[#ff4b4b] hover:bg-[#ea2b2b] text-white border-[#cc1b1b] ring-4 ring-[#ffc2c2] animate-pulse'
              : 'bg-[#e5f8d0] text-[#46a302] border-[#b2e57b] hover:bg-[#d7f5b8]'
          }`}
          title={isListeningMic ? 'Detener micrófono' : 'Hablar con el micrófono'}
        >
          {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#58cc02]" />}
          <span className="hidden sm:inline">
            {isListeningMic ? 'Listening...' : 'Speak'}
          </span>
        </button>

        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText + (interimTranscript ? ` ${interimTranscript}` : '')}
            onChange={(e) => {
              setInputText(e.target.value);
              setInterimTranscript('');
            }}
            placeholder={
              currentBuddy.id === 'jun'
                ? 'Type in Mandarin Chinese (or English/Spanish)...'
                : currentBuddy.id === 'minho'
                ? 'Type in Korean (or English/Spanish)...'
                : 'Type your message in Spanish (or speak above)...'
            }
            className="w-full pl-4 pr-10 py-3 text-sm rounded-2xl border-2 border-b-4 border-[#e5e5e5] focus:outline-none focus:border-[#58cc02] focus:border-b-[#46a302] bg-[#f7f7f7] text-[#4b4b4b] placeholder:text-[#afafaf] font-bold"
          />
          {inputText && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setInputText('');
                setInterimTranscript('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#e5e5e5] hover:bg-[#d4d4d4] text-[#777777] flex items-center justify-center transition-colors cursor-pointer"
              title="Clear input"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={(!inputText.trim() && !interimTranscript.trim()) || isBuddyTyping}
          className="duo-btn-green h-12 px-5 text-xs font-black flex items-center justify-center gap-2"
          title="Send message"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
