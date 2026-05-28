import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, Play, Pause, Disc } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AudioPlayerProps {
  onAudioStarted?: () => void;
  autoPlayRequest?: boolean;
}

export default function AudioPlayer({ onAudioStarted, autoPlayRequest = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynth, setIsSynth] = useState(false);
  const [volume, setVolume] = useState(0.2); // Low gentle background volume
  const [showIntro, setShowIntro] = useState(true);

  // Audio elements
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const synthNodesRef = useRef<any[]>([]);
  const synthIntervalRef = useRef<any>(null);

  // High quality peaceful instrumental ambient loops
  const TRACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"; // Beautiful chill ambient acoustic track

  // Try to initialize conventional audio or fallback to synthesized serene spiritual chord pad
  const initAudio = async () => {
    // 1. Initialize HTML5 Audio Element
    if (!musicRef.current) {
      const audio = new Audio(TRACK_URL);
      audio.loop = true;
      audio.volume = volume;
      musicRef.current = audio;
    }

    try {
      // Try to play MP3 track
      await musicRef.current.play();
      setIsPlaying(true);
      setIsSynth(false);
      if (onAudioStarted) onAudioStarted();
    } catch (err) {
      console.warn("Conventional MP3 autoplay blocked or failed, initiating custom Web Audio synth pad...", err);
      // 2. Fallback: Initialize Web Audio Synth Pad
      initSynthPad();
    }
  };

  // Synthesizes a beautiful, echoing spiritual ambient drone with gold pentatonic notes
  const initSynthPad = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Master volume node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Low frequency majestic ambient drone (Deep grounding feeling)
      const baseOsc = ctx.createOscillator();
      const baseGain = ctx.createGain();
      baseOsc.type = "sine";
      baseOsc.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      baseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      baseOsc.connect(baseGain);
      baseGain.connect(masterGain);
      baseOsc.start();
      synthNodesRef.current.push(baseOsc, baseGain);

      // Harmonious gold tone scales (A Minor Pentatonic: A, C, D, E, G) - mystical, peaceful, spiritual vibe
      const pentatonicFreqs = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let frequencyIndex = 0;

      const playSpiritualTone = () => {
        if (ctx.state === "suspended") return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const delayNode = ctx.createDelay();
        const feedbackNode = ctx.createGain();

        osc.type = "triangle";
        // Rotate through comforting frequencies
        const baseFreq = pentatonicFreqs[frequencyIndex];
        frequencyIndex = (frequencyIndex + 1) % pentatonicFreqs.length;

        // Slight micro-tuning fluctuation for analog warm feel
        osc.frequency.setValueAtTime(baseFreq + (Math.random() * 2 - 1), ctx.currentTime);

        // Echo delay effect
        delayNode.delayTime.setValueAtTime(0.5, ctx.currentTime);
        feedbackNode.gain.setValueAtTime(0.4, ctx.currentTime);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        // Feed to feedback loop
        gainNode.connect(delayNode);
        delayNode.connect(feedbackNode);
        feedbackNode.connect(delayNode);
        delayNode.connect(masterGain);

        // Smooth volume envelope fade-in/fade-out
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 1.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

        osc.start(now);
        osc.stop(now + 5.0);
      };

      // Trigger chord notes every 2.8 seconds
      playSpiritualTone();
      const interval = setInterval(playSpiritualTone, 2800);
      synthIntervalRef.current = interval;

      setIsPlaying(true);
      setIsSynth(true);
      if (onAudioStarted) onAudioStarted();
    } catch (e) {
      console.error("Web Audio API not supported or failed to launch:", e);
    }
  };

  const stopSynthPad = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    synthNodesRef.current = [];
  };

  const handleStartExperience = () => {
    setShowIntro(false);
    initAudio();
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      // Pause
      if (musicRef.current) {
        musicRef.current.pause();
      }
      stopSynthPad();
      setIsPlaying(false);
    } else {
      // Play
      if (isSynth) {
        initSynthPad();
      } else if (musicRef.current) {
        try {
          await musicRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          initSynthPad();
        }
      } else {
        initAudio();
      }
    }
  };

  // Keep volume updated on hardware output
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = volume;
    }
    if (audioContextRef.current) {
      // Just adjust overall listener volume if possible, we can re-create gain nodes or just let it adjust on next tone
    }
  }, [volume]);

  // Clean up
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
      stopSynthPad();
    };
  }, []);

  return (
    <>
      {/* 1. Immersive Intro "Gate" Overlay to bypass Autoplay boundaries */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-slate-950 via-teal-980 to-slate-950 text-white p-6"
          >
            {/* Elegant Background Canvas Overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-md text-center flex flex-col items-center justify-center z-10"
            >
              {/* Islamic Star Mandala Frame */}
              <div className="h-20 w-20 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center mb-6 relative animate-pulse">
                <Music className="h-8 w-8 text-amber-400" />
                <div className="absolute inset-0 rounded-full border border-amber-500/20 scale-125 animate-ping opacity-40" />
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-wide text-amber-400 mb-3">
                Qurban Al Ikhlas
              </h1>
              <p className="text-sm text-emerald-100 font-sans tracking-wide mb-2">
                Masjid Al Ikhlas Perum GBI Purwokerto
              </p>
              <p className="text-xs text-emerald-400/80 font-mono mb-8">
                Edisi Publikasi Digital 1447H / 2026
              </p>

              <p className="text-xs text-slate-300 max-w-sm mb-8 leading-relaxed">
                Halaman ini menyajikan visualisasi 3D interaktif yang diiringi instrumen spiritual lembut untuk menyelimuti perjalanan penjelajahan Anda.
              </p>

              <motion.button
                id="btn-enter-experience"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartExperience}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-sans font-medium rounded-full cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 flex items-center gap-2 group tracking-wide text-sm"
              >
                MASUKI PENGALAMAN 3D
                <Play className="h-4 w-4 fill-slate-950 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Subtle Footer */}
            <div className="absolute bottom-6 text-2xs text-emerald-300/40 tracking-widest font-mono">
              MASJID AL IKHLAS • PURWOKERTO
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Tiny Floating Audio Controller (Top Right, or Floating Bottom Corner) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-3 py-1.5 bg-slate-950/80 border border-emerald-500/20 rounded-full flex items-center gap-2 backdrop-blur-md"
          >
            {/* Live equalizer animated lines */}
            <div className="flex items-end gap-0.5 h-3 w-4">
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-2" style={{ animationDelay: "0.1s" }} />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-3" style={{ animationDelay: "0.3s" }} />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: "0.5s" }} />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-2.5" style={{ animationDelay: "0.2s" }} />
            </div>

            <span className="text-3xs text-amber-400 font-mono tracking-wider truncate max-w-[100px]">
              {isSynth ? "SPI_CHORD_SYNTH" : "AMBIENT_OUTLINE"}
            </span>
          </motion.div>
        )}

        <motion.button
          id="btn-music-toggle"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayback}
          className="h-11 w-11 rounded-full cursor-pointer bg-slate-950/90 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400/50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-amber-400 z-40 focus:outline-none"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <span className="relative flex items-center justify-center">
              <Pause className="h-4 w-4" />
              {/* Spinning record border highlight */}
              <div className="absolute inset-0 h-8 w-8 rounded-full border border-dashed border-amber-400/30 animate-spin" style={{ animationDuration: "12s" }} />
            </span>
          ) : (
            <Play className="h-4 w-4 fill-amber-400/20 translate-x-0.5" />
          )}
        </motion.button>
      </div>
    </>
  );
}
