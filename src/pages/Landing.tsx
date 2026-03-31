import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Heart, Brain, TrendingUp, ArrowRight, Zap, Shield, Users, Cpu, Dna } from 'lucide-react';

const features = [
  { icon: Heart, title: 'Vitals Tracking', description: 'Real-time monitoring of your body\'s core metrics', color: '#ff2d55', xp: '+150 XP' },
  { icon: Brain, title: 'AI Disease Scan', description: 'Neural symptom analysis powered by frontier AI', color: '#00d4ff', xp: '+300 XP' },
  { icon: TrendingUp, title: 'Risk Assessment', description: 'Full-body health scoring with predictive analysis', color: '#7c3aed', xp: '+250 XP' },
  { icon: Shield, title: 'Data Fortress', description: 'Military-grade encryption on all your health data', color: '#10b981', xp: '+100 XP' },
  { icon: Zap, title: 'Instant Intel', description: 'Sub-second AI insights personalized to your profile', color: '#f59e0b', xp: '+200 XP' },
  { icon: Users, title: 'Expert Network', description: 'Access curated medical intelligence at any time', color: '#ec4899', xp: '+180 XP' },
];

const stats = [
  { value: '98.7%', label: 'Accuracy Rate', icon: Cpu },
  { value: '< 2s', label: 'AI Response', icon: Zap },
  { value: '256-bit', label: 'Encryption', icon: Shield },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Rajdhani', 'Orbitron', sans-serif" }} className="min-h-screen bg-[#050810] text-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .hex-border { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.03) 2px, rgba(0,212,255,0.03) 4px); }
        .neon-text { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
        .grid-bg { background-image: linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px); background-size: 60px 60px; }
        .card-glow:hover { box-shadow: 0 0 30px rgba(0,212,255,0.15), inset 0 0 30px rgba(0,212,255,0.05); }
        .xp-bar { background: linear-gradient(90deg, #00d4ff, #7c3aed); animation: pulse-xp 2s ease-in-out infinite; }
        @keyframes pulse-xp { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .glitch::before { content: attr(data-text); position: absolute; left: 2px; text-shadow: -2px 0 #ff2d55; clip: rect(24px, 550px, 90px, 0); animation: glitch 3s infinite linear; }
        @keyframes glitch { 0% { clip: rect(42px, 9999px, 44px, 0); } 20% { clip: rect(12px, 9999px, 78px, 0); } 40% { clip: rect(62px, 9999px, 14px, 0); } 60% { clip: rect(28px, 9999px, 90px, 0); } 80% { clip: rect(8px, 9999px, 60px, 0); } 100% { clip: rect(42px, 9999px, 44px, 0); } }
        .corner-bracket::before, .corner-bracket::after { content: ''; position: absolute; width: 12px; height: 12px; border-color: #00d4ff; border-style: solid; }
        .corner-bracket::before { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .corner-bracket::after { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
      `}</style>

      {/* Ambient background */}
      <div className="fixed inset-0 grid-bg scan-line pointer-events-none" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      {/* NAV */}
      <nav className="relative z-50 border-b border-[#00d4ff]/20 bg-[#050810]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 hex-border bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-black text-lg tracking-widest text-white">MEDI<span className="text-[#00d4ff]">INTEL</span></span>
              <div className="text-[10px] tracking-[0.3em] text-[#00d4ff]/60" style={{ fontFamily: "'Share Tech Mono', monospace" }}>HEALTH_OS v2.4.1</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm border border-[#00d4ff]/30 text-[#00d4ff] rounded hover:bg-[#00d4ff]/10 transition-all tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              [LOGIN]
            </button>
            <button onClick={() => navigate('/signup')} className="px-5 py-2 text-sm bg-[#00d4ff] text-[#050810] font-bold rounded hover:bg-white transition-all tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              [ENROLL]
            </button>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* HERO */}
        <section className="py-24 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 border border-[#00d4ff]/40 rounded-full bg-[#00d4ff]/5" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
            <span className="text-[#00d4ff] text-xs tracking-widest">SYSTEM ONLINE // AI-POWERED HEALTH INTELLIGENCE</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", lineHeight: 1.1 }} className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="text-white">LEVEL UP</span>
              <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ff2d55)' }}>YOUR HEALTH</span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[#8892a4] text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 300, letterSpacing: '0.05em' }}>
            The world's first gamified health intelligence platform. Track vitals, detect diseases, and optimize your body like a pro — powered by frontier AI.
          </motion.p>

          {/* XP Progress showcase */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative max-w-sm mx-auto p-4 border border-[#00d4ff]/20 rounded-xl bg-[#0a0f1e]/80 corner-bracket">
            <div className="flex items-center justify-between mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              <span className="text-xs text-[#00d4ff]/60">HEALTH SCORE</span>
              <span className="text-xs text-[#00d4ff]">LVL 12 → 13</span>
            </div>
            <div className="h-3 bg-[#0d1528] rounded-full overflow-hidden border border-[#00d4ff]/20">
              <motion.div className="h-full xp-bar rounded-full" initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              <span>7,200 / 10,000 XP</span>
              <span className="text-[#00d4ff]">+2,800 XP to next level</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,212,255,0.4)' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/signup')}
              className="px-8 py-4 font-bold text-lg rounded-lg text-[#050810] tracking-widest flex items-center justify-center gap-2"
              style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
              START MISSION <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
              className="px-8 py-4 font-bold text-lg rounded-lg border border-[#00d4ff]/40 text-[#00d4ff] tracking-widest hover:bg-[#00d4ff]/10 transition-all"
              style={{ fontFamily: "'Orbitron', sans-serif" }}>
              CONTINUE GAME
            </motion.button>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-3 gap-4 mb-24">
          {stats.map((s, i) => (
            <div key={i} className="p-6 border border-[#00d4ff]/20 rounded-xl bg-[#0a0f1e]/60 text-center corner-bracket relative card-glow transition-all">
              <s.icon className="w-6 h-6 mx-auto mb-2 text-[#00d4ff]" />
              <div style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-[#8892a4] text-sm tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* FEATURES GRID */}
        <section className="mb-24 space-y-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <div className="text-[#00d4ff]/60 text-sm tracking-[0.4em] mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// ABILITY_TREE</div>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl font-black text-white tracking-tight">UNLOCK YOUR POWERS</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: `0 0 30px ${f.color}25` }}
                className="p-6 border rounded-xl bg-[#0a0f1e]/80 cursor-pointer transition-all relative overflow-hidden corner-bracket"
                style={{ borderColor: `${f.color}30` }}>
                <div className="absolute top-0 right-0 text-[10px] px-2 py-1 rounded-bl font-mono" style={{ background: `${f.color}20`, color: f.color, fontFamily: "'Share Tech Mono', monospace" }}>{f.xp}</div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: `${f.color}15`, border: `1px solid ${f.color}40` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-bold text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-[#8892a4] text-sm leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 300 }}>{f.description}</p>
                <div className="mt-4 h-1 rounded-full bg-[#0d1528]">
                  <motion.div className="h-full rounded-full" style={{ background: f.color, width: '0%' }} whileInView={{ width: `${60 + i * 8}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
          <div className="relative p-12 rounded-2xl text-center overflow-hidden border border-[#00d4ff]/20" style={{ background: 'linear-gradient(135deg, #0a0f1e, #0d1528)' }}>
            <div className="absolute inset-0 scan-line" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="text-[#00d4ff] text-sm tracking-[0.4em] mb-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// MISSION_BRIEFING</div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl md:text-5xl font-black text-white mb-4">READY TO BEGIN?</h2>
              <p className="text-[#8892a4] mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Join the next generation of health-aware individuals. Your body is the final frontier — start exploring it today.</p>
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,255,0.5)' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/signup')}
                className="px-10 py-4 font-black text-lg rounded-lg text-[#050810] tracking-widest"
                style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                INITIALIZE PLAYER
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-[#00d4ff]/10 bg-[#050810]/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-black tracking-widest text-white text-sm">MEDI<span className="text-[#00d4ff]">INTEL</span></span>
          <span className="text-[#8892a4] text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>© 2026 MediIntel Health OS // All systems nominal</span>
          <div className="flex gap-4 text-xs text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <span className="hover:text-[#00d4ff] cursor-pointer transition-colors">[Privacy]</span>
            <span className="hover:text-[#00d4ff] cursor-pointer transition-colors">[Terms]</span>
            <span className="hover:text-[#00d4ff] cursor-pointer transition-colors">[Docs]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}