import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplet, Thermometer, Wind, TrendingUp, Calendar, Zap, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { healthApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface HealthRecord {
  id: string; user_id: string; heart_rate: number | null; blood_pressure: string | null;
  temperature: number | null; oxygen_level: number | null; glucose: number | null;
  weight: number | null; notes: string | null; recorded_at: string;
}

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  .grid-bg{background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:60px 60px;}
  .corner::before,.corner::after{content:'';position:absolute;width:12px;height:12px;border-style:solid;}
  .corner-c::before{top:0;left:0;border-width:2px 0 0 2px;border-color:#00d4ff;}
  .corner-c::after{bottom:0;right:0;border-width:0 2px 2px 0;border-color:#00d4ff;}
  .stat-glow:hover{box-shadow:0 0 25px rgba(0,212,255,0.12);}
`;

export default function Dashboard() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    healthApi.getRecent(7).then(d => { setRecords(d || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const latest = records[0];
  const heartRateData = [...records].reverse().map(r => ({
    date: new Date(r.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: r.heart_rate || 0,
  }));

  const vitals = [
    { icon: Heart, label: 'Heart Rate', value: latest?.heart_rate ?? '--', unit: 'BPM', color: '#ff2d55', progress: latest?.heart_rate ? Math.min((latest.heart_rate / 120) * 100, 100) : 0 },
    { icon: Activity, label: 'Blood Pressure', value: latest?.blood_pressure ?? '--', unit: 'mmHg', color: '#00d4ff', progress: 75 },
    { icon: Thermometer, label: 'Temperature', value: latest?.temperature ?? '--', unit: '°C', color: '#f59e0b', progress: latest?.temperature ? ((latest.temperature - 35) / 5) * 100 : 0 },
    { icon: Wind, label: 'Oxygen Level', value: latest?.oxygen_level ?? '--', unit: '%', color: '#10b981', progress: latest?.oxygen_level ?? 0 },
    { icon: Droplet, label: 'Glucose', value: latest?.glucose ?? '--', unit: 'mg/dL', color: '#a855f7', progress: latest?.glucose ? Math.min((latest.glucose / 180) * 100, 100) : 0 },
    { icon: TrendingUp, label: 'Weight', value: latest?.weight ?? '--', unit: 'kg', color: '#ec4899', progress: 60 },
  ];

  const achievements = [
    { label: 'First Record', done: records.length > 0, icon: '🏆' },
    { label: '7-Day Streak', done: records.length >= 7, icon: '🔥' },
    { label: 'AI Scan', done: false, icon: '🧠' },
    { label: 'Risk Check', done: false, icon: '🛡️' },
  ];

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{SHARED_STYLES}</style>
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="relative p-6 border border-[#00d4ff]/20 rounded-xl bg-[#0a0f1e]/80 backdrop-blur corner corner-c overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at left, rgba(0,212,255,0.05) 0%, transparent 60%)' }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-[#00d4ff]/60 text-xs tracking-widest mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// PLAYER_DASHBOARD</div>
              <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-3xl font-black text-white">
                WELCOME BACK, <span className="text-[#00d4ff]">{(profile?.full_name || 'PLAYER').toUpperCase()}</span>
              </h1>
              <p className="text-[#8892a4] text-sm mt-1 flex items-center gap-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Award className="w-5 h-5 text-[#f59e0b]" />
                <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-2xl font-black text-[#f59e0b]">LVL 12</span>
              </div>
              <div className="w-36 h-2 bg-[#0d1528] rounded-full overflow-hidden border border-[#00d4ff]/20">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
                  initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 0.5, duration: 1 }} />
              </div>
              <div className="text-[10px] text-[#8892a4] mt-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>7,200 / 10,000 XP</div>
            </div>
          </div>
        </motion.div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vitals.map((v, i) => (
            <motion.div key={v.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="relative p-5 border rounded-xl bg-[#0a0f1e]/80 stat-glow transition-all corner corner-c"
              style={{ borderColor: `${v.color}30` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}>
                  <v.icon className="w-5 h-5" style={{ color: v.color }} />
                </div>
                <span className="text-xs" style={{ color: v.color, fontFamily: "'Share Tech Mono', monospace" }}>LIVE</span>
              </div>
              <div className="text-[#8892a4] text-xs mb-1 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{v.label.toUpperCase()}</div>
              <div className="flex items-baseline gap-1 mb-3">
                <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-2xl font-black text-white">{v.value}</span>
                <span className="text-xs text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{v.unit}</span>
              </div>
              <div className="h-1.5 bg-[#0d1528] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: v.color }}
                  initial={{ width: 0 }} animate={{ width: `${v.progress}%` }} transition={{ delay: 0.3 + i * 0.07, duration: 0.8 }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          {records.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="lg:col-span-2 relative p-6 border border-[#ff2d55]/20 rounded-xl bg-[#0a0f1e]/80 corner corner-c">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-[#ff2d55]" />
                <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-bold text-white tracking-wide">HEART RATE HISTORY</span>
                <span className="ml-auto text-xs text-[#ff2d55]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>7D_TREND</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={heartRateData}>
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff2d55" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.08)" />
                  <XAxis dataKey="date" stroke="#4a5568" tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fill: '#8892a4' }} />
                  <YAxis stroke="#4a5568" tick={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, fill: '#8892a4' }} />
                  <Tooltip contentStyle={{ background: '#0a0f1e', border: '1px solid rgba(255,45,85,0.3)', borderRadius: '8px', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="#ff2d55" strokeWidth={2} fill="url(#hg)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="relative p-6 border border-[#f59e0b]/20 rounded-xl bg-[#0a0f1e]/80 corner corner-c">
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-[#f59e0b]" />
              <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-bold text-white tracking-wide">ACHIEVEMENTS</span>
            </div>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${a.done ? 'border-[#f59e0b]/30 bg-[#f59e0b]/5' : 'border-[#ffffff]/5 bg-[#0d1528]/50 opacity-50'}`}>
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-sm text-white flex-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{a.label}</span>
                  {a.done && <span className="text-[#f59e0b] text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>✓</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}