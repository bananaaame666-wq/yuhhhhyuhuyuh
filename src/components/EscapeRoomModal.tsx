import React, { useState, useEffect } from 'react';
import { ESCAPE_ROOM_CLUES } from '../data/seedData';
import {
  X,
  Key,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface EscapeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (summaryMessage: string) => void;
}

export const EscapeRoomModal: React.FC<EscapeRoomModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
  } | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentClue = ESCAPE_ROOM_CLUES[currentClueIndex];
  const progressPercent = ((currentClueIndex + (isEscaped ? 1 : 0)) / ESCAPE_ROOM_CLUES.length) * 100;

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    const chosen = currentClue.options.find((o) => o.id === optionId);
    if (!chosen) return;

    setFeedback({
      isCorrect: chosen.isCorrect,
      text: chosen.feedback,
    });
  };

  const handleNextClue = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    setShowHint(false);
    if (currentClueIndex < ESCAPE_ROOM_CLUES.length - 1) {
      setCurrentClueIndex((prev) => prev + 1);
    } else {
      setIsEscaped(true);
    }
  };

  const handleRevealAndAdvance = () => {
    const correct = currentClue.options.find((o) => o.isCorrect);
    if (correct) {
      setSelectedOptionId(correct.id);
      setFeedback({
        isCorrect: true,
        text: `Solution: "${correct.text}" — ${correct.feedback}`,
      });
    }
  };

  const handleFinishEscape = () => {
    onComplete('¡Logré escapar de la biblioteca secreta usando solo español! 🗝️ Descifré las tres pistas sin ayuda de traducción.');
    onClose();
  };

  const handleRestart = () => {
    setCurrentClueIndex(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setShowHint(false);
    setIsEscaped(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-800/80 flex items-center justify-center text-lg">
              <span>🗝️</span>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                No-English Escape Room
              </h3>
              <p className="text-xs text-amber-200/90">
                La Biblioteca Secreta · Decipher the room using Spanish clues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-amber-900 transition-colors"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div
            className="bg-amber-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {!isEscaped ? (
            <>
              {/* Clue Header */}
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>{currentClue.title}</span>
                </div>
                <span className="text-stone-400">
                  Clue {currentClue.id} of {ESCAPE_ROOM_CLUES.length}
                </span>
              </div>

              {/* Spanish Clue Parchment */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300/80 text-amber-950 font-serif leading-relaxed shadow-inner">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Papiro Español Encontrado:
                </span>
                <p className="text-sm font-medium italic">
                  {currentClue.clueSpanish}
                </p>
              </div>

              {/* Hint Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide clue hint' : 'Need a vocabulary hint?'}</span>
                </button>

                {showHint && (
                  <div className="mt-2 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
                    💡 <span className="font-semibold">{currentClue.hint}</span>
                  </div>
                )}
              </div>

              {/* Question & Options */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  {currentClue.question}
                </span>

                {currentClue.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let cardStyle = 'border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/30';

                  if (isSelected) {
                    cardStyle = opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-rose-400 bg-rose-50/80 ring-2 ring-rose-400/20';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${cardStyle}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-stone-900 text-xs sm:text-sm">
                          {opt.text}
                        </p>
                        {isSelected && (
                          <div className="shrink-0">
                            {opt.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-rose-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Block */}
              {feedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="font-bold">
                      {feedback.isCorrect ? '¡Mecanismo activado!' : 'The lock stays shut!'}
                    </p>
                    <p>{feedback.text}</p>
                    {!feedback.isCorrect && (
                      <button
                        type="button"
                        onClick={handleRevealAndAdvance}
                        className="text-[11px] underline font-semibold text-rose-800 hover:text-rose-950 mt-1 cursor-pointer"
                      >
                        Unlock mechanism with correct answer & proceed
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Action */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Give Up For Now
                </button>

                <button
                  onClick={handleNextClue}
                  disabled={!feedback?.isCorrect}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all ${
                    feedback?.isCorrect
                      ? 'bg-amber-700 hover:bg-amber-800 text-white cursor-pointer'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {currentClueIndex < ESCAPE_ROOM_CLUES.length - 1
                      ? 'Next Chamber Clue'
                      : 'Unlock Secret Exit'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Escaped Celebration View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-3xl ring-8 ring-amber-50">
                <span>🗝️</span>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-stone-900">
                  ¡Has Escapado de la Biblioteca Secreta!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                  You read all three Spanish clues, found the blue book under the clock, turned the owl statue, and typed ‘LIBERTAD’ to open the stone doors.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Counts toward today’s conversation streak!</span>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>

                <button
                  onClick={handleFinishEscape}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-amber-700 hover:bg-amber-800 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Share Escape with Buddy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
