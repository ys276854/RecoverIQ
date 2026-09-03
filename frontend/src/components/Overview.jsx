import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, ShieldCheck, DollarSign, TrendingUp, AlertCircle, 
  CheckCircle2, Clock, X, Info, ChevronRight, PauseCircle, Zap, Ban, MessageSquare, HelpCircle, FileText, Tag, RotateCcw,
  Code, Activity, Sliders, Play, Sparkles, Layers
} from 'lucide-react';

export default function Overview({ overviewData, onNavigate, onSelectCase }) {
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [hoveredBucket, setHoveredBucket] = useState(null);
  const [liveFeed, setLiveFeed] = useState([]);
  const [selectedFeedItem, setSelectedFeedItem] = useState(null);

  useEffect(() => {
    async function fetchLiveFeed() {
      try {
        const res = await fetch('/api/decisions/live');
        const data = await res.json();
        setLiveFeed(data);
      } catch (e) {
        console.error("Error fetching live feed:", e);
      }
    }
    fetchLiveFeed();
  }, []);

  if (!overviewData) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading revenue intelligence...</div>;
  }

  const revenue_at_risk = overviewData?.revenue_at_risk ?? 520500.0;
  const natural_recovery_value = overviewData?.natural_recovery_value ?? 305123.0;
  const net_recovery_value = overviewData?.net_recovery_value ?? 182231.0;
  const unrecovered_residual = overviewData?.unrecovered_residual ?? 33146.0;
  const saved_by_not_intervening = overviewData?.saved_by_not_intervening ?? 18400.0;

  const funnel_waterfall = overviewData?.funnel_waterfall || {
    at_risk: 520500.0,
    natural_recovery: 305123.0,
    net_recovery_value: 182231.0,
    unrecovered_residual: 33146.0,
    costs_and_incentives: 34000.0
  };

  const saved_breakdown = overviewData?.saved_breakdown || {
    monitored_transactions: 412,
    avg_natural_recovery_prob: 86.0,
    expected_intervention_cost: 18400.0,
    expected_incremental_recovery: 6200.0,
    avoided_cost: 18400.0
  };

  const leak_categories = overviewData?.leak_categories || [];

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatLakhs = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    } else if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}K`;
    }
    return `₹${val}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Executive Report Print CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="typo-main-heading">Executive Revenue Cockpit</h1>
          <p className="typo-subtitle mt-1">Autonomous revenue intelligence & net recovery evaluation engine</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Print C-Suite Executive Summary</span>
          </button>
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-700 font-semibold">Engine Active</span>
          </div>
        </div>
      </div>

      {/* Hero Dynamic Value Hub */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          {/* Main Primary Hero Metric */}
          <div className="space-y-2 lg:w-5/12">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Primary Objective: Net Recovery Yield
            </div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 num-tabular tracking-tight">
              {formatINR(net_recovery_value)}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-full font-mono border border-emerald-300">
                +28.5% Net Increment
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-2.5 py-1 rounded-full font-mono border border-blue-300">
                ROI: 14.2x
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans leading-relaxed pt-1">
              Actual net cash recovered by merchant after subtracting all direct intervention fees (₹4–₹7) and margin discounts.
            </p>
          </div>

          {/* Sub-Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-7/12 border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold text-amber-900 uppercase tracking-wider font-mono">Revenue At Risk</div>
              <div className="text-xl font-bold text-slate-900 num-tabular">{formatLakhs(revenue_at_risk)}</div>
              <div className="text-[10px] text-slate-600 font-mono font-semibold">19 active leak events</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Natural Recovery</div>
              <div className="text-xl font-bold text-slate-900 num-tabular">{formatLakhs(natural_recovery_value)}</div>
              <div className="text-[10px] text-slate-600 font-mono font-semibold">58.6% organic baseline</div>
            </div>

            <div 
              onClick={() => setShowSavedModal(true)}
              className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 hover:bg-emerald-100/70 transition-all cursor-pointer space-y-2 group flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider font-mono">Saved (Do Nothing)</div>
                <div className="text-xl font-bold text-emerald-900 num-tabular">{formatLakhs(saved_by_not_intervening)}</div>
              </div>
              <button className="w-full inline-flex items-center justify-between bg-white text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs group-hover:bg-slate-50">
                <span>Inspect Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Connected Sankey Pipeline Attribution Flow */}
        <div className="pt-5 border-t border-slate-100 font-mono text-xs space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Connected Sankey Attribution Pipeline:
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Step 1: Total Leak */}
            <div className="w-full md:w-1/4 p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl text-center shadow-2xs">
              <div className="text-[10px] text-amber-900 font-bold uppercase font-mono">1. Total Revenue Leak</div>
              <div className="text-base font-extrabold text-amber-950 mt-0.5 num-tabular">{formatLakhs(revenue_at_risk)}</div>
            </div>

            {/* Pipeline Arrow: Splits Into */}
            <div className="hidden md:flex flex-col items-center justify-center text-slate-600 font-bold text-xs shrink-0">
              <span className="text-[10px] font-mono text-slate-600 font-bold uppercase">Splits Into</span>
              <span className="text-slate-600 font-extrabold text-sm">&rarr;</span>
            </div>

            {/* Step 2: Passive / Organic Recovery */}
            <div className="w-full md:w-1/4 p-3.5 bg-slate-100/90 border border-slate-300 rounded-xl text-center shadow-2xs">
              <div className="text-[10px] text-slate-800 font-bold uppercase font-mono">2. Organic Recovery (Zero Cost)</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5 num-tabular">{formatLakhs(natural_recovery_value)}</div>
            </div>

            {/* Plus Indicator */}
            <div className="hidden md:block font-bold text-slate-600 text-sm font-mono">+</div>

            {/* Step 3: Autonomous Agentic Net Recovery */}
            <div className="w-full md:w-1/4 p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-center shadow-xs">
              <div className="text-[10px] text-emerald-900 font-bold uppercase font-mono">3. Agentic Net Recovery</div>
              <div className="text-base font-extrabold text-emerald-950 mt-0.5 num-tabular">{formatINR(net_recovery_value)}</div>
            </div>

            {/* Plus Indicator */}
            <div className="hidden md:block font-bold text-slate-600 text-sm font-mono">+</div>

            {/* Step 4: Irrecoverable Drop */}
            <div className="w-full md:w-1/4 p-3.5 bg-rose-50/90 border border-rose-200 rounded-xl text-center shadow-2xs">
              <div className="text-[10px] text-rose-900 font-bold uppercase font-mono">4. Irrecoverable Drop</div>
              <div className="text-base font-extrabold text-rose-950 mt-0.5 num-tabular">{formatLakhs(unrecovered_residual)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Recovery Waterfall + Live Decisions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Waterfall Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">REVENUE RECOVERY WATERFALL</h2>
              <p className="text-xs text-slate-500">Decomposition of revenue leakage into 4 exact matching segments</p>
            </div>
            <button
              onClick={() => onNavigate('simulator')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              Counterfactual Simulator &rarr;
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 font-sans text-[11px] font-semibold">Visual Formula:</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-200">
              ₹5.21L At Risk
            </span>
            <span className="text-slate-400 font-bold">=</span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
              ₹3.05L Natural Rec
            </span>
            <span className="text-slate-400 font-bold">+</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              ₹1.82L Net Rec
            </span>
            <span className="text-slate-400 font-bold">+</span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold border border-rose-200">
              ₹33.1K Residual
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs py-2">
            <div
              onMouseEnter={() => setHoveredBucket('at_risk')}
              onMouseLeave={() => setHoveredBucket(null)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                hoveredBucket === 'at_risk' ? 'border-amber-400 bg-amber-50/60 shadow-xs' : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-bold text-amber-950">Revenue At Risk (Total Leakage)</span>
                <span className="font-bold text-amber-950">{formatLakhs(funnel_waterfall.at_risk)} (100%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredBucket('natural')}
              onMouseLeave={() => setHoveredBucket(null)}
              className={`p-3.5 rounded-xl border ml-4 transition-all cursor-pointer ${
                hoveredBucket === 'natural' ? 'border-slate-400 bg-slate-100 shadow-xs' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-semibold text-slate-700">├── Natural Recovery (WAIT Strategy)</span>
                <span className="font-bold text-slate-800">{formatLakhs(funnel_waterfall.natural_recovery)} (58.6%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full" style={{ width: '58.6%' }}></div>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredBucket('net')}
              onMouseLeave={() => setHoveredBucket(null)}
              className={`p-4 rounded-xl border-2 ml-4 transition-all cursor-pointer ${
                hoveredBucket === 'net' ? 'border-emerald-600 bg-emerald-100/60 shadow-xs' : 'border-emerald-500 bg-emerald-50/60'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-bold text-emerald-950 uppercase text-xs tracking-wider">├── NET RECOVERY VALUE</span>
                <span className="font-extrabold text-emerald-700 text-sm">{formatINR(funnel_waterfall.net_recovery_value)} (35.0%)</span>
              </div>
              <div className="w-full bg-emerald-200 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full" style={{ width: '35.0%' }}></div>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredBucket('residual')}
              onMouseLeave={() => setHoveredBucket(null)}
              className={`p-3.5 rounded-xl border ml-8 transition-all cursor-pointer ${
                hoveredBucket === 'residual' ? 'border-rose-300 bg-rose-50/60 shadow-xs' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-medium text-rose-800">└── Unrecovered Residual</span>
                <span className="font-bold text-rose-700">{formatLakhs(funnel_waterfall.unrecovered_residual)} (6.4%)</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full" style={{ width: '6.4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Decisions Feed (Click opens Slide-over JSON Payload Inspector) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">LIVE RECOVERY FEED</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Click card for JSON</span>
          </div>

          <div className="space-y-3 font-mono text-xs flex-1 overflow-y-auto max-h-[420px]">
            {liveFeed.map((item) => {
              const isWait = item.action === 'WAIT';
              const isPayLink = item.action === 'PAYMENT_LINK';
              const isReminder = item.action === 'REMINDER';
              const isStop = item.action === 'STOP';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFeedItem(item)}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-500 transition-all cursor-pointer space-y-2 bg-white shadow-2xs hover:shadow-md group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px] font-sans font-medium">● {item.time}</span>
                    <span className="font-bold text-slate-900">{formatINR(item.amount)}</span>
                  </div>

                  <div className="flex justify-between items-center font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                      isWait ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      isPayLink ? 'bg-blue-100 text-blue-900 border border-blue-200 font-bold' :
                      isReminder ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}>
                      {isWait && <PauseCircle className="w-3 h-3 text-amber-700" />}
                      {isPayLink && <Zap className="w-3 h-3 text-blue-700" />}
                      {isReminder && <MessageSquare className="w-3 h-3 text-blue-700" />}
                      {isStop && <Ban className="w-3 h-3 text-rose-700" />}
                      {item.action}
                    </span>
                    <span className="text-[11px] text-blue-600 font-mono group-hover:underline flex items-center gap-0.5">
                      Inspect Payload <Code className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Full Autonomous Queue &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Where Are We Losing Money? Category Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">WHERE ARE WE LOSING MONEY?</h2>
            <p className="text-xs text-slate-500">Leakage distribution across operational payment flows</p>
          </div>
          <button
            onClick={() => onNavigate('leaks')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            Investigate All Leaks &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Events</th>
                <th className="p-3.5 text-right">At Risk Amount</th>
                <th className="p-3.5 text-right">Natural Rec %</th>
                <th className="p-3.5">Optimal Action</th>
                <th className="p-3.5 text-right">Expected Net</th>
                <th className="p-3.5 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {leak_categories.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-sans font-medium text-slate-900">{cat.category}</td>
                  <td className="p-3.5 text-right text-slate-600">{cat.events_count}</td>
                  <td className="p-3.5 text-right font-semibold text-slate-900">{formatINR(cat.at_risk_amount)}</td>
                  <td className="p-3.5 text-right text-amber-700 font-semibold">{cat.natural_rec_pct}%</td>
                  <td className="p-3.5 font-sans text-blue-900 font-medium">{cat.optimal_intervention}</td>
                  <td className="p-3.5 text-right font-semibold text-emerald-700">{formatINR(cat.expected_net_value)}</td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium ${
                      cat.trend.startsWith('-') ? 'bg-emerald-50 text-emerald-700' : cat.trend.startsWith('+') ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cat.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-OVER RAW JSON PAYLOAD INSPECTOR MODAL */}
      {selectedFeedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-slate-950 border-l border-slate-800 text-slate-100 w-full max-w-lg h-full p-6 space-y-5 overflow-y-auto shadow-2xl font-mono">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <div className="text-[10px] text-blue-400 font-bold uppercase">MODEL DECISION VECTOR & PAYLOAD</div>
                <h3 className="text-sm font-bold text-white">Case #{selectedFeedItem.id || 'ORD-8271'}</h3>
              </div>
              <button onClick={() => setSelectedFeedItem(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Decision Equation</div>
                <div className="text-emerald-400 font-bold">EINRV = (0.94 - 0.88) × ₹18,500 - ₹6.50 = +₹1,103.50</div>
                <div className="text-[10px] text-slate-500 font-sans">Natural recovery (P_nat = 88%) vs Nudge lift (P_treat = 94%)</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Raw Webhook Event JSON</div>
                <pre className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{JSON.stringify({
  event: "payment.failed",
  case_id: selectedFeedItem.id || "LEAK_8271",
  order_id: "ORD-8271",
  amount: selectedFeedItem.amount,
  payment_method: "UPI",
  failure_reason: selectedFeedItem.reason,
  timestamp: selectedFeedItem.time,
  model_inference: {
    P_nat: 0.88,
    P_treat: 0.94,
    intervention_cost: 6.50,
    policy_recommendation: selectedFeedItem.action
  }
}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFeedItem(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Breakdown Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">WHY WE DIDN'T ACT</h3>
                <p className="text-xs text-slate-500">Autonomous non-intervention breakdown</p>
              </div>
              <button onClick={() => setShowSavedModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-lg text-xs space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-emerald-800">Transactions Monitored:</span>
                <span className="font-bold text-emerald-950">{saved_breakdown?.monitored_transactions || 412} Transactions</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-emerald-800">Natural Recovery Probability:</span>
                <span className="font-bold text-emerald-950">{saved_breakdown?.avg_natural_recovery_prob || 86}%</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-emerald-800">Expected Intervention Cost:</span>
                <span className="font-bold text-emerald-950">₹{(saved_breakdown?.expected_intervention_cost || 18400).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-emerald-800">Expected Incremental Recovery:</span>
                <span className="font-bold text-emerald-950">₹{(saved_breakdown?.expected_incremental_recovery || 6200).toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                <span className="font-bold text-emerald-900 uppercase font-mono">Decision:</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">WAIT</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">Result:</div>
              <div className="font-mono text-emerald-700 font-bold text-sm">
                ₹{(saved_breakdown?.avoided_cost || 18400).toLocaleString()} intervention cost avoided
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE C-SUITE EXECUTIVE SUMMARY MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-8 space-y-6 text-slate-900 font-sans">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 italic">Razor<span className="text-blue-600">pay</span></span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-300 font-mono">Agentic Stack</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">C-Suite Executive Revenue Intelligence Report</h2>
                <p className="text-xs text-slate-500 font-mono">Report Period: August 2026 &bull; Acme Commerce Private Ltd</p>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-bold">Total Monitored Leaks</div>
                <div className="text-base font-bold text-slate-900">₹5,20,500</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                <div className="text-emerald-800 text-[10px] uppercase font-bold">Net Recovered Cash</div>
                <div className="text-base font-bold text-emerald-950">₹1,82,231</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold">Print / Export PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
