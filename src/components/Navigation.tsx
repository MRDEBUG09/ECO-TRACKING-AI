import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, BarChart3, Target, CalendarDays, MessageSquarePlus, 
  TrendingUp, FileSpreadsheet, Settings, LogOut, Bell, Menu, X, Leaf, User 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
  const { logout, user } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Leaf },
    { id: 'activities', label: 'Track Activities', icon: CalendarDays },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'goals', label: 'My Commitments', icon: Target },
    { id: 'challenges', label: 'Community', icon: History },
    { id: 'ai-coach', label: 'AI Personal Coach', icon: MessageSquarePlus },
    { id: 'predictions', label: 'AI Forecasts', icon: TrendingUp },
    { id: 'reports', label: 'ESG Reports', icon: FileSpreadsheet },
    { id: 'profile', label: 'Personal Settings', icon: Settings },
  ];

  return (
    <aside 
      id="app_sidebar"
      className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/5 border-r border-white/10 backdrop-blur-3xl z-50 transition-transform duration-300 flex flex-col justify-between 
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                EcoTrack<span className="text-emerald-400 font-extrabold">AI</span>
              </h1>
              <span className="text-[10px] text-emerald-400/80 uppercase font-bold tracking-widest leading-none block mt-0.5">
                Measure. Understand. Reduce.
              </span>
            </div>
          </div>
          {onClose && (
            <button id="close_sidebar_btn" onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                id={`nav_btn_${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl transition duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-white/10 text-emerald-400 border border-white/10 font-semibold' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile Card */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-bold text-white uppercase text-sm border border-emerald-400/25 shadow-lg">
            {user?.displayName ? user.displayName.substring(0, 2) : <User className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 id="sidebar_username" className="text-sm font-medium text-white truncate">{user?.displayName || 'Eco Warrior'}</h4>
            <p className="text-xs text-slate-400 truncate">{user?.email || 'user@ecotrack.ai'}</p>
          </div>
        </div>
        <button
          id="logout_btn"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition cursor-pointer text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

interface TopbarProps {
  onMenuOpen: () => void;
  activeView: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuOpen, activeView }) => {
  const { notifications, markNotificationRead, user } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Mission Control Dashboard',
    activities: 'Utility Footprint Tracker',
    analytics: 'Climate Impact Insights',
    goals: 'Commitments & Goal Milestones',
    challenges: 'Community Impact Challenges',
    'ai-coach': 'AI Carbon Coach',
    predictions: 'AI Footprint Forecast Engine',
    reports: 'ESG Carbon Audit Reports',
    profile: 'Climate Prefs & Account Settings',
  };

  return (
    <header 
      id="app_topbar"
      className="sticky top-0 bg-white/5 backdrop-blur-3xl border-b border-white/10 z-40 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button id="toggle_menu_btn" onClick={onMenuOpen} className="lg:hidden text-slate-400 hover:text-white transition">
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 id="topbar_title" className="text-lg font-bold text-white tracking-tight">
            {viewTitles[activeView] || 'EcoTrack AI'}
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            Location Profile: <span className="text-emerald-400 font-semibold">{user?.country || 'India'}</span> • Score: <span className="text-cyan-300 font-bold">{user?.carbonScore || 75} XP</span>
          </p>
        </div>
      </div>

      {/* Notifications and Profile triggers */}
      <div className="flex items-center gap-4 relative">
        <button
          id="toggle_notifications_btn"
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition cursor-pointer relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          )}
        </button>

        {showNotifications && (
          <div 
            id="notifications_panel"
            className="absolute right-0 top-13 w-80 max-h-[400px] overflow-y-auto bg-[#050816]/90 border border-white/10 backdrop-blur-3xl rounded-2xl p-4 shadow-2xl z-50 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="text-sm font-semibold text-white">Notifications</h4>
              {unreadCount > 0 && <span className="text-xs text-emerald-450 font-medium">{unreadCount} unread</span>}
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-450 text-center py-6">No recent updates.</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-xl border transition text-left cursor-pointer ${
                      n.isRead 
                        ? 'bg-white/[0.01] border-white/5 opacity-60' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate pr-2">{n.title}</span>
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5">{n.message}</p>
                    <span className="text-[9px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Small Active User Badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          <span className="text-xs text-slate-300 font-medium leading-none">Net Zero Target Sync</span>
        </div>
      </div>
    </header>
  );
};
