import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, ReceiptText, Search, Store, Zap, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TenantNav from '../components/TenantNav';
import { useEffect, useState, useRef } from 'react';

// Pentatonic scale frequencies (C Major Pentatonic: C4, D4, E4, G4, A4, C5)
const PENTATONIC_FREQUENCIES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

const ROOM_IMAGES = [
  { src: '/room-demo.jpg', name: 'THE OBSIDIAN SUITE', location: 'Jubilee Hills, Hyderabad' },
  { src: '/room-demo-2.jpg', name: 'THE CARBON LOFT', location: 'HITEC City, Hyderabad' },
  { src: '/room-demo-3.jpg', name: 'NEON HORIZON', location: 'Gachibowli, Hyderabad' }
];

export default function Landing() {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Enforce dark mode on landing
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Web Audio Synthesizer for Wind Chimes
  const playWindChime = () => {
    if (!audioEnabled) return;
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Play 3-4 random notes from the pentatonic scale to simulate a chime brushing
    const numNotes = Math.floor(Math.random() * 2) + 3;
    let startTime = ctx.currentTime;

    for (let i = 0; i < numNotes; i++) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Aluminum/Bamboo resonance feel (sine or triangle)
      osc.type = 'sine';
      
      // Pick random pentatonic frequency
      const freq = PENTATONIC_FREQUENCIES[Math.floor(Math.random() * PENTATONIC_FREQUENCIES.length)];
      // Add slight random detune for organic feel
      osc.frequency.value = freq + (Math.random() * 4 - 2); 

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Envelope: quick attack, very long decay for chimes
      const noteTime = startTime + i * 0.15; // Stagger notes slightly
      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.15, noteTime + 0.05); // attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 4.0); // long decay

      osc.start(noteTime);
      osc.stop(noteTime + 4.0);
    }
  };

  // Slider Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRoomIndex((prev) => (prev + 1) % ROOM_IMAGES.length);
      playWindChime(); // Play sound on transition
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, [audioEnabled]);

  return (
    <div className="min-h-screen bg-bugatti-mesh text-slate-200 selection:bg-bugatti-cyan/30">
      <div className="absolute inset-0 bg-gradient-to-b from-bugatti-obsidian/80 via-bugatti-obsidian/40 to-bugatti-obsidian z-[-1]" />
      <TenantNav />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 text-center lg:pt-48">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-bugatti-cyan/30 bg-bugatti-cyan/10 px-4 py-1.5 text-sm font-medium text-bugatti-cyan backdrop-blur-md"
        >
          <Zap size={14} className="fill-bugatti-cyan" /> 
          The Future of Premium Co-living
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-5xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          ELEVATE YOUR <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-bugatti-blue via-bugatti-cyan to-white bg-clip-text text-transparent">
            LIVING STANDARD.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-2xl text-lg font-light text-slate-400 sm:text-xl"
        >
          High-tech, verified premium residences in Hyderabad. Built for those who demand excellence in every detail.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <Link
            to="/explore"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-bugatti-carbon transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-bugatti-cyan to-bugatti-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
              <Search size={18} /> Find Your Space
            </span>
          </Link>
          <Link
            to="/dashboard"
            className="group glass-panel inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 hover:border-bugatti-cyan/50"
          >
            <Store size={18} /> List Your Property <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Showcasing the room slider */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        
        {/* Audio Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-2 rounded-full border border-bugatti-cyan/30 bg-bugatti-obsidian/60 px-4 py-2 text-sm font-medium text-bugatti-cyan backdrop-blur-md transition-colors hover:bg-bugatti-cyan/10"
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {audioEnabled ? 'Sensory Audio On' : 'Enable Sensory Audio'}
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="glow-border rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,210,255,0.3)] bg-bugatti-carbon"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentRoomIndex}
                src={ROOM_IMAGES[currentRoomIndex].src}
                alt="Luxury PG Room"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover" 
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-bugatti-obsidian via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-8 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoomIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-3xl font-bold text-white tracking-wide">{ROOM_IMAGES[currentRoomIndex].name}</h3>
                  <p className="text-bugatti-cyan font-medium flex items-center gap-2 mt-2">
                    <MapPin size={16} /> {ROOM_IMAGES[currentRoomIndex].location}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-8 flex gap-2 z-10">
              {ROOM_IMAGES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentRoomIndex ? 'w-8 bg-bugatti-cyan shadow-[0_0_10px_rgba(0,210,255,0.8)]' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-white">Engineering <span className="text-bugatti-cyan">Excellence</span></h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-gradient-to-r from-bugatti-blue to-bugatti-cyan rounded-full" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            delay={0.1}
            icon={<MapPin size={24} className="text-bugatti-cyan" />}
            title="Precision Location"
            text="Advanced mapping calculates true commute times, ensuring you're always connected to the heart of the city."
          />
          <Feature
            delay={0.2}
            icon={<BadgeCheck size={24} className="text-bugatti-cyan" />}
            title="Verified Standards"
            text="Every property undergoes a rigorous 50-point inspection including fire safety, compliance, and aesthetic quality."
          />
          <Feature
            delay={0.3}
            icon={<ReceiptText size={24} className="text-bugatti-cyan" />}
            title="Transparent Economics"
            text="Crystal clear pricing structure. No hidden fees. Zero-GST receipts generated instantly through the platform."
          />
          <Feature
            delay={0.4}
            icon={<Store size={24} className="text-bugatti-cyan" />}
            title="Owner Dashboard"
            text="A high-performance telemetry dashboard for owners to track occupancy, revenue, and leads in real-time."
          />
          <Feature
            delay={0.5}
            icon={<Zap size={24} className="text-bugatti-cyan" />}
            title="Automated Operations"
            text="Seamlessly manage billing, electricity telemetry, and food schedules without manual intervention."
          />
          <Feature
            delay={0.6}
            icon={<MapPin size={24} className="text-bugatti-cyan" />}
            title="Scalable Architecture"
            text="Built on a robust, national-ready infrastructure starting with Hyderabad's premium sector."
          />
        </div>
      </section>

      <footer className="border-t border-white/5 bg-bugatti-carbon/50 py-12 text-center backdrop-blur-md">
        <div className="flex justify-center mb-6">
          <div className="text-2xl font-bold tracking-widest text-white">PG<span className="text-bugatti-cyan">EASE</span></div>
        </div>
        <p className="text-sm text-slate-500 font-light uppercase tracking-widest">
          © 2026 PGease Technologies. The Standard of Living.
        </p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, text, delay }: { icon: React.ReactNode; title: string; text: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel group relative overflow-hidden rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(0,210,255,0.4)]"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bugatti-cyan/10 blur-3xl transition-all group-hover:bg-bugatti-cyan/20" />
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner group-hover:bg-bugatti-cyan/10 transition-colors">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold tracking-wide text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">{text}</p>
      </div>
    </motion.div>
  );
}
