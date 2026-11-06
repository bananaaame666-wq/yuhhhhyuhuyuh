import React from 'react';
import { Flame, CheckCircle2, CircleDot } from 'lucide-react';
import { StreakState } from '../types';

interface HeaderProps {
  streakState: StreakState;
  onOpenStreakModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ streakState }) => {
  return (
    <header className="border-b border-stone-200/90 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
              {/* Original custom geometric sparkle/letter mark */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                <path d="M7.75 7.75l2.83 2.83M13.42 13.42l2.83 2.83M7.75 16.25l2.83-2.83M13.42 10.58l2.83-2.83" />
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-stone-900 lowercase">
                  duo pals
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  demo
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Reciprocal language buddy practice
              </p>
            </div>
          </div>

          {/* Center Daily Goal Chip */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200 text-xs font-medium text-stone-700">
            {streakState.todayCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-700">
                  TODAY’S MINI GOAL: COMPLETED
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-600">Conversation safe for today</span>
              </>
            ) : (
              <>
                <CircleDot className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                <span className="font-semibold text-stone-800">
                  TODAY’S MINI GOAL: 1 REAL CONVERSATION
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500">Send 1 message or finish 1 challenge</span>
              </>
            )}
          </div>

          {/* Right: Streak & User avatar */}
          <div className="flex items-center gap-3">
            {/* Streak Counter Pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
                streakState.todayCompleted
                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title={
                streakState.todayCompleted
                  ? `${streakState.currentStreak}-day streak active today!`
                  : `${streakState.currentStreak}-day streak. Practice today to reach ${streakState.currentStreak + 1}!`
              }
            >
              <Flame
                className={`w-5 h-5 transition-transform ${
                  streakState.todayCompleted
                    ? 'text-amber-500 fill-amber-500 scale-110 animate-bounce'
                    : 'text-stone-400 fill-stone-300'
                }`}
              />
              <span className="tabular-nums text-base">{streakState.currentStreak}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {streakState.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <span>Tú</span>
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-semibold text-stone-800">You</div>
                <div className="text-stone-500">Practicing Spanish</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Daily Goal Bar */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex md:hidden items-center justify-between text-xs">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5">
            {streakState.todayCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Goal Done: 1 Conversation logged!</span>
              </>
            ) : (
              <>
                <CircleDot className="w-3.5 h-3.5 text-amber-500" />
                <span>Today’s mini goal: 1 real conversation</span>
              </>
            )}
          </span>
          <span className="text-stone-500 text-[11px]">
            {streakState.todayCompleted ? 'Streak safe 🔥' : 'Send message or play challenge'}
          </span>
        </div>
      </div>
    </header>
  );
};
