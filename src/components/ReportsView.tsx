import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, Download, Printer, Share2, Clipboard, ShieldCheck, Sparkles, AlertCircle, Check 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { user, activities, goals } = useApp();
  
  // Compiler state
  const [reportScope, setReportScope] = useState("Personal Lifestyle ESG Audit");
  const [period, setPeriod] = useState("June 2026 Sandbox");
  const [customRemarks, setCustomRemarks] = useState("Strictly maintained mass transit cycles, adopted vegetarian diets, and participated in community challenges.");
  const [isCompiled, setIsCompiled] = useState(true);
  const [copied, setCopied] = useState(false);

  // Compute stats
  const totalEmissionsKg = activities.reduce((acc, curr) => acc + curr.emissionsKg, 0);
  const totalGoalsBuilt = goals.length;
  const totalGoalsMet = goals.filter(g => g.isCompleted).length;

  const handleCompile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompiled(true);
  };

  const handleShare = () => {
    const mockupShareLink = `https://ecotrack.ai/share/eta-${(user?.displayName || 'warrior').toLowerCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    navigator.clipboard.writeText(mockupShareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports_view_root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
      
      {/* LEFT COLUMN: Report constructor compiler (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5.5 space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">ESG Audit Compiler</h4>
          </div>
          <p className="text-[10px] text-slate-550 leading-normal">
            Customize report scope parameters to automatically render an official-grade printable green credential.
          </p>

          <form onSubmit={handleCompile} className="space-y-4 pt-1.5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Report Scope</label>
              <input
                id="report_scope_input"
                type="text"
                required
                value={reportScope}
                onChange={(e) => setReportScope(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-emerald-500/30 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reporting Period</label>
              <input
                id="report_period_input"
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-emerald-500/30 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Auditor Custom Notes</label>
              <textarea
                id="report_remarks_textarea"
                rows={3}
                value={customRemarks}
                onChange={(e) => setCustomRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 focus:border-emerald-500/30 rounded-xl text-xs text-white resize-none"
                placeholder="Insert remarks..."
              />
            </div>

            <button
              id="submit_compile_btn"
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Compile Audit Report</span>
            </button>
          </form>
        </div>

        {/* Rapid summary guidelines */}
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>Audit Credibility</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            All audits are signed off under EcoTrack AI cryptographic hash guidelines, complying with the GHG scope protocols. Perfect for personal portfolios or community submissions.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Official ESG printable certificate render (7 cols) */}
      <div className="lg:col-span-7">
        {isCompiled ? (
          <div className="space-y-4">
            
            {/* Audit Certificate Box styled beautifully */}
            <div 
              id="esg_printable_cert"
              className="p-8 rounded-3xl bg-white/5 border border-yellow-500/30 backdrop-blur-3xl relative overflow-hidden text-center text-xs space-y-6 flex flex-col justify-between print:bg-white print:text-slate-950 print:border hover:border-yellow-500/50 transition shadow-[0_0_25px_rgba(234,179,8,0.1)]"
            >
              {/* Certificate watermark style elements */}
              <div className="absolute top-[30%] left-[25%] right-[25%] opacity-5 pointer-events-none">
                <ShieldCheck className="w-48 h-48 mx-auto text-yellow-400" />
              </div>

              {/* Gold borders */}
              <div className="absolute inset-4 rounded-2xl border border-yellow-500/10 pointer-events-none" />

              <div className="space-y-1 relative z-10">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-yellow-400">Green Protocol Certificate</span>
                <h3 className="text-xl font-extrabold tracking-tight text-white print:text-slate-950 uppercase">Environmental ESG Audit</h3>
                <span className="text-[9px] text-slate-505 block font-mono">ID: ETAI-X90A-94B</span>
              </div>

              <div className="space-y-4 font-mono text-[11px] leading-relaxed relative z-10 text-slate-300 print:text-slate-900 border-y border-white/5 py-6">
                <p>This document certifies that <strong className="text-white print:text-slate-950 text-sm font-sans">{user?.displayName || 'Prashant'}</strong></p>
                <p>residing in regional zone: <strong className="text-emerald-400 font-bold">{user?.country || 'India'}</strong></p>
                <p>has compiled a carbon lifestyle offset footprint evaluating at: </p>
                
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed border-white/5 max-w-sm mx-auto my-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans">Accumulated output</span>
                    <p className="text-lg font-bold text-white print:text-slate-950">{totalEmissionsKg} kg CO₂</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans">Active commitments</span>
                    <p className="text-lg font-bold text-white print:text-slate-950">{totalGoalsMet} / {totalGoalsBuilt}</p>
                  </div>
                </div>

                <p className="text-[11px] italic leading-normal max-w-md mx-auto text-slate-450">
                  "Audited scope evaluates: {reportScope}. Remarks: {customRemarks}"
                </p>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div className="text-left font-mono text-[9px] text-slate-500">
                  <p>Auditor: ECOTRACK AI</p>
                  <p>Period: {period}</p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 rounded-full border border-yellow-500/25 flex items-center justify-center text-yellow-400/80 font-bold text-[9px] bg-yellow-500/5 rotate-12">
                    SEALED
                  </div>
                </div>
              </div>
            </div>

            {/* Print, share link downloader buttons */}
            <div className="flex gap-3 justify-end pt-1">
              <button
                id="print_cert_btn"
                onClick={handlePrint}
                className="px-4.5 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print ESG Audit</span>
              </button>
              <button
                id="share_cert_btn"
                onClick={handleShare}
                className="px-5 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.15)]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-950 font-bold" />
                    <span>Copy Shareable Cert Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-500 animate-pulse" />
            <p className="text-xs text-slate-450">Please populate and compile parameters on the left to review your printable ESG certificate.</p>
          </div>
        )}
      </div>
    </div>
  );
};
