import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// Sidebar expands to 220px and collapses to 64px.
// We use CSS transition on margin-left to keep main content in sync.
// The sidebar spring animation (~300ms) is matched by the CSS transition.
export default function Layout() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#020d18' }}>
      <Sidebar />
      {/*
        Default margin matches expanded sidebar width.
        When sidebar collapses the sidebar is fixed-position so this margin
        creates the offset; the transition smooths it visually.
        For a fully reactive margin, pass expanded state via context —
        but for most use cases the fixed 220px is fine as the sidebar
        overlaps content only by ~156px when collapsed.
      */}
      <main style={{ flex:1, marginLeft:220, minWidth:0, transition:'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        <Outlet />
      </main>
    </div>
  );
}