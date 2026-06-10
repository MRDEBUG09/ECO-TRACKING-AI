import React from 'react';
import { motion } from 'motion/react';
import { EarthCanvas } from './EarthCanvas';
import { 
  ArrowRight, Play, CheckCircle, Flame, Star, Award, Leaf, Zap, Globe2, ShieldCheck, HeartPulse
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const stats = [
    { value: "482K Tons", label: "Carbon Saved", icon: Leaf },
    { value: "72,400+", label: "Active Users", icon: Flame },
    { value: "3.2M", label: "Trees Equivalent", icon: Zap },
    { value: "94.2%", label: "Goals Succeeded", icon: Award },
  ];

  const features = [
    {
      title: "AI Carbon Coach",
      desc: "Instant conversational guidance powered by Gemini, giving you tailored recommendations based on actual history logs.",
      icon: HeartPulse,
      tag: "Gemini 3.5",
      span: "md:col-span-2"
    },
    {
      title: "Emission Tracking",
      desc: "Record transportation, energy, diets, purchasing receipts, and compost variables.",
      icon: Zap,
      tag: "Universal",
      span: "md:col-span-1"
    },
    {
      title: "Interactive Analytics",
      desc: "Monitor distributions and trace monthly progress trends over neat Recharts curves.",
      icon: Globe2,
      tag: "Visual",
      span: "md:col-span-1"
    },
    {
      title: "Sustainability Goals",
      desc: "Lock milestone goals, measure accomplishments, and earn carbon-saving achievement cards.",
      icon: Star,
      tag: "Milestones",
      span: "md:col-span-2"
    },
    {
      title: "Carbon Prediction",
      desc: "Apply predictive machine intelligence to forecast your trajectory over 30d, 90d, and one year.",
      icon: ShieldCheck,
      tag: "Forecast",
      span: "md:col-span-1"
    },
    {
      title: "Community Challenges",
      desc: "Participate in local sustainability challenges to climb regional scoreboard tiers.",
      icon: Flame,
      tag: "League",
      span: "md:col-span-2"
    }
  ];

  const steps = [
    { index: "01", title: "Track", desc: "Instantly log utility bills, car mileage, and dietary choices in under 15 seconds." },
    { index: "02", title: "Analyze", desc: "Discover which habits drive highest carbon overhead through custom visual charts." },
    { index: "03", title: "Improve", desc: "Engage in community trials, check tips, and claim medals as you transition to Net Zero." }
  ];

  const testimonials = [
    { name: "Alisha Sharma", role: "Sustainability Officer", quote: "EcoTrack completely changed how our group approaches green habits. The AI Carbon Coach operates exactly like a real ESG expert, serving personalized daily checklists!" },
    { name: "Sanjay Mehta", role: "Climate Blogger", quote: "The Carbon Prediction forecasting graph is mindblowing. Seeing exactly how many trees my biking habit saved over 30 days kept me motivated!" },
    { name: "Jessica Rogers", role: "Product Lead", quote: "Gorgeously fast, beautiful liquid glass interface, and outstandingly robust. Standard and custom goals sync instantly with my real habits." }
  ];

  return (
    <div id="landing_root" className="min-h-screen bg-[#050816] text-white overflow-hidden relative font-sans">
      
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            EcoTrack AI
          </span>
        </div>
        <button 
          id="hero_start_btn_top"
          onClick={onStart}
          className="px-5 py-2 rounded-xl text-sm font-medium border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200"
        >
          Access Dashboard
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Content */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5"
          >
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">Eco-Persuasion Engine Powered By Gemini AI</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
          >
            Track Your Carbon Footprint With <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">AI Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Understand your impact on the planet in real-time, launch community habits, and receive personalized recommendations powered by Gemini.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              id="hero_start_btn"
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-md font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 cursor-pointer shadow-[0_0_30px_rgba(52,211,153,0.3)] transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
            <button
              id="hero_demo_btn"
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-md font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Watch Demo</span>
            </button>
          </motion.div>
        </div>

        {/* Right Side Slow rotating custom Earth EarthCanvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="lg:col-span-5 relative flex justify-center items-center"
        >
          <div className="w-full max-w-[420px] lg:max-w-none aspect-square relative flex items-center justify-center">
            <EarthCanvas />
          </div>
        </motion.div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="border-y border-white/5 bg-white/[0.01] relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center space-y-1.5 border-r last:border-0 border-white/5">
                <div className="flex justify-center mb-1">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES SECTION AS BENTO GRID */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-widest">Enterprise SaaS Scope</span>
          <h2 className="text-3xl sm:text-4.5xl font-bold tracking-tight">Our Platform Highlights</h2>
          <p className="text-slate-400 text-sm sm:text-md">
            Engineered with deep personalization metrics to streamline your personal carbon offset journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className={`${feat.span} bg-white/[0.03] border border-white/5 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all duration-300`}
              >
                {/* Glow Overlay */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-400/10 transition" />
                
                <div className="flex items-start justify-between relative z-10 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="px-3 py-1 text-[10px] font-semibold text-cyan-300 uppercase bg-cyan-500/10 rounded-full border border-cyan-500/20">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white relative z-10 mb-2">{feat.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 relative z-10 group-hover:text-slate-300 transition">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-widest">Simple Roadmap</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Three Steps to Impact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
          {stagesLines()}
          {steps.map((st, i) => (
            <div key={i} className="space-y-4 relative z-10 bg-slate-950/40 p-6 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto text-sm font-bold shadow-lg">
                {st.index}
              </div>
              <h3 className="text-lg font-bold text-white">{st.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SLIDER */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-widest font-mono">Testimonials</span>
          <h2 className="text-3xl font-bold tracking-tight">Loved by Global Citizens</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-7 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative">
              <div className="flex gap-1 text-emerald-400 mb-4">
                <Star className="w-4 h-4 fill-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400" />
                <Star className="w-4 h-4 fill-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{t.name}</h4>
                <span className="text-xs text-slate-500">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 relative z-10 mt-12 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-medium">EcoTrack AI</span>
          </div>
          <div>
            <p>© {new Date().getFullYear()} EcoTrack AI Inc. All rights reserved. • Empowering Carbon Offset Transparency.</p>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white transition cursor-pointer">Security Protocol</span>
            <span className="hover:text-white transition cursor-pointer">Firestore Rules Policy</span>
            <span className="hover:text-white transition cursor-pointer">ESG Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// SVG decorative connector line helper
function stagesLines() {
  return (
    <div className="absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 hidden md:block z-0 pointer-events-none" />
  );
}
