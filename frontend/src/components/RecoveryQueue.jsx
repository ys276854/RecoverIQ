import React from 'react';
import { Zap, Clock, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecoveryQueue({ queueData, onSelectCase, onExecuteAction }) {
  if (!queueData) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading recovery queue...</div>;
  }

  const { act_now, wait, stop, act_now_value, wait_natural_recovery, stop_avoided_cost } = queueData;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Autonomous Recovery Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">Triage workspace explicitly classifying ACT NOW, WAIT, and STOP decision branches</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Auto-Dispatch: ACTIVE
          </span>
        </div>
      </div>

      {/* 3 Triage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* COLUMN 1: ACT NOW */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-200 bg-blue-50/50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-700" />
              <span className="font-bold text-xs uppercase tracking-wider text-blue-950">ACT NOW ({act_now.length})</span>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-900">{formatINR(act_now_value)} Yield</span>
          </div>

          <div className="p-3 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50 font-sans">
            Direct action recommended. Incremental yield exceeds intervention cost.
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
            {act_now.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="font-bold text-xs text-slate-700">No Cases In ACT NOW</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All active revenue leaks are either monitoring naturally or suppressed by merchant policy guardrails.
                </p>
              </div>
            ) : (
              act_now.map(({ event, evaluation }) => (
                <div
                  key={event.id}
                  onClick={() => onSelectCase(event.id)}
                  className="p-3 rounded border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{event.customer_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">#{event.order_id}</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900">{formatINR(event.amount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Action:</span>
                    <span className="font-semibold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded">
                      {evaluation.recommended_action.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Net Incremental Value:</span>
                    <span className="font-bold text-emerald-700">+{formatINR(evaluation.incremental_value_over_wait)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Conf: {(evaluation.confidence_score*100).toFixed(0)}%</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExecuteAction(event.id, evaluation.recommended_action);
                      }}
                      className="text-xs px-2.5 py-1 rounded bg-blue-900 hover:bg-blue-950 text-white font-medium transition-colors"
                    >
                      Execute Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: WAIT */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-200 bg-amber-50/50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-950">WAIT ({wait.length})</span>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-800">{formatINR(wait_natural_recovery)} Nat. Rec</span>
          </div>

          <div className="p-3 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50 font-sans">
            High natural recovery probability. Intervening burns unnecessary costs/discounts.
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
            {wait.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                <div className="font-bold text-xs text-slate-700">No Cases In WAIT</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No active transactions currently in natural recovery monitoring window.
                </p>
              </div>
            ) : (
              wait.map(({ event, evaluation }) => (
                <div
                  key={event.id}
                  onClick={() => onSelectCase(event.id)}
                  className="p-3 rounded border border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{event.customer_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">#{event.order_id}</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900">{formatINR(event.amount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">P(Natural Recovery):</span>
                    <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                      {(evaluation.natural_recovery_prob * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-sans line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                    {evaluation.rationale}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Monitoring...</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(event.id);
                      }}
                      className="text-xs text-blue-700 font-medium hover:underline"
                    >
                      Inspect Case &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: STOP */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-200 bg-rose-50/50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <span className="font-bold text-xs uppercase tracking-wider text-rose-950">STOP / DO NOT TOUCH ({stop.length})</span>
            </div>
            <span className="text-xs font-mono font-semibold text-rose-800">{formatINR(stop_avoided_cost)} Cost Saved</span>
          </div>

          <div className="p-3 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50 font-sans">
            Low margin, touch limit, or policy blocked. Intervening produces negative net yield.
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
            {stop.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="font-bold text-xs text-slate-700">No Cases In STOP</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No cases currently suppressed by merchant guardrail limits.
                </p>
              </div>
            ) : (
              stop.map(({ event, evaluation }) => (
                <div
                  key={event.id}
                  onClick={() => onSelectCase(event.id)}
                  className="p-3 rounded border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all cursor-pointer space-y-2 opacity-90"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{event.customer_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">#{event.order_id}</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900">{formatINR(event.amount)}</span>
                  </div>

                  <div className="text-[11px] text-rose-700 font-sans font-medium bg-rose-50 p-1.5 rounded border border-rose-100">
                    {evaluation.rationale}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">Action Suppressed</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(event.id);
                      }}
                      className="text-xs text-slate-600 font-medium hover:underline"
                    >
                      Inspect &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
