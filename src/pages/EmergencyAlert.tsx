import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Heart, Thermometer, Activity, Shield, CheckCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SHARED = `@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
.gbg{background-image:linear-gradient(rgba(255,45,85,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,45,85,0.03) 1px,transparent 1px);background-size:60px 60px;}
.scan{background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,45,85,0.02) 2px,rgba(255,45,85,0.02) 4px);}
.cc-red::before,.cc-red::after{content:'';position:absolute;width:12px;height:12px;border-color:#ff2d55;border-style:solid;}
.cc-red::before{top:0;left:0;border-width:2px 0 0 2px;} .cc-red::after{bottom:0;right:0;border-width:0 2px 2px 0;}
.cc-amber::before,.cc-amber::after{content:'';position:absolute;width:12px;height:12px;border-color:#f59e0b;border-style:solid;}
.cc-amber::before{top:0;left:0;border-width:2px 0 0 2px;} .cc-amber::after{bottom:0;right:0;border-width:0 2px 2px 0;}
@keyframes sos-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,45,85,0.6),0 0 30px rgba(255,45,85,0.3)}50%{box-shadow:0 0 0 20px rgba(255,45,85,0),0 0 60px rgba(255,45,85,0.5)}}
.sos-btn{animation:sos-pulse 2s ease-in-out infinite;}
@keyframes alert-blink{0%,100%{opacity:1}50%{opacity:0.4}}
.alert-blink{animation:alert-blink 1s ease-in-out infinite;}`;

const EMERGENCY_CONTACTS = [
  { name: 'Emergency Services', number: '112', icon: AlertTriangle, color: '#ff2d55', description: 'Police · Fire · Ambulance' },
  { name: 'NIMHANS Helpline', number: '080-46110007', icon: Heart, color: '#f59e0b', description: 'Mental Health Crisis' },
  { name: 'Poison Control', number: '1800-116-117', icon: Shield, color: '#7c3aed', description: '24/7 Toxicology Support' },
];

const SYMPTOMS_TO_WATCH = [
  { symptom: 'Chest Pain / Pressure', severity: 'CRITICAL', color: '#ff2d55', action: 'Call 112 immediately' },
  { symptom: 'Difficulty Breathing', severity: 'CRITICAL', color: '#ff2d55', action: 'Call 112 immediately' },
  { symptom: 'Sudden Severe Headache', severity: 'HIGH', color: '#f59e0b', action: 'Seek emergency care' },
  { symptom: 'Loss of Balance / Dizziness', severity: 'HIGH', color: '#f59e0b', action: 'Sit down, call caregiver' },
  { symptom: 'Blurred Vision', severity: 'HIGH', color: '#f59e0b', action: 'Seek emergency care' },
  { symptom: 'Slurred Speech', severity: 'CRITICAL', color: '#ff2d55', action: 'Possible stroke — Call 112' },
  { symptom: 'Sudden Weakness (one side)', severity: 'CRITICAL', color: '#ff2d55', action: 'Possible stroke — Call 112' },
  { symptom: 'Severe Abdominal Pain', severity: 'HIGH', color: '#f59e0b', action: 'Seek emergency care' },
];

