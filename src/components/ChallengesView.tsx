import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, Users, Award, Star, Flame, Zap, CheckCircle2, ArrowRight, HelpCircle, User 
} from 'lucide-react';

export const ChallengesView: React.FC = () => {
  const { user, updateUserScore } = useApp();
  const [successMsg, setSuccessMsg] = useState("");
  
  // Track joined status of challenges
  const [joinedChallenges, setJoinedChallenges] = useState<Record<string, boolean>>({
    'no-car-week': true,
    'eco-cooking': false,
    'zero-plastic': false
  });

  const handleJoinChallenge = (id: string, name: string) => {
    setJoinedChallenges(prev => ({ ...prev, [id]: true }));
    setSuccessMsg(`Joined Campaign: "${name}"!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleCompleteChallenge = async (id: string, pointsValue: number, name: string) => {
    setJoinedChallenges(prev => ({ ...prev, [id]: false }));
    await updateUserScore(pointsValue);
    setSuccessMsg(`Congratulations! Completed campaign: "${name}". Earned +${pointsValue} XP!`);
    setTimeout(() => setSuccessMsg(""), 2400);
  };

  const communityChallenges = [
    {
      id: "no-car-week",
      title: "No Car Commute Week",
      desc: "Avoid using self-driven gasoline cars for travel. Rely purely on bicycles or mass bus systems for commute travel this week.",
      participants: 1240,
      points: 150,
      category: "transportation",
      duration: "5 days remaining"
    },
    {
      id: "eco-cooking",
      title: "Zero Waste Cooking Sprint",
      desc: "Produce gourmet meals relying purely on plant ingredients and absolute recycling of all packaging scrap containers.",
      participants: 580,
      points: 120,
      category: "food",
      duration: "7 days remaining"
    },
    {
      id: "zero-plastic",
      title: "Conscious Retail Stop-gap",
      desc: "Strictly avoid acquiring new plastic containers, packaging wrap, electronic items, or heavy clothing fabric items for 3 consecutive days.",
      participants: 940,
      points: 100,
      category: "shopping",
      duration: "2 days remaining"
    }
  ];

  const simulatedLeaderboard = [
    { rank: 1, name: "Aarav Sharma", score: 940, activeBonus: true },
    { rank: 2, name: "Siddharth Patil", score: 870, activeBonus: true },
    { rank: 3, name: "Emily Clarkson", score: 810, activeBonus: false },
    { rank: 4, name: "Prashant (You)", score: user?.carbonScore || 750, activeBonus: false, highlight: true },
    { rank: 5, name: "Sneha Nair", score: 710, activeBonus: true },
    { rank: 6, name: "Michael Vance", score: 680, activeBonus: false },
    { rank: 7, name: "Divya Kapoor", score: 650, activeBonus: false }
  ];

  return (
    <div id="challenges_view_root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
      
      {/* LEFT COLUMN: Active campaign modules (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <h3 className="text-md font-bold uppercase tracking-wider text-slate-400">Weekly Green Campaigns</h3>
          {successMsg && (
            <span id="challenge_success_toast" className="text-xs text-emerald-400 font-bold bg-[#10b981]/15 border border-[#10b981]/25 px-2.5 py-1.5 rounded-lg max-w-[400px] truncate leading-tight block">
              {successMsg}
            </span>
          )}
        </div>

        <div id="campaigns_list_area" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityChallenges.map((ch) => {
            const hasJoined = joinedChallenges[ch.id];
            return (
              <div 
                key={ch.id} 
                className={`p-6 rounded-3xl bg-white/5 border transition backdrop-blur-xl flex flex-col justify-between ${
                  hasJoined 
                    ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'border-white/10 hover:border-emerald-500/30'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-extrabold text-cyan-300 bg-cyan-500/10 rounded-md border border-cyan-500/15">
                      {ch.duration}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/15">
                      <Zap className="w-3.5 h-3.5" />
                      <span>+{ch.points} XP</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">{ch.title}</h4>
                    <p className="text-xs text-slate-400 leading-normal mt-1.5">{ch.desc}</p>
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{ch.participants} participants active</span>
                  </div>
                </div>

                <div className="border-t border-white/5 mt-6 pt-4 flex items-center justify-between text-xs">
                  {hasJoined ? (
                    <>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enlisted</span>
                      </span>
                      <button
                        id={`complete_chall_${ch.id}`}
                        onClick={() => handleCompleteChallenge(ch.id, ch.points, ch.title)}
                        className="px-4 py-2 rounded-xl text-[11px] font-bold text-slate-950 bg-[#10b981] hover:bg-emerald-300 transition cursor-pointer"
                      >
                        Claim Impact Medals
                      </button>
                    </>
                  ) : (
                    <button
                      id={`join_chall_${ch.id}`}
                      onClick={() => handleJoinChallenge(ch.id, ch.title)}
                      className="px-4 py-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer w-full"
                    >
                      <span>Join Campaign</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Box */}
        <div className="p-5 rounded-2.5xl bg-white/5 border border-white/10 backdrop-blur-xl flex gap-4">
          <Flame className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Campaign Leagues 2026</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every completed campaign increments your central carbon score, helping you jump leaderboard tiers and earn priority certificate levels. Recompute often to match offsets.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Regional Leaderboard Board (4 cols) */}
      <div className="lg:col-span-4 bg-white/5 border border-white/10 backdrop-blur-xl p-5.5 rounded-3xl overflow-hidden relative font-sans">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl pointer-events-none rounded-full" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <Award className="w-5 h-5 text-yellow-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Regional Leaderboard</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            League rankings of carbon abaters calculated from total monthly XP points harvested.
          </p>

          <div id="leaderboard_table" className="space-y-2 pt-2 text-xs">
            {simulatedLeaderboard.map((row) => (
              <div 
                key={row.rank} 
                className={`p-3 rounded-xl border transition flex items-center justify-between mx-0.5 ${
                  row.highlight 
                    ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/5 border-emerald-500/35 text-emerald-400 font-bold' 
                    : 'bg-white/5 border-white/10 text-slate-405'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-extrabold text-[10px] ${
                    row.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : row.rank === 2 ? 'bg-slate-300/20 text-slate-300' : 'text-slate-500'
                  }`}>
                    {row.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-white font-bold uppercase border border-white/5">
                      {row.name.substring(0, 2)}
                    </div>
                    <span className="truncate pr-2 max-w-[100px]">{row.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-white shrink-0">
                  <span>{row.score} XP</span>
                  {row.activeBonus && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
