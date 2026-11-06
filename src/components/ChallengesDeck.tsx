import React from 'react';
import { ChallengeType } from '../types';
import { Theater, Key, Dices, ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';

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
      xp: '+15 XP',
      subtitle: 'Telenovela Voice Acting',
      description: 'Act out three dramatic beats in Spanish with passion. Speak your lines out loud!',
      borderColor: 'border-[#d896ff] border-b-[#a559d9]',
      bgColor: 'hover:bg-[#faf5ff]',
      btnClass: 'duo-btn-purple',
    },
    {
      type: 'escape' as ChallengeType,
      id: 'escape',
      title: 'No-English Escape Room',
      emoji: '🗝️',
      xp: '+20 XP',
      subtitle: 'Secret Library Mystery',
      description: 'Decipher Spanish clues without translations to unlock ancient chamber doors.',
      borderColor: 'border-[#ffd599] border-b-[#e58500]',
      bgColor: 'hover:bg-[#fffbf5]',
      btnClass: 'duo-btn-amber',
    },
    {
      type: 'improv' as ChallengeType,
      id: 'improv',
      title: 'Improv Portal',
      emoji: '🎲',
      xp: '+15 XP',
      subtitle: 'Spanish On Your Feet',
      description: 'Think fast and speak/type authentic Spanish reactions to absurd real-time scenarios!',
      borderColor: 'border-[#b2e57b] border-b-[#46a302]',
      bgColor: 'hover:bg-[#f6fdf0]',
      btnClass: 'duo-btn-green',
    },
  ];

  return (
    <div className="duo-card p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#58cc02] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h3 className="font-black text-[#4b4b4b] text-base">
              Conversation Challenges
            </h3>
            <span className="text-[11px] font-bold text-[#afafaf]">
              Earn streak shields & XP
            </span>
          </div>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f7f7f7] border-2 border-[#e5e5e5] text-[#afafaf]">
          3 Quests
        </span>
      </div>

      <div className="space-y-3">
        {challenges.map((c) => {
          const isDone = completedChallenges.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => onOpenChallenge(c.type)}
              className={`p-4 rounded-2xl border-2 border-b-4 transition-all cursor-pointer bg-white group ${c.borderColor} ${c.bgColor}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f7f7f7] border-2 border-[#e5e5e5] flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <span>{c.emoji}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm text-[#4b4b4b] group-hover:text-[#58cc02] transition-colors">
                        {c.title}
                      </h4>
                      <span className="text-[10px] font-black uppercase text-[#1cb0f6] bg-[#e7f7ff] px-2 py-0.5 rounded-full border border-[#b8e7ff] flex items-center gap-0.5">
                        <Zap className="w-3 h-3 fill-[#1cb0f6]" />
                        <span>{c.xp}</span>
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#46a302] bg-[#e5f8d0] px-2 py-0.5 rounded-full border border-[#b2e57b]">
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          <span>DONE</span>
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] font-extrabold text-[#777777] mt-0.5">
                      {c.subtitle}
                    </span>
                    <p className="text-xs font-semibold text-[#afafaf] mt-1 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-2xl bg-[#f7f7f7] border-2 border-b-4 border-[#e5e5e5] group-hover:border-[#58cc02] group-hover:text-[#58cc02] text-[#afafaf] flex items-center justify-center transition-all"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
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
