import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, UtilityPole, Utensils, ShoppingBag, Trash2, Check, Sparkles, HelpCircle 
} from 'lucide-react';

export const ActivityTracking: React.FC = () => {
  const { logActivity, activities, user } = useApp();
  const [activeCategory, setActiveCategory] = useState<'transportation' | 'electricity' | 'food' | 'shopping' | 'waste'>('transportation');
  const [successMsg, setSuccessMsg] = useState("");

  // Sub-forms states
  // Transportation
  const [transportType, setTransportType] = useState<'car' | 'bike' | 'train' | 'bus' | 'flight'>('car');
  const [distanceKm, setDistanceKm] = useState(25);
  const [fuelType, setFuelType] = useState<'gasoline' | 'diesel' | 'hybrid' | 'electric'>('gasoline');

  // Electricity
  const [kwh, setKwh] = useState(15);

  // Diet food
  const [dietType, setDietType] = useState<'Vegan' | 'Vegetarian' | 'Mixed' | 'Non-Veg'>('Mixed');
  const [mealsCount, setMealsCount] = useState(3);

  // Shopping buy
  const [electronicsCount, setElectronicsCount] = useState(0);
  const [fashionCount, setFashionCount] = useState(0);
  const [miscItemsCount, setMiscItemsCount] = useState(0);

  // Waste scrap
  const [wasteWeightKg, setWasteWeightKg] = useState(5);
  const [recyclePercent, setRecyclePercent] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedEmissions = 0;
    const detailsObj: any = {};

    switch (activeCategory) {
      case 'transportation':
        // Standard global emission metrics: kg CO2 per km
        if (transportType === 'car') {
          const multiplier = fuelType === 'gasoline' ? 0.22 : fuelType === 'diesel' ? 0.19 : fuelType === 'hybrid' ? 0.11 : 0.04;
          calculatedEmissions = distanceKm * multiplier;
        } else if (transportType === 'flight') {
          calculatedEmissions = distanceKm * 0.25; // high-altitude premium
        } else if (transportType === 'bus' || transportType === 'train') {
          calculatedEmissions = distanceKm * 0.05; // rapid transit index
        } else {
          calculatedEmissions = 0; // biking offset
        }
        detailsObj.transportType = transportType;
        detailsObj.distanceKm = distanceKm;
        if (transportType === 'car') detailsObj.fuelType = fuelType;
        break;

      case 'electricity':
        calculatedEmissions = kwh * 0.45; // average grid index 0.45kg per kwh
        detailsObj.kwh = kwh;
        break;

      case 'food':
        const dietMultiplier = dietType === 'Vegan' ? 0.4 : dietType === 'Vegetarian' ? 0.7 : dietType === 'Mixed' ? 1.2 : 2.5;
        calculatedEmissions = mealsCount * dietMultiplier;
        detailsObj.dietType = dietType;
        detailsObj.mealsCount = mealsCount;
        break;

      case 'shopping':
        calculatedEmissions = 
          (electronicsCount * 35) + 
          (fashionCount * 7.5) + 
          (miscItemsCount * 1.5);
        detailsObj.electronicsCount = electronicsCount;
        detailsObj.fashionCount = fashionCount;
        detailsObj.miscItemsCount = miscItemsCount;
        break;

      case 'waste':
        // landfilled waste has higher emissions. Recycling mitigates overall trash
        const recycleMitigation = (100 - recyclePercent) / 100;
        calculatedEmissions = wasteWeightKg * 0.9 * recycleMitigation;
        detailsObj.wasteWeightKg = wasteWeightKg;
        detailsObj.recyclePercent = recyclePercent;
        break;
    }

    // Format payload precision
    calculatedEmissions = parseFloat(calculatedEmissions.toFixed(1));

    await logActivity(activeCategory, calculatedEmissions, detailsObj);
    setSuccessMsg(`Logged ${calculatedEmissions} kg CO₂ successfully!`);
    
    // Reset secondary values
    if (activeCategory === 'shopping') {
      setElectronicsCount(0);
      setFashionCount(0);
      setMiscItemsCount(0);
    }

    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <div id="activity_tracking_root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* LEFT PANEL: Categories Bento Selectors */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-md font-bold uppercase tracking-wider text-slate-400">Activity Categories</h3>
        
        <div id="category_bento_nodes" className="grid grid-cols-2 gap-3.5">
          {[
            { id: 'transportation', label: 'Transportation', icon: Car, desc: 'Logged travels & commute styles', style: 'border-[#10b981]/20 hover:border-[#10b981]' },
            { id: 'electricity', label: 'Electricity Grid', icon: UtilityPole, desc: 'Real electricity values (kWh)', style: 'border-[#10b981]/20 hover:border-[#10b981]' },
            { id: 'food', label: 'Diet Consumptions', icon: Utensils, desc: 'Vegan vs Mixed meals breakdown', style: 'border-[#10b981]/20 hover:border-[#10b981]' },
            { id: 'shopping', label: 'Fashion & Tech', icon: ShoppingBag, desc: 'New electronics or apparel items', style: 'border-[#10b981]/20 hover:border-[#10b981]' },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                id={`cat_select_${cat.id}`}
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setSuccessMsg("");
                }}
                className={`text-left p-4 rounded-2xl border backdrop-blur-xl transition duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/5 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'}`} />
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <h4 className="text-sm font-semibold truncate">{cat.label}</h4>
                <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-0.5">{cat.desc}</p>
              </button>
            );
          })}

          {/* Large waste grid button spans full width bottom */}
          <button
            id="cat_select_waste"
            onClick={() => {
              setActiveCategory('waste');
              setSuccessMsg("");
            }}
            className={`col-span-2 text-left p-4 rounded-2xl border backdrop-blur-xl transition duration-200 cursor-pointer flex items-center justify-between ${
              activeCategory === 'waste'
                ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/5 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              <div>
                <h4 className="text-sm font-semibold">Trash & Organic Waste</h4>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">Recycling ratios and landfill footprint</p>
              </div>
            </div>
            {activeCategory === 'waste' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pr-0.5" />}
          </button>
        </div>

        {/* Dynamic environmental educational tip */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex gap-3">
          <Sparkles className="w-5 h-5 text-cyan-300 shrink-0" />
          <p className="text-[10px] text-slate-500 leading-relaxed">
            <strong>Did you know?</strong> An average passenger vehicle emits roughly 4.6 metric tons of CO₂ per year. Transitioning to hybrid gears can easily half this overhead.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Category Details Inputs Fields Form */}
      <div className="lg:col-span-7">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6.5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl pointer-events-none rounded-full" />
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4.5 mb-6">
            <h3 className="text-md font-bold text-white tracking-tight capitalize">
              {activeCategory} Details
            </h3>
            {successMsg && (
              <span id="tracker_success_toast" className="px-3 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TRANSPORT FIELDS */}
            {activeCategory === 'transportation' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Commute Mechanism</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['car', 'bike', 'train', 'bus', 'flight'] as const).map((type) => (
                      <button
                        id={`transport_${type}`}
                        key={type}
                        type="button"
                        onClick={() => setTransportType(type)}
                        className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition capitalize ${
                          transportType === type
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border-white/5 text-slate-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Travel Distance (km)</label>
                  <input
                    id="transport_km_input"
                    type="number"
                    min="1"
                    required
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/20 text-white"
                  />
                </div>

                {transportType === 'car' && (
                  <div className="space-y-1.5 animate-fade-in bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Engine Fuel Type</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['gasoline', 'diesel', 'hybrid', 'electric'] as const).map((fuel) => (
                        <button
                          id={`fuel_${fuel}`}
                          key={fuel}
                          type="button"
                          onClick={() => setFuelType(fuel)}
                          className={`py-1.5 text-[10px] font-bold rounded-lg border transition capitalize ${
                            fuelType === fuel
                              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                              : 'bg-white/5 border-white/5 text-slate-400'
                          }`}
                        >
                          {fuel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ELECTRICITY FIELDS */}
            {activeCategory === 'electricity' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Consumption (kWh)</label>
                  <input
                    id="electricity_kwh_input"
                    type="number"
                    min="1"
                    required
                    value={kwh}
                    onChange={(e) => setKwh(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/20 text-white"
                  />
                  <span className="text-[10px] text-slate-500 block leading-normal mt-1">Average households consume about 10-25 kWh of electric current daily. Check your utility invoice meter to get precise values.</span>
                </div>
              </div>
            )}

            {/* DIET FOOD FIELDS */}
            {activeCategory === 'food' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Meal Preference Type</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Vegan', 'Vegetarian', 'Mixed', 'Non-Veg'] as const).map((pref) => (
                      <button
                        id={`diet_${pref}`}
                        key={pref}
                        type="button"
                        onClick={() => setDietType(pref)}
                        className={`py-2 text-[10px] font-bold rounded-lg border transition ${
                          dietType === pref
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border-white/5 text-slate-400'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Meals logged / Consumption count</label>
                  <input
                    id="food_meals_input"
                    type="number"
                    min="1"
                    required
                    value={mealsCount}
                    onChange={(e) => setMealsCount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/20 text-white"
                  />
                </div>
              </div>
            )}

            {/* SHOPPING FIELDS */}
            {activeCategory === 'shopping' && (
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2">Items Acquired</h4>
                <div className="grid grid-cols-3 gap-3.5">
                  <div className="bg-white/5 border border-white/10 p-4.5 rounded-2xl flex flex-col items-center backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tech Electronics</span>
                    <input
                      id="item_electronics_input"
                      type="number"
                      min="0"
                      value={electronicsCount}
                      onChange={(e) => setElectronicsCount(parseInt(e.target.value) || 0)}
                      className="w-16 text-center mt-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-bold"
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4.5 rounded-2xl flex flex-col items-center backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fashion Apparel</span>
                    <input
                      id="item_fashion_input"
                      type="number"
                      min="0"
                      value={fashionCount}
                      onChange={(e) => setFashionCount(parseInt(e.target.value) || 0)}
                      className="w-16 text-center mt-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-bold"
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4.5 rounded-2xl flex flex-col items-center backdrop-blur-md">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Misc Items</span>
                    <input
                      id="item_misc_input"
                      type="number"
                      min="0"
                      value={miscItemsCount}
                      onChange={(e) => setMiscItemsCount(parseInt(e.target.value) || 0)}
                      className="w-16 text-center mt-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WASTE RECYCLABLE FIELDS */}
            {activeCategory === 'waste' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Waste Weight (kg)</label>
                  <input
                    id="waste_weight_input"
                    type="number"
                    min="1"
                    required
                    value={wasteWeightKg}
                    onChange={(e) => setWasteWeightKg(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500/20 text-white"
                  />
                </div>

                <div className="space-y-1.5 select-none text-left">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <span>Recycled Fragment ratio</span>
                    <span className="text-emerald-400">{recyclePercent}%</span>
                  </div>
                  <input
                    id="waste_recycle_range"
                    type="range"
                    min="0"
                    max="100"
                    value={recyclePercent}
                    onChange={(e) => setRecyclePercent(parseInt(e.target.value) || 0)}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>
            )}

            <button
              id="submit_tracker_btn"
              type="submit"
              className="w-full py-4 rounded-xl text-sm font-semibold text-slate-950 font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 hover:to-cyan-200 cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.3)] transition"
            >
              Commit Log Entry
            </button>
          </form>

          {/* HISTORICAL LOGS SUMMARY (within tracker view for accessibility) */}
          <div className="border-t border-white/5 mt-8.5 pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Carbon Logs History</h4>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3 text-center">No logged records found yet.</p>
            ) : (
              <div id="logs_history_table" className="space-y-2 text-left max-h-[220px] overflow-y-auto">
                {activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-lg capitalize">
                        {act.category === 'transportation' ? <Car className="w-4 h-4" /> : <UtilityPole className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize truncate pr-2 max-w-[150px]">{act.category}</p>
                        <span className="text-[10px] text-slate-500">{new Date(act.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })} • {act.date}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-cyan-300">
                      +{act.emissionsKg.toFixed(1)} kg CO₂
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
