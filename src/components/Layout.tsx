import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020d18' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 220, minWidth: 0, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        <Outlet />
      </main>
    </div>
  );
}