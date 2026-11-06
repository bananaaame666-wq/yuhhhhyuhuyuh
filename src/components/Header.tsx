import React from 'react';
import { Flame, CheckCircle2, CircleDot, Zap } from 'lucide-react';
import { StreakState } from '../types';

interface HeaderProps {
  streakState: StreakState;
  onOpenStreakModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ streakState }) => {
  return (
    <header className="border-b-2 border-[#e5e5e5] bg-white sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] flex items-center justify-center text-white shadow-xs">
              {/* Cute Duolingo-inspired friendly sparkle / twin stars mark */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-7 h-7"
                stroke="currentColor"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                <path d="M7.75 7.75l2.83 2.83M13.42 13.42l2.83 2.83M7.75 16.25l2.83-2.83M13.42 10.58l2.83-2.83" />
                <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#58cc02] lowercase font-sans">
                  duo pals
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e5f8d0] text-[#46a302] border border-[#b2e57b]">
                  demo
                </span>
              </div>
              <p className="text-xs font-bold text-[#afafaf] hidden sm:block">
                Reciprocal language buddy exchange
              </p>
            </div>
          </div>

          {/* Center Daily Goal Chip */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#f7f7f7] border-2 border-b-4 border-[#e5e5e5] text-xs font-bold text-[#4b4b4b]">
            {streakState.todayCompleted ? (
              <>
                <div className="w-5 h-5 rounded-full bg-[#58cc02] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="font-extrabold text-[#46a302] uppercase tracking-wide">
                  TODAY’S MINI GOAL: COMPLETED!
                </span>
                <span className="text-[#d4d4d4]">·</span>
                <span className="text-[#777777]">1 conversation safe</span>
              </>
            ) : (
              <>
                <CircleDot className="w-4 h-4 text-[#ff9600] shrink-0 animate-pulse" />
                <span className="font-extrabold text-[#4b4b4b] uppercase tracking-wide">
                  TODAY’S GOAL: 1 CONVERSATION
                </span>
                <span className="text-[#d4d4d4]">·</span>
                <span className="text-[#777777]">Send 1 message or play a challenge</span>
              </>
            )}
          </div>

          {/* Right: Streak & User avatar */}
          <div className="flex items-center gap-3">
            {/* Streak Counter Pill */}
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-sm font-extrabold border-2 border-b-4 transition-all ${
                streakState.todayCompleted
                  ? 'bg-[#fff5e6] text-[#e58500] border-[#ffd599] border-b-[#e58500] shadow-xs'
                  : 'bg-white text-[#afafaf] border-[#e5e5e5] border-b-[#d4d4d4]'
              }`}
              title={
                streakState.todayCompleted
                  ? `${streakState.currentStreak}-day streak active today!`
                  : `${streakState.currentStreak}-day streak. Practice today to reach ${streakState.currentStreak + 1}!`
              }
            >
              <Flame
                className={`w-6 h-6 transition-transform ${
                  streakState.todayCompleted
                    ? 'text-[#ff9600] fill-[#ff9600] scale-110 animate-bounce'
                    : 'text-[#d4d4d4] fill-[#e5e5e5]'
                }`}
              />
              <span className="tabular-nums text-lg font-black text-[#ff9600]">
                {streakState.currentStreak}
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#afafaf]">
                {streakState.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>

            {/* Gems / XP indicator */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white border-2 border-b-4 border-[#e5e5e5] text-xs font-black text-[#1cb0f6]">
              <Zap className="w-4 h-4 fill-[#1cb0f6]" />
              <span className="tabular-nums font-extrabold">240 XP</span>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l-2 border-[#e5e5e5]">
              <div className="w-10 h-10 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white flex items-center justify-center font-black text-sm shadow-xs">
                <span>Tú</span>
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-extrabold text-[#4b4b4b]">You</div>
                <div className="text-[#afafaf] font-bold text-[11px]">Practicing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Daily Goal Bar */}
        <div className="mt-2.5 pt-2 border-t border-[#f0f0f0] flex md:hidden items-center justify-between text-xs">
          <span className="font-extrabold text-[#4b4b4b] flex items-center gap-1.5">
            {streakState.todayCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#58cc02]" />
                <span className="text-[#46a302]">Goal: Conversation logged!</span>
              </>
            ) : (
              <>
                <CircleDot className="w-3.5 h-3.5 text-[#ff9600]" />
                <span>Today’s goal: 1 real conversation</span>
              </>
            )}
          </span>
          <span className="text-[#afafaf] font-bold text-[11px]">
            {streakState.todayCompleted ? 'Streak safe 🔥' : 'Extend streak to 5'}
          </span>
        </div>
      </div>
    </header>
  );
};
