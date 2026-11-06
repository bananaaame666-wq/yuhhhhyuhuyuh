import React, { useState, useEffect, useRef } from 'react';
import { ESCAPE_ROOM_CLUES } from '../data/seedData';
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
  Key,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Mic,
  MicOff,
  Volume2,
  Lock,
  Unlock,
  Radio,
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
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isSpeakingClue, setIsSpeakingClue] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    text: string;
    spokenLine?: string;
  } | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);

  const speechListenerRef = useRef<SpeechListener | null>(null);

  // Initialize Speech Listener
  useEffect(() => {
    speechListenerRef.current = new SpeechListener('es-MX');
    return () => {
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  // Close on Escape key & cleanup
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

  const currentClue = ESCAPE_ROOM_CLUES[currentClueIndex];
  const progressPercent = ((currentClueIndex + (isEscaped ? 1 : 0)) / ESCAPE_ROOM_CLUES.length) * 100;

  // Speak clue out loud in Spanish
  const handleReadClueAloud = () => {
    stopSpeaking();
    setIsSpeakingClue(true);
    speakText(
      currentClue.clueSpanish,
      'es-ES',
      () => setIsSpeakingClue(true),
      () => setIsSpeakingClue(false)
    );
  };

  // Preview target voice command pronunciation
  const handleListenTargetVoiceCommand = () => {
    stopSpeaking();
    speakText(currentClue.targetVoiceCommandSpanish, 'es-MX');
  };

  // Start Voice Command Recognition
  const handleStartListening = () => {
    setSpeechError(null);
    setInterimTranscript('');
    setFeedback(null);
    stopSpeaking();

    if (!isSpeechRecognitionSupported()) {
      setSpeechError(
        'Speech recognition is not supported in this browser. You can select the solution card below.'
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
        handleEvaluateVoiceCommand(finalText);
      },
      onError: (err) => {
        setIsListening(false);
        setSpeechError(`Microphone notice: ${err}. Try speaking again or select the card below.`);
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
      handleEvaluateVoiceCommand(interimTranscript);
      setSpokenTranscript(interimTranscript);
      setInterimTranscript('');
    }
  };

  // Evaluate spoken voice command against clue criteria
  const handleEvaluateVoiceCommand = (spoken: string) => {
    const cleanSpoken = spoken.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Check against target phrase
    const match = checkSpokenMatch(spoken, currentClue.targetVoiceCommandSpanish);

    // Also check alternate keywords
    const matchesKeyword = currentClue.alternateKeywords.some((kw) =>
      cleanSpoken.includes(kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );

    const isMatch = match.isMatch || matchesKeyword;

    if (isMatch) {
      playSound('unlock');
      const correctOpt = currentClue.options.find((o) => o.isCorrect);
      if (correctOpt) {
        setSelectedOptionId(correctOpt.id);
      }
      setFeedback({
        isCorrect: true,
        text: `¡Comando de voz verificado! Te escuché decir: "${spoken}". El mecanismo responde y el candado se abre.`,
        spokenLine: spoken,
      });
    } else {
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        text: `Escuché: "${spoken}". El mecanismo requiere la palabra o acción en español. Prueba diciendo: "${currentClue.targetVoiceCommandSpanish}"`,
        spokenLine: spoken,
      });
    }
  };

  // Card selection fallback
  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    const chosen = currentClue.options.find((o) => o.id === optionId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      playSound('unlock');
      setFeedback({
        isCorrect: true,
        text: `¡Mecanismo desbloqueado! ${chosen.feedback}`,
      });
    } else {
      playSound('wrong');
      setFeedback({
        isCorrect: false,
        text: chosen.feedback,
      });
    }
  };

  const handleNextClue = () => {
    setSelectedOptionId(null);
    setFeedback(null);
    setShowHint(false);
    setSpokenTranscript('');
    setInterimTranscript('');
    stopSpeaking();

    if (currentClueIndex < ESCAPE_ROOM_CLUES.length - 1) {
      setCurrentClueIndex((prev) => prev + 1);
    } else {
      playSound('success');
      setIsEscaped(true);
    }
  };

  const handleRevealAndAdvance = () => {
    const correct = currentClue.options.find((o) => o.isCorrect);
    if (correct) {
      setSelectedOptionId(correct.id);
      playSound('unlock');
      setFeedback({
        isCorrect: true,
        text: `Desbloqueo de emergencia activado: "${correct.text}"`,
      });
    }
  };

  const handleFinishEscape = () => {
    handleModalClose();
    onComplete(
      '¡Logré escapar de la biblioteca secreta pronunciando los comandos de voz en español! 🗝️ Desbloqueé los tres mecanismos con mi voz.'
    );
  };

  const handleRestart = () => {
    setCurrentClueIndex(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setShowHint(false);
    setSpokenTranscript('');
    setInterimTranscript('');
    setIsEscaped(false);
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
        <div className="px-6 py-4 bg-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-800/80 flex items-center justify-center text-lg">
              <span>🗝️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  Voice-Activated Escape Room
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-900 text-amber-200 px-2 py-0.5 rounded-full border border-amber-700">
                  Verbal Audio Mode
                </span>
              </div>
              <p className="text-xs text-amber-200/90">
                La Biblioteca Secreta · Speak the commands in Spanish to open locks!
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
            className="w-10 h-10 rounded-xl text-amber-200 hover:text-white hover:bg-amber-900 transition-colors flex items-center justify-center cursor-pointer shrink-0"
            title="Close modal (Esc)"
            aria-label="Close modal"
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

              {/* Spanish Clue Parchment with Audio Reader */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300/80 text-amber-950 font-serif leading-relaxed shadow-inner space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-800">
                    Papiro Español Encontrado:
                  </span>
                  <button
                    type="button"
                    onClick={handleReadClueAloud}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSpeakingClue
                        ? 'bg-amber-700 text-white border-amber-800 animate-pulse'
                        : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                    }`}
                    title="Listen to the parchment clue read aloud in Spanish"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingClue ? 'Narrando...' : 'Escuchar Pista'}</span>
                  </button>
                </div>

                <p className="text-sm font-medium italic">
                  {currentClue.clueSpanish}
                </p>
              </div>

              {/* Hint Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1.5 transition-colors cursor-pointer"
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

              {/* Verbal Voice Command Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-stone-50 border-2 border-amber-300/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-700 animate-pulse" />
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Comando de Voz para Desbloquear
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleListenTargetVoiceCommand}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Oír comando de voz</span>
                  </button>
                </div>

                {/* Big Live Mic Trigger */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={isListening ? handleStopListening : handleStartListening}
                    className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300 animate-pulse'
                        : 'bg-amber-800 hover:bg-amber-900 active:scale-95 text-white shadow-amber-800/20'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Detener y Desbloquear</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Decir Comando en Español</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs text-stone-600 text-center sm:text-left flex-1">
                    {isListening ? (
                      <span className="font-semibold text-amber-800 flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                        Escuchando tu comando de voz en español...
                      </span>
                    ) : (
                      <span>
                        Di en voz alta: <strong className="text-amber-950 font-bold">«{currentClue.targetVoiceCommandSpanish}»</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Transcript / Interim Speech */}
                {(isListening || interimTranscript || spokenTranscript) && (
                  <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs text-amber-950 font-medium flex items-start gap-2 shadow-inner">
                    <span className="text-amber-700 font-bold shrink-0">🎙️ Comando detectado:</span>
                    <p className="italic">
                      {interimTranscript || spokenTranscript || 'Esperando que hables...'}
                    </p>
                  </div>
                )}

                {speechError && (
                  <p className="text-[11px] text-rose-600 font-medium">{speechError}</p>
                )}
              </div>

              {/* Alternative Question & Options */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-700 block">
                  {currentClue.question} (O toca para confirmar):
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
                              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                <Unlock className="w-4 h-4" />
                                <span>Abierto</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-rose-500 font-bold text-xs">
                                <Lock className="w-4 h-4" />
                                <span>Cerrado</span>
                              </div>
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
                      {feedback.isCorrect ? '¡Mecanismo Desbloqueado!' : 'El cerrojo permanece cerrado.'}
                    </p>
                    <p>{feedback.text}</p>
                    {!feedback.isCorrect && (
                      <button
                        type="button"
                        onClick={handleRevealAndAdvance}
                        className="text-[11px] underline font-semibold text-rose-800 hover:text-rose-950 mt-1 cursor-pointer"
                      >
                        Abrir candado con la solución y continuar
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
                  onClick={handleNextClue}
                  disabled={!feedback?.isCorrect}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all ${
                    feedback?.isCorrect
                      ? 'bg-amber-800 hover:bg-amber-900 text-white cursor-pointer'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {currentClueIndex < ESCAPE_ROOM_CLUES.length - 1
                      ? 'Siguiente Candado'
                      : 'Abrir Puerta de Salida'}
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
                  ¡Escapaste Usando Comandos de Voz!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Pronunciaste en voz alta los comandos en español para encontrar el libro azul, girar la estatua del búho y decir «LIBERTAD» para desactivar la alarma.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl max-w-md mx-auto text-xs text-emerald-900 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¡Práctica de voz registrada para tu racha de hoy!</span>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Jugar de Nuevo</span>
                </button>

                <button
                  onClick={handleFinishEscape}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-amber-800 hover:bg-amber-900 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Compartir Escape con Compañero</span>
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
