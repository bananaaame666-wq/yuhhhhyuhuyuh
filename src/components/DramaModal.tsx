import React, { useState, useEffect, useRef } from 'react';
import { DRAMA_BEATS } from '../data/seedData';
import {
  SpeechListener,
  speakText,
  stopSpeaking,
  playSound,
  checkSpokenMatch,
  isSpeechRecognitionSupported,
} from '../utils/speech';
import {
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
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
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [activePronunciationId, setActivePronunciationId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
    spokenLine?: string;
  } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const speechListenerRef = useRef<SpeechListener | null>(null);

  // Initialize Speech Listener for Spanish
  useEffect(() => {
    speechListenerRef.current = new SpeechListener('es-MX');
    return () => {
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  // Close on Escape key & stop audio
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
    speechListenerRef.current?.stop();
    stopSpeaking();
    setIsListening(false);
    onClose();
  };

  const currentBeat = DRAMA_BEATS[currentBeatIndex];
  const progressPercent = ((currentBeatIndex + (isFinished ? 1 : 0)) / DRAMA_BEATS.length) * 100;

  // Speak Mateo's dramatic line aloud
  const handleReadBuddyPrompt = () => {
    stopSpeaking();
    setIsSpeakingPrompt(true);
    speakText(
      currentBeat.buddyPrompt,
      'es-MX',
      () => setIsSpeakingPrompt(true),
      () => setIsSpeakingPrompt(false)
    );
  };

  // Preview pronunciation for any Spanish option
  const handleListenPronunciation = (optionId: string, textSpanish: string) => {
    stopSpeaking();
    setActivePronunciationId(optionId);
    speakText(
      textSpanish,
      'es-MX',
      () => setActivePronunciationId(optionId),
      () => setActivePronunciationId(null)
    );
  };

  // Start Verbal Voice Listening
  const handleStartListening = () => {
    setSpeechError(null);
    setInterimTranscript('');
    setFeedback(null);
    stopSpeaking();

    if (!isSpeechRecognitionSupported()) {
      setSpeechError(
        'Speech recognition is not supported in this browser. You can tap any line below or test simulated voice.'
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
        setSpokenTranscript(finalText);
        setInterimTranscript('');
        setIsListening(false);
        handleEvaluateSpokenSpeech(finalText);
      },
      onError: (err) => {
        setIsListening(false);
        setSpeechError(`Microphone notice: ${err}. Try speaking again or select an option below.`);
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
      handleEvaluateSpokenSpeech(interimTranscript);
      setSpokenTranscript(interimTranscript);
      setInterimTranscript('');
    }
  };

  // Evaluate what user spoke against the dramatic options
  const handleEvaluateSpokenSpeech = (spoken: string) => {
    let bestOption = null;
    let highestRatio = -1;

    for (const opt of currentBeat.options) {
      const match = checkSpokenMatch(spoken, opt.textSpanish);
      if (match.similarityRatio > highestRatio) {
        highestRatio = match.similarityRatio;
        bestOption = opt;
      }
    }

    if (bestOption && highestRatio >= 0.35) {
      setSelectedOptionId(bestOption.id);
      if (bestOption.isCorrect) {
        playSound('correct');
        setFeedback({
          isCorrect: true,
          text: `¡Excelente voz y pronunciación! "${bestOption.textSpanish}" — ${bestOption.explanation}`,
          spokenLine: spoken,
        });
      } else {
        playSound('wrong');
        setFeedback({
          isCorrect: false,
          text: `Te escuché decir: "${spoken}". Esa réplica es divertida pero no encaja con la tensión dramática: ${bestOption.explanation}`,
          spokenLine: spoken,
        });
      }
    } else {
      // Didn't clearly match any of the lines, but give constructive verbal feedback
      playSound('wrong');
      const correctOpt = currentBeat.options.find((o) => o.isCorrect)!;
      setFeedback({
        isCorrect: false,
        text: `Te escuché decir: "${spoken}". ¡Buen intento verbal! Prueba decir en voz alta: "${correctOpt.textSpanish}"`,
        spokenLine: spoken,
      });
    }
  };

  // Fallback: click to select or simulate voice
  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    const chosen = currentBeat.options.find((o) => o.id === optionId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      playSound('correct');
      setFeedback({
        isCorrect: true,
        text: `¡Línea seleccionada! "${chosen.textSpanish}" — ${chosen.explanation}`,
      });
    } else {
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        text: chosen.explanation,
      });
    }
  };

  const handleNextBeat = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    setSpokenTranscript('');
    setInterimTranscript('');
    stopSpeaking();

    if (currentBeatIndex < DRAMA_BEATS.length - 1) {
      setCurrentBeatIndex((prev) => prev + 1);
    } else {
      playSound('applause');
      setIsFinished(true);
    }
  };

  const handleRevealAndAdvance = () => {
    const correctOption = currentBeat.options.find((o) => o.isCorrect);
    if (correctOption) {
      setSelectedOptionId(correctOption.id);
      playSound('correct');
      setFeedback({
        isCorrect: true,
        text: `Línea dramática ideal: "${correctOption.textSpanish}" — ${correctOption.explanation}`,
      });
    }
  };

  const handleFinishDrama = () => {
    handleModalClose();
    onComplete(
      '¡Acabo de interpretar una escena dramática de telenovela hablando en español en voz alta! 🎭 ¡Sobreviví los tres actos con final feliz!'
    );
  };

  const handleRestart = () => {
    setCurrentBeatIndex(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setSpokenTranscript('');
    setInterimTranscript('');
    setIsFinished(false);
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
        <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-700/80 flex items-center justify-center text-lg">
              <span>🎭</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  Drama Replay: Verbal Acting Studio
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full border border-purple-600">
                  Verbal Audio Mode
                </span>
              </div>
              <p className="text-xs text-purple-200">
                Speak your Spanish lines out loud into the microphone!
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 transition-colors cursor-pointer"
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

              {/* Character Prompt with Audio Playback */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Mateo actúa su línea:
                  </span>
                  <button
                    type="button"
                    onClick={handleReadBuddyPrompt}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSpeakingPrompt
                        ? 'bg-purple-600 text-white border-purple-700 animate-pulse'
                        : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
                    }`}
                    title="Listen to Mateo's dramatic prompt spoken aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingPrompt ? 'Speaking...' : 'Escuchar a Mateo'}</span>
                  </button>
                </div>

                <p className="italic text-stone-800 font-medium text-sm leading-relaxed">
                  {currentBeat.buddyPrompt}
                </p>
              </div>

              {/* Interactive Verbal Microphone Recording Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-stone-50 border-2 border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                      Tu Turno: Dilo en voz alta en español
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500">
                    Voice Recognition Active
                  </span>
                </div>

                {/* Big Live Mic Trigger */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={isListening ? handleStopListening : handleStartListening}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 animate-pulse'
                        : 'bg-purple-700 hover:bg-purple-800 active:scale-95 text-white shadow-purple-600/20'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Detener y Evaluar Voz</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Presionar y Hablar en Español</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs text-stone-500 text-center sm:text-left flex-1">
                    {isListening ? (
                      <span className="font-semibold text-purple-700 flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                        Escuchando tu voz... di una de las líneas abajo
                      </span>
                    ) : (
                      <span>
                        Haz clic en el micrófono y di tu línea dramática con emoción.
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Transcript / Interim Speech */}
                {(isListening || interimTranscript || spokenTranscript) && (
                  <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-purple-950 font-medium flex items-start gap-2 shadow-inner">
                    <span className="text-purple-600 font-bold shrink-0">🎙️ Voz detectada:</span>
                    <p className="italic">
                      {interimTranscript || spokenTranscript || 'Esperando que comiences a hablar...'}
                    </p>
                  </div>
                )}

                {speechError && (
                  <p className="text-[11px] text-rose-600 font-medium">{speechError}</p>
                )}
              </div>

              {/* Dramatic Lines / Cue Cards */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-700 block">
                  Líneas dramáticas posibles (escucha la pronunciación o elígela):
                </span>

                {currentBeat.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isPronouncing = activePronunciationId === opt.id;

                  let cardStyle =
                    'border-stone-200 bg-white hover:border-purple-300 hover:bg-purple-50/30';

                  if (isSelected) {
                    cardStyle = opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-rose-400 bg-rose-50/70 ring-2 ring-rose-400/20';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border text-left transition-all ${cardStyle}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="space-y-1 flex-1 cursor-pointer"
                          onClick={() => handleSelectOption(opt.id)}
                        >
                          <p className="font-semibold text-stone-900 text-sm">
                            «{opt.textSpanish}»
                          </p>
                          <p className="text-xs text-stone-500 italic">
                            ({opt.textEnglish})
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Audio pronunciation guide button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleListenPronunciation(opt.id, opt.textSpanish);
                            }}
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isPronouncing
                                ? 'bg-purple-600 text-white border-purple-600 animate-bounce'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                            title="Listen to native Spanish pronunciation of this line"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {isSelected && (
                            <div className="mt-0.5">
                              {opt.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                              )}
                            </div>
                          )}
                        </div>
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
                      {feedback.isCorrect ? '¡Magnífica interpretación verbal!' : '¡Ajuste dramático necesario!'}
                    </p>
                    <p>{feedback.text}</p>
                    {!feedback.isCorrect && (
                      <button
                        type="button"
                        onClick={handleRevealAndAdvance}
                        className="text-[11px] underline font-semibold text-rose-800 hover:text-rose-950 mt-1 cursor-pointer"
                      >
                        Avanzar con la línea dramática ideal
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Action */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cerrar
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
                      ? 'Siguiente Acto'
                      : 'Concluir Escena'}
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
                  ¡Escena Verbal Completada con Éxito!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Hablaste tus líneas en voz alta en español a través de los tres actos. La cadencia dramática y tu pronunciación resolvieron el misterio con Mateo.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¡Práctica verbal registrada para tu racha de hoy!</span>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Actuación</span>
                </button>

                <button
                  onClick={handleFinishDrama}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-700 hover:bg-purple-800 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Compartir con Compañero</span>
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
