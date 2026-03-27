import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Laptop,
  ClipboardCheck,
  AlertTriangle,
  Users,
  LogOut,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'System Overview', path: '/', icon: LayoutDashboard },
    { name: 'Asset Masterlist', path: '/assets', icon: Laptop },
    { name: 'Procurement', path: '/requests', icon: ClipboardCheck },
    { name: 'Investigations', path: '/incidents', icon: AlertTriangle },
    { name: 'Directory', path: '/users', icon: Users },
  ];

  return (
    <div className="relative flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-900">
      {/* 1. GLOBAL BACKGROUND: The Subtle "HISP Aura" */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ff8000] rounded-full blur-[150px] opacity-[0.08] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#e49f37] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />

      {/* 2. THE GLASS SIDEBAR */}
      <aside className="relative z-20 w-72 bg-white/60 backdrop-blur-2xl border-r border-white/80 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
        {/* Brand Header */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100">
              <img
                src="https://pbs.twimg.com/profile_images/1151137195027132418/5g7iNP8z_400x400.png"
                alt="HISP Rwanda"
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-800 tracking-tight leading-none">
                HISP-AMS
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#ff8000] mt-1">
                Rwanda
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff8000] to-[#e49f37] text-white shadow-[0_8px_16px_-6px_rgba(255,128,0,0.4)]'
                    : 'text-slate-500 hover:bg-white/80 hover:text-[#ff8000] hover:shadow-sm'
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  // Optional: Add a subtle bounce effect on the active icon
                  ({ isActive }: any) =>
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Quick-Card (Glass inside Glass) */}
        <div className="p-4 m-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white shadow-sm">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff8000] to-[#e49f37] flex items-center justify-center font-bold text-white shadow-inner">
              {user?.first_name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-slate-800 truncate leading-tight">
                {user?.first_name || 'Admin'} {user?.last_name || 'User'}
              </span>
              <span className="text-[10px] text-[#e49f37] uppercase font-black tracking-wider">
                {user?.role || 'SYSTEM ADMIN'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-500 bg-white/60 hover:bg-[#ff8000] hover:text-white rounded-xl transition-colors group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Secure Sign Out
          </button>
        </div>
      </aside>

      {/* 3. THE MAIN ARENA */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Glass Header */}
        <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-white flex items-center justify-between px-10 sticky top-0 z-30">
          {/* Smart Search */}
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#ff8000] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by serial number, user, or tag ID..."
              className="w-full bg-white/60 border border-white rounded-2xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-[#ff8000]/10 focus:border-[#ff8000]/30 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm"
            />
            {/* Shortcut Hint */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-300 border border-slate-200 rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center justify-end gap-1 mb-0.5">
                <Sparkles className="w-3 h-3 text-[#e49f37]" /> Core Network
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 justify-end bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Synchronized
              </span>
            </div>

            <button className="relative p-3 bg-white/60 border border-white rounded-full text-slate-500 hover:text-[#ff8000] hover:shadow-md transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Data Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 lg:p-10">
          {/* The Outlet renders the current page (e.g., Asset Table, Dashboard) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
