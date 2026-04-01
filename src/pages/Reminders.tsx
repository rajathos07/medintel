import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Pill, Droplets, Dumbbell, Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const SHARED = `@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
.gbg{background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:60px 60px;}
.scan{background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,255,0.02) 2px,rgba(0,212,255,0.02) 4px);}
.cc::before,.cc::after{content:'';position:absolute;width:12px;height:12px;border-color:#00d4ff;border-style:solid;}
.cc::before{top:0;left:0;border-width:2px 0 0 2px;} .cc::after{bottom:0;right:0;border-width:0 2px 2px 0;}
.inp:focus{box-shadow:0 0 0 1px #00d4ff,0 0 15px rgba(0,212,255,0.2);outline:none;}
.card-hover:hover{box-shadow:0 0 25px rgba(0,212,255,0.12),inset 0 0 25px rgba(0,212,255,0.03);}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
.blink{animation:blink 2s ease-in-out infinite;}`;

type ReminderType = 'medication' | 'hydration' | 'exercise' | 'appointment';

interface Reminder {
  id: string;
  user_id: string;
  type: ReminderType;
  message: string;
  scheduled_time: string;
  is_recurring: boolean;
  recurrence_rule: string;
  is_completed: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<ReminderType, { icon: any; color: string; label: string; bg: string }> = {
  medication: { icon: Pill, color: '#ff2d55', label: 'MEDICATION', bg: 'rgba(255,45,85,0.08)' },
  hydration:  { icon: Droplets, color: '#00d4ff', label: 'HYDRATION', bg: 'rgba(0,212,255,0.08)' },
  exercise:   { icon: Dumbbell, color: '#10b981', label: 'EXERCISE', bg: 'rgba(16,185,129,0.08)' },
  appointment:{ icon: Calendar, color: '#f59e0b', label: 'APPOINTMENT', bg: 'rgba(245,158,11,0.08)' },
};

const SAMPLE_REMINDERS = [
  { type: 'medication' as ReminderType, message: 'Blood pressure medication - Amlodipine 5mg', time: '08:00' },
  { type: 'hydration'  as ReminderType, message: 'Drink a full glass of water', time: '10:00' },
  { type: 'exercise'   as ReminderType, message: '15-minute gentle morning walk', time: '09:00' },
  { type: 'appointment'as ReminderType, message: 'Cardiology check-up at City Hospital', time: '14:30' },
];

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<ReminderType | 'all'>('all');
  const [form, setForm] = useState({
    type: 'medication' as ReminderType,
    message: '',
    scheduled_time: '',
    is_recurring: false,
    recurrence_rule: 'daily',
  });

  useEffect(() => { if (user) fetchReminders(); }, [user]);

