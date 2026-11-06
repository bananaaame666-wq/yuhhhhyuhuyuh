import { StreakState } from '../types';

const STORAGE_KEY = 'duo_pals_streak_v1';

export function getLocalDateString(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return getLocalDateString(0);
}

export function getYesterdayDateString(): string {
  return getLocalDateString(-1);
}

export function getInitialSeededStreak(): StreakState {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Seed with 4 days completed up to yesterday
  const history: string[] = [
    getLocalDateString(-4),
    getLocalDateString(-3),
    getLocalDateString(-2),
    yesterday,
  ];

  return {
    currentStreak: 4,
    bestStreak: 4,
    lastActivityDate: yesterday,
    history,
    todayCompleted: false,
  };
}

export function loadStreakState(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = getInitialSeededStreak();
      saveStreakState(seeded);
      return seeded;
    }
    const parsed: StreakState = JSON.parse(raw);
    const today = getTodayDateString();
    
    // Check if today was already completed
    parsed.todayCompleted = parsed.lastActivityDate === today;
    return parsed;
  } catch (err) {
    console.warn('LocalStorage error or unavailable, using seeded streak state:', err);
    return getInitialSeededStreak();
  }
}

export function saveStreakState(state: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save streak state to localStorage:', err);
  }
}

export interface ActivityResult {
  newState: StreakState;
  didIncrement: boolean;
  message: string;
}

export function recordQualifyingActivity(currentState: StreakState): ActivityResult {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // If already done today, do not increment again
  if (currentState.lastActivityDate === today) {
    return {
      newState: {
        ...currentState,
        todayCompleted: true,
      },
      didIncrement: false,
      message: 'Great practice! You have already kept your streak safe today.',
    };
  }

  let nextStreak = 1;
  if (currentState.lastActivityDate === yesterday) {
    // Continuous streak!
    nextStreak = currentState.currentStreak + 1;
  } else {
    // Streak restarted after a lapse
    nextStreak = 1;
  }

  const updatedHistory = Array.from(new Set([...currentState.history, today]));
  const updatedBest = Math.max(currentState.bestStreak, nextStreak);

  const updatedState: StreakState = {
    currentStreak: nextStreak,
    bestStreak: updatedBest,
    lastActivityDate: today,
    history: updatedHistory,
    todayCompleted: true,
  };

  saveStreakState(updatedState);

  return {
    newState: updatedState,
    didIncrement: true,
    message: `Streak increased to ${nextStreak} day${nextStreak === 1 ? '' : 's'}! 🔥`,
  };
}

export interface DayDisplay {
  dateStr: string;
  dayShort: string;
  dayNumber: number;
  isToday: boolean;
  isCompleted: boolean;
  isFuture: boolean;
}

export function getSevenDayCalendar(history: string[], todayCompleted: boolean): DayDisplay[] {
  const today = getTodayDateString();
  const days: DayDisplay[] = [];

  // Display a 7-day window: 4 days before today, today, and 2 days ahead
  for (let offset = -4; offset <= 2; offset++) {
    const d = new Date();
    d.setDate(d.getDate() + offset);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();

    const isToday = offset === 0;
    const isFuture = offset > 0;
    const isCompleted = isToday ? todayCompleted : (!isFuture && history.includes(dateStr));

    days.push({
      dateStr,
      dayShort,
      dayNumber,
      isToday,
      isCompleted,
      isFuture,
    });
  }

  return days;
}
