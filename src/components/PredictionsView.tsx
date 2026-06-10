import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { 
  TrendingUp, Sparkles, HelpCircle, Flame, Check, ShieldAlert, ArrowRight 
} from 'lucide-react';

export const PredictionsView: React.FC = () => {
  const { activities, user } = useApp();
  
  // States
  const [forecastHorizon, setForecastHorizon] = useState<'30' | '90' | '365'>('30');
  const [hypotheticalDailySaving, setHypotheticalDailySaving] = useState<number>(3); // averted kg per day
  const [successToggle, setSuccessToggle] = useState(false);

  // Math variables
  const numDays = parseInt(forecastHorizon);
  const totalLogged = activities.reduce((a,c) => a+c.emissionsKg, 0);
  const dailyAverageDb = activities.length > 0 ? (totalLogged / activities.length) : 10;
  // Clamp daily averages to real metrics or default safe
  const dailyAverage = Math.max(3.5, Math.min(25, dailyAverageDb));

  // Build forecast array list
  const forecastData: Array<{ day: string; TypicalTrend: number; DiminishedTrend: number }> = [];
  
  for (let i = 1; i <= numDays; i++) {
    // Generate interval markers
    if (numDays === 30 && i % 3 === 0) {
      const typical = parseFloat((i * dailyAverage).toFixed(1));
      const diminished = parseFloat((i * Math.max(1, dailyAverage - hypotheticalDailySaving)).toFixed(1));
      forecastData.push({ day: `Day ${i}`, TypicalTrend: typical, DiminishedTrend: diminished });
    } else if (numDays === 90 && i % 10 === 0) {
      const typical = parseFloat((i * dailyAverage).toFixed(1));
      const diminished = parseFloat((i * Math.max(1, dailyAverage - hypotheticalDailySaving)).toFixed(1));
      forecastData.push({ day: `Day ${i}`, TypicalTrend: typical, DiminishedTrend: diminished });
    } else if (numDays === 365 && i % 30 === 0) {
      const typical = parseFloat((i * dailyAverage).toFixed(1));
      const diminished = parseFloat((i * Math.max(1, dailyAverage - hypotheticalDailySaving)).toFixed(1));
      forecastData.push({ day: `Month ${i / 30}`, TypicalTrend: typical, DiminishedTrend: diminished });
    }
  }

  // Calculate environmental equivalents
  const carbonAvertedKg = parseFloat((numDays * hypotheticalDailySaving).toFixed(1));
  const treesEquivalent = Math.floor(carbonAvertedKg / 21.8); // 1 tree offsets ~21.8kg co2 per year

  return (
    <div id="predictions_view_root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
      
      {/* LEFT COLUMN: Forecast line graphs visualizers (8 cols) */}
      <div className="lg:col-span-8 bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
        {/* Glow and decorations */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 blur-2xl pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Carbon Trajectory Forecasts</h3>
          </div>

          <div id="horizon_tab_selectors" className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-center">
            {[
              { id: '30', label: '30 Days' },
              { id: '90', label: '90 Days' },
              { id: '365', label: '1 Year' }
            ].map((hz) => (
              <button
                id={`horizon_tab_${hz.id}`}
                key={hz.id}
                onClick={() => setForecastHorizon(hz.id as any)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  forecastHorizon === hz.id
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'text-slate-450 hover:text-white'
                }`}
              >
                {hz.label}
              </button>
            ))}
          </div>
        </div>

        {/* LINE COMPARISON CHART */}
        <div id="forecast_chart_container" className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} label={{ value: 'Accumulated CO2 (kg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} iconSize={12} fontSize={10} wrapperStyle={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }} />
              <Line 
                name="Business-As-Usual (BAU) Trend" 
                type="monotone" 
                dataKey="TypicalTrend" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line 
                name="Optimized Reduced Trend" 
                type="monotone" 
                dataKey="DiminishedTrend" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 1.5, stroke: '#050816' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Informative educational foot */}
        <div className="border-t border-white/5 pt-4.5 mt-6 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <span>Formula: Orthographic Linear Extrapolation</span>
          <span>Stewardship Tier: Elite</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive variables adjustments (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Adjust reduction range widget */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5.5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">Interactive Modeling</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Input a hypothetical daily saving factor (e.g. carpooling or energy auditing) to compute future offset metrics.
          </p>

          <div className="space-y-4 pt-1.5">
            <div className="space-y-1 select-none text-left">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                <span>Hypothetical daily saving</span>
                <span className="text-emerald-400">{hypotheticalDailySaving} kg CO₂ / day</span>
              </div>
              <input
                id="hypo_saving_range"
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={hypotheticalDailySaving}
                onChange={(e) => setHypotheticalDailySaving(parseFloat(e.target.value) || 0.5)}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs backdrop-blur-md">
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Forecast Horizon:</span>
                <span className="text-white font-bold">{forecastHorizon} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Accumulated saving:</span>
                <span className="text-emerald-400 font-bold">{carbonAvertedKg} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Trees saved equivalent:</span>
                <span className="text-cyan-300 font-bold">{treesEquivalent} mature trees</span>
              </div>
            </div>

            <button
              id="model_commit_btn"
              onClick={() => {
                setSuccessToggle(true);
                setTimeout(() => setSuccessToggle(false), 2000);
              }}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {successToggle ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Hypothesis locked!</span>
                </>
              ) : (
                <span>Lock modeling hypothesis</span>
              )}
            </button>
          </div>
        </div>

        {/* Environmental forecast diagnostic alert box */}
        <div className="p-5 rounded-3xl bg-[#0a1128] border border-cyan-500/10 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-300 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Stewardship Diagnostics</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            By avoiding a standard passenger gasoline car commute of 40km, you mitigate ~8.8kg of CO₂ emissions. Sustaining this over 1 year is the atmospheric equivalent of planting 150 mature trees!
          </p>
        </div>
      </div>
    </div>
  );
};
