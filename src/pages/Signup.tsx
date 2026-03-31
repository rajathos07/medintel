import { useState, type FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/app/dashboard'); }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
    const { error } = await signUp(email, password, fullName);
    if (error) { setError(error.message); setLoading(false); }
  };

  const perks = ['AI Disease Detection', 'Vitals Tracking', 'Risk Assessment', 'Health Score XP'];

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] flex items-center justify-center p-6 relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
      .grid-bg{background-image:linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px);background-size:60px 60px;}
      .corner::before,.corner::after{content:'';position:absolute;width:16px;height:16px;border-color:#7c3aed;border-style:solid;}
      .corner::before{top:0;left:0;border-width:2px 0 0 2px;}
      .corner::after{bottom:0;right:0;border-width:0 2px 2px 0;}
      .input-glow:focus{box-shadow:0 0 0 1px #7c3aed,0 0 20px rgba(124,58,237,0.2);}`}</style>

      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', transform: 'translate(40%,-40%)' }} />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)', transform: 'translate(-40%,40%)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #00d4ff)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-black text-xl tracking-widest">MEDI<span className="text-[#7c3aed]">INTEL</span></span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-3xl font-black text-white tracking-tight">CREATE PLAYER</h1>
          <p className="text-[#8892a4] text-sm mt-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// INITIALIZE NEW HEALTH PROFILE</p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 px-3 py-2 border border-[#7c3aed]/20 rounded-lg bg-[#7c3aed]/5">
              <span className="text-[#00d4ff] text-xs">▶</span>
              <span className="text-[#8892a4] text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{p}</span>
            </motion.div>
          ))}
        </div>

        <div className="relative p-8 border border-[#7c3aed]/20 rounded-xl bg-[#0a0f1e]/90 backdrop-blur-xl corner">
          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-3 border border-[#ff2d55]/40 rounded-lg bg-[#ff2d55]/10 text-[#ff2d55] text-sm"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'PLAYER_NAME', value: fullName, setter: setFullName, type: 'text', icon: User, placeholder: 'Your full name' },
              { label: 'EMAIL_ADDRESS', value: email, setter: setEmail, type: 'email', icon: Mail, placeholder: 'player@example.com' },
              { label: 'PASSWORD', value: password, setter: setPassword, type: 'password', icon: Lock, placeholder: '••••••••••' },
            ].map(({ label, value, setter, type, icon: Icon, placeholder }) => (
              <div key={label}>
                <label className="block text-xs text-[#7c3aed]/80 mb-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c3aed]/50" />
                  <input type={type} value={value} onChange={e => setter(e.target.value)} required placeholder={placeholder}
                    className="input-glow w-full pl-11 pr-4 py-3 bg-[#0d1528] border border-[#7c3aed]/20 rounded-lg text-white placeholder-[#8892a4]/50 focus:outline-none transition-all text-sm"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }} />
                </div>
              </div>
            ))}

            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-4 font-black text-white rounded-lg flex items-center justify-center gap-2 tracking-widest disabled:opacity-50 mt-2"
              style={{ fontFamily: "'Orbitron', sans-serif", background: loading ? '#1a2540' : 'linear-gradient(135deg, #7c3aed, #00d4ff)' }}>
              {loading ? '[ CREATING PROFILE... ]' : <>[ENLIST NOW] <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-[#8892a4] mt-6 text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            Have an account?{' '}
            <Link to="/login" className="text-[#7c3aed] hover:underline">[SIGN_IN]</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}