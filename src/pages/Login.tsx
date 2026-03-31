import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); }
    else navigate('/app/dashboard');
  };

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] flex items-center justify-center p-6 relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
      .grid-bg{background-image:linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px);background-size:60px 60px;}
      .corner::before,.corner::after{content:'';position:absolute;width:16px;height:16px;border-color:#00d4ff;border-style:solid;}
      .corner::before{top:0;left:0;border-width:2px 0 0 2px;}
      .corner::after{bottom:0;right:0;border-width:0 2px 2px 0;}
      .input-glow:focus{box-shadow:0 0 0 1px #00d4ff,0 0 20px rgba(0,212,255,0.2);}`}</style>

      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', transform: 'translate(-40%,-40%)' }} />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.05) 0%, transparent 70%)', transform: 'translate(40%,40%)' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded" style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontFamily: "'Orbitron', sans-serif" }} className="font-black text-xl tracking-widest">MEDI<span className="text-[#00d4ff]">INTEL</span></span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-3xl font-black text-white tracking-tight">PLAYER LOGIN</h1>
          <p className="text-[#8892a4] text-sm mt-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// AUTHENTICATE TO CONTINUE</p>
        </div>

        <div className="relative p-8 border border-[#00d4ff]/20 rounded-xl bg-[#0a0f1e]/90 backdrop-blur-xl corner">
          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-3 border border-[#ff2d55]/40 rounded-lg bg-[#ff2d55]/10 text-[#ff2d55] text-sm"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#00d4ff]/70 mb-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>EMAIL_ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00d4ff]/50" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="player@example.com"
                  className="input-glow w-full pl-11 pr-4 py-3 bg-[#0d1528] border border-[#00d4ff]/20 rounded-lg text-white placeholder-[#8892a4]/50 focus:outline-none transition-all text-sm"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#00d4ff]/70 mb-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00d4ff]/50" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••••••"
                  className="input-glow w-full pl-11 pr-4 py-3 bg-[#0d1528] border border-[#00d4ff]/20 rounded-lg text-white placeholder-[#8892a4]/50 focus:outline-none transition-all text-sm"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }} />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,212,255,0.4)' }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-4 font-black text-[#050810] rounded-lg flex items-center justify-center gap-2 tracking-widest disabled:opacity-50 mt-2"
              style={{ fontFamily: "'Orbitron', sans-serif", background: loading ? '#1a2540' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: loading ? '#8892a4' : '#050810' }}>
              {loading ? '[ AUTHENTICATING... ]' : <>[ENTER SYSTEM] <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-[#8892a4] mt-6 text-sm" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            No account?{' '}
            <Link to="/signup" className="text-[#00d4ff] hover:underline">[CREATE_PLAYER]</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}