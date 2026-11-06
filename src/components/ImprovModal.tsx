import React, { useState, useEffect, useRef } from 'react';
import { IMPROV_SCENARIOS } from '../data/seedData';
import {
  SpeechListener,
  speakText,
  stopSpeaking,
  playSound,
  isSpeechRecognitionSupported,
} from '../utils/speech';
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
  Mic,
  MicOff,
  Radio,
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
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [isSpeakingMyLine, setIsSpeakingMyLine] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedText, setSubmittedText] = useState('');

  const speechListenerRef = useRef<SpeechListener | null>(null);

  // Initialize Speech Listener
  useEffect(() => {
    speechListenerRef.current = new SpeechListener('es-MX');
    return () => {
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, [isOpen]);

  const handleModalClose = () => {
    onClose();
    setIsListening(false);
    try {
      speechListenerRef.current?.stop();
    } catch (err) {
      console.warn('Speech stop error:', err);
    }
    try {
      stopSpeaking();
    } catch (err) {
      console.warn('SpeechSynthesis stop error:', err);
    }
  };

  if (!isOpen) return null;

  const currentScenario = IMPROV_SCENARIOS[scenarioIndex % IMPROV_SCENARIOS.length];
  const combinedText = (inputText + (interimTranscript ? ` ${interimTranscript}` : '')).trim();
  const wordCount = combinedText ? combinedText.split(/\s+/).length : 0;

  // Speak prompt aloud
  const handleReadPromptAloud = () => {
    stopSpeaking();
    setIsSpeakingPrompt(true);
    speakText(
      currentScenario.promptQuestion,
      'es-MX',
      () => setIsSpeakingPrompt(true),
      () => setIsSpeakingPrompt(false)
    );
  };

  // Preview pronunciation of vocabulary phrase
  const handlePronouncePhrase = (phrase: string) => {
    stopSpeaking();
    speakText(phrase, 'es-MX');
  };

  // Play back user's spoken words
  const handlePlayMyLine = () => {
    if (!combinedText) return;
    stopSpeaking();
    setIsSpeakingMyLine(true);
    speakText(
      combinedText,
      'es-MX',
      () => setIsSpeakingMyLine(true),
      () => setIsSpeakingMyLine(false)
    );
  };

  // Start Verbal Voice Listening
  const handleStartListening = () => {
    setSpeechError(null);
    setValidationError(null);
    setInterimTranscript('');
    stopSpeaking();

    if (!isSpeechRecognitionSupported()) {
      setSpeechError(
        'Speech recognition is not supported in this browser. You can type your line below.'
      );
      return;
    }

    const listener = speechListenerRef.current;
    if (!listener) return;

    const started = listener.start({
      onStart: () => {
        setIsListening(true);
      },
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onResult: (finalText) => {
        setInputText((prev) => {
          const base = prev.trim();
          return base ? `${base} ${finalText}` : finalText;
        });
        setInterimTranscript('');
        setValidationError(null);
      },
      onError: (err) => {
        setIsListening(false);
        setSpeechError(`Microphone notice: ${err}. You can type or try again.`);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!started) {
      setIsListening(false);
    }
  };

  const handleStopListening = () => {
    speechListenerRef.current?.stop();
    setIsListening(false);
    if (interimTranscript) {
      setInputText((prev) => {
        const base = prev.trim();
        return base ? `${base} ${interimTranscript}` : interimTranscript;
      });
      setInterimTranscript('');
    }
  };

  const handleShuffle = () => {
    speechListenerRef.current?.stop();
    stopSpeaking();
    setIsListening(false);
    setScenarioIndex((prev) => (prev + 1) % IMPROV_SCENARIOS.length);
    setInputText('');
    setInterimTranscript('');
    setValidationError(null);
    setIsSubmitted(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalContent = combinedText;
    const finalWords = finalContent ? finalContent.split(/\s+/).length : 0;

    if (finalWords < 3) {
      setValidationError(
        '¡Casi listo! Please speak or type at least 3 Spanish words so your scene partner understands your reaction.'
      );
      return;
    }

    speechListenerRef.current?.stop();
    stopSpeaking();
    setIsListening(false);
    playSound('success');

    setValidationError(null);
    setSubmittedText(finalContent);
    setIsSubmitted(true);
    onComplete(finalContent, currentScenario.title);
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
      onClick={handleModalClose}
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
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  Improv Portal: Verbal Freestyle Stage
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600">
                  Verbal Audio Mode
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Speak your Spanish lines freely into the microphone!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleModalClose();
            }}
            className="w-10 h-10 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors flex items-center justify-center cursor-pointer shrink-0"
            title="Close modal (Esc)"
            aria-label="Close modal"
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
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white border border-stone-200 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Otro Escenario</span>
                  </button>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {currentScenario.situationSpanish}
                </p>
                <p className="text-[11px] text-stone-500 italic">
                  ({currentScenario.situationEnglish})
                </p>

                {/* Character speaking prompt with Audio button */}
                <div className="mt-3 pt-3 border-t border-stone-200/80 bg-white p-3.5 rounded-lg border flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                      {currentScenario.promptSpeaker} te pregunta:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 italic">
                      {currentScenario.promptQuestion}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReadPromptAloud}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border shrink-0 transition-colors cursor-pointer ${
                      isSpeakingPrompt
                        ? 'bg-emerald-700 text-white border-emerald-800 animate-pulse'
                        : 'bg-stone-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Listen to the character prompt spoken aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingPrompt ? 'Hablando...' : 'Escuchar'}</span>
                  </button>
                </div>
              </div>

              {/* Big Verbal Microphone Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-stone-50 border-2 border-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Graba tu Respuesta Verbal en Español
                    </span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-emerald-800">
                    {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'} (mín. 3)
                  </span>
                </div>

                {/* Mic Action Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={isListening ? handleStopListening : handleStartListening}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Detener Micrófono</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Hablar en Español</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs text-stone-600 text-center sm:text-left flex-1">
                    {isListening ? (
                      <span className="font-semibold text-emerald-800 flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        Transcribiendo tu voz en tiempo real... ¡sigue hablando!
                      </span>
                    ) : (
                      <span>
                        Presiona el micrófono y di lo que se te ocurra en español.
                      </span>
                    )}
                  </div>
                </div>

                {speechError && (
                  <p className="text-[11px] text-rose-600 font-medium">{speechError}</p>
                )}
              </div>

              {/* Free-form Input Area (synced with live voice transcription) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-stone-800">
                    Transcripción Verbal (puedes editar o escribir también):
                  </label>
                  {combinedText && (
                    <button
                      type="button"
                      onClick={handlePlayMyLine}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeakingMyLine ? 'Reproduciendo...' : 'Escuchar mi línea'}</span>
                    </button>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={combinedText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setInterimTranscript('');
                    if (validationError && e.target.value.trim().split(/\s+/).length >= 3) {
                      setValidationError(null);
                    }
                  }}
                  placeholder="Tu voz transcrita aparecerá aquí... (e.g. ¡Hola! Es una receta secreta de mi abuela y sabe increíble)"
                  className="w-full p-3.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 font-medium"
                />
              </div>

              {/* Vocabulary helpers with audio preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700 block">
                  Bloques de vocabulario recomendados (toca para insertar o escuchar):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentScenario.helpfulWords.map((word) => (
                    <div
                      key={word.es}
                      className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => handleInsertWord(word.es)}
                        className="px-2 py-1 font-medium hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>+ {word.es}</span>
                        <span className="text-[10px] text-emerald-600">({word.en})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePronouncePhrase(word.es)}
                        className="px-1.5 py-1 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 border-l border-emerald-200 transition-colors cursor-pointer"
                        title="Listen to phrase pronunciation"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation error if < 3 words */}
              {validationError && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium">
                  {validationError}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Audio y Sumar Racha</span>
                </button>
              </div>
            </>
          ) : (
            /* Improv Completion View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl ring-8 ring-emerald-50">
                <span>🎉</span>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-stone-900">
                  ¡Gran Réplica Verbal!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Pensaste en tus pies, hablaste en español en voz alta y tu voz fue transcrita con éxito. La grabación se ha entregado a tu compañero en el chat.
                </p>
              </div>

              {/* Display what user spoken */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl max-w-md mx-auto text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Tu Transcripción Verbal:
                </span>
                <p className="text-sm font-semibold text-emerald-900 italic">
                  “{submittedText}”
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¡Racha actualizada y agregada al chat!</span>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleShuffle}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Otro Escenario</span>
                </button>

                <button
                  onClick={handleModalClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Volver al Chat</span>
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
