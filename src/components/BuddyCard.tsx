import React, { useState, useEffect } from 'react';
import { Buddy } from '../types';
import { BUDDY_PROFILES } from '../data/seedData';
import { Users, ArrowLeftRight, CheckCircle, MapPin, Sparkles, X, Heart } from 'lucide-react';

interface BuddyCardProps {
  currentBuddy: Buddy;
  onSelectBuddy: (buddy: Buddy) => void;
}

export const BuddyCard: React.FC<BuddyCardProps> = ({
  currentBuddy,
  onSelectBuddy,
}) => {
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  // Close switch modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSwitchModal) {
        setShowSwitchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSwitchModal]);

  return (
    <div className="duo-card p-5">
      {/* Simulation Banner Notice */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b-2 border-[#f0f0f0] text-xs">
        <div className="flex items-center gap-1.5 font-extrabold text-[#46a302]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#58cc02] animate-ping" />
          <span className="uppercase tracking-wide text-[11px]">DEMO LANGUAGE BUDDY</span>
        </div>
        <span className="text-[11px] font-bold text-[#afafaf]">
          Deterministic scripted exchange
        </span>
      </div>

      {/* Buddy Profile Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 border-b-4 shadow-xs relative ${
              currentBuddy.id === 'jun'
                ? 'bg-[#e7f7ff] border-[#1899d6] text-[#1899d6]'
                : currentBuddy.id === 'minho'
                ? 'bg-[#f3e8ff] border-[#a559d9] text-[#a559d9]'
                : 'bg-[#e5f8d0] border-[#46a302] text-[#46a302]'
            }`}
          >
            <span>{currentBuddy.avatarEmoji}</span>
            <span className="absolute -bottom-1 -right-1 text-base">{currentBuddy.flag}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#4b4b4b]">
                {currentBuddy.name}
              </h3>
              <span className="text-[#afafaf] font-bold">·</span>
              <span className="text-xs font-bold text-[#777777]">
                {currentBuddy.age} yrs
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#afafaf] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#afafaf] shrink-0" />
              <span>
                {currentBuddy.city}, {currentBuddy.country}
              </span>
            </div>
          </div>
        </div>

        {/* Switch Buddy Button */}
        <button
          type="button"
          onClick={() => setShowSwitchModal(true)}
          className="duo-btn-white px-3.5 py-1.5 text-xs font-extrabold flex items-center gap-1.5 shrink-0"
          title="Switch to another demo buddy"
        >
          <Users className="w-4 h-4 text-[#1cb0f6]" />
          <span>Switch Pal</span>
        </button>
      </div>

      {/* Reciprocal Exchange Box */}
      <div className="mt-4 p-4 rounded-2xl bg-[#f7f7f7] border-2 border-b-4 border-[#e5e5e5]">
        <div className="flex items-center justify-between text-xs font-bold mb-2.5">
          <div className="flex items-center gap-1.5 text-[#58cc02]">
            <Sparkles className="w-4 h-4 fill-[#58cc02]" />
            <span className="font-black uppercase tracking-wider text-[11px] text-[#46a302]">
              GOOD RECIPROCAL MATCH
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#e5e5e5] text-[#1cb0f6]">
            {currentBuddy.level}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-white border-2 border-b-4 border-[#e5e5e5]">
            <span className="block text-[10px] uppercase font-black tracking-wider text-[#afafaf]">
              You Speak & Practice
            </span>
            <span className="font-extrabold text-[#4b4b4b] text-sm block mt-0.5">
              {currentBuddy.id === 'jun'
                ? 'Mandarin Chinese'
                : currentBuddy.id === 'minho'
                ? 'Korean (한국어)'
                : 'Español (Spanish)'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white border-2 border-b-4 border-[#e5e5e5]">
            <span className="block text-[10px] uppercase font-black tracking-wider text-[#afafaf]">
              {currentBuddy.name} Speaks & Practices
            </span>
            <span className="font-extrabold text-[#4b4b4b] text-sm block mt-0.5">
              English
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#777777] text-center">
          <ArrowLeftRight className="w-4 h-4 text-[#58cc02] shrink-0" />
          <p className="text-[11px] leading-snug">
            Reciprocal Rule: You write in their target language · {currentBuddy.name} replies in English!
          </p>
        </div>
      </div>

      {/* Bio & Interests */}
      <div className="mt-4 text-xs space-y-2.5">
        <p className="text-[#777777] font-semibold leading-relaxed italic bg-white p-2.5 rounded-xl border border-[#f0f0f0]">
          “{currentBuddy.bio}”
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentBuddy.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 rounded-xl bg-[#f7f7f7] border border-[#e5e5e5] text-[#4b4b4b] text-[11px] font-extrabold"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Switch Buddy Modal */}
      {showSwitchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setShowSwitchModal(false)}
        >
          <div
            className="duo-card w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#f0f0f0]">
              <div>
                <h4 className="text-lg font-black text-[#4b4b4b]">
                  Choose Your Demo Buddy
                </h4>
                <p className="text-xs font-bold text-[#afafaf]">
                  Practice with Camila (Mexico), Jun (China), or Minho (Korea).
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSwitchModal(false);
                }}
                className="w-10 h-10 rounded-xl text-[#afafaf] hover:text-[#4b4b4b] hover:bg-[#f7f7f7] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close modal (Esc)"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {BUDDY_PROFILES.map((buddy) => {
                const isSelected = buddy.id === currentBuddy.id;
                return (
                  <div
                    key={buddy.id}
                    onClick={() => {
                      onSelectBuddy(buddy);
                      setShowSwitchModal(false);
                    }}
                    className={`p-4 rounded-2xl border-2 border-b-4 text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#e5f8d0] border-[#58cc02] border-b-[#46a302]'
                        : 'bg-white border-[#e5e5e5] hover:bg-[#f7f7f7]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 shadow-xs ${
                          buddy.id === 'jun'
                            ? 'bg-[#e7f7ff] border-[#1899d6]'
                            : buddy.id === 'minho'
                            ? 'bg-[#f3e8ff] border-[#a559d9]'
                            : 'bg-[#e5f8d0] border-[#46a302]'
                        }`}
                      >
                        <span>{buddy.avatarEmoji}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#4b4b4b] text-base">
                            {buddy.name}
                          </span>
                          <span className="text-xs font-bold text-[#afafaf]">
                            ({buddy.age})
                          </span>
                          <span className="text-base">{buddy.flag}</span>
                        </div>
                        <div className="text-xs font-bold text-[#777777] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#afafaf]" />
                          <span>
                            {buddy.city}, {buddy.country}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-[#afafaf] line-clamp-1 mt-1">
                          {buddy.interests.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-[#46a302] bg-[#d7f5b8] px-3 py-1.5 rounded-xl border border-[#b2e57b]">
                          <CheckCircle className="w-4 h-4 stroke-[3]" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <button className="duo-btn-white px-3.5 py-1 text-xs font-extrabold uppercase">
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowSwitchModal(false)}
                className="duo-btn-white w-full py-2.5 text-xs font-extrabold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