  const fetchReminders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user!.id)
      .order('scheduled_time', { ascending: true });
    if (!error && data) setReminders(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message || !form.scheduled_time) return;
    setSaving(true);
    const { error } = await supabase.from('reminders').insert([{
      user_id: user!.id,
      ...form,
      is_completed: false,
    }]);
    if (!error) {
      await fetchReminders();
      setShowForm(false);
      setForm({ type: 'medication', message: '', scheduled_time: '', is_recurring: false, recurrence_rule: 'daily' });
    }
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

  const filtered = filter === 'all' ? reminders : reminders.filter(r => r.type === filter);
  const completed = reminders.filter(r => r.is_completed).length;
  const pending = reminders.filter(r => !r.is_completed).length;

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{SHARED}</style>
      <div className="fixed inset-0 gbg scan pointer-events-none" />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
          <div className="text-[#00d4ff]/60 text-xs tracking-widest mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// CARE_SCHEDULER</div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl font-black text-white">
            SMART <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>REMINDERS</span>
          </h1>
          <p className="text-[#8892a4] text-sm mt-2 tracking-wide" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            Medication · Hydration · Exercise · Appointments
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-3">
          {[
            { label: 'TOTAL', value: reminders.length, color: '#00d4ff' },
            { label: 'PENDING', value: pending, color: '#f59e0b' },
            { label: 'DONE', value: completed, color: '#10b981' },
            { label: 'RECURRING', value: reminders.filter(r => r.is_recurring).length, color: '#7c3aed' },
          ].map((s, i) => (
            <div key={i} className="relative p-4 border border-[#00d4ff]/15 rounded-xl bg-[#0a0f1e]/80 text-center cc card-hover transition-all">
              <div style={{ fontFamily: "'Orbitron', sans-serif", color: s.color }} className="text-2xl font-black">{s.value}</div>
              <div className="text-[10px] text-[#8892a4] tracking-widest mt-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filter + Add Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'medication', 'hydration', 'exercise', 'appointment'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-xs rounded-lg border transition-all tracking-widest"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  borderColor: filter === f ? '#00d4ff' : 'rgba(0,212,255,0.15)',
                  background: filter === f ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: filter === f ? '#00d4ff' : '#8892a4',
                }}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(0,212,255,0.4)' }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-black rounded-lg tracking-widest"
            style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#050810' }}>
            <Plus className="w-4 h-4" /> [ADD]
          </motion.button>
        </motion.div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="relative p-6 border border-[#00d4ff]/25 rounded-xl bg-[#0a0f1e]/90 cc overflow-hidden">
              <div className="text-[#00d4ff]/60 text-xs tracking-widest mb-4" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// NEW_REMINDER</div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selector */}
                <div>
                  <label className="block text-xs text-[#00d4ff]/70 mb-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>REMINDER_TYPE</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(Object.keys(TYPE_CONFIG) as ReminderType[]).map(t => {
                      const cfg = TYPE_CONFIG[t];
                      const Icon = cfg.icon;
                      return (
                        <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                          className="flex items-center gap-2 p-3 rounded-lg border text-sm transition-all"
                          style={{
                            borderColor: form.type === t ? cfg.color : 'rgba(255,255,255,0.08)',
                            background: form.type === t ? cfg.bg : 'transparent',
                            color: form.type === t ? cfg.color : '#8892a4',
                            fontFamily: "'Share Tech Mono', monospace",
                          }}>
                          <Icon className="w-4 h-4" /> {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-[#00d4ff]/70 mb-1.5 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>MESSAGE</label>
                  <input type="text" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="e.g. Take Metformin 500mg with breakfast"
                    className="inp w-full px-4 py-3 bg-[#0d1528] border border-[#00d4ff]/20 rounded-lg text-white text-sm transition-all"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Time */}
                  <div>
                    <label className="block text-xs text-[#00d4ff]/70 mb-1.5 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>SCHEDULED_TIME</label>
                    <input type="time" value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })}
                      className="inp w-full px-4 py-3 bg-[#0d1528] border border-[#00d4ff]/20 rounded-lg text-white text-sm transition-all"
                      style={{ fontFamily: "'Share Tech Mono', monospace", colorScheme: 'dark' }} />
                  </div>

                  {/* Recurrence */}
                  <div>
                    <label className="block text-xs text-[#00d4ff]/70 mb-1.5 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>RECURRENCE</label>
                    <select value={form.is_recurring ? form.recurrence_rule : 'none'}
                      onChange={e => {
                        const val = e.target.value;
                        setForm({ ...form, is_recurring: val !== 'none', recurrence_rule: val === 'none' ? 'daily' : val });
                      }}
                      className="inp w-full px-4 py-3 bg-[#0d1528] border border-[#00d4ff]/20 rounded-lg text-white text-sm transition-all"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      <option value="none">ONE_TIME</option>
                      <option value="daily">DAILY</option>
                      <option value="weekly">WEEKLY</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#00d4ff]/10">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={saving}
                    className="px-6 py-2.5 font-black text-sm rounded-lg tracking-widest disabled:opacity-50"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', color: '#050810' }}>
                    {saving ? '[SAVING...]' : '[DEPLOY]'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 font-black text-sm rounded-lg border border-[#00d4ff]/20 text-[#8892a4] hover:text-white transition-all tracking-widest"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>[CANCEL]</motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Templates */}
        {!showForm && reminders.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 border border-[#00d4ff]/10 rounded-xl bg-[#0a0f1e]/60">
            <div className="text-xs text-[#00d4ff]/60 mb-3 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// QUICK_START_TEMPLATES</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SAMPLE_REMINDERS.map((s, i) => {
                const cfg = TYPE_CONFIG[s.type];
                const Icon = cfg.icon;
                return (
                  <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      setSaving(true);
                      await supabase.from('reminders').insert([{ user_id: user!.id, type: s.type, message: s.message, scheduled_time: s.time, is_recurring: true, recurrence_rule: 'daily', is_completed: false }]);
                      await fetchReminders();
                      setSaving(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg border text-left transition-all"
                    style={{ borderColor: `${cfg.color}25`, background: cfg.bg }}>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} />
                    <div>
                      <div className="text-xs font-bold" style={{ color: cfg.color, fontFamily: "'Share Tech Mono', monospace" }}>{cfg.label}</div>
                      <div className="text-xs text-[#8892a4]">{s.message}</div>
                    </div>
                    <Plus className="w-3 h-3 ml-auto shrink-0 text-[#8892a4]" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Reminder List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((r, i) => {
                const cfg = TYPE_CONFIG[r.type];
                const Icon = cfg.icon;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative p-5 border rounded-xl bg-[#0a0f1e]/80 card-hover transition-all ${r.is_completed ? 'opacity-50' : ''}`}
                    style={{ borderColor: r.is_completed ? 'rgba(255,255,255,0.06)' : `${cfg.color}25` }}>
                    <div className="flex items-center gap-4">
                      {/* Type Icon */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                        <Icon className="w-6 h-6" style={{ color: cfg.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold tracking-widest" style={{ color: cfg.color, fontFamily: "'Share Tech Mono', monospace" }}>{cfg.label}</span>
                          {r.is_recurring && (
                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border" style={{ color: '#7c3aed', borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)', fontFamily: "'Share Tech Mono', monospace" }}>
                              <RefreshCw className="w-2.5 h-2.5" />{r.recurrence_rule?.toUpperCase()}
                            </span>
                          )}
                          {r.is_completed && (
                            <span className="text-[10px] px-2 py-0.5 rounded border" style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', fontFamily: "'Share Tech Mono', monospace" }}>DONE</span>
                          )}
                        </div>
                        <p className={`text-sm font-semibold ${r.is_completed ? 'line-through text-[#8892a4]' : 'text-white'}`}>
                          {r.message}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[#8892a4]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{r.scheduled_time}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleComplete(r.id, r.is_completed)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all"
                          style={{ borderColor: r.is_completed ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)', background: r.is_completed ? 'rgba(16,185,129,0.1)' : 'transparent' }}>
                          {r.is_completed ? <CheckCircle className="w-5 h-5 text-[#10b981]" /> : <XCircle className="w-5 h-5 text-[#8892a4]" />}
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteReminder(r.id)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#ff2d55]/20 hover:border-[#ff2d55]/50 hover:bg-[#ff2d55]/10 transition-all">
                          <Trash2 className="w-4 h-4 text-[#ff2d55]" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16 text-[#8892a4]">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p style={{ fontFamily: "'Share Tech Mono', monospace" }} className="text-sm">NO_REMINDERS_FOUND</p>
                <p className="text-xs mt-1">Click [ADD] to schedule your first reminder</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}