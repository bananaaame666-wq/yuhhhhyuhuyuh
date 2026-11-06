import React from 'react';
import { ChallengeType } from '../types';
import { Theater, Key, Dices, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ChallengesDeckProps {
  onOpenChallenge: (type: ChallengeType) => void;
  completedChallenges: string[];
}

export const ChallengesDeck: React.FC<ChallengesDeckProps> = ({
  onOpenChallenge,
  completedChallenges,
}) => {
  const challenges = [
    {
      type: 'drama' as ChallengeType,
      id: 'drama',
      title: 'Drama Replay',
      emoji: '🎭',
      subtitle: '3-Beat Telenovela Roleplay',
      description: 'Navigate a dramatic reunion, an unexpected mystery, and a happy resolution in authentic Spanish.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Theater,
      accentBorder: 'hover:border-purple-300',
    },
    {
      type: 'escape' as ChallengeType,
      id: 'escape',
      title: 'No-English Escape Room',
      emoji: '🗝️',
      subtitle: '3-Clue Secret Library Puzzle',
      description: 'Decipher Spanish clues to locate hidden keys, turn stone owls, and punch in the exit passcode.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Key,
      accentBorder: 'hover:border-amber-300',
    },
    {
      type: 'improv' as ChallengeType,
      id: 'improv',
      title: 'Improv Portal',
      emoji: '🎲',
      subtitle: 'Free-Form Spanish Scenarios',
      description: 'Respond on your feet to absurd prompts: neon green TV cakes, backpack dragons, or talking pets!',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Dices,
      accentBorder: 'hover:border-emerald-300',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-stone-900 text-base">
            Conversation Challenges
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-stone-500">
          Counts toward daily streak
        </span>
      </div>
      <p className="text-xs text-stone-500 mb-4 leading-relaxed">
        Low-pressure interactive missions. Complete any challenge to keep your streak burning and share the achievement with your buddy!
      </p>

      <div className="space-y-3">
        {challenges.map((c) => {
          const isDone = completedChallenges.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => onOpenChallenge(c.type)}
              className={`p-3.5 rounded-xl border border-stone-200 transition-all cursor-pointer bg-stone-50/50 hover:bg-white hover:shadow-xs group ${c.accentBorder}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-xl shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                    <span>{c.emoji}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {c.title}
                      </h4>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] font-medium text-stone-500 mt-0.5">
                      {c.subtitle}
                    </span>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <button className="p-2 rounded-lg text-stone-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
