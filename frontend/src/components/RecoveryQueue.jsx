import React from 'react';
import { Zap, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RecoveryQueue({ queueData, onSelectCase, onExecuteAction }) {
  const DEFAULT_QUEUE = {
    act_now: [
      { id: "LEAK_8271", order_id: "ORD-8271", customer_name: "Rahul Sharma", amount: 12500.0, optimal_action: "PAYMENT_LINK", optimal_einrv: 9496.0, natural_recovery_prob: 0.12, age_minutes: 14 }
    ],
    wait: [
      { id: "LEAK_9014", order_id: "ORD-9014", customer_name: "Priya Verma", amount: 4200.0, optimal_action: "WAIT", optimal_einrv: 3717.0, age_minutes: 22 }
    ],
    stop: [
      { id: "LEAK_4102", order_id: "INV-4102", customer_name: "Apex Retail Pvt Ltd", amount: 45000.0, optimal_action: "BLOCK", optimal_einrv: 0.0, age_minutes: 1440 }
    ],
    act_now_value: 12500.0,
    wait_natural_recovery: 4200.0,
    stop_avoided_cost: 45000.0
  };

  const activeQueue = queueData || DEFAULT_QUEUE;
  const rawActNow = Array.isArray(activeQueue.act_now) ? activeQueue.act_now : DEFAULT_QUEUE.act_now;
  const rawWait = Array.isArray(activeQueue.wait) ? activeQueue.wait : DEFAULT_QUEUE.wait;
  const rawStop = Array.isArray(activeQueue.stop) ? activeQueue.stop : DEFAULT_QUEUE.stop;

  const act_now_value = activeQueue.act_now_value || 12500.0;
  const wait_natural_recovery = activeQueue.wait_natural_recovery || 4200.0;
  const stop_avoided_cost = activeQueue.stop_avoided_cost || 45000.0;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const normalizeItem = (item) => {
    if (!item) return { event: { id: 'LEAK_001', customer_name: 'Customer', order_id: 'ORD-001', amount: 0 }, evaluation: { recommended_action: 'ACT_NOW', incremental_value_over_wait: 0, natural_recovery_prob: 0.5, confidence_score: 0.9 } };
    if (item.event) {
      return {
        event: item.event,
        evaluation: item.evaluation || { recommended_action: 'PAYMENT_LINK', incremental_value_over_wait: 1000, natural_recovery_prob: 0.5, confidence_score: 0.9 }
      };
    }
    return {
      event: {
        id: item.id || 'LEAK_001',
        order_id: item.order_id || 'ORD-001',
        customer_name: item.customer_name || 'Customer',
        amount: item.amount || 0.0
      },
      evaluation: {
        recommended_action: item.optimal_action || 'PAYMENT_LINK',
        incremental_value_over_wait: item.optimal_einrv || 1000.0,
        natural_recovery_prob: item.natural_recovery_prob || 0.586,
        confidence_score: 0.92
      }
    };
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

      {/* 3-Column Decision Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {/* COLUMN 1: ACT NOW */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-200 bg-blue-50/50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-700" />
              <span className="font-bold text-xs uppercase tracking-wider text-blue-950">ACT NOW ({rawActNow.length})</span>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-900">{formatINR(act_now_value)} Yield</span>
          </div>

          <div className="p-3 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50 font-sans">
            Direct action recommended. Incremental yield exceeds intervention cost.
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
            {rawActNow.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="font-bold text-xs text-slate-700">No Cases In ACT NOW</div>
              </div>
            ) : (
              rawActNow.map((raw) => {
                const { event, evaluation } = normalizeItem(raw);
                return (
                  <div
                    key={event.id}
                    onClick={() => onSelectCase && onSelectCase(event.id)}
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
                        {(evaluation.recommended_action || 'PAYMENT_LINK').replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Net Incremental Value:</span>
                      <span className="font-bold text-emerald-700">+{formatINR(evaluation.incremental_value_over_wait || 1000)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">Conf: {((evaluation.confidence_score || 0.9) * 100).toFixed(0)}%</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExecuteAction && onExecuteAction(event.id, evaluation.recommended_action);
                        }}
                        className="text-xs px-2.5 py-1 rounded bg-blue-900 hover:bg-blue-950 text-white font-medium transition-colors"
                      >
                        Execute Now
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: WAIT */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-200 bg-amber-50/50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-950">WAIT ({rawWait.length})</span>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-800">{formatINR(wait_natural_recovery)} Nat. Rec</span>
          </div>

          <div className="p-3 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50 font-sans">
            High natural recovery probability. Intervening burns unnecessary costs/discounts.
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
            {rawWait.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                <div className="font-bold text-xs text-slate-700">No Cases In WAIT</div>
              </div>
            ) : (
              rawWait.map((raw) => {
                const { event, evaluation } = normalizeItem(raw);
                return (
                  <div
                    key={event.id}
                    onClick={() => onSelectCase && onSelectCase(event.id)}
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
                        {((evaluation.natural_recovery_prob || 0.586) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: STOP / BLOCK */}
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-3.5 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-950">STOP / BLOCK ({rawStop.length})</span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700">{formatINR(stop_avoided_cost)} Preserved</span>
          </div>

          <div className="p-3 text-[11px] text-slate-500 border-b border-slate-100 bg-slate-50 font-sans">
            Policy bounds or low margin cap reached. Interventions blocked.
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[600px]">
            {rawStop.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="font-bold text-xs text-slate-700">No Cases In STOP</div>
              </div>
            ) : (
              rawStop.map((raw) => {
                const { event } = normalizeItem(raw);
                return (
                  <div
                    key={event.id}
                    onClick={() => onSelectCase && onSelectCase(event.id)}
                    className="p-3 rounded border border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-xs text-slate-900">{event.customer_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">#{event.order_id}</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900">{formatINR(event.amount)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        GUARDRAIL BLOCK
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
