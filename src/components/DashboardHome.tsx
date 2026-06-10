import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { 
  TrendingUp, Leaf, Zap, BarChart3, Target, Calendar, Sparkles, MessageSquare, Plus, ArrowRight, ShieldCheck, RefreshCw, AlertCircle
} from 'lucide-react';

interface DashboardHomeProps {
  setActiveView: (view: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ setActiveView }) => {
  const { 
    user, activities, goals, aiInsights, requestInsights, logActivity 
  } = useApp();

  const [quickLoggingOpen, setQuickLoggingOpen] = useState(false);
  const [quickCat, setQuickCat] = useState<'transportation' | 'electricity' | 'food' | 'shopping' | 'waste'>('transportation');
  const [quickVal, setQuickVal] = useState<number>(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute calculated metrics
  const totalLoggedEmissions = activities.reduce((acc, curr) => acc + curr.emissionsKg, 0);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayActs = activities.filter(a => a.date === todayDateStr);
  const todayEmissions = todayActs.reduce((acc, curr) => acc + curr.emissionsKg, 0);

  const handleRefreshInsights = async () => {
    setIsRefreshing(true);
    await requestInsights();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    let computedEmissions = quickVal;
    const detailsObj: any = {};

    if (quickCat === 'transportation') {
      computedEmissions = parseFloat((quickVal * 0.18).toFixed(1)); // 0.18kg co2 per km average car
      detailsObj.transportType = 'car';
      detailsObj.distanceKm = quickVal;
    } else if (quickCat === 'electricity') {
      computedEmissions = parseFloat((quickVal * 0.45).toFixed(1)); // 0.45kg co2 per kWh average
      detailsObj.kwh = quickVal;
    } else if (quickCat === 'food') {
      computedEmissions = quickVal * 1.5; // meal constant
      detailsObj.dietType = 'Mixed';
      detailsObj.mealsCount = quickVal;
    } else {
      computedEmissions = quickVal; // flat raw rating
    }

    await logActivity(quickCat, computedEmissions, detailsObj);
    setQuickLoggingOpen(false);
    setQuickVal(10);
  };

  // Get score description and color rings
  const carbonScoreValue = user?.carbonScore || 75;
  let scoreTheme = { color: "text-emerald-400 font-bold", ring: "border-emerald-500/20", bg: "bg-emerald-500/10", tier: "Elite Green Pioneer" };
  if (carbonScoreValue < 55) {
    scoreTheme = { color: "text-red-400 font-bold", ring: "border-red-500/20", bg: "bg-red-500/10", tier: "High Output Level" };
  } else if (carbonScoreValue < 75) {
    scoreTheme = { color: "text-yellow-400 font-bold", ring: "border-yellow-500/20", bg: "bg-yellow-500/10", tier: "Active Carbon Mitigator" };
  }

  return (
    <div id="dashboard_home_container" className="space-y-8 animate-fade-in">
      
      {/* HEADER GREETING BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
        {/* Glow behind greeting */}
        <div className="absolute top-0 right-0 w-32 h-full bg-emerald-500/5 blur-2xl rounded-full" />
        <div className="space-y-1 relative z-10">
          <h1 id="dashboard_greeting" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Greetings, {user?.displayName || 'Prashant'}!
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            You are currently categorized as an <span className={`${scoreTheme.color} text-xs font-semibold`}>{scoreTheme.tier}</span>. Track today's lifestyle entries below.
          </p>
        </div>
        <button
          id="trigger_quick_log_btn"
          onClick={() => setQuickLoggingOpen(true)}
          className="px-5 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition cursor-pointer flex items-center justify-center gap-2 self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Quick Log Footprint</span>
        </button>
      </div>

      {/* ROW 1 BENTO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* BENTO CARD 1: Carbon Score Circular Gauge */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between group hover:border-[#10b981]/25 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Your Carbon Score</h3>
            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-4 h-4" />
            </span>
          </div>

          {/* Radial indicator */}
          <div className="flex flex-col items-center justify-center space-y-4 py-3 relative">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer circular boundary */}
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-slate-700/60" />
              <div className={`absolute inset-4 rounded-full border-4 ${scoreTheme.ring} flex flex-col items-center justify-center`}>
                <span id="score_value_label" className={`text-4.5xl font-extrabold ${scoreTheme.color} tracking-tight`}>
                  {carbonScoreValue}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Score / 100</span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl ${scoreTheme.bg} border border-emerald-500/15`}>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                Level {Math.floor(carbonScoreValue / 10)} Offsetter
              </span>
            </div>
          </div>
        </div>

        {/* BENTO CARD 2: Cumulative and Day Emissions trackers */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/20 transition">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Logged Emissions</h3>
            <span className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-300 border border-cyan-500/20">
              <Zap className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-6 relative z-10 py-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">{todayEmissions.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg CO₂</span></p>
                <h4 className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Today's Footprint</h4>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">-12% from average</span>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-white tracking-tight">{totalLoggedEmissions.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg CO₂</span></p>
              <h4 className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Monthly Footprint</h4>
            </div>
          </div>

          <button
            id="view_all_analytics_btn"
            onClick={() => setActiveView('analytics')}
            className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <span>Explore Analytics Graphs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BENTO CARD 3: Active Goals progress list */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between group hover:border-[#10b981]/25 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Goals & Commitments</h3>
            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <Target className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-4 py-2">
            {goals.slice(0, 2).map((g) => {
              const progressPct = Math.min(100, Math.floor((g.currentProgress / g.targetReduction) * 100));
              return (
                <div key={g.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white truncate max-w-[150px]">{g.title}</span>
                    <span className="text-emerald-400 font-bold">{progressPct}%</span>
                  </div>
                  {/* Linear bar */}
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">Target: {g.targetReduction} kg CO₂</span>
                </div>
              );
            })}
            {goals.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center">No active goals found.</p>
            )}
          </div>

          <button
            id="view_all_goals_btn"
            onClick={() => setActiveView('goals')}
            className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <span>Manage Commitments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ROW 2 BENTO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BENTO CARD 4 (8 cols): AI Carbon Coach Gemini Insight widget */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
          {/* Radial light */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4.5 mb-6.5 relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-md font-bold text-white tracking-tight">AI Carbon Intelligence Coach</h3>
            </div>
            <button
              id="refresh_insights_btn"
              onClick={handleRefreshInsights}
              disabled={isRefreshing}
              className="p-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-white/5 bg-white/5 hover:bg-white/10 transition rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Recomputing...' : 'Re-Analyze'}</span>
            </button>
          </div>

          {aiInsights ? (
            <div className="space-y-5 relative ref_insights_area">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <p id="ai_insight_text" className="text-xs leading-relaxed text-slate-300">
                  {aiInsights.insightText}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Recommended Actions This Week</h4>
                <div id="ai_action_bullets_list" className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiInsights.recommendations.map((recText, idx) => (
                    <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs shrink-0 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-normal">{recText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-500 animate-pulse" />
              <p className="text-xs text-slate-400">Loading your personalized Gemini AI Recommendations...</p>
            </div>
          )}

          <div className="border-t border-white/5 pt-5 mt-6.5 flex justify-between items-center text-xs relative z-10">
            <span className="text-slate-500 font-medium select-none">Ask questions anytime.</span>
            <button
              id="trigger_coach_chat_btn"
              onClick={() => setActiveView('ai-coach')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Launch Conversational Coach</span>
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 5 (4 cols): Quick utility emissions helper */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-300" />
              <h3 className="text-md font-bold text-white tracking-tight">Emissions quicklog</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Quickly record general utility metrics or commute distance in 1 click.
            </p>

            <form onSubmit={handleQuickLog} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Utility Type</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['transportation', 'electricity', 'food'] as const).map((cat) => (
                    <button
                      id={`ql_cat_${cat}`}
                      key={cat}
                      type="button"
                      onClick={() => setQuickCat(cat)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition capitalize ${
                        quickCat === cat
                          ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat === 'transportation' ? 'Drive' : cat === 'electricity' ? 'Power' : 'Food'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {quickCat === 'transportation' ? 'Travel distance (km)' : quickCat === 'electricity' ? 'Consumption (kWh)' : 'Meals count'}
                </label>
                <input
                  id="ql_val_input"
                  type="number"
                  min="1"
                  required
                  value={quickVal}
                  onChange={(e) => setQuickVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl font-medium text-xs focus:outline-none focus:border-emerald-500/20 text-white"
                />
              </div>

              <button
                id="submit_quick_log"
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <span>Save Quick Log</span>
                <Plus className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* QUICK FLOATING DIALOG MODAL ON TRIGGER */}
      {quickLoggingOpen && (
        <div id="quick_log_modal_backdrop" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            id="quick_log_modal_panel"
            className="w-full max-w-sm bg-slate-900 border border-emerald-500/20 rounded-3xl p-6.5 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-white uppercase tracking-wider">Log Footprint Variables</h3>
              <button 
                id="close_ql_modal"
                onClick={() => setQuickLoggingOpen(false)} 
                className="text-slate-400 hover:text-white transition cursor-pointer text-sm"
              >
                Close
              </button>
            </div>
            {/* Same form can act within trigger */}
            <p className="text-xs text-slate-400">Head to the 'Track Activities' tab on the sidebar to fill in granular receipts (flights, vegetarian filters, fashionable items, metals etc).</p>
            <button
              id="goto_acts_tab_btn"
              onClick={() => {
                setQuickLoggingOpen(false);
                setActiveView('activities');
              }}
              className="w-full py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-xs text-emerald-400 font-bold transition flex items-center justify-center gap-2"
            >
              <span>Unlock full tracker parameters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
