import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Scan, Shield, Activity, User, LogOut,
  Heart, Bell, Bot, AlertTriangle, ChevronRight, Menu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { path: '/app/dashboard',         icon: LayoutDashboard, label: 'Dashboard',        accent: '#00e5ff' },
  { path: '/app/disease-detection', icon: Scan,            label: 'Disease Scan',     accent: '#00e5ff' },
  { path: '/app/risk-assessment',   icon: Shield,          label: 'Risk Assessment',  accent: '#a78bfa' },
  { path: '/app/health-monitoring', icon: Activity,        label: 'Vitals Monitor',   accent: '#34d399' },
  { path: '/app/reminders',         icon: Bell,            label: 'Reminders',        accent: '#fbbf24' },
  { path: '/app/ai-companion',      icon: Bot,             label: 'CARE-AI',          accent: '#34d399' },
  { path: '/app/emergency',         icon: AlertTriangle,   label: 'Emergency SOS',    accent: '#f87171', pulse: true },
  { path: '/app/profile',           icon: User,            label: 'Profile',          accent: '#c084fc' },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm('Log out of MedIntel?')) { await signOut(); navigate('/login'); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .sidebar-root { font-family: 'DM Sans', sans-serif; }
        .nav-link-pill { transition: background 0.2s, color 0.2s; }
        .nav-link-pill:hover { background: rgba(0,229,255,0.07); }
        .nav-link-pill.active-link { background: rgba(0,229,255,0.12); }
        .bio-glow { filter: drop-shadow(0 0 6px currentColor); }
        @keyframes sos-beat { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.2)} }
        .sos-pulse { animation: sos-beat 1.2s ease-in-out infinite; }
      `}</style>

      <motion.aside
        animate={{ width: expanded ? 220 : 68 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="sidebar-root h-screen fixed left-0 top-0 z-50 flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #020d18 0%, #030f1c 60%, #020b14 100%)',
          borderRight: '1px solid rgba(0,229,255,0.08)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top — logo + toggle */}
        <div className="flex items-center gap-3 px-3 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(0,229,255,0.06)', minHeight: 64 }}>
          {/* Logo icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center cursor-pointer relative"
            style={{ background: 'linear-gradient(135deg, #00e5ff22, #00e5ff11)', border: '1px solid rgba(0,229,255,0.25)' }}
            onClick={() => navigate('/app/dashboard')}
          >
            <Heart className="w-5 h-5 bio-glow" style={{ color: '#00e5ff' }} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#34d399]" style={{ boxShadow: '0 0 6px #34d399' }} />
          </motion.div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: '#e0f7ff', letterSpacing: 1, whiteSpace: 'nowrap' }}>
                  MEDI<span style={{ color: '#00e5ff' }}>INTEL</span>
                </div>
                <div style={{ fontSize: 9, color: 'rgba(0,229,255,0.45)', letterSpacing: '0.15em', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  HEALTH OS v2.4
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hamburger toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(v => !v)}
            className="ml-auto w-8 h-8 shrink-0 flex items-center justify-center rounded-lg"
            style={{ color: 'rgba(0,229,255,0.5)', background: 'rgba(0,229,255,0.04)' }}
          >
            <Menu className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
          {NAV.map(({ path, icon: Icon, label, accent, pulse }) => (
            <NavLink key={path} to={path}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`nav-link-pill flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer ${isActive ? 'active-link' : ''}`}
                  style={{ position: 'relative' }}
                  title={!expanded ? label : undefined}
                >
                  {/* Active bar */}
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                    />
                  )}

                  {/* Icon */}
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg relative"
                    style={{
                      background: isActive ? `${accent}18` : 'transparent',
                      border: isActive ? `1px solid ${accent}35` : '1px solid transparent',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? accent : 'rgba(148,163,184,0.7)' }} />
                    {pulse && (
                      <span className="sos-pulse absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#f87171]"
                        style={{ boxShadow: '0 0 6px #f87171' }} />
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? accent : 'rgba(148,163,184,0.85)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Chevron only when expanded + active */}
                  {expanded && isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto shrink-0" style={{ color: accent }} />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom — user + logout */}
        <div className="px-2 py-3 shrink-0" style={{ borderTop: '1px solid rgba(0,229,255,0.06)' }}>
          {/* User chip */}
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl mb-1"
            style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.07)' }}>
            <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#00e5ff,#34d399)', color: '#020d18' }}>
              {(profile?.full_name || 'U')[0].toUpperCase()}
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="overflow-hidden min-w-0"
                >
                  <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile?.full_name || 'User'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all"
            style={{ color: 'rgba(248,113,113,0.7)' }}
            title={!expanded ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}