import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Loader, Activity } from 'lucide-react';
import { riskAssessmentAPI } from '../services/api';

interface FormData {
  medicalHistory: { pastConditions: string[]; surgeries: string[]; familyHistory: string[]; medications: string[]; };
  lifestyle: { exercise: string; diet: string; smoking: boolean; alcohol: string; sleepHours: number; stressLevel: string; };
  vitals: { heartRate: number; bloodPressure: string; temperature: number; oxygenLevel: number; glucose: number; weight: number; bmi: number; };
  demographics: { age: number; gender: string; };
}
interface RiskResult { riskScore: number; riskLevel: string; analysis: string; concerns: string[]; recommendations: string[]; }

const STYLE = `@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
.gbg{background-image:linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px);background-size:60px 60px;}
.cc::before,.cc::after{content:'';position:absolute;width:12px;height:12px;border-color:#7c3aed;border-style:solid;}
.cc::before{top:0;left:0;border-width:2px 0 0 2px;} .cc::after{bottom:0;right:0;border-width:0 2px 2px 0;}
.inp:focus{box-shadow:0 0 0 1px #7c3aed,0 0 15px rgba(124,58,237,0.2);}
.inp{background:#0d1528;border:1px solid rgba(124,58,237,0.2);border-radius:8px;color:white;padding:10px 14px;width:100%;outline:none;font-family:'Share Tech Mono',monospace;font-size:13px;transition:all 0.2s;}`;

const inputCls = "inp";
const labelCls = "block text-xs mb-1.5 tracking-widest";

