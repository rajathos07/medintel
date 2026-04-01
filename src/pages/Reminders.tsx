import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Pill, Droplets, Dumbbell, Calendar,
         CheckCircle, XCircle, RefreshCw, BellRing, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/* ─── Types ──────────────────────────────────────────────────────────── */
type ReminderType = 'medication' | 'hydration' | 'exercise' | 'appointment';

interface Reminder {
  id: string; user_id: string; type: ReminderType; message: string;
  scheduled_time: string; is_recurring: boolean; recurrence_rule: string;
  is_completed: boolean; created_at: string;
}

interface ToastItem { id: string; reminder: Reminder; }

/* ─── Config ─────────────────────────────────────────────────────────── */
const TYPE_CFG: Record<ReminderType, { icon: any; color: string; label: string; bg: string }> = {
  medication:  { icon: Pill,      color: '#f87171', label: 'Medication',   bg: 'rgba(248,113,113,0.09)' },
  hydration:   { icon: Droplets,  color: '#00e5ff', label: 'Hydration',    bg: 'rgba(0,229,255,0.08)'  },
  exercise:    { icon: Dumbbell,  color: '#34d399', label: 'Exercise',     bg: 'rgba(52,211,153,0.08)' },
  appointment: { icon: Calendar,  color: '#fbbf24', label: 'Appointment',  bg: 'rgba(251,191,36,0.08)' },
};

