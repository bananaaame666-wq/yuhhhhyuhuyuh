import React, { useState, useRef, useEffect } from 'react';
import { Buddy, ChatMessage } from '../types';
import { CONVERSATION_STARTERS, generateScriptedBuddyReply } from '../data/seedData';
import {
  Send,
  Globe,
  Sparkles,
  Shuffle,
  Volume2,
  CheckCheck,
  ChevronDown,
  Info,
} from 'lucide-react';

interface ChatAreaProps {
  currentBuddy: Buddy;
  messages: ChatMessage[];
  onSendMessage: (userText: string) => void;
  isBuddyTyping: boolean;
  starterIndex: number;
  onCycleStarter: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentBuddy,
  messages,
  onSendMessage,
  isBuddyTyping,
  starterIndex,
  onCycleStarter,
}) => {
  const [inputText, setInputText] = useState('');
  const [expandedTranslations, setExpandedTranslations] = useState<Record<string, boolean>>({});
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStarter = CONVERSATION_STARTERS[starterIndex % CONVERSATION_STARTERS.length];

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBuddyTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInputText('');
  };

  const handleUseStarter = (starterText: string) => {
    setInputText(starterText);
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
              You write in <span className="font-semibold text-stone-700">Español</span> · {currentBuddy.name} replies in <span className="font-semibold text-stone-700">English</span>
            </p>
          </div>
        </div>

        {/* Global Translation Toggle */}
        <button
          onClick={() => setShowAllTranslations((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            showAllTranslations
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
          title="Toggle English and Spanish translation notes for all messages"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">
            {showAllTranslations ? 'Translations: ON' : 'Translations: Tap to show'}
          </span>
          <span className="sm:hidden">
            {showAllTranslations ? 'Notes ON' : 'Notes'}
          </span>
        </button>
      </div>

      {/* Reciprocal Helper Bar */}
      <div className="px-4 py-1.5 bg-emerald-50/60 border-b border-emerald-100/60 text-xs text-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            <strong>Reciprocal Rule:</strong> Write your replies in Spanish to practice your target language!
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

                <p className="text-[14px] sm:text-[15px] font-medium whitespace-pre-wrap">
                  {msg.text}
                </p>

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

              {/* Translation Toggle Button */}
              <div className="mt-1 flex items-center gap-2 px-1">
                <button
                  onClick={() => toggleTranslation(msg.id)}
                  className={`text-[11px] font-semibold flex items-center gap-1 py-0.5 px-1.5 rounded transition-colors ${
                    isUser
                      ? 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <Globe className="w-3 h-3 text-emerald-600" />
                  <span>{isVisible ? 'Hide note' : 'Show translation'}</span>
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
            className="px-2.5 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors"
            title="Copy question into message box"
          >
            Use this starter
          </button>
          <button
            onClick={onCycleStarter}
            className="p-1 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
            title="Show another starter"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Composer Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3.5 sm:p-4 bg-white border-t border-stone-200/90 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe en español... (e.g. ¿Qué música te gusta? o Hoy comí tacos)"
            className="w-full pl-3.5 pr-10 py-3 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 font-medium"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isBuddyTyping}
          className={`h-11 px-4 sm:px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            inputText.trim() && !isBuddyTyping
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
