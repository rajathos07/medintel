import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplet, Thermometer, Wind, TrendingUp, Zap, Award, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { healthApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HealthRecord {
  id: string; heart_rate: number | null; blood_pressure: string | null;
  temperature: number | null; oxygen_level: number | null; glucose: number | null;
  weight: number | null; recorded_at: string;
}

const BIO_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&family=Azeret+Mono:wght@400;500&display=swap');
  .bio-card { background: linear-gradient(135deg, rgba(2,20,35,0.9), rgba(3,15,28,0.95)); border: 1px solid rgba(0,229,255,0.09); border-radius: 18px; transition: border-color 0.3s, box-shadow 0.3s; }
  .bio-card:hover { border-color: rgba(0,229,255,0.2); }
  .vital-card { transition: transform 0.2s, box-shadow 0.2s; }
  .vital-card:hover { transform: translateY(-3px); }
  .hero-grid { background-image: linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px); background-size: 48px 48px; }
  @keyframes sos-beat { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .live-dot { animation: sos-beat 2s infinite; }
`;

export default function Dashboard() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    healthApi.getRecent(7).then(d => { setRecords(d || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const latest = records[0];
  const chartData = [...records].reverse().map(r => ({
    t: new Date(r.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hr: r.heart_rate || 0,
    o2: r.oxygen_level || 0,
  }));

  const vitals = [
    { icon: Heart,      label: 'Heart Rate',    value: latest?.heart_rate ?? '--',   unit: 'BPM',   color: '#f87171', max: 120, val: latest?.heart_rate },
    { icon: Activity,   label: 'Blood Pressure',value: latest?.blood_pressure ?? '--',unit: 'mmHg',  color: '#00e5ff', max: 180, val: 75 },
    { icon: Thermometer,label: 'Temperature',   value: latest?.temperature ?? '--',  unit: '°C',    color: '#fbbf24', max: 42,  val: latest?.temperature },
    { icon: Wind,       label: 'Oxygen Level',  value: latest?.oxygen_level ?? '--', unit: '%',     color: '#34d399', max: 100, val: latest?.oxygen_level },
    { icon: Droplet,    label: 'Glucose',       value: latest?.glucose ?? '--',      unit: 'mg/dL', color: '#a78bfa', max: 180, val: latest?.glucose },
    { icon: TrendingUp, label: 'Weight',        value: latest?.weight ?? '--',       unit: 'kg',    color: '#fb7185', max: 120, val: latest?.weight },
  ];

  const quickActions = [
    { label: 'Log Vitals',      path: '/app/health-monitoring', color: '#34d399' },
    { label: 'Run AI Scan',     path: '/app/disease-detection', color: '#00e5ff' },
    { label: 'Risk Check',      path: '/app/risk-assessment',   color: '#a78bfa' },
    { label: 'Set Reminder',    path: '/app/reminders',         color: '#fbbf24' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#020d18', color: '#e0f7ff', padding: '28px 32px' }}>
      <style>{BIO_STYLES}</style>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'Azeret Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(0,229,255,0.45)', marginBottom: 6 }}>// COMMAND_CENTER</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: -0.5, color: '#f0faff', lineHeight: 1.1 }}>
          Welcome back, <span style={{ color: '#00e5ff' }}>{profile?.full_name?.split(' ')[0] || 'Player'}</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)', marginTop: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Vitals grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {vitals.map((v, i) => (
          <motion.div key={v.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bio-card vital-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${v.color}14`, border: `1px solid ${v.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <v.icon style={{ width: 16, height: 16, color: v.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: v.color, display: 'inline-block', boxShadow: `0 0 8px ${v.color}` }} />
                <span style={{ fontSize: 10, color: `${v.color}90`, fontFamily: "'Azeret Mono', monospace", letterSpacing: '0.1em' }}>LIVE</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Azeret Mono', monospace" }}>{v.label.toUpperCase()}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: '#f0faff' }}>{v.value}</span>
              <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)' }}>{v.unit}</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${v.val ? Math.min((Number(v.val) / v.max) * 100, 100) : 0}%` }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.8 }}
                style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${v.color}, ${v.color}88)` }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 24 }}>
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bio-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Zap style={{ width: 16, height: 16, color: '#f87171' }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: '#e0f7ff' }}>Heart Rate History</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: "'Azeret Mono', monospace", color: 'rgba(248,113,113,0.6)', letterSpacing: '0.12em' }}>7D_TREND</span>
          </div>
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.05)" />
                <XAxis dataKey="t" stroke="transparent" tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 10, fontFamily: "'Azeret Mono'" }} />
                <YAxis stroke="transparent" tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 10, fontFamily: "'Azeret Mono'" }} />
                <Tooltip contentStyle={{ background: '#030f1c', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 10, fontSize: 12, fontFamily: "'Azeret Mono'" }} />
                <Area type="monotone" dataKey="hr" stroke="#f87171" strokeWidth={2} fill="url(#hrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.35)', fontSize: 13, fontFamily: "'Azeret Mono', monospace" }}>
              NO_DATA — log your first vitals
            </div>
          )}
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }} className="bio-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Award style={{ width: 16, height: 16, color: '#fbbf24' }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: '#e0f7ff' }}>Milestones</span>
          </div>
          {[
            { label: 'First Record Logged',  done: records.length > 0, xp: '+150 XP' },
            { label: '7-Day Tracking Streak',done: records.length >= 7, xp: '+300 XP' },
            { label: 'AI Scan Completed',    done: false,               xp: '+200 XP' },
            { label: 'Risk Assessment Done', done: false,               xp: '+250 XP' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, marginBottom: 8, background: a.done ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${a.done ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)'}`, opacity: a.done ? 1 : 0.5 }}>
              <span style={{ fontSize: 16 }}>{a.done ? '✓' : '○'}</span>
              <span style={{ flex: 1, fontSize: 12, color: a.done ? '#e0f7ff' : 'rgba(148,163,184,0.6)' }}>{a.label}</span>
              <span style={{ fontSize: 10, fontFamily: "'Azeret Mono', monospace", color: '#fbbf24' }}>{a.xp}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <div style={{ fontFamily: "'Azeret Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)', marginBottom: 14 }}>// QUICK_ACTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {quickActions.map((a, i) => (
            <motion.button key={i} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(a.path)}
              style={{ padding: '14px 16px', borderRadius: 14, background: `${a.color}0d`, border: `1px solid ${a.color}25`, color: a.color, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 24px ${a.color}20`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {a.label}
              <ChevronRight style={{ width: 14, height: 14 }} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: 36, height: 36, border: '2px solid rgba(0,229,255,0.3)', borderTopColor: '#00e5ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
    </div>
  );
}