import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { 
  Mail, Lock, Globe2, User, Leaf, ArrowRight, Zap, Target, Star, AlertCircle
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginWithGoogle, updateProfile, isFirebasePlaceholder } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: 'India',
    lifestylePreference: 'Mixed' as 'Vegan' | 'Vegetarian' | 'Mixed' | 'Non-Veg'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Form schema check
    if (isSignUp && !formData.name.trim()) {
      setError("Please key in your full name.");
      setLoading(false);
      return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please complete your email and password credentials.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign-up flow: simulate or triggers Google login to register user, or simulate offline registering instantly
        await loginWithGoogle();
        // Overwrite user preferences immediately
        await updateProfile({
          displayName: formData.name,
          country: formData.country,
          lifestylePreference: formData.lifestylePreference,
          carbonScore: 75,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Login flow: triggers Google authenticator instantly for premium hassle-free entry
        await loginWithGoogle();
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Authentication error occurred. Please verify keys.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError("Google Authentication failed. Proceeding with offline entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth_container_root" className="min-h-screen bg-[#050816] flex flex-col md:flex-row text-white overflow-hidden font-sans relative">
      <div className="absolute top-[-100px] left-[40%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* LEFT PANEL: Professional SaaS illustration, climate milestones, goals */}
      <div className="hidden md:flex md:w-1/2 bg-white/5 border-r border-white/10 p-12 flex-col justify-between relative overflow-hidden backdrop-blur-3xl z-10">
        
        {/* Glow and design elements */}
        <div className="absolute top-[30%] left-[20%] w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Header section */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-lg text-white">EcoTrack<span className="text-emerald-400 font-extrabold">AI</span></span>
        </div>

        {/* Climate achievement showcase card */}
        <div className="space-y-6 my-auto relative z-10 max-w-lg">
          <span className="px-3 py-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/15 rounded-full border border-emerald-500/20 inline-block">
            Net Zero Alliance 2026
          </span>
          <h2 className="text-3.5xl lg:text-4.5xl font-extrabold tracking-tight leading-tight">
            Transition to a <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">Sustainable</span> Future.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our machine intelligence engine helps households and pioneers measure utilities footprint, manage milestone goals, and trim average annual carbon by up to 40%.
          </p>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Verified Analytics</h4>
              <p className="text-[11px] text-slate-400 leading-normal">Carbon metrics tailored precisely using local emission algorithms.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
              <Target className="w-5 h-5 text-cyan-300" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Goals</h4>
              <p className="text-[11px] text-slate-400 leading-normal">Adopt community commitments, unlock medals, and save carbon.</p>
            </div>
          </div>
        </div>

        {/* Footer info links */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center gap-4">
          <span>Shield Secured</span>
          <span>•</span>
          <span>Google Sync Included</span>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication interactive forms */}
      <div className="w-full md:w-1/2 p-6 sm:p-12 md:p-16 flex flex-col justify-center relative bg-[#050816]/30 backdrop-blur-lg z-10">
        
        {/* Mobile Header block */}
        <div className="flex md:hidden items-center gap-2 mb-8">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-md text-white">EcoTrack AI</span>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8">
          
          <div className="space-y-2 text-left">
            <h3 id="auth_header_title" className="text-2.5xl font-bold tracking-tight text-white sm:text-3.5xl">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isSignUp ? 'Kickstart your personalized climate tracking profile.' : 'Manage activities and continue coaching dialogs.'}
            </p>
          </div>

          {/* Error boundary badge */}
          {error && (
            <div id="auth_error_card" className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-2.5 text-xs animate-bounce">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5.5 h-5.5 text-slate-500" />
                  <input
                    id="signup_name_input"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10.5 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/30 transition text-white placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5.5 h-5.5 text-slate-500" />
                <input
                  id="auth_email_input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10.5 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/30 transition text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5.5 h-5.5 text-slate-500" />
                <input
                  id="auth_password_input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10.5 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/30 transition text-white placeholder-slate-500"
                />
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Country Residence</label>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-3 w-5.5 h-5.5 text-slate-500" />
                    <select
                      id="signup_country_select"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full pl-10.5 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/30 transition text-white custom-select-arrow"
                    >
                      <option value="India" className="bg-[#050816]">India</option>
                      <option value="United States" className="bg-[#050816]">United States</option>
                      <option value="United Kingdom" className="bg-[#050816]">United Kingdom</option>
                      <option value="Germany" className="bg-[#050816]">Germany</option>
                      <option value="Canada" className="bg-[#050816]">Canada</option>
                      <option value="Australia" className="bg-[#050816]">Australia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Lifestyle / Diet Preference</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Vegan', 'Vegetarian', 'Mixed', 'Non-Veg'] as const).map((pref) => (
                      <button
                        id={`pref_btn_${pref}`}
                        key={pref}
                        type="button"
                        onClick={() => setFormData({ ...formData, lifestylePreference: pref })}
                        className={`py-2 text-[11px] font-bold rounded-lg border transition ${
                          formData.lifestylePreference === pref
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-0" />
                  <span>Remember Me</span>
                </label>
                <span className="hover:text-white transition cursor-pointer">Forgot Password?</span>
              </div>
            )}

            <button
              id="submit_auth_btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition bg-gradient-to-r from-emerald-500 to-cyan-400 hover:to-cyan-300 text-slate-950 font-bold cursor-pointer hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Eco Account' : 'Verify Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="w-full h-px bg-white/5" />
            <span className="shrink-0 uppercase font-bold tracking-widest text-[9px]">Carbon Gate Auths</span>
            <span className="w-full h-px bg-white/5" />
          </div>

          <button
            id="google_oauth_btn"
            type="button"
            onClick={handleOAuthLogin}
            className="w-full py-3.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white cursor-pointer transition flex items-center justify-center gap-3.5"
          >
            {/* Google Vector Icon */}
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google Account</span>
          </button>

          {/* Toggle register */}
          <div className="text-center text-xs text-slate-400">
            <span>{isSignUp ? 'Already registered on EcoTrack?' : 'First time committing to carbon offset?'} </span>
            <button
              id="toggle_auth_view_btn"
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-400 font-semibold underline hover:text-emerald-300 transition cursor-pointer ml-1"
            >
              {isSignUp ? 'Sign In' : 'Register Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
