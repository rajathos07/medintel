// ─────────────────────────────────────────────
//  Login.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AUTH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&family=Azeret+Mono:wght@400;500&display=swap');
  .auth-grid { background-image: linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px); background-size: 48px 48px; }
  .auth-input { width: 100%; padding: 13px 16px 13px 44px; background: rgba(3,15,28,0.8); border: 1px solid rgba(0,229,255,0.13); border-radius: 12px; color: #e0f7ff; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .auth-input:focus { border-color: rgba(0,229,255,0.45); box-shadow: 0 0 0 3px rgba(0,229,255,0.06), 0 0 20px rgba(0,229,255,0.08); }
  .auth-input::placeholder { color: rgba(148,163,184,0.4); }
  .auth-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg,#00c8e8,#0284c7); color: #020d18; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 0.08em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: box-shadow 0.2s, transform 0.15s; }
  .auth-btn:hover { box-shadow: 0 0 40px rgba(0,200,232,0.4); transform: translateY(-1px); }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  @keyframes cell-rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); }
    else navigate('/app/dashboard');
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#020d18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <style>{AUTH_STYLES}</style>
      <div className="auth-grid" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />
      {/* Orbs */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#00e5ff22,#00e5ff11)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Activity style={{ width: 24, height: 24, color: '#00e5ff', filter: 'drop-shadow(0 0 8px #00e5ff)' }} />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28, color: '#f0faff', letterSpacing: -0.5, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.55)', fontFamily: "'Azeret Mono', monospace", letterSpacing: '0.1em' }}>// AUTHENTICATE TO CONTINUE</p>
        </div>

        {/* Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(2,20,35,0.95), rgba(3,15,28,0.98))', border: '1px solid rgba(0,229,255,0.1)', borderRadius: 20, padding: 32, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, color: '#f87171', fontSize: 13, fontFamily: "'Azeret Mono', monospace" }}>
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Email', type: 'email', val: email, set: setEmail, icon: Mail, ph: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, icon: Lock, ph: '············' },
            ].map(({ label, type, val, set, icon: Icon, ph }) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(0,229,255,0.55)', letterSpacing: '0.15em', fontFamily: "'Azeret Mono', monospace", marginBottom: 8 }}>{label.toUpperCase()}</label>
                <div style={{ position: 'relative' }}>
                  <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(0,229,255,0.4)' }} />
                  <input className="auth-input" type={type} value={val} onChange={e => set(e.target.value)} required placeholder={ph} />
                </div>
              </div>
            ))}

            <button className="auth-btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Authenticating...' : <> Sign In <ArrowRight style={{ width: 15, height: 15 }} /> </>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: 'rgba(148,163,184,0.55)' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 600 }}>Create one →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;