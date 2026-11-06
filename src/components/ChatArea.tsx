import React, { useState, useRef, useEffect } from 'react';
import { Buddy, ChatMessage } from '../types';
import { CONVERSATION_STARTERS } from '../data/seedData';
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
} from 'lucide-react';

interface ChatAreaProps {
  currentBuddy: Buddy;
  messages: ChatMessage[];
  onSendMessage: (userText: string, isVoice?: boolean) => void;
  isBuddyTyping: boolean;
  starterIndex: number;
  onCycleStarter: () => void;
  autoSpeakReplies: boolean;
  onToggleAutoSpeak: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentBuddy,
  messages,
  onSendMessage,
  isBuddyTyping,
  starterIndex,
  onCycleStarter,
  autoSpeakReplies,
  onToggleAutoSpeak,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});
  const [showAllTranslations, setShowAllTranslations] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechListenerRef = useRef<SpeechListener | null>(null);

  const currentStarter = CONVERSATION_STARTERS[starterIndex % CONVERSATION_STARTERS.length];

  // Initialize Speech Listener for Spanish chat input
  useEffect(() => {
    speechListenerRef.current = new SpeechListener('es-MX');
    return () => {
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBuddyTyping]);

  // If autoSpeakReplies is enabled and buddy sends a new message, speak it aloud!
  useEffect(() => {
    if (!autoSpeakReplies || messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'buddy') {
      speakText(lastMsg.text, 'en-US');
    }
  }, [messages.length, autoSpeakReplies]);

  // Handle Voice Input Toggle
  const handleToggleVoiceInput = () => {
    setMicNotice(null);

    if (isListeningMic) {
      speechListenerRef.current?.stop();
      setIsListeningMic(false);
      if (interimTranscript) {
        setInputText((prev) => (prev ? `${prev} ${interimTranscript}` : interimTranscript));
        setInterimTranscript('');
      }
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setMicNotice('Speech recognition is not supported in this browser. You can type in Spanish.');
      return;
    }

    const listener = speechListenerRef.current;
    if (!listener) return;

    const started = listener.start({
      onStart: () => {
        setIsListeningMic(true);
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
      },
      onError: (err) => {
        setIsListeningMic(false);
        setMicNotice(`Mic error: ${err}`);
      },
      onEnd: () => {
        setIsListeningMic(false);
      },
    });

    if (!started) {
      setIsListeningMic(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isListeningMic) {
      speechListenerRef.current?.stop();
      setIsListeningMic(false);
    }

    const fullText = (inputText + (interimTranscript ? ` ${interimTranscript}` : '')).trim();
    if (!fullText) return;

    onSendMessage(fullText, isListeningMic);
    setInputText('');
    setInterimTranscript('');
  };

  const handleUseStarter = (starterText: string) => {
    setInputText(starterText);
    inputRef.current?.focus();
  };

  // Play audio for any individual message
  const handlePlayMessageAudio = (msg: ChatMessage) => {
    if (playingMessageId === msg.id) {
      stopSpeaking();
      setPlayingMessageId(null);
      return;
    }

    stopSpeaking();
    setPlayingMessageId(msg.id);

    const lang = msg.language === 'es' ? 'es-MX' : 'en-US';
    speakText(
      msg.text,
      lang,
      () => setPlayingMessageId(msg.id),
      () => setPlayingMessageId(null)
    );
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

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col h-[650px] sm:h-[700px] overflow-hidden">
      {/* Chat Top Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${currentBuddy.avatarBg}`}
          >
            <span>{currentBuddy.avatarEmoji}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900 text-sm">
                Chat with {currentBuddy.name}
              </span>
              <span className="text-xs">{currentBuddy.flag}</span>
              <span className="text-[11px] text-stone-400">·</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                Demo Buddy
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              You speak/write in <span className="font-semibold text-stone-700">Español</span> · {currentBuddy.name} replies in <span className="font-semibold text-stone-700">English</span>
            </p>
          </div>
        </div>

        {/* Audio auto-speak & Translation Toggles */}
        <div className="flex items-center gap-2">
          {/* Auto Speak Toggle */}
          <button
            type="button"
            onClick={onToggleAutoSpeak}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              autoSpeakReplies
                ? 'bg-purple-50 text-purple-800 border-purple-300'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            }`}
            title="Automatically speak partner replies out loud"
          >
            {autoSpeakReplies ? (
              <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="hidden sm:inline">
              {autoSpeakReplies ? 'Auto Voice: ON' : 'Auto Voice: OFF'}
            </span>
          </button>

          {/* Global Translation Toggle */}
          <button
            onClick={() => setShowAllTranslations((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showAllTranslations
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="Toggle English and Spanish translation notes for all messages"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">
              {showAllTranslations ? 'Translations: ON' : 'Translations: Tap'}
            </span>
            <span className="sm:hidden">
              {showAllTranslations ? 'Notes ON' : 'Notes'}
            </span>
          </button>
        </div>
      </div>

      {/* Reciprocal Helper Bar */}
      <div className="px-4 py-1.5 bg-emerald-50/60 border-b border-emerald-100/60 text-xs text-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            <strong>Verbal Practice:</strong> Tap the microphone or 🔊 speaker buttons to practice and hear conversational cadence!
          </span>
        </div>
        <span className="text-[10px] text-emerald-700/80 hidden sm:inline">
          {messages.length} messages
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-stone-50/30">
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
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-stone-400 px-1">
                <span className="font-semibold text-stone-600">
                  {isUser ? 'You (Practicing Spanish)' : `${currentBuddy.name} (Practicing English)`}
                </span>
                <span>·</span>
                <span>{msg.timestamp}</span>
                {msg.isSpokenVoice && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    🎙️ Spoken
                  </span>
                )}
              </div>

              {/* Speech Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed transition-all ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-stone-900 border border-stone-200/90 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Challenge tag if this message came from a challenge */}
                {msg.isChallengeResult && (
                  <div className="mb-2 pb-1.5 border-b border-white/20 text-[11px] font-bold flex items-center gap-1 text-emerald-100">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{msg.challengeTitle || 'Conversation Challenge Completed'}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] sm:text-[15px] font-medium whitespace-pre-wrap flex-1">
                    {msg.text}
                  </p>

                  {/* Audio Play Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayMessageAudio(msg)}
                    className={`p-1.5 rounded-lg shrink-0 transition-all cursor-pointer ${
                      isPlaying
                        ? isUser
                          ? 'bg-emerald-700 text-white animate-bounce'
                          : 'bg-purple-100 text-purple-700 animate-bounce'
                        : isUser
                        ? 'text-emerald-100 hover:bg-emerald-700/60'
                        : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                    }`}
                    title={isPlaying ? 'Stop audio' : 'Listen to native pronunciation out loud'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Translation Display */}
                {isVisible && (
                  <div
                    className={`mt-2.5 pt-2 text-xs border-t transition-all ${
                      isUser
                        ? 'border-emerald-500/50 text-emerald-50 bg-emerald-700/40 -mx-3 -mb-2 px-3 py-2 rounded-b-xl'
                        : 'border-stone-100 text-stone-600 bg-stone-50 -mx-3 -mb-2 px-3 py-2 rounded-b-xl'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-semibold text-[11px] mb-1 opacity-90">
                      <Globe className="w-3 h-3 shrink-0" />
                      <span>
                        {isUser
                          ? 'Demo polish & meaning:'
                          : 'Traducción al español:'}
                      </span>
                    </div>
                    <p className="italic text-[12px] leading-snug">
                      {msg.translation}
                    </p>
                  </div>
                )}
              </div>

              {/* Translation & Pronounce Action Bar */}
              <div className="mt-1 flex items-center gap-2 px-1">
                <button
                  onClick={() => toggleTranslation(msg.id)}
                  className={`text-[11px] font-semibold flex items-center gap-1 py-0.5 px-1.5 rounded transition-colors cursor-pointer ${
                    isUser
                      ? 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <Globe className="w-3 h-3 text-emerald-600" />
                  <span>{isVisible ? 'Hide note' : 'Show translation'}</span>
                </button>

                <button
                  onClick={() => handlePlayMessageAudio(msg)}
                  className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-stone-400" />
                  <span>{isPlaying ? 'Detener audio' : 'Pronunciar'}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Scripted Buddy Typing Indicator */}
        {isBuddyTyping && (
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-white border border-stone-200/80 rounded-2xl px-3.5 py-2.5 w-fit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-medium">
              {currentBuddy.name} is typing in English...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Conversation Starter Banner */}
      <div className="px-4 py-2.5 bg-amber-50/70 border-t border-amber-200/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Conversation Starter
            </span>
            <p className="text-xs font-semibold text-stone-800 truncate">
              {currentStarter}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleUseStarter(currentStarter)}
            className="px-2.5 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Copy question into message box"
          >
            Use this starter
          </button>
          <button
            onClick={onCycleStarter}
            className="p-1 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
            title="Show another starter"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Voice Recording Status Banner */}
      {isListeningMic && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-xs text-rose-900 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 font-semibold">
            <Radio className="w-4 h-4 text-rose-600" />
            <span>Escuchando tu voz en español... di tu mensaje con naturalidad</span>
          </div>
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className="text-[11px] font-bold text-rose-800 bg-white border border-rose-300 px-2 py-0.5 rounded cursor-pointer"
          >
            Listo / Detener
          </button>
        </div>
      )}

      {micNotice && (
        <div className="px-4 py-1.5 bg-amber-50 text-[11px] text-amber-800 border-t border-amber-200">
          {micNotice}
        </div>
      )}

      {/* Composer Input Bar with Mic & Send */}
      <form
        onSubmit={handleSend}
        className="p-3.5 sm:p-4 bg-white border-t border-stone-200/90 flex items-center gap-2"
      >
        {/* Verbal Voice Input Button */}
        <button
          type="button"
          onClick={handleToggleVoiceInput}
          className={`h-11 px-3 sm:px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isListeningMic
              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 animate-pulse'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
          }`}
          title={isListeningMic ? 'Detener micrófono' : 'Hablar en español con el micrófono'}
        >
          {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
          <span className="hidden sm:inline">
            {isListeningMic ? 'Escuchando...' : 'Hablar'}
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
            placeholder="Escribe o habla en español... (e.g. ¿Qué música te gusta? o Hoy comí tacos)"
            className="w-full pl-3.5 pr-10 py-3 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 font-medium"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => {
                setInputText('');
                setInterimTranscript('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={(!inputText.trim() && !interimTranscript.trim()) || isBuddyTyping}
          className={`h-11 px-4 sm:px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            (inputText.trim() || interimTranscript.trim()) && !isBuddyTyping
              ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-500/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
          title="Send message in Spanish"
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
