import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, User, Globe, Heart, ShieldAlert, Check, RefreshCw, Trash2, HelpCircle 
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, resetLocalStorageData } = useApp();
  const [successMsg, setSuccessMsg] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Form states initialized from user
  const [name, setName] = useState(user?.displayName || "Prashant");
  const [country, setCountry] = useState(user?.country || "India");
  const [lifestylePreference, setLifestylePreference] = useState<'Vegan' | 'Vegetarian' | 'Mixed' | 'Non-Veg'>(user?.lifestylePreference || "Mixed");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await updateProfile({
      displayName: name,
      country,
      lifestylePreference
    });

    setSuccessMsg("Profile variables synchronized successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleCachePurge = () => {
    setIsResetting(true);
    resetLocalStorageData();
    setTimeout(() => {
      setIsResetting(false);
      setSuccessMsg("Local state wiped. Relogging to sync variables.");
    }, 600);
  };

  return (
    <div id="profile_view_root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
      
      {/* LEFT COLUMN: Update Profile credentials panel (8 cols) */}
      <div className="lg:col-span-8">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl pointer-events-none rounded-full" />
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4.5 mb-6">
            <h3 className="text-md font-bold text-white tracking-tight">Account Climate Profile</h3>
            {successMsg && (
              <span id="profile_success_toast" className="px-3 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    id="profile_name_input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-emerald-500/30 rounded-xl text-xs text-white bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Country Zone</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <select
                    id="profile_country_select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white bg-[#050816]"
                  >
                    <option value="India" className="bg-[#050816]">India</option>
                    <option value="United States" className="bg-[#050816]">United States</option>
                    <option value="United Kingdom" className="bg-[#050816]">United Kingdom</option>
                    <option value="Germany" className="bg-[#050816]">Germany</option>
                    <option value="Canada" className="bg-[#050816]">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Dietary style / Lifestyle Preference</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Vegan', 'Vegetarian', 'Mixed', 'Non-Veg'] as const).map((pref) => (
                  <button
                    id={`profile_pref_${pref}`}
                    key={pref}
                    type="button"
                    onClick={() => setLifestylePreference(pref)}
                    className={`py-2 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
                      lifestylePreference === pref
                        ? 'bg-[#10b981]/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/20'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="save_profile_variables"
              type="submit"
              className="w-full py-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.3)] transition"
            >
              Sync Profile details
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: System configurations & cache triggers (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Diagnostics Credentials info Card */}
        <div className="p-5.5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3.5 select-none text-xs">
          <div className="flex items-center gap-2">
            <Settings className="w-4.5 h-4.5 text-cyan-300" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">System Diagnostics</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Your credentials profile synchronized securely under Net Zero sandbox protocol credentials.
          </p>
          <div className="space-y-2 border-t border-white/5 pt-3.5 text-slate-400">
            <p><strong>Email:</strong> {user?.email || 'user@ecotrack.ai'}</p>
            <p><strong>Account Rank:</strong> Tier-2 (Active Warrior)</p>
            <p><strong>Points score:</strong> {user?.carbonScore || 75} XP</p>
          </div>
        </div>

        {/* Cache purging and deletions */}
        <div className="p-5.5 rounded-3xl bg-white/5 border border-red-500/20 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Danger Zone</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Executing purging operations clears all offline storage variables from this computer. Ensure certificates are compiled beforehand.
          </p>

          <div className="space-y-2.5">
            <button
              id="purge_cache_btn"
              onClick={handleCachePurge}
              disabled={isResetting}
              className="w-full py-3.5 rounded-xl text-xs font-bold border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Purging offsets...' : 'Wipe local carbon state'}</span>
            </button>
            <button
              id="simulate_delete_profile"
              onClick={() => alert("Simulated Profile Deletion: In production this cleanly wipes Firestore accounts entirely.")}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Request Account Eradication</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