const SAMPLES = [
  { type: 'medication'  as ReminderType, message: 'Blood pressure medication — Amlodipine 5mg', time: '08:00' },
  { type: 'hydration'   as ReminderType, message: 'Drink a full glass of water',                 time: '10:00' },
  { type: 'exercise'    as ReminderType, message: '15-minute gentle morning walk',               time: '09:00' },
  { type: 'appointment' as ReminderType, message: 'Cardiology check-up at City Hospital',        time: '14:30' },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&family=Azeret+Mono:wght@400;500&display=swap');
  .rem-grid { background-image:linear-gradient(rgba(0,229,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.025) 1px,transparent 1px); background-size:48px 48px; }
  .rem-card { background:linear-gradient(135deg,rgba(2,20,35,0.92),rgba(3,15,28,0.96)); border-radius:16px; transition:border-color 0.25s,box-shadow 0.25s; }
  .rem-input { width:100%; padding:11px 14px; background:rgba(3,15,28,0.85); border:1px solid rgba(0,229,255,0.13); border-radius:11px; color:#e0f7ff; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; box-sizing:border-box; }
  .rem-input:focus { border-color:rgba(0,229,255,0.4); box-shadow:0 0 0 3px rgba(0,229,255,0.06); }
  .rem-input::placeholder { color:rgba(148,163,184,0.35); }
  .rem-select { appearance:none; }
  .rem-btn-primary { background:linear-gradient(135deg,#00c8e8,#0284c7); color:#020d18; font-family:'Syne',sans-serif; font-weight:800; font-size:12px; letter-spacing:0.07em; border:none; border-radius:11px; padding:11px 22px; cursor:pointer; transition:box-shadow 0.2s,transform 0.15s; }
  .rem-btn-primary:hover { box-shadow:0 0 30px rgba(0,200,232,0.4); transform:translateY(-1px); }
  .rem-btn-primary:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
  .rem-btn-ghost  { background:transparent; color:rgba(148,163,184,0.7); font-family:'Syne',sans-serif; font-weight:700; font-size:12px; letter-spacing:0.07em; border:1px solid rgba(255,255,255,0.1); border-radius:11px; padding:11px 22px; cursor:pointer; transition:border-color 0.2s,color 0.2s; }
  .rem-btn-ghost:hover  { border-color:rgba(255,255,255,0.25); color:#e0f7ff; }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes toast-in { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
  @keyframes toast-out { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(110%)} }
  .toast-in  { animation:toast-in  0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .toast-out { animation:toast-out 0.3s  ease-in forwards; }
`;

/* ─── Notification toast component ──────────────────────────────────── */
function ReminderToast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const cfg = TYPE_CFG[item.reminder.type];
  const Icon = cfg.icon;
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(item.id), 300);
  };

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const t = setTimeout(dismiss, 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={leaving ? 'toast-out' : 'toast-in'}
      style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:14,
        background:'linear-gradient(135deg,rgba(2,20,35,0.98),rgba(3,15,28,0.99))',
        border:`1px solid ${cfg.color}35`, boxShadow:`0 8px 40px rgba(0,0,0,0.6),0 0 20px ${cfg.color}15`,
        minWidth:300, maxWidth:360, position:'relative' }}>
      <div style={{ width:38,height:38,flexShrink:0,borderRadius:10,background:cfg.bg,border:`1px solid ${cfg.color}30`,display:'flex',alignItems:'center',justifyContent:'center' }}>
        <Icon style={{ width:18,height:18,color:cfg.color,filter:`drop-shadow(0 0 6px ${cfg.color})` }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:10,color:`${cfg.color}90`,letterSpacing:'0.12em',fontFamily:"'Azeret Mono',monospace",marginBottom:3 }}>
          {cfg.label.toUpperCase()} REMINDER
        </div>
        <div style={{ fontSize:13,color:'#e0f7ff',fontWeight:500,lineHeight:1.4 }}>{item.reminder.message}</div>
        <div style={{ fontSize:11,color:'rgba(148,163,184,0.55)',marginTop:4,fontFamily:"'Azeret Mono',monospace" }}>
          Scheduled: {item.reminder.scheduled_time}
        </div>
      </div>
      <button onClick={dismiss} style={{ background:'none',border:'none',color:'rgba(148,163,184,0.4)',cursor:'pointer',padding:2,flexShrink:0 }}>
        <X style={{ width:13,height:13 }} />
      </button>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders]   = useState<Reminder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [filter, setFilter]         = useState<ReminderType | 'all'>('all');
  const [toasts, setToasts]         = useState<ToastItem[]>([]);
  const [notifPerm, setNotifPerm]   = useState<NotificationPermission>('default');
  const firedRef                    = useRef<Set<string>>(new Set()); // track already-fired "key"

  const [form, setForm] = useState({
    type: 'medication' as ReminderType, message: '', scheduled_time: '',
    is_recurring: false, recurrence_rule: 'daily',
  });

  /* ── Fetch reminders ─────────────────────────────────────────────── */
  const fetchReminders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from('reminders').select('*')
      .eq('user_id', user.id).order('scheduled_time', { ascending: true });
    if (!error && data) setReminders(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchReminders(); }, [fetchReminders]);

  /* ── Request notification permission on mount ────────────────────── */
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPerm(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(p => setNotifPerm(p));
      }
    }
  }, []);

  /* ── Time-based reminder checker (runs every 30 seconds) ─────────── */
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh  = now.getHours().toString().padStart(2, '0');
      const mm  = now.getMinutes().toString().padStart(2, '0');
      const nowStr = `${hh}:${mm}`;  // "HH:MM"

      reminders.forEach(r => {
        if (r.is_completed) return;

        // scheduled_time may be "HH:MM" or "HH:MM:SS" — normalise to "HH:MM"
        const rTime = r.scheduled_time?.slice(0, 5);
        if (rTime !== nowStr) return;

        // Key = id + date so recurring reminders fire once per day
        const dateKey = now.toDateString();
        const fireKey = `${r.id}-${dateKey}`;
        if (firedRef.current.has(fireKey)) return;
        firedRef.current.add(fireKey);

        // 1. In-app toast
        const toastId = `${r.id}-${Date.now()}`;
        setToasts(prev => [...prev, { id: toastId, reminder: r }]);

        // 2. Browser push notification (if granted)
        if ('Notification' in window && Notification.permission === 'granted') {
          const cfg = TYPE_CFG[r.type];
          new Notification(`⏰ ${cfg.label} Reminder`, {
            body: r.message,
            icon: '/favicon.ico',
            tag: fireKey,   // prevents duplicate OS notifications
          });
        }
      });
    };

    check(); // run immediately
    const interval = setInterval(check, 30_000); // re-check every 30 s
    return () => clearInterval(interval);
  }, [reminders]);

  /* ── CRUD ────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message || !form.scheduled_time) return;
    setSaving(true);
    const { error } = await supabase.from('reminders').insert([{ user_id: user!.id, ...form, is_completed: false }]);
    if (!error) { await fetchReminders(); setShowForm(false); setForm({ type:'medication', message:'', scheduled_time:'', is_recurring:false, recurrence_rule:'daily' }); }
    setSaving(false);
  };

  const toggleComplete = async (id: string, current: boolean) => {
    await supabase.from('reminders').update({ is_completed: !current }).eq('id', id);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_completed: !current } : r));
  };

  const deleteReminder = async (id: string) => {
    await supabase.from('reminders').delete().eq('id', id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const filtered  = filter === 'all' ? reminders : reminders.filter(r => r.type === filter);
  const completed = reminders.filter(r => r.is_completed).length;
  const pending   = reminders.filter(r => !r.is_completed).length;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:'100vh', background:'#020d18', color:'#e0f7ff', padding:'28px 32px', position:'relative' }}>
      <style>{STYLES}</style>
      <div className="rem-grid" style={{ position:'fixed', inset:0, pointerEvents:'none' }} />

      {/* ── Toast portal (top-right) ─────────────────────────────────── */}
      <div style={{ position:'fixed', top:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:10 }}>
        {toasts.map(t => (
          <ReminderToast key={t.id} item={t} onDismiss={dismissToast} />
        ))}
      </div>

      <div style={{ position:'relative', zIndex:1, maxWidth:860, margin:'0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:28 }}>
          <div style={{ fontFamily:"'Azeret Mono',monospace", fontSize:10, letterSpacing:'0.22em', color:'rgba(0,229,255,0.45)', marginBottom:8 }}>// CARE SCHEDULER</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:32, letterSpacing:-0.5, color:'#f0faff', lineHeight:1.1, marginBottom:6 }}>
            Health Reminders
          </h1>
          <p style={{ fontSize:13, color:'rgba(148,163,184,0.55)' }}>
            Medication · Hydration · Exercise · Appointments
          </p>

          {/* Notification permission banner */}
          {notifPerm === 'denied' && (
            <div style={{ marginTop:14, padding:'10px 16px', borderRadius:10, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', fontSize:12, color:'rgba(248,113,113,0.8)', fontFamily:"'Azeret Mono',monospace" }}>
              ⚠ Browser notifications are blocked. Enable them in site settings to receive reminder alerts.
            </div>
          )}
          {notifPerm === 'default' && (
            <button onClick={() => Notification.requestPermission().then(p => setNotifPerm(p))}
              style={{ marginTop:12, padding:'8px 16px', borderRadius:10, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.25)', fontSize:12, color:'#fbbf24', cursor:'pointer', fontFamily:"'Azeret Mono',monospace", display:'flex', alignItems:'center', gap:6 }}>
              <BellRing style={{ width:13, height:13 }} /> Enable notifications for reminders
            </button>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
          style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
          {[
            { label:'Total',     value:reminders.length,                              color:'#00e5ff' },
            { label:'Pending',   value:pending,                                        color:'#fbbf24' },
            { label:'Completed', value:completed,                                      color:'#34d399' },
            { label:'Recurring', value:reminders.filter(r => r.is_recurring).length,  color:'#a78bfa' },
          ].map((s,i) => (
            <div key={i} className="rem-card" style={{ padding:'16px 18px', border:'1px solid rgba(0,229,255,0.09)', textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:10, color:'rgba(148,163,184,0.55)', marginTop:5, letterSpacing:'0.1em', fontFamily:"'Azeret Mono',monospace" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </motion.div>

        {/* Filter + Add */}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:20 }}>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {(['all','medication','hydration','exercise','appointment'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:'7px 14px', borderRadius:9, border:`1px solid ${filter===f ? '#00e5ff' : 'rgba(0,229,255,0.15)'}`, background:filter===f ? 'rgba(0,229,255,0.11)' : 'transparent', color:filter===f ? '#00e5ff' : 'rgba(148,163,184,0.65)', fontSize:11, fontFamily:"'Azeret Mono',monospace", letterSpacing:'0.1em', cursor:'pointer', transition:'all 0.18s', textTransform:'uppercase' }}>
                {f}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={() => setShowForm(v => !v)}
            className="rem-btn-primary"
            style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Plus style={{ width:14,height:14 }} /> Add Reminder
          </motion.button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              className="rem-card" style={{ border:'1px solid rgba(0,229,255,0.18)', padding:24, marginBottom:20, overflow:'hidden' }}>
              <div style={{ fontFamily:"'Azeret Mono',monospace", fontSize:10, letterSpacing:'0.2em', color:'rgba(0,229,255,0.45)', marginBottom:16 }}>// NEW REMINDER</div>
              <form onSubmit={handleSubmit}>

                {/* Type selector */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:11, color:'rgba(0,229,255,0.55)', letterSpacing:'0.15em', fontFamily:"'Azeret Mono',monospace", marginBottom:8 }}>TYPE</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {(Object.keys(TYPE_CFG) as ReminderType[]).map(t => {
                      const cfg = TYPE_CFG[t];
                      const Icon = cfg.icon;
                      const sel = form.type === t;
                      return (
                        <button key={t} type="button" onClick={() => setForm({ ...form, type:t })}
                          style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 12px', borderRadius:10, border:`1px solid ${sel ? cfg.color : 'rgba(255,255,255,0.07)'}`, background:sel ? cfg.bg : 'transparent', color:sel ? cfg.color : 'rgba(148,163,184,0.6)', fontSize:12, cursor:'pointer', transition:'all 0.18s', fontFamily:"'DM Sans',sans-serif", fontWeight:sel?600:400 }}>
                          <Icon style={{ width:14,height:14 }} /> {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:11, color:'rgba(0,229,255,0.55)', letterSpacing:'0.15em', fontFamily:"'Azeret Mono',monospace", marginBottom:7 }}>MESSAGE</label>
                  <input className="rem-input" type="text" value={form.message} onChange={e => setForm({ ...form, message:e.target.value })} placeholder="e.g. Take Metformin 500mg with breakfast" />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
                  <div>
                    <label style={{ display:'block', fontSize:11, color:'rgba(0,229,255,0.55)', letterSpacing:'0.15em', fontFamily:"'Azeret Mono',monospace", marginBottom:7 }}>TIME</label>
                    <input className="rem-input" type="time" value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time:e.target.value })} style={{ colorScheme:'dark' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, color:'rgba(0,229,255,0.55)', letterSpacing:'0.15em', fontFamily:"'Azeret Mono',monospace", marginBottom:7 }}>RECURRENCE</label>
                    <select className="rem-input rem-select" value={form.is_recurring ? form.recurrence_rule : 'none'}
                      onChange={e => { const v=e.target.value; setForm({ ...form, is_recurring:v!=='none', recurrence_rule:v==='none'?'daily':v }); }}>
                      <option value="none">One-time</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div style={{ display:'flex', gap:10, borderTop:'1px solid rgba(0,229,255,0.08)', paddingTop:16 }}>
                  <button type="submit" disabled={saving} className="rem-btn-primary">{saving ? 'Saving...' : 'Save Reminder'}</button>
                  <button type="button" className="rem-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick-start templates */}
        {!showForm && reminders.length === 0 && !loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="rem-card" style={{ border:'1px solid rgba(0,229,255,0.08)', padding:20, marginBottom:20 }}>
            <div style={{ fontFamily:"'Azeret Mono',monospace", fontSize:10, letterSpacing:'0.2em', color:'rgba(0,229,255,0.4)', marginBottom:12 }}>// QUICK START TEMPLATES</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {SAMPLES.map((s, i) => {
                const cfg = TYPE_CFG[s.type]; const Icon = cfg.icon;
                return (
                  <motion.button key={i} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={async () => {
                      setSaving(true);
                      await supabase.from('reminders').insert([{ user_id:user!.id, type:s.type, message:s.message, scheduled_time:s.time, is_recurring:true, recurrence_rule:'daily', is_completed:false }]);
                      await fetchReminders(); setSaving(false);
                    }}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, border:`1px solid ${cfg.color}22`, background:cfg.bg, cursor:'pointer', textAlign:'left' }}>
                    <Icon style={{ width:15,height:15,flexShrink:0,color:cfg.color }} />
                    <div>
                      <div style={{ fontSize:10,color:cfg.color,fontFamily:"'Azeret Mono',monospace",letterSpacing:'0.1em',marginBottom:2 }}>{cfg.label.toUpperCase()}</div>
                      <div style={{ fontSize:12,color:'rgba(148,163,184,0.7)' }}>{s.message}</div>
                    </div>
                    <Plus style={{ width:12,height:12,marginLeft:'auto',flexShrink:0,color:'rgba(148,163,184,0.4)' }} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Reminder list */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <div style={{ width:34,height:34,border:'2px solid rgba(0,229,255,0.25)',borderTopColor:'#00e5ff',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto' }} />
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <AnimatePresence>
              {filtered.map((r, i) => {
                const cfg = TYPE_CFG[r.type]; const Icon = cfg.icon;
                return (
                  <motion.div key={r.id} initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} transition={{ delay:i*0.04 }}
                    className="rem-card"
                    style={{ border:`1px solid ${r.is_completed ? 'rgba(255,255,255,0.05)' : cfg.color+'28'}`, padding:'18px 20px', opacity:r.is_completed ? 0.55 : 1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:44,height:44,flexShrink:0,borderRadius:12,background:cfg.bg,border:`1px solid ${cfg.color}28`,display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <Icon style={{ width:20,height:20,color:cfg.color,filter:`drop-shadow(0 0 5px ${cfg.color})` }} />
                      </div>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5, flexWrap:'wrap' }}>
                          <span style={{ fontSize:10,color:`${cfg.color}90`,fontFamily:"'Azeret Mono',monospace",letterSpacing:'0.12em' }}>{cfg.label.toUpperCase()}</span>
                          {r.is_recurring && (
                            <span style={{ display:'flex',alignItems:'center',gap:4,fontSize:10,padding:'2px 7px',borderRadius:6,border:'1px solid rgba(167,139,250,0.28)',background:'rgba(167,139,250,0.07)',color:'#a78bfa',fontFamily:"'Azeret Mono',monospace" }}>
                              <RefreshCw style={{ width:9,height:9 }} />{r.recurrence_rule?.charAt(0).toUpperCase()+r.recurrence_rule?.slice(1)}
                            </span>
                          )}
                          {r.is_completed && (
                            <span style={{ fontSize:10,padding:'2px 7px',borderRadius:6,border:'1px solid rgba(52,211,153,0.28)',background:'rgba(52,211,153,0.07)',color:'#34d399',fontFamily:"'Azeret Mono',monospace" }}>Done</span>
                          )}
                        </div>
                        <p style={{ fontSize:14,fontWeight:500,color:r.is_completed?'rgba(148,163,184,0.55)':'#e0f7ff',margin:0,textDecoration:r.is_completed?'line-through':'none' }}>{r.message}</p>
                        <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:5,color:'rgba(148,163,184,0.45)',fontFamily:"'Azeret Mono',monospace",fontSize:11 }}>
                          <Clock style={{ width:11,height:11 }} />{r.scheduled_time?.slice(0,5)}
                        </div>
                      </div>

                      <div style={{ display:'flex',gap:7,flexShrink:0 }}>
                        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                          onClick={() => toggleComplete(r.id, r.is_completed)}
                          style={{ width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${r.is_completed?'rgba(52,211,153,0.3)':'rgba(255,255,255,0.1)'}`,background:r.is_completed?'rgba(52,211,153,0.1)':'transparent',cursor:'pointer' }}>
                          {r.is_completed
                            ? <CheckCircle style={{ width:17,height:17,color:'#34d399' }} />
                            : <XCircle    style={{ width:17,height:17,color:'rgba(148,163,184,0.5)' }} />}
                        </motion.button>
                        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                          onClick={() => deleteReminder(r.id)}
                          style={{ width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(248,113,113,0.2)',background:'transparent',cursor:'pointer' }}>
                          <Trash2 style={{ width:15,height:15,color:'rgba(248,113,113,0.7)' }} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && !loading && (
              <div style={{ textAlign:'center', padding:'52px 0', color:'rgba(148,163,184,0.4)' }}>
                <Bell style={{ width:40,height:40,margin:'0 auto 12px',opacity:0.2 }} />
                <p style={{ fontFamily:"'Azeret Mono',monospace", fontSize:12 }}>No reminders found</p>
                <p style={{ fontSize:12, marginTop:4 }}>Click "Add Reminder" to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}