import React, { useState, useEffect } from 'react';
import { IMPROV_SCENARIOS } from '../data/seedData';
import {
  X,
  Dices,
  Sparkles,
  Shuffle,
  Send,
  ArrowRight,
  Volume2,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';

interface ImprovModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (userImprovResponse: string, scenarioTitle: string) => void;
}

export const ImprovModal: React.FC<ImprovModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedText, setSubmittedText] = useState('');

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

  const currentScenario = IMPROV_SCENARIOS[scenarioIndex % IMPROV_SCENARIOS.length];

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const handleShuffle = () => {
    setScenarioIndex((prev) => (prev + 1) % IMPROV_SCENARIOS.length);
    setInputText('');
    setValidationError(null);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordCount < 3) {
      setValidationError(
        '¡Casi listo! Please type at least 3 Spanish words so your scene partner understands your reaction.'
      );
      return;
    }

    setValidationError(null);
    setSubmittedText(inputText.trim());
    setIsSubmitted(true);
    onComplete(inputText.trim(), currentScenario.title);
  };

  const handleInsertWord = (phrase: string) => {
    setInputText((prev) => {
      if (!prev) return phrase;
      return `${prev} ${phrase}`;
    });
    setValidationError(null);
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
        <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-lg">
              <span>🎲</span>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Improv Portal: Spanish On Your Feet
              </h3>
              <p className="text-xs text-emerald-100">
                Type any Spanish response (3+ words) to absurd real-time scenarios!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {!isSubmitted ? (
            <>
              {/* Scenario Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentScenario.emoji}</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {currentScenario.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white border border-stone-200 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Try Another Scene</span>
                  </button>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {currentScenario.situationSpanish}
                </p>
                <p className="text-[11px] text-stone-500 italic">
                  ({currentScenario.situationEnglish})
                </p>

                {/* Character speaking prompt */}
                <div className="mt-3 pt-3 border-t border-stone-200/80 bg-white p-3 rounded-lg border">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                    {currentScenario.promptSpeaker} pregunta:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 italic">
                    {currentScenario.promptQuestion}
                  </p>
                </div>
              </div>

              {/* Vocabulary helpers */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700 block">
                  Quick Spanish Idea Blocks (tap to insert):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentScenario.helpfulWords.map((word) => (
                    <button
                      key={word.es}
                      type="button"
                      onClick={() => handleInsertWord(word.es)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ {word.es}</span>
                      <span className="text-[10px] text-emerald-600">({word.en})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Free-form Input Area */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-bold text-stone-800">
                      Your Spanish Improv Line:
                    </label>
                    <span
                      className={`font-semibold tabular-nums ${
                        wordCount >= 3 ? 'text-emerald-600' : 'text-stone-400'
                      }`}
                    >
                      {wordCount} {wordCount === 1 ? 'word' : 'words'} (min. 3)
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (validationError && e.target.value.trim().split(/\s+/).length >= 3) {
                        setValidationError(null);
                      }
                    }}
                    placeholder="Escribe tu respuesta libre en español... (e.g. ¡Es una receta especial que aprendí de mi abuela verde!)"
                    className="w-full p-3.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 text-stone-900 placeholder:text-stone-400"
                  />
                </div>

                {/* Validation error if < 3 words */}
                {validationError && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium">
                    {validationError}
                  </div>
                )}

                {/* Pronunciation tip */}
                <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Practice Tip:</strong> Say it out loud as you type to practice natural cadence!
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Line & Count Streak</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Improv Completion View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl ring-8 ring-emerald-50">
                <span>🎉</span>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-stone-900">
                  ¡Gran Reacción de Improv!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                  You thought on your feet in Spanish and kept the scene flowing. Your line has been delivered to your buddy in the chat!
                </p>
              </div>

              {/* Display what user typed */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl max-w-md mx-auto text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Tu Réplica en Español:
                </span>
                <p className="text-sm font-semibold text-emerald-900 italic">
                  “{submittedText}”
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Streak updated & added to buddy chat!</span>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleShuffle}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Try Another Scene</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Back to Chat</span>
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
