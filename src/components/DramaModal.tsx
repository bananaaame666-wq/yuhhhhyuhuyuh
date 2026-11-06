import React, { useState, useEffect } from 'react';
import { DRAMA_BEATS } from '../data/seedData';
import {
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Theater,
} from 'lucide-react';

interface DramaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (summaryMessage: string) => void;
}

export const DramaModal: React.FC<DramaModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
  } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

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

  const currentBeat = DRAMA_BEATS[currentBeatIndex];
  const progressPercent = ((currentBeatIndex + (isFinished ? 1 : 0)) / DRAMA_BEATS.length) * 100;

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    const chosen = currentBeat.options.find((o) => o.id === optionId);
    if (!chosen) return;

    setFeedback({
      isCorrect: chosen.isCorrect,
      text: chosen.explanation,
    });
  };

  const handleNextBeat = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    if (currentBeatIndex < DRAMA_BEATS.length - 1) {
      setCurrentBeatIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRevealAndAdvance = () => {
    // If stuck, reveal the correct option and let them advance cleanly
    const correctOption = currentBeat.options.find((o) => o.isCorrect);
    if (correctOption) {
      setSelectedOptionId(correctOption.id);
      setFeedback({
        isCorrect: true,
        text: `Here is the dramatic line: "${correctOption.textSpanish}" — ${correctOption.explanation}`,
      });
    }
  };

  const handleFinishDrama = () => {
    onComplete('¡Acabo de sobrevivir a una escena dramática de telenovela en Drama Replay! 🎭 Sobreviví los tres actos con final feliz.');
    onClose();
  };

  const handleRestart = () => {
    setCurrentBeatIndex(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setIsFinished(false);
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
        <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-700/80 flex items-center justify-center text-lg">
              <span>🎭</span>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Drama Replay: Telenovela Edition
              </h3>
              <p className="text-xs text-purple-200">
                Choose the line that keeps the dramatic momentum alive!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 transition-colors"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div
            className="bg-purple-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {!isFinished ? (
            <>
              {/* Scene Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-800 uppercase tracking-wider">
                  <span>{currentBeat.sceneTitle}</span>
                  <span className="text-stone-400">
                    Beat {currentBeat.id} of {DRAMA_BEATS.length}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-950 leading-relaxed">
                  <p className="font-medium">{currentBeat.context}</p>
                </div>
              </div>

              {/* Character Prompt */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-sm">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Mateo speaks:
                </span>
                <p className="italic text-stone-800 font-medium">
                  {currentBeat.buddyPrompt}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-700 block">
                  Select your dramatic Spanish response:
                </span>

                {currentBeat.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let cardStyle = 'border-stone-200 bg-white hover:border-purple-300 hover:bg-purple-50/30';

                  if (isSelected) {
                    cardStyle = opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-rose-400 bg-rose-50/70 ring-2 ring-rose-400/20';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${cardStyle}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-stone-900 text-sm">
                            {opt.textSpanish}
                          </p>
                          <p className="text-xs text-stone-500 italic">
                            ({opt.textEnglish})
                          </p>
                        </div>
                        {isSelected && (
                          <div className="shrink-0 mt-0.5">
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
                      {feedback.isCorrect ? '¡Excelente réplica!' : 'Not quite the right tone!'}
                    </p>
                    <p>{feedback.text}</p>
                    {!feedback.isCorrect && (
                      <button
                        type="button"
                        onClick={handleRevealAndAdvance}
                        className="text-[11px] underline font-semibold text-rose-800 hover:text-rose-950 mt-1 cursor-pointer"
                      >
                        Reveal ideal dramatic line & continue
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
                  Cancel
                </button>

                <button
                  onClick={handleNextBeat}
                  disabled={!feedback?.isCorrect}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all ${
                    feedback?.isCorrect
                      ? 'bg-purple-700 hover:bg-purple-800 text-white cursor-pointer'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {currentBeatIndex < DRAMA_BEATS.length - 1
                      ? 'Next Scene Beat'
                      : 'Finish Scene'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Scene Finished View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center text-3xl ring-8 ring-purple-50">
                <span>🏆</span>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-stone-900">
                  ¡Escena Dramática Completada!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                  You navigated all three telenovela beats in Spanish without breaking character. You and Mateo reconciled and secured tickets to Madrid!
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
                  <span>Replay Scene</span>
                </button>

                <button
                  onClick={handleFinishDrama}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Share Result with Buddy</span>
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