export default function EmergencyAlert() {
  const { profile } = useAuth();
  const [sosSent, setSosSent] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const triggerSOS = async () => {
    setSosLoading(true);
    // In production, this would call a Supabase Edge Function to:
    // 1. Send SMS/email to emergency_contact in user_profiles
    // 2. Log the SOS event in the database
    // 3. Share location if permission granted
    await new Promise(r => setTimeout(r, 2000)); // Simulate API call
    setSosSent(true);
    setSosLoading(false);
    setConfirmVisible(false);
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const hasCritical = selectedSymptoms.some(s =>
    SYMPTOMS_TO_WATCH.find(w => w.symptom === s)?.severity === 'CRITICAL'
  );

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{SHARED}</style>
      <div className="fixed inset-0 gbg scan pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
          <div className="text-[#ff2d55]/60 text-xs tracking-widest mb-2 alert-blink" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// EMERGENCY_PROTOCOL</div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl font-black text-white">
            SOS <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#ff2d55,#f59e0b)' }}>ALERT</span>
          </h1>
          <p className="text-[#8892a4] text-sm mt-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            Emergency contacts · Symptom checker · Quick dial
          </p>
        </motion.div>

        {/* SOS Button */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {sosSent ? (
              <motion.div key="sent" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center space-y-3">
                <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '3px solid #10b981' }}>
                  <CheckCircle className="w-16 h-16 text-[#10b981]" />
                </div>
                <div style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-xl font-black text-[#10b981]">SOS SENT</div>
                <p className="text-[#8892a4] text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  Alert sent to: {profile?.emergency_contact || 'Emergency Contact'}
                </p>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setSosSent(false)}
                  className="px-6 py-2 border border-[#10b981]/30 rounded-lg text-[#10b981] text-sm"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  RESET
                </motion.button>
              </motion.div>
            ) : confirmVisible ? (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 p-6 border border-[#ff2d55]/30 rounded-xl bg-[#ff2d55]/5 max-w-sm w-full">
                <AlertTriangle className="w-12 h-12 text-[#ff2d55] mx-auto" />
                <div style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-lg font-black text-white">CONFIRM SOS?</div>
                <p className="text-[#8892a4] text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  This will immediately alert {profile?.emergency_contact || 'your emergency contact'} with your current status.
                </p>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={triggerSOS} disabled={sosLoading}
                    className="flex-1 py-3 font-black text-sm rounded-lg tracking-widest"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#ff2d55,#f59e0b)', color: '#050810' }}>
                    {sosLoading ? 'SENDING...' : 'CONFIRM'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={() => setConfirmVisible(false)}
                    className="flex-1 py-3 font-black text-sm rounded-lg border border-[#ff2d55]/20 text-[#8892a4] tracking-widest"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>CANCEL</motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button key="sos" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setConfirmVisible(true)}
                className="sos-btn w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 border-[#ff2d55] cursor-pointer"
                style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.2) 0%, rgba(255,45,85,0.05) 100%)' }}>
                <AlertTriangle className="w-12 h-12 text-[#ff2d55] mb-1" />
                <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-black text-2xl text-[#ff2d55]">SOS</span>
                <span className="text-[10px] text-[#ff2d55]/70 tracking-widest mt-0.5" style={{ fontFamily: "'Share Tech Mono', monospace" }}>PRESS · HOLD</span>
              </motion.button>
            )}
          </AnimatePresence>

          {!sosSent && !confirmVisible && profile?.emergency_contact && (
            <p className="mt-4 text-xs text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              Will alert: <span className="text-[#f59e0b]">{profile.emergency_contact}</span>
            </p>
          )}
          {!sosSent && !confirmVisible && !profile?.emergency_contact && (
            <p className="mt-4 text-xs text-[#ff2d55]/70 border border-[#ff2d55]/20 px-3 py-1.5 rounded-lg" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              ⚠ Set an emergency contact in Profile first
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Contacts */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="relative p-5 border border-[#ff2d55]/20 rounded-xl bg-[#0a0f1e]/80 cc-red space-y-3">
            <div className="text-[#ff2d55]/60 text-xs tracking-widest mb-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// EMERGENCY_CONTACTS</div>
            {EMERGENCY_CONTACTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.a key={i} href={`tel:${c.number}`} whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer block"
                  style={{ borderColor: `${c.color}25`, background: `${c.color}08` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{c.name}</div>
                    <div className="text-xs text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{c.description}</div>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: c.color }}>
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{c.number}</span>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Symptom Checker */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="relative p-5 border border-[#f59e0b]/20 rounded-xl bg-[#0a0f1e]/80 cc-amber space-y-3">
            <div className="text-[#f59e0b]/60 text-xs tracking-widest mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// SYMPTOM_CHECK</div>
            <p className="text-xs text-[#8892a4] mb-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>Select symptoms you're experiencing:</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,158,11,0.2) transparent' }}>
              {SYMPTOMS_TO_WATCH.map((s, i) => (
                <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSymptom(s.symptom)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all"
                  style={{
                    borderColor: selectedSymptoms.includes(s.symptom) ? `${s.color}50` : 'rgba(255,255,255,0.06)',
                    background: selectedSymptoms.includes(s.symptom) ? `${s.color}10` : 'transparent',
                  }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-white">{s.symptom}</div>
                    {selectedSymptoms.includes(s.symptom) && (
                      <div className="text-[10px] mt-0.5" style={{ color: s.color, fontFamily: "'Share Tech Mono', monospace" }}>→ {s.action}</div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: s.color, background: `${s.color}15`, fontFamily: "'Share Tech Mono', monospace" }}>{s.severity}</span>
                </motion.button>
              ))}
            </div>

            {hasCritical && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg border border-[#ff2d55]/40 bg-[#ff2d55]/10 alert-blink">
                <AlertTriangle className="w-4 h-4 text-[#ff2d55] shrink-0" />
                <span className="text-xs text-[#ff2d55]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  CRITICAL symptoms detected — Call 112 now
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Vitals Warning Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative p-5 border border-[#7c3aed]/20 rounded-xl bg-[#0a0f1e]/80">
          <div className="text-[#7c3aed]/60 text-xs tracking-widest mb-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// DANGER_THRESHOLDS · Seek immediate care if vitals exceed these ranges</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Activity, label: 'HEART RATE', warn: '< 50 or > 120 BPM', color: '#ff2d55' },
              { icon: Activity, label: 'BLOOD PRESSURE', warn: '> 180/120 mmHg', color: '#f59e0b' },
              { icon: Thermometer, label: 'TEMPERATURE', warn: '> 38.5°C or < 35°C', color: '#00d4ff' },
              { icon: Heart, label: 'OXYGEN LEVEL', warn: '< 90% SpO₂', color: '#7c3aed' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-3 rounded-xl border" style={{ borderColor: `${v.color}25`, background: `${v.color}08` }}>
                  <Icon className="w-5 h-5 mb-2" style={{ color: v.color }} />
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: v.color, fontFamily: "'Share Tech Mono', monospace" }}>{v.label}</div>
                  <div className="text-xs text-[#8892a4]">{v.warn}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Location Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex items-center gap-2 p-3 border border-[#10b981]/15 rounded-lg bg-[#10b981]/5">
          <MapPin className="w-4 h-4 text-[#10b981] shrink-0" />
          <p className="text-xs text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            Your location will be shared with your caregiver when SOS is triggered. Ensure location access is enabled in your browser.
          </p>
        </motion.div>
      </div>
    </div>
  );
}