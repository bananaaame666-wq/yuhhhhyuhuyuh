import React from 'react';
import { StreakState } from '../types';
import { getSevenDayCalendar } from '../utils/streak';
import { Flame, Check, Lock, Trophy, Award, Sparkles } from 'lucide-react';

interface StreakCardProps {
  streakState: StreakState;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakState }) => {
  const days = getSevenDayCalendar(
    streakState.history,
    streakState.todayCompleted
  );

  return (
    <div className="duo-card p-5">
      {/* Header with Flame & Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-b-4 transition-all ${
              streakState.todayCompleted
                ? 'bg-[#fff5e6] border-[#ffd599] border-b-[#e58500] shadow-xs'
                : 'bg-[#f7f7f7] border-[#e5e5e5] border-b-[#d4d4d4]'
            }`}
          >
            <Flame
              className={`w-8 h-8 transition-all ${
                streakState.todayCompleted
                  ? 'text-[#ff9600] fill-[#ff9600] scale-115 animate-bounce'
                  : 'text-[#d4d4d4] fill-[#e5e5e5]'
              }`}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight text-[#ff9600] tabular-nums font-sans">
                {streakState.currentStreak}
              </span>
              <span className="text-sm font-black uppercase tracking-wider text-[#4b4b4b]">
                Day Streak!
              </span>
            </div>
            <p className="text-xs font-bold text-[#afafaf]">
              Personal Best: {streakState.bestStreak} days
            </p>
          </div>
        </div>

        {/* Milestone badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#fff9e6] border-2 border-b-4 border-[#ffe082] text-xs font-black text-[#e5a400]">
          <Trophy className="w-4 h-4 fill-[#e5a400]" />
          <span>SUPER PAL</span>
        </div>
      </div>

      {/* 7-Day Calendar Row */}
      <div className="mt-5 pt-4 border-t-2 border-[#f0f0f0]">
        <div className="text-[11px] font-black text-[#afafaf] uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>7-Day Habit Tracker</span>
          <span className="text-[#58cc02] font-black">
            {streakState.todayCompleted ? 'Today completed ✓' : 'Practice needed today'}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {days.map((day) => {
            return (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center py-2.5 px-1 rounded-2xl border-2 transition-all ${
                  day.isToday
                    ? day.isCompleted
                      ? 'bg-[#58cc02] text-white border-[#58cc02] border-b-4 border-b-[#46a302] font-black shadow-xs scale-105'
                      : 'bg-[#fff5e6] border-[#ffd599] border-b-4 border-b-[#e58500] text-[#e58500] font-black'
                    : day.isCompleted
                    ? 'bg-[#e5f8d0] border-[#b2e57b] border-b-4 border-b-[#8ec953] text-[#46a302]'
                    : day.isFuture
                    ? 'bg-[#f7f7f7] border-[#e5e5e5] text-[#d4d4d4]'
                    : 'bg-[#f7f7f7] border-[#e5e5e5] text-[#afafaf]'
                }`}
              >
                <span className="text-[10px] uppercase font-black tracking-tight">
                  {day.dayShort}
                </span>

                <div className="my-1.5 flex items-center justify-center">
                  {day.isCompleted ? (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        day.isToday ? 'bg-white text-[#58cc02]' : 'bg-[#58cc02] text-white'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : day.isToday ? (
                    <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#ff9600] flex items-center justify-center text-xs text-[#ff9600] animate-pulse font-black">
                      ●
                    </div>
                  ) : day.isFuture ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#d4d4d4]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#e5e5e5] text-[10px] flex items-center justify-center text-[#afafaf] font-black">
                      —
                    </div>
                  )}
                </div>

                <span className="text-xs tabular-nums font-black">
                  {day.dayNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Status Callout */}
      <div
        className={`mt-4 p-3.5 rounded-2xl border-2 border-b-4 text-xs leading-relaxed flex items-center gap-3 ${
          streakState.todayCompleted
            ? 'bg-[#e5f8d0] border-[#b2e57b] border-b-[#8ec953] text-[#2e6e00]'
            : 'bg-[#fff5e6] border-[#ffd599] border-b-[#e58500] text-[#8f4700]'
        }`}
      >
        <div className="shrink-0">
          {streakState.todayCompleted ? (
            <div className="w-9 h-9 rounded-xl bg-[#58cc02] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#ff9600] text-white flex items-center justify-center animate-bounce">
              <Flame className="w-5 h-5 fill-white" />
            </div>
          )}
        </div>
        <div>
          {streakState.todayCompleted ? (
            <p className="font-bold">
              <strong className="font-black text-sm block mb-0.5">Today’s streak is safe! 🔥</strong>
              You reached <span className="font-black text-[#58cc02]">{streakState.currentStreak} days</span>. Come back tomorrow to keep the flame alive!
            </p>
          ) : (
            <p className="font-bold">
              <strong className="font-black text-sm block mb-0.5">Extend your streak to 5 days!</strong>
              Send 1 message in Spanish or finish a challenge to lock in today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
