import React, { useState } from 'react';
import { Play, RotateCcw, Zap, PauseCircle, Ban, Radio, Cpu, Terminal } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function DemoBar({ onTriggerDemo, onReload }) {
  const [webhookSimulating, setWebhookSimulating] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

  const handleSimulateWebhook = async () => {
    setWebhookSimulating(true);
    try {
      const data = await apiFetch('/api/webhook/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: "payment.failed",
          amount: 16500.0,
          customer_name: "Vikram Aditya",
          payment_method: "UPI"
        })
      });
      setWebhookMessage(data.message);
      onReload();
      setTimeout(() => setWebhookMessage(''), 4000);
    } catch (e) {
      console.error("Webhook simulation error:", e);
    } finally {
      setWebhookSimulating(false);
    }
  };

  return (
    <div className="bg-[#0B0F19] text-slate-200 border-b border-slate-800 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md font-mono select-none">
      <div className="flex items-center space-x-2.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-blue-400" /> DEV TOOLKIT &bull; DEMO PRESETS
        </span>
        {webhookMessage ? (
          <span className="text-emerald-400 font-bold text-[11px] animate-pulse">
            ✓ {webhookMessage}
          </span>
        ) : (
          <span className="text-slate-400 hidden xl:inline text-[11px] font-sans">
          ℹ️ <strong>Mode Disclosure:</strong> Production uses real Razorpay test-mode Payment Links & HMAC webhooks; simulator controls event timing.
        </span>
        )}
      </div>

      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        {/* Webhook Simulator Button */}
        <button
          onClick={handleSimulateWebhook}
          disabled={webhookSimulating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all text-xs font-bold shadow-xs"
          title="Simulate incoming Razorpay payment.failed webhook payload"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{webhookSimulating ? 'Ingesting...' : '⚡ Webhook Simulator (Razorpay HMAC Test Payload)'}</span>
        </button>

        {/* Preset Case 1: ACT */}
        <button
          onClick={() => onTriggerDemo('CASE_1_ACT')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 transition-all text-xs font-semibold"
        >
          <Zap className="w-3.5 h-3.5 text-blue-400" /> Case 1: Act Now
        </button>

        {/* Preset Case 2: WAIT */}
        <button
          onClick={() => onTriggerDemo('CASE_2_WAIT')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-all text-xs font-semibold"
        >
          <PauseCircle className="w-3.5 h-3.5 text-amber-400" /> Case 2: Wait
        </button>

        {/* Preset Case 3: BLOCK */}
        <button
          onClick={() => onTriggerDemo('CASE_3_STOP')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 transition-all text-xs font-semibold"
        >
          <Ban className="w-3.5 h-3.5 text-rose-400" /> Case 3: Block
        </button>

        {/* Failure Recovery Resiliency Demo Scenario */}
        <button
          onClick={() => onTriggerDemo('FAILURE_RECOVERY')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 transition-all text-xs font-bold shadow-xs"
          title="Simulate API failure (502 Bad Gateway) and circuit-breaker fallback recovery flow"
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>🛡️ Failure Recovery Demo</span>
        </button>

        <button
          onClick={onReload}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 transition-all text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}