export default function RiskAssessment() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    medicalHistory: { pastConditions: [], surgeries: [], familyHistory: [], medications: [] },
    lifestyle: { exercise: 'moderate', diet: 'balanced', smoking: false, alcohol: 'none', sleepHours: 7, stressLevel: 'moderate' },
    vitals: { heartRate: 70, bloodPressure: '120/80', temperature: 36.6, oxygenLevel: 98, glucose: 90, weight: 70, bmi: 22 },
    demographics: { age: 30, gender: 'male' },
  });

  const handleArrayInput = (category: keyof FormData, field: string, value: string) => {
    const items = value.split(',').map(i => i.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [category]: { ...prev[category], [field]: items } }));
  };

  const handleAssess = async () => {
    setLoading(true); setError(null);
    try {
      const data = await riskAssessmentAPI.assess(formData);
      setResult(data);
      await riskAssessmentAPI.saveAssessment(formData, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess risk.');
    } finally { setLoading(false); }
  };

  const riskCfg = { high: { c: '#ff2d55', bg: 'rgba(255,45,85,0.12)', l: 'HIGH_RISK' }, medium: { c: '#f59e0b', bg: 'rgba(245,158,11,0.12)', l: 'MODERATE' }, low: { c: '#10b981', bg: 'rgba(16,185,129,0.12)', l: 'LOW_RISK' } };
  const rc = riskCfg[(result?.riskLevel?.toLowerCase() as keyof typeof riskCfg) ?? 'low'] ?? riskCfg.low;

  const steps = ['DEMOGRAPHICS', 'MED_HISTORY', 'LIFESTYLE', 'VITALS'];

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{STYLE}</style>
      <div className="fixed inset-0 gbg pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#7c3aed]/30 rounded-full bg-[#7c3aed]/5" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <Shield className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-[#7c3aed] text-xs tracking-widest">COMPREHENSIVE_HEALTH_SCAN</span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl font-black">RISK <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#00d4ff)' }}>ASSESSMENT</span></h1>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div key="err" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 border border-[#ff2d55]/40 rounded-xl bg-[#ff2d55]/10 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ff2d55] mt-0.5 flex-shrink-0" />
              <div><div className="text-[#ff2d55] font-bold text-sm" style={{ fontFamily: "'Orbitron', sans-serif" }}>SCAN_ERROR</div>
              <p className="text-[#ff2d55]/80 text-xs mt-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{error}</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="relative p-6 border border-[#7c3aed]/20 rounded-xl bg-[#0a0f1e]/80 cc">

              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                {steps.map((label, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all"
                        style={{ fontFamily: "'Orbitron', sans-serif", background: i + 1 <= step ? 'linear-gradient(135deg,#7c3aed,#00d4ff)' : '#0d1528', color: i + 1 <= step ? '#050810' : '#8892a4', border: i + 1 <= step ? 'none' : '1px solid rgba(124,58,237,0.2)' }}>
                        {i + 1 <= step ? (i + 1 < step ? '✓' : i + 1) : i + 1}
                      </div>
                      <span className="text-[8px] mt-1 text-[#8892a4] hidden md:block tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{label}</span>
                    </div>
                    {i < 3 && <div className="flex-1 h-0.5 mx-2" style={{ background: i + 1 < step ? 'linear-gradient(90deg,#7c3aed,#00d4ff)' : 'rgba(124,58,237,0.15)' }} />}
                  </div>
                ))}
              </div>

              <div className="text-[#7c3aed]/60 text-xs tracking-widest mb-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// STEP_{step}_OF_4 :: {steps[step-1]}</div>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls} style={{ color: 'rgba(124,58,237,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>AGE</label>
                      <input type="number" value={formData.demographics.age} onChange={e => setFormData(p => ({ ...p, demographics: { ...p.demographics, age: parseInt(e.target.value) } }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: 'rgba(124,58,237,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>GENDER</label>
                      <select value={formData.demographics.gender} onChange={e => setFormData(p => ({ ...p, demographics: { ...p.demographics, gender: e.target.value } }))} className={inputCls}>
                        <option value="male">MALE</option><option value="female">FEMALE</option><option value="other">OTHER</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {[['PAST_CONDITIONS', 'pastConditions'], ['SURGERIES', 'surgeries'], ['FAMILY_HISTORY', 'familyHistory'], ['MEDICATIONS', 'medications']].map(([lbl, field]) => (
                    <div key={field}>
                      <label className={labelCls} style={{ color: 'rgba(124,58,237,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>{lbl} <span className="opacity-50">(comma-separated)</span></label>
                      <input type="text" defaultValue={(formData.medicalHistory as any)[field]?.join(', ')} onChange={e => handleArrayInput('medicalHistory', field, e.target.value)} placeholder="e.g. diabetes, hypertension..." className={inputCls} />
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[['EXERCISE', 'exercise', [['sedentary','SEDENTARY'],['light','LIGHT'],['moderate','MODERATE'],['active','ACTIVE'],['very_active','VERY_ACTIVE']]],
                      ['DIET', 'diet', [['poor','POOR'],['fair','FAIR'],['balanced','BALANCED'],['excellent','EXCELLENT']]],
                      ['ALCOHOL', 'alcohol', [['none','NONE'],['occasional','OCCASIONAL'],['moderate','MODERATE'],['heavy','HEAVY']]],
                      ['STRESS_LEVEL', 'stressLevel', [['low','LOW'],['moderate','MODERATE'],['high','HIGH'],['very_high','VERY_HIGH']]]
                    ].map(([lbl, key, opts]) => (
                      <div key={key as string}>
                        <label className={labelCls} style={{ color: 'rgba(124,58,237,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>{lbl as string}</label>
                        <select value={(formData.lifestyle as any)[key as string]} onChange={e => setFormData(p => ({ ...p, lifestyle: { ...p.lifestyle, [key as string]: e.target.value } }))} className={inputCls}>
                          {(opts as string[][]).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                    <div>
                      <label className={labelCls} style={{ color: 'rgba(124,58,237,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>SLEEP_HOURS</label>
                      <input type="number" value={formData.lifestyle.sleepHours} onChange={e => setFormData(p => ({ ...p, lifestyle: { ...p.lifestyle, sleepHours: parseInt(e.target.value) } }))} className={inputCls} />
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-[#7c3aed]/20 rounded-lg bg-[#0d1528]">
                      <input type="checkbox" id="smoking" checked={formData.lifestyle.smoking} onChange={e => setFormData(p => ({ ...p, lifestyle: { ...p.lifestyle, smoking: e.target.checked } }))} className="w-4 h-4 accent-[#7c3aed]" />
                      <label htmlFor="smoking" className="text-[#8892a4] text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>SMOKER</label>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[['HEART_RATE (BPM)', 'heartRate', 'number'],['BLOOD_PRESSURE', 'bloodPressure', 'text'],['TEMPERATURE (°C)', 'temperature', 'number'],['OXYGEN_LEVEL (%)', 'oxygenLevel', 'number'],['GLUCOSE (mg/dL)', 'glucose', 'number'],['WEIGHT (kg)', 'weight', 'number'],['BMI', 'bmi', 'number']].map(([lbl, key, type]) => (
                      <div key={key as string}>
                        <label className={labelCls} style={{ color: 'rgba(124,58,237,0.7)', fontFamily: "'Share Tech Mono', monospace" }}>{lbl as string}</label>
                        <input type={type as string} step={key === 'temperature' || key === 'weight' || key === 'bmi' ? '0.1' : undefined}
                          value={(formData.vitals as any)[key as string]} onChange={e => setFormData(p => ({ ...p, vitals: { ...p.vitals, [key as string]: type === 'number' ? parseFloat(e.target.value) : e.target.value } }))} className={inputCls} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-4 border-t border-[#7c3aed]/10">
                {step > 1 ? (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(s => s - 1)}
                    className="px-5 py-2.5 text-sm font-black rounded-lg border border-[#7c3aed]/20 text-[#8892a4] hover:text-white tracking-widest"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>[BACK]</motion.button>
                ) : <div />}
                {step < 4 ? (
                  <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.97 }} onClick={() => setStep(s => s + 1)}
                    className="px-5 py-2.5 text-sm font-black rounded-lg tracking-widest"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#050810' }}>[NEXT]</motion.button>
                ) : (
                  <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.97 }} onClick={handleAssess} disabled={loading}
                    className="px-6 py-2.5 text-sm font-black rounded-lg flex items-center gap-2 tracking-widest disabled:opacity-40"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#7c3aed,#ff2d55)', color: 'white' }}>
                    {loading ? <><Loader className="w-4 h-4 animate-spin" />[ANALYZING...]</> : <><Activity className="w-4 h-4" />[RUN_ASSESSMENT]</>}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative p-6 border rounded-xl cc" style={{ borderColor: `${rc.c}40`, background: rc.bg }}>
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-xl font-black text-white">ASSESSMENT COMPLETE</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black" style={{ fontFamily: "'Orbitron', sans-serif", background: rc.c, color: '#050810' }}>{rc.l}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#8892a4] text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>OVERALL_RISK_SCORE</span>
                  <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-3xl font-black text-white">{result.riskScore}<span className="text-base text-[#8892a4]">/100</span></span>
                </div>
                <div className="h-3 bg-[#050810] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
                  <motion.div className="h-full rounded-full" style={{ background: rc.c }} initial={{ width: 0 }} animate={{ width: `${result.riskScore}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                </div>
              </div>

              <div className="relative p-5 border border-[#7c3aed]/20 rounded-xl bg-[#0a0f1e]/80 cc">
                <div className="text-[#7c3aed]/60 text-xs tracking-widest mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// AI_ANALYSIS</div>
                <p className="text-[#8892a4] text-sm leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{result.analysis}</p>
              </div>

              {result.concerns?.length > 0 && (
                <div className="relative p-5 border border-[#f59e0b]/20 rounded-xl bg-[#0a0f1e]/80 cc">
                  <div className="text-[#f59e0b]/60 text-xs tracking-widest mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// HEALTH_CONCERNS</div>
                  {result.concerns.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2 text-sm text-[#8892a4]"><AlertTriangle className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />{c}</div>
                  ))}
                </div>
              )}

              {result.recommendations?.length > 0 && (
                <div className="relative p-5 border border-[#10b981]/20 rounded-xl bg-[#0a0f1e]/80 cc">
                  <div className="text-[#10b981]/60 text-xs tracking-widest mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// RECOMMENDED_ACTIONS</div>
                  {result.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2 text-sm text-[#8892a4]"><CheckCircle className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />{r}</div>
                  ))}
                </div>
              )}

              <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(124,58,237,0.35)' }} whileTap={{ scale: 0.97 }}
                onClick={() => { setResult(null); setStep(1); }}
                className="w-full py-4 font-black rounded-lg tracking-widest"
                style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#050810' }}>
                [RUN_ANOTHER_ASSESSMENT]
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}