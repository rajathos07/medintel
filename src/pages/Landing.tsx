import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Activity, Heart, Brain, TrendingUp, ArrowRight, Zap, Shield, Cpu, Dna, Microscope } from 'lucide-react';

const FEATURES = [
  { icon: Heart,       title: 'Live Vitals',       desc: 'Real-time physiological monitoring with anomaly detection',       color: '#f87171', glow: 'rgba(248,113,113,0.25)' },
  { icon: Brain,       title: 'Neural Diagnosis',  desc: 'AI symptom analysis trained on 50M+ clinical datasets',          color: '#00e5ff', glow: 'rgba(0,229,255,0.2)'  },
  { icon: TrendingUp,  title: 'Risk Modeling',     desc: 'Predictive health scoring with personalized risk trajectories',  color: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
  { icon: Shield,      title: 'Zero-Trust Data',   desc: 'End-to-end encrypted health vault — your data, always yours',   color: '#34d399', glow: 'rgba(52,211,153,0.2)'  },
  { icon: Zap,         title: 'Instant Intel',     desc: 'Sub-second AI insights delivered in plain language',             color: '#fbbf24', glow: 'rgba(251,191,36,0.2)'  },
  { icon: Dna,         title: 'Biomarker Trends',  desc: 'Longitudinal tracking of 20+ biomarkers over time',             color: '#fb7185', glow: 'rgba(251,113,133,0.2)' },
];

const STATS = [
  { val: '98.7%', label: 'Diagnostic Accuracy' },
  { val: '< 1.4s', label: 'AI Response Time' },
  { val: '256-AES', label: 'Encryption Grade' },
  { val: '50M+', label: 'Clinical Data Points' },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#020d18', color: '#e0f7ff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Syne:wght@700;800;900&family=Azeret+Mono:wght@400;500&display=swap');

        /* Noise overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 999;
          opacity: 0.5;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .cell-ring {
          border-radius: 50%;
          border: 1px solid rgba(0,229,255,0.12);
          position: absolute;
          animation: cell-rotate linear infinite;
        }

        @keyframes cell-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .glow-text {
          text-shadow: 0 0 60px rgba(0,229,255,0.35), 0 0 120px rgba(0,229,255,0.15);
        }

        .bio-card {
          position: relative;
          background: linear-gradient(135deg, rgba(2,20,35,0.9), rgba(3,15,28,0.95));
          border: 1px solid rgba(0,229,255,0.1);
          border-radius: 20px;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          overflow: hidden;
        }

        .bio-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(ellipse at top left, rgba(0,229,255,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .bio-card:hover {
          border-color: rgba(0,229,255,0.25);
          transform: translateY(-4px);
        }

        .ecg-line {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: ecg-draw 3s ease forwards 1s;
        }

        @keyframes ecg-draw {
          to { stroke-dashoffset: 0; }
        }

        .stat-glow:hover {
          box-shadow: 0 0 40px rgba(0,229,255,0.12);
        }

        .btn-primary {
          background: linear-gradient(135deg, #00c8e8, #0284c7);
          color: #020d18;
          font-weight: 700;
          border-radius: 12px;
          padding: 14px 32px;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Azeret Mono', monospace;
          transition: box-shadow 0.3s, transform 0.2s;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          box-shadow: 0 0 40px rgba(0,200,232,0.5), 0 4px 20px rgba(0,0,0,0.4);
          transform: translateY(-2px);
        }

        .btn-ghost {
          background: transparent;
          color: rgba(0,229,255,0.8);
          font-weight: 600;
          border-radius: 12px;
          padding: 14px 32px;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Azeret Mono', monospace;
          border: 1px solid rgba(0,229,255,0.25);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .btn-ghost:hover {
          background: rgba(0,229,255,0.06);
          border-color: rgba(0,229,255,0.45);
        }

        .scroll-indicator {
          animation: scroll-bob 2s ease-in-out infinite;
        }

        @keyframes scroll-bob {
          0%,100% { transform: translateY(0); opacity: 0.7; }
          50%      { transform: translateY(6px); opacity: 1; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(0,229,255,0.07)',
        background: 'rgba(2,13,24,0.85)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#00e5ff22,#00e5ff11)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity style={{ width: 18, height: 18, color: '#00e5ff', filter: 'drop-shadow(0 0 6px #00e5ff)' }} />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: 2, color: '#e0f7ff' }}>
              MEDI<span style={{ color: '#00e5ff' }}>INTEL</span>
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: 12 }}>
            <button className="btn-ghost" style={{ padding: '9px 22px', fontSize: 12 }} onClick={() => navigate('/login')}>Log In</button>
            <button className="btn-primary" style={{ padding: '9px 22px', fontSize: 12 }} onClick={() => navigate('/signup')}>Get Started</button>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="hero-grid" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Ambient orbs */}
        <motion.div style={{ y: yBg, position: 'absolute', top: '10%', right: '8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <motion.div style={{ y: yBg, position: 'absolute', bottom: '5%', left: '3%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Cell rings */}
        {[260, 380, 500].map((s, i) => (
          <div key={i} className="cell-ring" style={{
            width: s, height: s, right: `calc(8% - ${s/2 - 130}px)`, top: `calc(50% - ${s/2}px)`,
            animationDuration: `${20 + i * 8}s`,
            animationDirection: i % 2 ? 'reverse' : 'normal',
          }} />
        ))}

        {/* ECG decorative SVG */}
        <svg style={{ position: 'absolute', bottom: 40, left: 0, right: 0, width: '100%', opacity: 0.2 }} height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path className="ecg-line" d="M0,30 L200,30 L230,30 L245,5 L260,55 L275,15 L290,30 L400,30 L430,30 L445,5 L460,55 L475,15 L490,30 L700,30 L730,30 L745,5 L760,55 L775,15 L790,30 L1200,30"
            stroke="#00e5ff" strokeWidth="1.5" fill="none" />
        </svg>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: 640 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.2)', marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', display: 'inline-block', animation: 'sos-beat 2s infinite' }} />
              <span style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(0,229,255,0.8)', fontFamily: "'Azeret Mono', monospace" }}>SYSTEM ONLINE // AI HEALTH INTELLIGENCE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glow-text"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 1.05, letterSpacing: -1, marginBottom: 24, color: '#f0faff' }}
            >
              Your body.<br />
              <span style={{ color: '#00e5ff' }}>Decoded.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(176,213,230,0.75)', marginBottom: 40, fontWeight: 300, maxWidth: 500 }}>
              The world's most advanced personal health OS. AI-powered diagnostics, real-time vitals tracking, and predictive risk modeling — all in one bioluminescent interface.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                Begin Scan <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button className="btn-ghost" onClick={() => navigate('/login')}>
                Resume Session
              </button>
            </motion.div>

            {/* Mini stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ display: 'flex', gap: 32, marginTop: 52, paddingTop: 32, borderTop: '1px solid rgba(0,229,255,0.08)' }}>
              {STATS.slice(0, 3).map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: '#00e5ff', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.7)', marginTop: 4, letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-indicator" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(0,229,255,0.35)', fontSize: 11, fontFamily: "'Azeret Mono', monospace", letterSpacing: '0.2em', textAlign: 'center' }}>
          SCROLL
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Azeret Mono', monospace", fontSize: 11, letterSpacing: '0.25em', color: 'rgba(0,229,255,0.5)', marginBottom: 16 }}>// CAPABILITIES</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: '#e0f7ff', letterSpacing: -0.5 }}>
            Medical-grade tools.<br /><span style={{ color: '#00e5ff' }}>Consumer-grade experience.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="bio-card" style={{ padding: 28 }}
              whileHover={{ boxShadow: `0 8px 40px ${f.glow}` }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <f.icon style={{ width: 22, height: 22, color: f.color, filter: `drop-shadow(0 0 6px ${f.color})` }} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: '#e0f7ff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.75)', lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
              <div style={{ marginTop: 20, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${f.color}60, transparent)` }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(0,229,255,0.07)', borderBottom: '1px solid rgba(0,229,255,0.07)', background: 'rgba(0,229,255,0.02)', padding: '60px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className="stat-glow" style={{ textAlign: 'center', padding: 24, borderRadius: 16, border: '1px solid rgba(0,229,255,0.07)', transition: 'box-shadow 0.3s' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: '#00e5ff', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.65)', marginTop: 8, letterSpacing: '0.08em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ borderRadius: 28, padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(52,211,153,0.04) 100%)', border: '1px solid rgba(0,229,255,0.12)' }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Azeret Mono', monospace", fontSize: 11, letterSpacing: '0.25em', color: 'rgba(0,229,255,0.5)', marginBottom: 20 }}>// INITIALIZE HEALTH PROFILE</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', color: '#f0faff', marginBottom: 18, letterSpacing: -0.5 }}>
              Ready to know<br />your body?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(176,213,230,0.65)', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px', fontWeight: 300 }}>
              Join thousands monitoring their health with clinical-grade AI. Free to start, no credit card required.
            </p>
            <button className="btn-primary" style={{ fontSize: 14, padding: '16px 40px' }} onClick={() => navigate('/signup')}>
              Start Free Today <ArrowRight style={{ width: 17, height: 17 }} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(0,229,255,0.06)', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 2, color: '#e0f7ff' }}>
            MEDI<span style={{ color: '#00e5ff' }}>INTEL</span>
          </span>
          <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.45)', fontFamily: "'Azeret Mono', monospace" }}>© 2026 MedIntel Health OS · All rights reserved</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Docs'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'rgba(0,229,255,0.45)', cursor: 'pointer', fontFamily: "'Azeret Mono', monospace", letterSpacing: '0.05em' }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}