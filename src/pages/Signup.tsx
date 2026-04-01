import { useState, type FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&family=Azeret+Mono:wght@400;500&display=swap');
  .auth-grid { background-image: linear-gradient(rgba(52,211,153,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.025) 1px,transparent 1px); background-size: 48px 48px; }
  .auth-input { width:100%; padding:13px 16px 13px 44px; background:rgba(3,15,28,0.8); border:1px solid rgba(52,211,153,0.13); border-radius:12px; color:#e0f7ff; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; box-sizing:border-box; }
  .auth-input:focus { border-color:rgba(52,211,153,0.45); box-shadow:0 0 0 3px rgba(52,211,153,0.06),0 0 20px rgba(52,211,153,0.07); }
  .auth-input::placeholder { color:rgba(148,163,184,0.4); }
  .auth-btn { width:100%; padding:14px; border-radius:12px; border:none; background:linear-gradient(135deg,#34d399,#059669); color:#020d18; font-family:'Syne',sans-serif; font-weight:800; font-size:13px; letter-spacing:0.08em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:box-shadow 0.2s,transform 0.15s; }
  .auth-btn:hover { box-shadow:0 0 40px rgba(52,211,153,0.4); transform:translateY(-1px); }
  .auth-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
`;

const PERKS = ['AI Disease Detection', 'Real-time Vitals', 'Risk Modeling', 'Emergency SOS'];

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
    e.preventDefault(); setError(''); setLoading(true);
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
    const { error } = await signUp(email, password, fullName);
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#020d18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <style>{AUTH_STYLES}</style>
      <div className="auth-grid" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '-15%', right: '-8%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,255,0.04) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#34d39922,#34d39911)', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Activity style={{ width: 24, height: 24, color: '#34d399', filter: 'drop-shadow(0 0 8px #34d399)' }} />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: '#f0faff', letterSpacing: -0.5, marginBottom: 6 }}>Create your profile</h1>
          <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)', fontFamily: "'Azeret Mono', monospace", letterSpacing: '0.1em' }}>// INITIALIZE HEALTH PROFILE</p>
        </div>

        {/* Perks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {PERKS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)', borderRadius: 10 }}>
              <CheckCircle style={{ width: 13, height: 13, color: '#34d399', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.75)' }}>{p}</span>
            </motion.div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'linear-gradient(135deg,rgba(2,20,35,0.95),rgba(3,15,28,0.98))', border: '1px solid rgba(52,211,153,0.1)', borderRadius: 20, padding: 30, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              style={{ marginBottom: 18, padding: '11px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, color: '#f87171', fontSize: 12, fontFamily: "'Azeret Mono', monospace" }}>
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', type: 'text', val: fullName, set: setFullName, icon: User, ph: 'Your full name' },
              { label: 'Email', type: 'email', val: email, set: setEmail, icon: Mail, ph: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, icon: Lock, ph: 'min. 6 characters' },
            ].map(({ label, type, val, set, icon: Icon, ph }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(52,211,153,0.55)', letterSpacing: '0.15em', fontFamily: "'Azeret Mono', monospace", marginBottom: 7 }}>{label.toUpperCase()}</label>
                <div style={{ position: 'relative' }}>
                  <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(52,211,153,0.4)' }} />
                  <input className="auth-input" type={type} value={val} onChange={e => set(e.target.value)} required placeholder={ph} />
                </div>
              </div>
            ))}

            <button className="auth-btn" type="submit" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Creating profile...' : <> Create Account <ArrowRight style={{ width: 15, height: 15 }} /> </>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(148,163,184,0.5)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}