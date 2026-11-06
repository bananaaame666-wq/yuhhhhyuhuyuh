import React, { useState, useEffect, useRef } from 'react';
import { Buddy } from '../types';
import {
  SpeechListener,
  speakText,
  stopSpeaking,
  playSound,
  isSpeechRecognitionSupported,
} from '../utils/speech';
import { generateScriptedBuddyReply, CONVERSATION_STARTERS } from '../data/seedData';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Captions,
  Sparkles,
  Flame,
  Radio,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Users,
} from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  buddy: Buddy;
  onEndCall: (callStats: {
    durationSeconds: number;
    spokenSentences: number;
    transcriptSummary: string[];
  }) => void;
  onSwitchBuddy: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  buddy,
  onEndCall,
  onSwitchBuddy,
}) => {
  // Call Controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Verbal speech states
  const [isListening, setIsListening] = useState(false);
  const [interimUserText, setInterimUserText] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [buddySpeaking, setBuddySpeaking] = useState(false);
  const [buddySubtitle, setBuddySubtitle] = useState('');
  const [buddySubtitleTranslation, setBuddySubtitleTranslation] = useState('');
  const [conversationHistory, setConversationHistory] = useState<
    { sender: 'user' | 'buddy'; text: string; translation?: string }[]
  >([]);
  const [spokenCount, setSpokenCount] = useState(0);

  // WebCam
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);

  // Speech Recognition listener
  const speechListenerRef = useRef<SpeechListener | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize Speech Listener
  useEffect(() => {
    speechListenerRef.current = new SpeechListener('es-MX');
    return () => {
      speechListenerRef.current?.stop();
      stopSpeaking();
    };
  }, []);

  // Handle Call Setup when modal opens
  useEffect(() => {
    if (!isOpen) {
      cleanupCall();
      return;
    }

    playSound('mic-on');
    setCallDuration(0);
    setSpokenCount(0);
    setConversationHistory([]);

    // Call duration timer
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Initial greeting from buddy spoken out loud!
    const greetingText = `¡Hola! It's so good to see you! How are you doing today?`;
    const greetingEs = `¡Hola! ¡Qué bueno verte! ¿Cómo estás hoy?`;

    setTimeout(() => {
      setBuddySubtitle(greetingText);
      setBuddySubtitleTranslation(greetingEs);
      setBuddySpeaking(true);
      speakText(
        greetingText,
        'en-US',
        () => setBuddySpeaking(true),
        () => {
          setBuddySpeaking(false);
          // Auto-start listening to user after buddy finishes greeting!
          startUserListening();
        }
      );
      setConversationHistory([{ sender: 'buddy', text: greetingText, translation: greetingEs }]);
    }, 800);

    // Attempt webcam
    startWebcam();

    return () => {
      cleanupCall();
    };
  }, [isOpen, buddy.id]);

  const cleanupCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    speechListenerRef.current?.stop();
    stopSpeaking();
    setIsListening(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  // Start Real Webcam (or graceful fallback)
  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        setCameraStream(stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      }
    } catch (err: any) {
      console.warn('Camera stream not accessible (using simulated camera tile):', err);
      setCameraError('Camera access unavailable. Using animated avatar view.');
    }
  };

  // Start continuous Spanish Speech Recognition
  const startUserListening = () => {
    if (isMicMuted) return;
    const listener = speechListenerRef.current;
    if (!listener) return;

    listener.start({
      onStart: () => {
        setIsListening(true);
      },
      onInterim: (text) => {
        setInterimUserText(text);
      },
      onResult: (finalText) => {
        handleUserSpokenSentence(finalText);
      },
      onError: (err) => {
        console.warn('Call speech recognition error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        // If not muted and buddy is not speaking, keep listening
        if (!isMicMuted && !buddySpeaking) {
          setIsListening(false);
        }
      },
    });
  };

  // Handle a detected verbal sentence from user
  const handleUserSpokenSentence = (spokenSpanish: string) => {
    if (!spokenSpanish.trim()) return;

    speechListenerRef.current?.stop();
    setIsListening(false);
    setUserTranscript(spokenSpanish);
    setInterimUserText('');
    setSpokenCount((prev) => prev + 1);
    playSound('correct');

    setConversationHistory((prev) => [
      ...prev,
      {
        sender: 'user',
        text: spokenSpanish,
        translation: `Demo translation: "${spokenSpanish}"`,
      },
    ]);

    // Buddy responds verbally with realistic delay
    setTimeout(() => {
      const reply = generateScriptedBuddyReply(spokenSpanish, buddy);
      setBuddySubtitle(reply.text);
      setBuddySubtitleTranslation(reply.translation);

      setConversationHistory((prev) => [
        ...prev,
        {
          sender: 'buddy',
          text: reply.text,
          translation: reply.translation,
        },
      ]);

      if (!isAudioMuted) {
        setBuddySpeaking(true);
        speakText(
          reply.text,
          'en-US',
          () => setBuddySpeaking(true),
          () => {
            setBuddySpeaking(false);
            // Resume listening after buddy finishes talking!
            if (!isMicMuted) {
              setTimeout(() => {
                startUserListening();
              }, 400);
            }
          }
        );
      } else {
        // Resume listening directly
        setTimeout(() => {
          startUserListening();
        }, 1500);
      }
    }, 900);
  };

  // Toggle Mute
  const handleToggleMic = () => {
    if (isMicMuted) {
      setIsMicMuted(false);
      startUserListening();
    } else {
      setIsMicMuted(true);
      speechListenerRef.current?.stop();
      setIsListening(false);
    }
  };

  // Toggle Camera
  const handleToggleVideo = () => {
    if (isVideoEnabled) {
      setIsVideoEnabled(false);
      if (cameraStream) {
        cameraStream.getVideoTracks().forEach((t) => (t.enabled = false));
      }
    } else {
      setIsVideoEnabled(true);
      if (cameraStream) {
        cameraStream.getVideoTracks().forEach((t) => (t.enabled = true));
      } else {
        startWebcam();
      }
    }
  };

  // End Call & trigger summary
  const handleHangup = () => {
    cleanupCall();
    const summary = conversationHistory
      .filter((m) => m.sender === 'user')
      .map((m) => m.text);
    onEndCall({
      durationSeconds: callDuration,
      spokenSentences: Math.max(spokenCount, summary.length),
      transcriptSummary: summary,
    });
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Quick conversation helper phrase
  const handleSayStarter = (starterText: string) => {
    handleUserSpokenSentence(starterText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE VERBAL CALL</span>
              <span className="text-stone-400">·</span>
              <span className="tabular-nums font-mono">{formatTime(callDuration)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-300 bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800 backdrop-blur-md">
              <span>{buddy.flag}</span>
              <span className="font-semibold text-white">{buddy.name}</span>
              <span className="text-stone-400">in</span>
              <span>{buddy.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchBuddy}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              title="Switch demo buddy for call"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch Pal</span>
            </button>

            <button
              onClick={() => setShowCaptions((prev) => !prev)}
              className={`p-2 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
                showCaptions
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-900/80 text-stone-400 border-stone-700'
              }`}
              title="Toggle Live Subtitles (CC)"
            >
              <Captions className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Main Stage Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-stone-900">
          {/* Partner Video Screen */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Ambient Animated Studio/City Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-emerald-950/40 to-stone-950 opacity-90" />

            {/* Subtle background light glow */}
            <div
              className={`absolute w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
                buddySpeaking ? 'bg-emerald-500/25 opacity-100 scale-110' : 'bg-emerald-900/10 opacity-40'
              }`}
            />

            {/* Partner Avatar / Animated Character Feed */}
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <div
                className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center text-6xl sm:text-7xl shadow-2xl transition-all duration-300 border-4 ${
                  buddySpeaking
                    ? 'border-emerald-400 ring-8 ring-emerald-500/30 scale-105'
                    : 'border-stone-700 ring-4 ring-stone-800'
                } ${buddy.avatarBg}`}
              >
                <span>{buddy.avatarEmoji}</span>

                {/* Speaking Waveform Ping Ring */}
                {buddySpeaking && (
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-60" />
                )}

                {/* Language Badge */}
                <div className="absolute -bottom-2 bg-stone-900/90 text-stone-200 border border-stone-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-md">
                  <span>Speaking English</span>
                  <span>{buddy.flag}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
                  <span>{buddy.name}</span>
                  <span className="text-sm font-normal text-stone-400">({buddy.age})</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Native Spanish Speaker · Practicing English with you!
                </p>
              </div>

              {/* Live Audio Visualizer Bars when buddy is speaking */}
              {buddySpeaking && (
                <div className="flex items-center gap-1 mt-3">
                  {[0.4, 0.9, 0.6, 1.0, 0.7, 0.9, 0.5, 0.8].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-emerald-400 rounded-full animate-pulse"
                      style={{
                        height: `${h * 24}px`,
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider ml-1.5">
                    Speaking Aloud...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Self-View Video Window (Picture-in-Picture) */}
          <div className="absolute top-16 right-4 sm:top-18 sm:right-6 w-32 h-44 sm:w-44 sm:h-56 rounded-2xl bg-stone-950 border-2 border-stone-700/80 shadow-2xl overflow-hidden z-30 flex flex-col">
            {isVideoEnabled ? (
              cameraStream ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/80 to-stone-900 p-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-1 shadow-inner">
                    Tú
                  </div>
                  <span className="text-[11px] font-bold text-stone-200">You (Speaking Spanish)</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Mic Active 🎙️</span>
                </div>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 p-2 text-center text-stone-400">
                <VideoOff className="w-6 h-6 mb-1 text-stone-500" />
                <span className="text-[11px]">Camera Off</span>
              </div>
            )}

            {/* Mic indicator badge on self tile */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-semibold text-stone-200">
              {isMicMuted ? (
                <>
                  <MicOff className="w-3 h-3 text-rose-400" />
                  <span>Muted</span>
                </>
              ) : isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300">Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-3 h-3 text-stone-400" />
                  <span>Ready</span>
                </>
              )}
            </div>
          </div>

          {/* Real-time Subtitles / Closed Captions Overlay */}
          {showCaptions && (
            <div className="absolute bottom-28 left-4 right-4 sm:left-8 sm:right-8 z-30 max-w-2xl mx-auto space-y-2 pointer-events-none">
              {/* User Live Spoken Speech Banner */}
              {(isListening || interimUserText || userTranscript) && (
                <div className="bg-emerald-950/85 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 text-white shadow-xl animate-fade-in pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      You speaking Spanish:
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold leading-snug">
                    «{interimUserText || userTranscript || 'Escuchando tu voz... habla en español'}»
                  </p>
                </div>
              )}

              {/* Buddy Live Spoken Subtitle */}
              {buddySubtitle && (
                <div className="bg-stone-900/90 backdrop-blur-md border border-stone-700 rounded-2xl p-3.5 text-white shadow-xl pointer-events-auto">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {buddy.name} (English):
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      Bilingual Exchange
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-medium leading-snug">
                    {buddySubtitle}
                  </p>
                  {buddySubtitleTranslation && (
                    <p className="text-xs text-stone-400 italic mt-1 pt-1 border-t border-stone-800">
                      Traducción: {buddySubtitleTranslation}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* In-Call Verbal Conversation Helpers (Horizontal Carousel) */}
          <div className="absolute top-20 left-4 sm:top-20 sm:left-6 max-w-xs hidden md:block z-20">
            <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-3 shadow-xl space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Conversation Starters to Say:</span>
              </span>
              <div className="space-y-1.5">
                {[
                  '¿Qué hiciste hoy Camila?',
                  '¿Qué música te gusta escuchar?',
                  '¿Tienes alguna mascota en México?',
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => handleSayStarter(phrase)}
                    className="w-full text-left text-xs bg-stone-800/80 hover:bg-emerald-900/50 hover:border-emerald-500/50 border border-stone-700/60 p-2 rounded-xl text-stone-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate font-medium">{phrase}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call Controls Dock */}
        <div className="p-4 sm:p-5 bg-stone-950/95 border-t border-stone-800 flex items-center justify-between gap-3 relative z-30">
          {/* Spoken Sentences Counter */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-400">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>
              {spokenCount} verbal exchange{spokenCount === 1 ? '' : 's'} logged
            </span>
          </div>

          {/* Central Controls */}
          <div className="flex items-center gap-3 sm:gap-4 mx-auto">
            {/* Mic Mute Button */}
            <button
              onClick={handleToggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer shadow-md ${
                isMicMuted
                  ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-400'
                  : 'bg-stone-800 hover:bg-stone-700'
              }`}
              title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
            </button>

            {/* Video Camera Button */}
            <button
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer shadow-md ${
                !isVideoEnabled
                  ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-400'
                  : 'bg-stone-800 hover:bg-stone-700'
              }`}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Audio Speaker Mute Button */}
            <button
              onClick={() => {
                setIsAudioMuted((prev) => !prev);
                if (!isAudioMuted) stopSpeaking();
              }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer shadow-md ${
                isAudioMuted
                  ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400'
                  : 'bg-stone-800 hover:bg-stone-700'
              }`}
              title={isAudioMuted ? 'Unmute partner audio' : 'Mute partner audio'}
            >
              {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-purple-400" />}
            </button>

            {/* End Call / Hang Up */}
            <button
              onClick={handleHangup}
              className="h-12 px-5 sm:px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              title="End verbal call and view practice summary"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">End Call</span>
            </button>
          </div>

          {/* Quick Voice Tip */}
          <div className="hidden lg:block text-right text-xs text-stone-500">
            <span className="text-emerald-400 font-semibold">Speak freely:</span> Speech-to-text listens continuously
          </div>
        </div>
      </div>
    </div>
  );
};
