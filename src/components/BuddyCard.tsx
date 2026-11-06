import React, { useState } from 'react';
import { Buddy } from '../types';
import { BUDDY_PROFILES } from '../data/seedData';
import { Users, ArrowLeftRight, CheckCircle, MapPin, Sparkles, X } from 'lucide-react';

interface BuddyCardProps {
  currentBuddy: Buddy;
  onSelectBuddy: (buddy: Buddy) => void;
}

export const BuddyCard: React.FC<BuddyCardProps> = ({
  currentBuddy,
  onSelectBuddy,
}) => {
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs transition-all">
      {/* Simulation Banner Notice */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-stone-100 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SIMULATED DEMO PARTNER</span>
        </div>
        <span className="text-[11px] text-stone-500">
          Scripted reciprocal demo
        </span>
      </div>

      {/* Buddy Profile Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border shadow-inner ${currentBuddy.avatarBg}`}
          >
            <span>{currentBuddy.avatarEmoji}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900">
                {currentBuddy.name}
              </h3>
              <span className="text-stone-400">·</span>
              <span className="text-xs font-medium text-stone-600">
                {currentBuddy.age} yrs
              </span>
              <span title={currentBuddy.country} className="text-sm">
                {currentBuddy.flag}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>
                {currentBuddy.city}, {currentBuddy.country}
              </span>
            </div>
          </div>
        </div>

        {/* Switch Buddy Button */}
        <button
          onClick={() => setShowSwitchModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
          title="Switch to another demo buddy"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Switch Buddy</span>
        </button>
      </div>

      {/* Reciprocal Exchange Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
        <div className="flex items-center justify-between text-xs font-medium text-stone-600 mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">
              GOOD MATCH
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            Reciprocal Exchange
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-white border border-stone-200 shadow-2xs">
            <span className="block text-[10px] uppercase font-bold text-stone-400">
              You Practice
            </span>
            <span className="font-bold text-stone-900 text-sm">
              Español (Spanish)
            </span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-stone-200 shadow-2xs">
            <span className="block text-[10px] uppercase font-bold text-stone-400">
              {currentBuddy.name} Practices
            </span>
            <span className="font-bold text-stone-900 text-sm">
              English
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-stone-600 text-center px-1">
          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <p className="text-[11px] leading-tight">
            You write in Spanish · {currentBuddy.name} responds in English so both build fluency together!
          </p>
        </div>
      </div>

      {/* Bio & Interests */}
      <div className="mt-3.5 text-xs space-y-2">
        <p className="text-stone-600 leading-relaxed italic">
          “{currentBuddy.bio}”
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentBuddy.interests.map((interest) => (
            <span
              key={interest}
              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
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
            className="bg-white w-full max-w-md rounded-2xl border border-stone-200 p-5 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  Switch Demo Buddy
                </h4>
                <p className="text-xs text-stone-500">
                  Choose a fictional partner to practice reciprocal exchange.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSwitchModal(false);
                }}
                className="w-10 h-10 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close modal (Esc)"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {BUDDY_PROFILES.map((buddy) => {
                const isSelected = buddy.id === currentBuddy.id;
                return (
                  <div
                    key={buddy.id}
                    onClick={() => {
                      onSelectBuddy(buddy);
                      setShowSwitchModal(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${buddy.avatarBg}`}
                      >
                        <span>{buddy.avatarEmoji}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 text-sm">
                            {buddy.name}
                          </span>
                          <span className="text-xs text-stone-500">
                            ({buddy.age})
                          </span>
                          <span className="text-xs">{buddy.flag}</span>
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {buddy.city}, {buddy.country}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-1 mt-0.5">
                          {buddy.interests.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-lg shadow-2xs">
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
                onClick={() => setShowSwitchModal(false)}
                className="w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl"
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
