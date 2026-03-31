import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertCircle, CheckCircle, X, Loader, Cpu } from 'lucide-react';
import { diseaseApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SYMPTOMS = ['Fever','Cough','Fatigue','Headache','Sore Throat','Nausea','Dizziness','Chest Pain','Shortness of Breath','Muscle Pain','Joint Pain','Chills','Loss of Appetite','Abdominal Pain','Vomiting','Diarrhea','Runny Nose','Congestion','Rash','Sweating'];
interface Disease { name: string; confidence: number; }
interface DetectionResult { diseases: Disease[]; recommendations: string[]; severity: string; }

export default function DiseaseDetection() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = SYMPTOMS.filter(s => s.toLowerCase().includes(search.toLowerCase()) && !selected.includes(s));
  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const analyze = async () => {
    if (!selected.length) return;
    setLoading(true); setError(null);
    try {
      if (!user) throw new Error('Not authenticated');
      setResult(await diseaseApi.detect(user.id, selected));
    } catch (e) { setError(e instanceof Error ? e.message : 'Analysis failed'); }
    finally { setLoading(false); }
  };

  const sev = { high: { c: '#ff2d55', bg: 'rgba(255,45,85,0.15)', l: 'CRITICAL' }, medium: { c: '#f59e0b', bg: 'rgba(245,158,11,0.15)', l: 'MODERATE' }, low: { c: '#10b981', bg: 'rgba(16,185,129,0.15)', l: 'STABLE' } };
  const s = sev[(result?.severity?.toLowerCase() as keyof typeof sev) ?? 'low'] ?? sev.low;

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
      .gbg{background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:60px 60px;}
      .cc::before,.cc::after{content:'';position:absolute;width:12px;height:12px;border-color:#00d4ff;border-style:solid;}
      .cc::before{top:0;left:0;border-width:2px 0 0 2px;} .cc::after{bottom:0;right:0;border-width:0 2px 2px 0;}
      .ss::-webkit-scrollbar{width:4px;} .ss::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.3);border-radius:4px;}`}</style>
      <div className="fixed inset-0 gbg pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00d4ff]/30 rounded-full bg-[#00d4ff]/5" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <Cpu className="w-4 h-4 text-[#00d4ff]" /><span className="text-[#00d4ff] text-xs tracking-widest">NEURAL_SCAN // AI DIAGNOSTIC ENGINE</span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-5xl font-black">SYMPTOM <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>SCANNER</span></h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative p-6 border border-[#00d4ff]/20 rounded-xl bg-[#0a0f1e]/80 cc">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-[#00d4ff]" />
                <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-bold text-white">SELECT SYMPTOMS</span>
                <span className="ml-auto text-xs text-[#00d4ff]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{selected.length}_ACTIVE</span>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892a4]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search_symptoms..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d1528] border border-[#00d4ff]/20 rounded-lg text-white placeholder-[#8892a4]/50 focus:outline-none focus:border-[#00d4ff]/50 text-sm"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }} />
              </div>
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 border border-[#00d4ff]/10 rounded-lg bg-[#0d1528]/50">
                  {selected.map(sym => (
                    <motion.div key={sym} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#050810]" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', fontFamily: "'Share Tech Mono', monospace" }}>
                      {sym}<button onClick={() => toggle(sym)}><X className="w-3 h-3" /></button>
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto ss mb-4">
                {filtered.map(sym => (
                  <motion.button key={sym} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggle(sym)}
                    className="px-3 py-2 text-left border border-[#00d4ff]/15 hover:border-[#00d4ff]/40 rounded-lg text-[#8892a4] hover:text-[#00d4ff] text-xs transition-all bg-[#0d1528]/50 hover:bg-[#00d4ff]/5"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}>▸ {sym}</motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,212,255,0.35)' }} whileTap={{ scale: 0.98 }}
                onClick={analyze} disabled={!selected.length || loading}
                className="w-full py-4 font-black rounded-lg flex items-center justify-center gap-2 tracking-widest disabled:opacity-30"
                style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#050810' }}>
                {loading ? <><Loader className="w-5 h-5 animate-spin text-white" /><span className="text-white">SCANNING...</span></> : <><Sparkles className="w-5 h-5" />RUN DIAGNOSTIC</>}
              </motion.button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div key="err" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 border border-[#ff2d55]/40 rounded-xl bg-[#ff2d55]/10 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#ff2d55] mt-0.5 flex-shrink-0" />
                  <div><div className="text-[#ff2d55] font-bold text-sm mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>SCAN_ERROR</div>
                  <p className="text-[#ff2d55]/80 text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{error}</p></div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="res" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="relative p-4 border rounded-xl cc flex items-center justify-between" style={{ borderColor: `${s.c}40`, background: s.bg }}>
                    <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-black text-white">DIAGNOSIS COMPLETE</span>
                    <span className="px-3 py-1 rounded-full text-xs font-black" style={{ fontFamily: "'Orbitron', sans-serif", background: s.c, color: '#050810' }}>{s.l}</span>
                  </div>
                  <div className="relative p-5 border border-[#00d4ff]/20 rounded-xl bg-[#0a0f1e]/80 cc space-y-3">
                    <div className="text-[#00d4ff]/60 text-xs tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// DETECTED_CONDITIONS</div>
                    {result.diseases?.length > 0 ? result.diseases.map((d, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-3 border border-[#00d4ff]/10 rounded-lg bg-[#0d1528]/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">{d.name}</span>
                          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', fontFamily: "'Orbitron', sans-serif" }}>{Math.round(d.confidence * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-[#050810] rounded-full overflow-hidden">
                          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} initial={{ width: 0 }} animate={{ width: `${d.confidence * 100}%` }} transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }} />
                        </div>
                      </motion.div>
                    )) : <p className="text-[#8892a4] text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>NO_CONDITIONS_DETECTED</p>}
                  </div>
                  {result.recommendations?.length > 0 && (
                    <div className="relative p-5 border border-[#10b981]/20 rounded-xl bg-[#0a0f1e]/80 cc space-y-2">
                      <div className="text-[#10b981]/60 text-xs tracking-widest mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// RECOMMENDED_ACTIONS</div>
                      {result.recommendations.map((r, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 text-sm text-[#8892a4]">
                          <CheckCircle className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />{r}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative p-12 border border-[#00d4ff]/10 rounded-xl bg-[#0a0f1e]/50 text-center cc">
                  <Sparkles className="w-14 h-14 mx-auto mb-4 text-[#00d4ff]/30" />
                  <div style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-[#8892a4] font-bold tracking-wide">AWAITING INPUT</div>
                  <div className="text-[#8892a4]/50 text-xs mt-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>select symptoms → run diagnostic</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}