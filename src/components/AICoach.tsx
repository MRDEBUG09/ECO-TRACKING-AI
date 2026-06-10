import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Send, RefreshCw, User, HelpCircle, ArrowRight, Zap, Target, BookOpen 
} from 'lucide-react';

export const AICoach: React.FC = () => {
  const { 
    chatHistory, sendCoachMessage, isSendingCoachMessage, activities, user 
  } = useApp();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to lowest point of conversation bubble
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || input;
    if (!query.trim() || isSendingCoachMessage) return;

    setInput("");
    await sendCoachMessage(query);
  };

  const recommendedTags = [
    "What is my highest emission driver?",
    "Set up a 3-step offset roadmap",
    "How can I optimize energy consumption?",
    "Why is a Vegan meal better for the environment?"
  ];

  return (
    <div id="ai_coach_container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] animate-fade-in text-left">
      
      {/* LEFT CHAT MODULE (8 cols) */}
      <div className="lg:col-span-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl flex flex-col justify-between overflow-hidden relative">
        {/* Glow corner behind coach */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 blur-2xl pointer-events-none rounded-full" />
        
        {/* Header display details */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Gemini AI Carbon Specialist</h3>
              <p className="text-[10px] text-slate-400">Synchronized context: <span className="text-emerald-400">{activities.length} activity metrics logged</span></p>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
            Realtime Sandbox Engine
          </span>
        </div>

        {/* MESSAGES BODY LIST */}
        <div id="chat_scroll_body" className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {/* Welcome Message Bubble */}
          <div className="flex gap-3.5 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 font-bold">
              AI
            </div>
            <div className="p-4 bg-slate-900 border border-emerald-500/15 rounded-2xl">
              <p className="text-xs text-slate-350 leading-relaxed">
                Hello <strong>{user?.displayName || 'Eco Warrior'}</strong>! I am your AI climate mentor. 
                I have access to your personal utilities footprint profile.
                {activities.length > 0 ? (
                  <span> I notice you have registered some active variables. Ask me any tailored questions, or select one of our pre-filled quick tags on the right!</span>
                ) : (
                  <span> Please log your daily activities inside the 'Track Activities' portal so I can assist you with your personalized carbon offset roadmap!</span>
                )}
              </p>
            </div>
          </div>

          {chatHistory.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={i} 
                className={`flex gap-3.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Profile Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold border ${
                  isUser 
                    ? 'bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 border-cyan-400' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {isUser ? <User className="w-4 h-4 text-slate-950" /> : 'AI'}
                </div>

                {/* Message Bubble box */}
                <div className={`p-4 rounded-2xl border ${
                  isUser 
                    ? 'bg-[#10b981]/10 border-emerald-500/20' 
                    : 'bg-slate-900 border-white/5'
                }`}>
                  <p id={`chat_bubble_${i}`} className="text-xs text-slate-305 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <span className="text-[9px] text-slate-500 block mt-2 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Prompt Loading Indicator */}
          {isSendingCoachMessage && (
            <div className="flex gap-3.5 max-w-[80%] animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                AI
              </div>
              <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-xs text-slate-400 font-medium">Recomputing patterns via Gemini API...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM CONTAINER */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-slate-950 flex gap-3.5">
          <input
            id="chat_input_text"
            type="text"
            disabled={isSendingCoachMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your climate offset query here... (e.g. 'Offset transport logs')"
            className="flex-1 px-4.5 py-3.5 bg-white/5 border border-white/5 focus:border-emerald-500/20 text-white placeholder-slate-500 rounded-xl focus:outline-none text-xs text-medium"
          />
          <button
            id="chat_submit_btn"
            type="submit"
            disabled={!input.trim() || isSendingCoachMessage}
            className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 cursor-pointer text-slate-950 font-bold transition flex items-center justify-center disabled:opacity-50 shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
          >
            <Send className="w-4.5 h-4.5 text-slate-950" />
          </button>
        </form>
      </div>

      {/* RIGHT SIDE SUGGESTIONS / EXPLANATORY TIPS (4 cols) */}
      <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
        
        {/* Recommended tags bento layout */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5.5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-300" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Prompt Tags</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Click any prompt tag below to automatically consult our AI coach using your context variables.
          </p>

          <div className="space-y-2 pt-1.5">
            {recommendedTags.map((tagText, i) => (
              <button
                id={`prom_tag_btn_${i}`}
                key={i}
                type="button"
                onClick={() => handleSend(undefined, tagText)}
                disabled={isSendingCoachMessage}
                className="w-full text-left p-3 text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 rounded-xl transition cursor-pointer flex items-center justify-between"
              >
                <span>{tagText}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Environmental target status info panel */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Climate sync data</h4>
          </div>
          <div className="space-y-2 text-xs leading-normal text-slate-400">
            <p><strong>Preference:</strong> {user?.lifestylePreference || 'Mixed'}</p>
            <p><strong>Carbon Points balance:</strong> {user?.carbonScore || 75} points</p>
            <p><strong>Total logs:</strong> {activities.length} entries registered</p>
          </div>
        </div>
      </div>
    </div>
  );
};
