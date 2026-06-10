import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Target, Award, Plus, Check, Zap, Sparkles, HelpCircle, Trophy, Trash2, Heart 
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoalProgress, user, activities } = useApp();
  const [successMsg, setSuccessMsg] = useState("");

  // Create Goal Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<'transportation' | 'electricity' | 'food' | 'shopping' | 'waste'>('transportation');
  const [targetReduction, setTargetReduction] = useState(40);

  // Manual Progress logger
  const [logProgressId, setLogProgressId] = useState<string | null>(null);
  const [progVal, setProgVal] = useState(15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addGoal(title, category, targetReduction);
    setSuccessMsg(`Committed to: "${title}"!`);
    setTitle("");
    setTargetReduction(40);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleUpdateProgressSubmit = async (e: React.FormEvent, goalId: string) => {
    e.preventDefault();
    await updateGoalProgress(goalId, progVal);
    setLogProgressId(null);
    setProgVal(15);
  };

  const presetGoals = [
    { title: "Avoid Car commutes 3x weekly", category: "transportation", target: 35 },
    { title: "Reduce electricity bills by 10%", category: "electricity", target: 50 },
    { title: "Maintain fully Vegan meal pattern on weekends", category: "food", target: 20 },
    { title: "Buy 100% recycled clothing articles", category: "shopping", target: 15 }
  ];

  // Dynamic achievement eligibility check based on historical performance or metrics
  const totalEmissionsLogged = activities.reduce((a,c) => a+c.emissionsKg, 0);
  const earnedBadges = [
    { name: "Net Zero Novice", desc: "Successfully logged your initial carbon activity entries.", unlocked: activities.length > 0 },
    { name: "First Commitment Active", desc: "Set up closer carbon goal targets.", unlocked: goals.length > 0 },
    { name: "Carbon Decoupler Gold", desc: "Averted accumulated greenhouse values exceeding 100 kg CO2.", unlocked: totalEmissionsLogged > 100 },
    { name: "Pioneer Diet Medal", desc: "Set up specialized plant-focused offset targets.", unlocked: goals.some(g => g.category === 'food') },
    { name: "Climate Master Badge", desc: "Achieved an overall carbon score of 80+.", unlocked: (user?.carbonScore || 75) >= 80 }
  ];

  return (
    <div id="goals_view_root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
      
      {/* LEFT MODULE: Active goals progress tracking (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <h3 className="text-md font-bold uppercase tracking-wider text-slate-400">Goals Under Management</h3>
          {successMsg && (
            <span id="goal_toast" className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md">
              {successMsg}
            </span>
          )}
        </div>

        {/* ACTIVE GOALS GRID GRID */}
        <div id="active_goals_grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const completedPercent = Math.min(100, Math.floor((goal.currentProgress / goal.targetReduction) * 100));
            const isCompleted = goal.isCompleted;
            return (
              <div 
                key={goal.id} 
                className={`p-5 rounded-2.5xl bg-white/5 border transition backdrop-blur-xl relative flex flex-col justify-between ${
                  isCompleted 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-white/10 hover:border-emerald-500/30'
                }`}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest font-extrabold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25">
                    Achieved Goal
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Target className={`w-4.5 h-4.5 mt-0.5 shrink-0 ${isCompleted ? 'text-emerald-400' : 'text-slate-450'}`} />
                    <h4 className="text-sm font-bold text-white leading-tight">{goal.title}</h4>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Target Reduction:</span>
                      <span className="text-emerald-400 font-bold">{goal.currentProgress} / {goal.targetReduction} kg CO₂</span>
                    </div>
                    {/* Linear neon bar marker */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-300"
                        style={{ width: `${completedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Progress recording buttons */}
                <div className="border-t border-white/5 mt-4 pt-3 flex items-center justify-between text-xs">
                  {logProgressId === goal.id ? (
                    <form onSubmit={(e) => handleUpdateProgressSubmit(e, goal.id)} className="flex items-center gap-2 w-full animate-fade-in">
                      <input
                        type="number"
                        min="1"
                        required
                        value={progVal}
                        onChange={(e) => setProgVal(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white/5 border border-white/5 rounded text-white font-bold"
                      />
                      <button type="submit" className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-[#10b981]/30 transition text-[10px] font-bold">
                        Confirm
                      </button>
                      <button type="button" onClick={() => setLogProgressId(null)} className="text-slate-500 hover:text-white text-[10px]">
                        X
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        onClick={() => setLogProgressId(goal.id)}
                        disabled={isCompleted}
                        className="text-emerald-400 hover:text-emerald-300 font-bold transition disabled:opacity-30 cursor-pointer"
                      >
                        Adjust Progress
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-slate-500 hover:text-red-400 font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="col-span-2 p-10 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <Target className="w-10 h-10 text-slate-600 animate-pulse" />
              <p className="text-xs text-slate-400">No committed goals under tracking. Initialize new goals using the constructor tool on the right!</p>
            </div>
          )}
        </div>

        {/* RECENT EARNED ACHIEVEMENTS DIAL */}
        <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2.5xl space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Medals & badges grid</h4>
          </div>
          <div id="badges_board_grid" className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {earnedBadges.map((badge, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                  badge.unlocked 
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                    : 'bg-white/5 border-white/10 text-slate-550'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 shrink-0" />
                    {badge.unlocked && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                  </div>
                  <h5 className="text-xs font-bold text-white">{badge.name}</h5>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Add new goals & pre-filled presets (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Create new Goal custom constructor */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5.5 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400 font-bold" />
            <h4 className="text-sm font-bold text-white tracking-tight">Create green goal</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Goal Title</label>
              <input
                id="goal_title_input"
                type="text"
                required
                placeholder="e.g. Switch to vegetarian logs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-emerald-500/30 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Carbon category</label>
              <select
                id="goal_cat_select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
              >
                <option value="transportation" className="bg-[#050816]">Transportation Drive</option>
                <option value="electricity" className="bg-[#050816]">Electricity Grid</option>
                <option value="food" className="bg-[#050816]">Diet Food</option>
                <option value="shopping" className="bg-[#050816]">Shopping purchases</option>
                <option value="waste" className="bg-[#050816]">Waste Scrap</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target reduction (kg CO₂)</label>
              <input
                id="goal_target_input"
                type="number"
                min="5"
                required
                value={targetReduction}
                onChange={(e) => setTargetReduction(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500"
              />
            </div>

            <button
              id="submit_goal_btn"
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 cursor-pointer transition flex items-center justify-center gap-1"
            >
              <span>Adopt Commitment</span>
              <Target className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        </div>

        {/* Quick Goal Presets Board */}
        <div className="bg-slate-950 border border-white/5 rounded-3xl p-5.5 space-y-4 select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-cyan-300" />
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Goal Presets Catalog</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Select one of these pre-filled climate commitments to automatically include it in your target checklists.
          </p>

          <div className="space-y-2">
            {presetGoals.map((pres, idx) => (
              <button
                id={`preset_goal_add_${idx}`}
                key={idx}
                type="button"
                onClick={() => {
                  addGoal(pres.title, pres.category as any, pres.target);
                  setSuccessMsg(`Preset: "${pres.title}" adopted!`);
                  setTimeout(() => setSuccessMsg(""), 2000);
                }}
                className="w-full text-left p-3 text-[11px] hover:bg-white/5 border border-white/5 rounded-xl transition flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h5 className="font-semibold text-white truncate max-w-[170px]">{pres.title}</h5>
                  <span className="text-[9px] text-slate-500 capitalize">{pres.category} • Target {pres.target}kg</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
