import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Droplet, AlertCircle, Save, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SHARED = `@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
.gbg{background-image:linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px);background-size:60px 60px;}
.cc::before,.cc::after{content:'';position:absolute;width:12px;height:12px;border-color:#7c3aed;border-style:solid;}
.cc::before{top:0;left:0;border-width:2px 0 0 2px;} .cc::after{bottom:0;right:0;border-width:0 2px 2px 0;}
.inp:focus{box-shadow:0 0 0 1px #7c3aed,0 0 15px rgba(124,58,237,0.2);}`;

export default function Profile() {
  const { profile, user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    full_name: profile?.full_name || '', date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || '', phone: profile?.phone || '',
    emergency_contact: profile?.emergency_contact || '', blood_type: profile?.blood_type || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    const { error } = await updateProfile(form);
    setMessage(error ? 'UPDATE_FAILED' : 'PROFILE_SYNCED');
    if (!error) setEditing(false);
    setLoading(false);
  };

  const infoCards = [
    { icon: Calendar, label: 'DATE_OF_BIRTH', value: profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'NOT_SET', color: '#00d4ff' },
    { icon: User, label: 'GENDER', value: profile?.gender?.toUpperCase() || 'NOT_SET', color: '#7c3aed' },
    { icon: Phone, label: 'PHONE', value: profile?.phone || 'NOT_SET', color: '#10b981' },
    { icon: Droplet, label: 'BLOOD_TYPE', value: profile?.blood_type || 'NOT_SET', color: '#ff2d55' },
    { icon: AlertCircle, label: 'EMERGENCY_CONTACT', value: profile?.emergency_contact || 'NOT_SET', color: '#f59e0b', span: true },
  ];

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white">
      <style>{SHARED}</style>
      <div className="fixed inset-0 gbg pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
          <div className="text-[#7c3aed]/60 text-xs tracking-widest mb-2" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// PLAYER_PROFILE</div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-4xl font-black text-white">HEALTH <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#7c3aed,#00d4ff)' }}>IDENTITY</span></h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative p-6 border border-[#7c3aed]/20 rounded-xl bg-[#0a0f1e]/80 cc">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#00d4ff)' }}>
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#050810] flex items-center justify-center" style={{ background: '#10b981' }}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-xl font-black text-white">{profile?.full_name?.toUpperCase() || 'PLAYER'}</h2>
                <p className="text-[#8892a4] text-xs flex items-center gap-1 mt-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  <Mail className="w-3 h-3" />{user?.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[#10b981] text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>PROFILE_ACTIVE</span>
                </div>
              </div>
            </div>
            {!editing && (
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="px-5 py-2.5 font-black text-sm rounded-lg tracking-widest"
                style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#050810' }}>
                [EDIT]
              </motion.button>
            )}
          </div>

          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-4 p-3 rounded-lg border text-xs ${message.includes('FAILED') ? 'border-[#ff2d55]/40 bg-[#ff2d55]/10 text-[#ff2d55]' : 'border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]'}`} style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {message.includes('FAILED') ? '⚠ ' : '✓ '}{message}
            </motion.div>
          )}

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'FULL_NAME', key: 'full_name', type: 'text' },
                  { label: 'DATE_OF_BIRTH', key: 'date_of_birth', type: 'date' },
                  { label: 'PHONE', key: 'phone', type: 'tel' },
                  { label: 'EMERGENCY_CONTACT', key: 'emergency_contact', type: 'tel' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-xs text-[#7c3aed]/70 mb-1.5 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{label}</label>
                    <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="inp w-full px-4 py-3 bg-[#0d1528] border border-[#7c3aed]/20 rounded-lg text-white focus:outline-none text-sm transition-all"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }} />
                  </div>
                ))}
                {[{ label: 'GENDER', key: 'gender', opts: [['', '-- SELECT --'], ['male', 'MALE'], ['female', 'FEMALE'], ['other', 'OTHER']] },
                  { label: 'BLOOD_TYPE', key: 'blood_type', opts: [['', '-- SELECT --'], ...['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => [b, b])] }
                ].map(({ label, key, opts }) => (
                  <div key={key}>
                    <label className="block text-xs text-[#7c3aed]/70 mb-1.5 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{label}</label>
                    <select value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="inp w-full px-4 py-3 bg-[#0d1528] border border-[#7c3aed]/20 rounded-lg text-white focus:outline-none text-sm transition-all"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2 border-t border-[#7c3aed]/10">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  className="px-6 py-3 font-black text-sm rounded-lg flex items-center gap-2 tracking-widest disabled:opacity-50"
                  style={{ fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#050810' }}>
                  <Save className="w-4 h-4" />{loading ? '[SAVING...]' : '[SAVE]'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 font-black text-sm rounded-lg border border-[#7c3aed]/20 text-[#8892a4] hover:text-white hover:border-[#7c3aed]/40 transition-all tracking-widest"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}>[CANCEL]</motion.button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoCards.map(({ icon: Icon, label, value, color, span }) => (
                <div key={label} className={`p-4 border rounded-xl bg-[#0d1528]/60 ${span ? 'md:col-span-2' : ''}`} style={{ borderColor: `${color}20` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-xs tracking-widest" style={{ color: `${color}80`, fontFamily: "'Share Tech Mono', monospace" }}>{label}</span>
                  </div>
                  <p className="text-white font-bold" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}