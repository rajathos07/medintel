import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Scan, Shield, Activity, User, LogOut,
  Heart, Bell, Bot, AlertTriangle, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { path: '/app/dashboard',         icon: LayoutDashboard, label: 'Dashboard',        accent: '#00e5ff' },
  { path: '/app/disease-detection', icon: Scan,            label: 'Disease Detection',accent: '#00e5ff' },
  { path: '/app/risk-assessment',   icon: Shield,          label: 'Risk Assessment',  accent: '#a78bfa' },
  { path: '/app/health-monitoring', icon: Activity,        label: 'Health Monitoring',accent: '#34d399' },
  { path: '/app/reminders',         icon: Bell,            label: 'Reminders',        accent: '#fbbf24' },
  { path: '/app/ai-companion',      icon: Bot,             label: 'AI Companion',     accent: '#34d399' },
  { path: '/app/emergency',         icon: AlertTriangle,   label: 'Emergency SOS',    accent: '#f87171', pulse: true },
  { path: '/app/profile',           icon: User,            label: 'Profile',          accent: '#c084fc' },
];

const EXPANDED_W  = 220;
const COLLAPSED_W = 64;

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
        .sb-root { font-family: 'DM Sans', sans-serif; }
        .sb-item  { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:12px; cursor:pointer; text-decoration:none; transition:background 0.18s; position:relative; }
        .sb-item:hover { background: rgba(0,229,255,0.07); }
        .sb-item.sb-active { background: rgba(0,229,255,0.11); }
        .sb-nav::-webkit-scrollbar { display:none; }
        .sb-nav { scrollbar-width:none; }
        @keyframes sos-beat { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.35);opacity:0.55} }
        .sos-dot { animation: sos-beat 1.2s ease-in-out infinite; }
        .sb-toggle { display:flex; align-items:center; justify-content:center; border-radius:9px; border:1px solid rgba(0,229,255,0.15); background:rgba(0,229,255,0.05); cursor:pointer; color:rgba(0,229,255,0.65); transition:background 0.18s,border-color 0.18s; flex-shrink:0; }
        .sb-toggle:hover { background:rgba(0,229,255,0.12); border-color:rgba(0,229,255,0.35); }
      `}</style>

      {/* Main sidebar */}
      <motion.aside
        className="sb-root"
        animate={{ width: expanded ? EXPANDED_W : COLLAPSED_W }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'linear-gradient(180deg,#020d18 0%,#030f1c 60%,#020b14 100%)',
          borderRight: '1px solid rgba(0,229,255,0.08)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.55)',
        }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 12px', borderBottom:'1px solid rgba(0,229,255,0.06)', minHeight:64, flexShrink:0 }}>
          {/* Logo */}
          <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={() => navigate('/app/dashboard')}
            style={{ width:38,height:38,flexShrink:0,borderRadius:11,background:'linear-gradient(135deg,rgba(0,229,255,0.18),rgba(0,229,255,0.07))',border:'1px solid rgba(0,229,255,0.28)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative' }}>
            <Heart style={{ width:17,height:17,color:'#00e5ff',filter:'drop-shadow(0 0 6px #00e5ff)' }} />
            <span style={{ position:'absolute',top:2,right:2,width:7,height:7,borderRadius:'50%',background:'#34d399',boxShadow:'0 0 6px #34d399' }} />
          </motion.div>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-8 }} transition={{ duration:0.13 }}
                style={{ flex:1, minWidth:0, overflow:'hidden' }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:'#e0f7ff',letterSpacing:1,whiteSpace:'nowrap' }}>
                  MEDI<span style={{ color:'#00e5ff' }}>INTEL</span>
                </div>
                <div style={{ fontSize:9,color:'rgba(0,229,255,0.4)',letterSpacing:'0.14em',fontFamily:'monospace',whiteSpace:'nowrap' }}>
                  HEALTH OS v2.4
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Toggle button: always rendered, always clickable ── */}
          <button
            className="sb-toggle"
            style={{ width:30,height:30,marginLeft:'auto' }}
            onClick={() => setExpanded(v => !v)}
            title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {expanded
              ? <ChevronLeft  style={{ width:14,height:14 }} />
              : <ChevronRight style={{ width:14,height:14 }} />
            }
          </button>
        </div>

        {/* Nav links */}
        <nav className="sb-nav" style={{ flex:1, overflowY:'auto', padding:'10px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ path, icon:Icon, label, accent, pulse }) => (
            <NavLink key={path} to={path} style={{ textDecoration:'none' }}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: expanded ? 2 : 0 }}
                  className={`sb-item${isActive ? ' sb-active' : ''}`}
                  title={!expanded ? label : undefined}
                  style={{ justifyContent: expanded ? 'flex-start' : 'center' }}
                >
                  {/* Active bar */}
                  {isActive && (
                    <motion.span layoutId="sb-active-bar"
                      style={{ position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:3,height:20,borderRadius:'0 3px 3px 0',background:accent,boxShadow:`0 0 10px ${accent}` }} />
                  )}

                  {/* Icon */}
                  <div style={{ width:32,height:32,flexShrink:0,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',
                    background: isActive ? `${accent}18` : 'transparent',
                    border: isActive ? `1px solid ${accent}30` : '1px solid transparent',
                    transition:'background 0.18s,border-color 0.18s' }}>
                    <Icon style={{ width:16,height:16,color: isActive ? accent : 'rgba(148,163,184,0.65)' }} />
                    {pulse && (
                      <span className="sos-dot" style={{ position:'absolute',top:0,right:0,width:7,height:7,borderRadius:'50%',background:'#f87171',boxShadow:'0 0 6px #f87171' }} />
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.12 }}
                        style={{ fontSize:13,fontWeight:isActive?600:400,color:isActive?accent:'rgba(148,163,184,0.8)',whiteSpace:'nowrap',flex:1 }}>
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {expanded && isActive && <ChevronRight style={{ width:11,height:11,color:`${accent}70`,flexShrink:0 }} />}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(0,229,255,0.06)', flexShrink:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:12,marginBottom:4,
            background:'rgba(0,229,255,0.04)',border:'1px solid rgba(0,229,255,0.07)',
            justifyContent: expanded ? 'flex-start' : 'center', overflow:'hidden' }}>
            <div style={{ width:26,height:26,flexShrink:0,borderRadius:'50%',background:'linear-gradient(135deg,#00e5ff,#34d399)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#020d18' }}>
              {(profile?.full_name || 'U')[0].toUpperCase()}
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ fontSize:11,color:'#94a3b8',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>
                  {profile?.full_name || 'Loading...'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button onClick={handleLogout} title={!expanded ? 'Log out' : undefined}
            style={{ width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:12,background:'transparent',border:'none',color:'rgba(248,113,113,0.7)',cursor:'pointer',justifyContent:expanded?'flex-start':'center' }}>
            <LogOut style={{ width:15,height:15,flexShrink:0 }} />
            <AnimatePresence>
              {expanded && (
                <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ fontSize:12,whiteSpace:'nowrap' }}>Log out</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ── Edge expand tab (shown only when collapsed) ──────────────────
          Provides a large, easy-to-click target to re-expand the sidebar
          even if the user misses the small chevron inside it.           */}
      <AnimatePresence>
        {!expanded && (
          <motion.button
            key="edge-tab"
            initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-6 }}
            transition={{ duration:0.2 }}
            onClick={() => setExpanded(true)}
            title="Expand sidebar"
            style={{
              position:'fixed', left:COLLAPSED_W, top:'50%', transform:'translateY(-50%)',
              zIndex:49, width:18, height:52, borderRadius:'0 10px 10px 0',
              background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.22)',
              borderLeft:'none', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', color:'rgba(0,229,255,0.7)',
            }}
          >
            <ChevronRight style={{ width:11,height:11 }} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}