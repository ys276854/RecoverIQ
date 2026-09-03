import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, DollarSign, Clock, ArrowRight, Zap, Info, Play, RefreshCw, HelpCircle, Layers, Cpu, Code } from 'lucide-react';

export default function DecisionCenter({ caseData, onExecuteAction, onSelectCustomer, onNavigate }) {
  const [activeStory, setActiveStory] = useState('current'); // 'current' or 'non_action'

  if (!caseData) {
    return <div className="p-8 text-center text-slate-500 font-mono">Select a revenue leak case to evaluate...</div>;
  }

  const { event, evaluation } = caseData;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const optimalActionObj = evaluation.actions_evaluated.find(a => a.is_optimal) || evaluation.actions_evaluated[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Case Selector / Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Autonomous Decision Center</h1>
          <p className="text-xs text-slate-600 mt-1">Causal inference engine evaluating 3-action strategy matrix (Act Now, Wait, Block)</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setActiveStory('current')}
            className={`px-3.5 py-2 rounded-xl font-sans text-xs font-bold transition-all ${
              activeStory === 'current' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Active Case #{event.order_id}
          </button>
          <button
            onClick={() => setActiveStory('non_action')}
            className={`px-3.5 py-2 rounded-xl font-sans text-xs font-bold transition-all ${
              activeStory === 'non_action' ? 'bg-amber-800 text-white shadow-sm' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Why We Didn't Act (Case Story)
          </button>
        </div>
      </div>

      {activeStory === 'current' ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Case Evaluation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {/* Header Block */}
            <div className="p-6 bg-slate-950 text-white space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">RECOVERY DECISION MATRIX</span>
                <span className="text-xs font-mono text-slate-400">{event.age_minutes}m ago</span>
              </div>
              <div className="flex justify-between items-baseline">
                <div>
                  <h2 className="text-sm font-medium text-slate-400 font-mono">Payment #{event.id} &bull; {event.customer_name}</h2>
                  <div className="text-4xl font-extrabold text-white num-tabular mt-1">{formatINR(event.amount)}</div>
                </div>
                <div className="text-right">
                  <span className="bg-slate-900 text-slate-200 px-3 py-1 rounded-full font-mono text-xs font-bold border border-slate-700">
                    {event.failure_reason}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Action Strategy Evaluation Matrix */}
            <div className="p-6 space-y-4 bg-white">
              <div className="text-xs font-bold tracking-wider text-slate-500 uppercase font-mono">WHAT SHOULD WE DO? (STRATEGY MATRIX: ACT NOW | WAIT | BLOCK)</div>
              <div className="space-y-3 font-mono text-xs">
                {evaluation.actions_evaluated.map((act) => {
                  const isOptimal = act.is_optimal;
                  return (
                    <div
                      key={act.action}
                      onClick={() => onExecuteAction(event.id, act.action)}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isOptimal
                          ? 'border-blue-600 bg-blue-50/90 ring-4 ring-blue-500/10 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-sans font-bold text-slate-900 text-sm">{act.display_name}</span>
                        {isOptimal && (
                          <span className="bg-blue-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-sans font-extrabold uppercase tracking-wider">
                            OPTIMAL
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-base ${isOptimal ? 'text-blue-950' : 'text-slate-800'}`}>
                          {formatINR(act.expected_net_value)}
                        </span>
                        <span className="text-[11px] text-slate-500 block font-sans">
                          {(act.recovery_probability * 100).toFixed(1)}% Rec Prob
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Causal Uplift Decision Formula Inspector & Data Grounding */}
            <div className="p-6 bg-slate-950 text-slate-100 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center">
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">EMPIRICAL CAUSAL INFERENCE ENGINE MATRIX</div>
                <span className="bg-slate-900 text-slate-300 text-[10px] px-2.5 py-0.5 rounded border border-slate-700 font-mono">
                  Benchmark Proxies: Olist + Hillstrom RCT
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold">EINRV(a) = [P(Y=1 | T=a, X) - P(Y=1 | T=0, X)] × V - C_a - D_a</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300 border-t border-slate-800">
                  <div>• Baseline P(Y=1 | T=0, X): <strong className="text-amber-400">{(evaluation.natural_recovery_prob * 100).toFixed(1)}%</strong></div>
                  <div>• Treatment P(Y=1 | T=a, X): <strong className="text-emerald-400">{(optimalActionObj.recovery_probability * 100).toFixed(1)}%</strong></div>
                  <div>• Causal Incremental Lift (ΔP_a): <strong className="text-blue-400">+{((optimalActionObj.recovery_probability - evaluation.natural_recovery_prob) * 100).toFixed(1)}%</strong></div>
                  <div>• Cost & Discount (C_a + D_a): <strong className="text-rose-400">₹{(event.amount * 0.05 + 4.0).toFixed(2)}</strong></div>
                </div>
                <p className="text-slate-400 font-sans text-xs pt-1 border-t border-slate-800/80 leading-relaxed">
                  <strong>Proxy Benchmark Limitation:</strong> Olist and Hillstrom serve as historical proxy benchmarks to demonstrate our causal uplift pipeline; production deployment replaces these proxies with live merchant Razorpay webhook telemetry.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onExecuteAction(event.id, optimalActionObj.action)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all font-sans"
                >
                  <Zap className="w-4 h-4 text-amber-300" /> Execute Optimal Action Now
                </button>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="px-4 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl font-bold text-xs transition-all font-sans"
                >
                  Simulate Counterfactual &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STORYTELLING FEATURE: Why We Didn't Act */
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-md overflow-hidden divide-y divide-slate-100">
            <div className="p-6 bg-amber-950 text-white space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-amber-300 uppercase">AUTONOMOUS NON-INTERVENTION CASE STORY</span>
                <span className="text-amber-200">#pay_991823</span>
              </div>
              <div className="flex justify-between items-baseline">
                <div>
                  <h2 className="text-sm font-semibold text-amber-200 font-mono">Checkout Abandonment Event</h2>
                  <div className="text-3xl font-extrabold text-white num-tabular mt-1">₹24,500 AT RISK</div>
                </div>
                <span className="bg-amber-900 text-amber-100 px-3 py-1 rounded-full font-mono font-bold text-xs border border-amber-700">
                  AI DECISION: WAIT
                </span>
              </div>
            </div>

            <div className="p-6 bg-white space-y-4 text-xs">
              <div className="font-bold uppercase tracking-wider text-slate-500 font-mono">WHY WE SUPPRESSED NUDGE</div>
              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Natural Recovery Prob</span>
                  <span className="font-bold text-amber-900 text-base">89.0%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Avoided Intervention Fee</span>
                  <span className="font-bold text-emerald-700 text-base">₹42.00</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>REALITY CHECK (6 HOURS LATER)</span>
              </div>
              <div className="font-mono text-emerald-950 font-bold text-sm">
                Customer returned and paid naturally! ₹24,500 recovered with ₹0 fee spent.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
