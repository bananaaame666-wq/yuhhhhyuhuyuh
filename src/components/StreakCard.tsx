import React from 'react';
import { StreakState } from '../types';
import { getSevenDayCalendar } from '../utils/streak';
import { Flame, Check, Lock, Trophy, Award } from 'lucide-react';

interface StreakCardProps {
  streakState: StreakState;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakState }) => {
  const days = getSevenDayCalendar(
    streakState.history,
    streakState.todayCompleted
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
      {/* Header with Flame & Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              streakState.todayCompleted
                ? 'bg-amber-100 text-amber-600 ring-4 ring-amber-300/30'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            <Flame
              className={`w-6 h-6 transition-all ${
                streakState.todayCompleted
                  ? 'text-amber-500 fill-amber-500 scale-110'
                  : 'text-stone-400 fill-stone-300'
              }`}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-stone-900 tabular-nums">
                {streakState.currentStreak}
              </span>
              <span className="text-sm font-bold text-stone-700">
                Day Streak
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Personal Best: {streakState.bestStreak} days
            </p>
          </div>
        </div>

        {/* Milestone badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-600">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Level 2 Pal</span>
        </div>
      </div>

      {/* 7-Day Calendar Row */}
      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>7-Day Practice Calendar</span>
          <span>{streakState.todayCompleted ? 'Active today ✓' : 'Awaiting today'}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {days.map((day) => {
            return (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all ${
                  day.isToday
                    ? day.isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-500/30 font-bold shadow-xs'
                      : 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-400/20 font-bold'
                    : day.isCompleted
                    ? 'bg-emerald-50 border-emerald-200/90 text-emerald-800'
                    : day.isFuture
                    ? 'bg-stone-50/70 border-stone-100 text-stone-300'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-tight">
                  {day.dayShort}
                </span>

                <div className="my-1 flex items-center justify-center">
                  {day.isCompleted ? (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        day.isToday ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : day.isToday ? (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center text-[10px] text-amber-700 animate-pulse">
                      ●
                    </div>
                  ) : day.isFuture ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-stone-300">
                      <Lock className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-stone-200/80 text-[10px] flex items-center justify-center text-stone-500">
                      —
                    </div>
                  )}
                </div>

                <span className="text-[11px] tabular-nums font-semibold">
                  {day.dayNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Status Callout */}
      <div
        className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed flex items-center gap-2.5 ${
          streakState.todayCompleted
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}
      >
        <div className="shrink-0">
          {streakState.todayCompleted ? (
            <Award className="w-5 h-5 text-emerald-600" />
          ) : (
            <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
          )}
        </div>
        <div>
          {streakState.todayCompleted ? (
            <p>
              <strong className="font-bold">Today’s practice is complete!</strong>{' '}
              You extended your streak to {streakState.currentStreak} days. Keep this rhythm alive tomorrow!
            </p>
          ) : (
            <p>
              <strong className="font-bold">Extend your streak to 5 days!</strong>{' '}
              Send any message to your buddy or complete 1 quick challenge below.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
