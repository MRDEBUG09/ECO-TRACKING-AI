import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Sidebar, Topbar } from './components/Navigation';

// Standard Sub-views
import { DashboardHome } from './components/DashboardHome';
import { ActivityTracking } from './components/ActivityTracking';
import { AnalyticsView } from './components/AnalyticsView';
import { GoalsView } from './components/GoalsView';
import { ChallengesView } from './components/ChallengesView';
import { AICoach } from './components/AICoach';
import { PredictionsView } from './components/PredictionsView';
import { ReportsView } from './components/ReportsView';
import { ProfileView } from './components/ProfileView';

import { RefreshCw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, loading } = useApp();
  const [hasStarted, setHasStarted] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Loading screen
  if (loading) {
    return (
      <div id="global_loader" className="min-h-screen bg-[#050816] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
          <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
        </div>
        <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Syncing Climate Offsets...</p>
      </div>
    );
  }

  // 2. Unauthenticated: Show beautiful Landing Page
  if (!user) {
    if (!hasStarted) {
      return <LandingPage onStart={() => setHasStarted(true)} />;
    }
    // Toggle login/register forms
    return <AuthPage />;
  }

  // 3. Authenticated Workspace
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome setActiveView={setActiveView} />;
      case 'activities':
        return <ActivityTracking />;
      case 'analytics':
        return <AnalyticsView />;
      case 'goals':
        return <GoalsView />;
      case 'challenges':
        return <ChallengesView />;
      case 'ai-coach':
        return <AICoach />;
      case 'predictions':
        return <PredictionsView />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardHome setActiveView={setActiveView} />;
    }
  };

  return (
    <div id="workspace_root" className="min-h-screen bg-[#050816] text-white flex flex-col lg:flex-row relative font-sans overflow-hidden">
      
      {/* Absolute Ambient Background Lights for Frosted Glass Theme */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Backdrop for mobile sliding view drawers */}
      {mobileSidebarOpen && (
        <div 
          id="sidebar_backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Primary Layout Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Global sticky Topbar header */}
        <Topbar 
          onMenuOpen={() => setMobileSidebarOpen(true)} 
          activeView={activeView} 
        />

        {/* Core Interactive Viewports Scroll Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
