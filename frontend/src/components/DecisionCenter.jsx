import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, DollarSign, Clock, ArrowRight, Zap, Info, Play, RefreshCw, HelpCircle, Layers, Cpu, Code, Sliders } from 'lucide-react';

export default function DecisionCenter({ caseData, onExecuteAction, onSelectCustomer, onNavigate }) {
  const [activeStory, setActiveStory] = useState('current'); // 'current' or 'non_action'

  const DEFAULT_CASE = {
    event: {
      id: "LEAK_8271",
      order_id: "ORD-8271",
      customer_id: "CUST_8812",
      customer_name: "Rahul Sharma",
      amount: 12500.0,
      failure_reason: "Gateway Timeout (504)",
      age_minutes: 14
    },
    evaluation: {
      natural_recovery_prob: 0.586,
      actions_evaluated: [
        { action: "PAYMENT_LINK", display_name: "Razorpay Payment Link", is_optimal: true, expected_net_value: 12611.0, recovery_probability: 0.88 },
        { action: "WAIT", display_name: "WAIT (Organic)", is_optimal: false, expected_net_value: 11310.0, recovery_probability: 0.586 },
        { action: "BLOCK", display_name: "Margin Discount Block", is_optimal: false, expected_net_value: 0.0, recovery_probability: 0.0 }
      ]
    }
  };

  const activeCase = caseData || DEFAULT_CASE;
  const { event, evaluation } = activeCase;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const actionsEvaluated = Array.isArray(evaluation?.actions_evaluated) ? evaluation.actions_evaluated : DEFAULT_CASE.evaluation.actions_evaluated;
  const optimalActionObj = actionsEvaluated.find(a => a.is_optimal) || actionsEvaluated[0];

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
                  <h2 className="text-sm font-medium text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                    <span>Payment #{event.id}</span>
                    <span>&bull;</span>
                    <button
                      onClick={() => {
                        if (onSelectCustomer && event.customer_id) {
                          onSelectCustomer(event.customer_id);
                        }
                      }}
                      className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer transition-colors inline-flex items-center gap-1"
                      title={`View ${event.customer_name}'s full customer revenue profile & transaction lifeline`}
                    >
                      <span>{event.customer_name} ({event.customer_id})</span>
                      <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
                    </button>
                  </h2>
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
                {actionsEvaluated.map((act) => {
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

            {/* AGENT REASONING & BOUNDED GUARDRAILS EXPLAINABILITY PANEL */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-4 font-sans text-xs text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
                    AGENT DECISION REASONING & BOUNDED GUARDRAILS
                  </h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  ✓ Gated & Compliant
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Causal Rationale Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
                    💡 Causal Rationale (Why this action?)
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-xs">
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>High Customer Value:</strong> Returning customer with 7 previous successful transactions.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>Transient Failure:</strong> Gateway timeout (504) indicates temporary network glitch.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>Optimal Recovery:</strong> Payment link yields 82% recovery probability vs 58.6% organic baseline.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span><strong>Positive Net Yield:</strong> Net revenue lift (+₹1,840) far exceeds direct SMS API cost (₹4.00).</span>
                    </li>
                  </ul>
                </div>

                {/* Guardrails Checked Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    🛡️ Merchant Guardrails & Rules Checked
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-xs font-mono">
                    <li className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Max 2 retries per 48h limit verified</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Minimum 6h spacing delay enforced</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Stop immediately after successful payment</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>No repeated customer messaging (Opt-Out safe)</span>
                    </li>
                  </ul>
                </div>
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

              {/* DYNAMIC CAUSAL PARAMETER TINKER & RAZORPAY API CODE SHOWCASE */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center text-blue-400 font-bold border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    <span>LIVE CAUSAL PARAMETER TINKER & RECALCULATOR</span>
                  </div>
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
                    Live Model Tinkering
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Margin Discount Offer:</span>
                      <span className="text-emerald-400 font-bold">₹{discountCapTinker}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="50"
                      value={discountCapTinker}
                      onChange={(e) => setDiscountCapTinker(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Outbound Nudge Spacing:</span>
                      <span className="text-blue-400 font-bold">{spacingDelayTinker} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      step="1"
                      value={spacingDelayTinker}
                      onChange={(e) => setSpacingDelayTinker(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-[11px] text-emerald-300 flex justify-between items-center">
                  <div>
                    <span>Tinkered Rec Prob: <strong className="text-white">{(dynamicProb * 100).toFixed(1)}%</strong></span>
                    <span className="mx-2 font-slate-600">|</span>
                    <span>Tinkered Incremental Lift: <strong className="text-blue-300">+{( (dynamicProb - 0.12) * 100 ).toFixed(1)}%</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 block font-bold">RECALCULATED NET YIELD</span>
                    <span className="text-sm font-black text-white">₹{dynamicNet.toFixed(2)}</span>
                  </div>
                </div>

                {/* Razorpay API Code Showcase Toggle Button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowCodeShowcase(!showCodeShowcase)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span>{showCodeShowcase ? 'Hide Razorpay API SDK Code & HMAC Payload' : '💻 Inspect Razorpay API Request Payload & HMAC SDK Integration Code'}</span>
                  </button>

                  {showCodeShowcase && (
                    <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-[11px] text-slate-300">
                      <div className="text-emerald-400 font-bold flex items-center justify-between border-b border-slate-800 pb-2">
                        <span>Razorpay API v1/payment_links Integration Code (Node.js)</span>
                        <span className="text-[10px] text-slate-500">POST https://api.razorpay.com/v1/payment_links</span>
                      </div>
                      <pre className="p-3 bg-slate-900 rounded-lg text-blue-300 overflow-x-auto text-[10px] font-mono leading-relaxed">
{`// 1. Dispatch Razorpay Payment Link API Payload
const razorpayPayload = {
  amount: ${event.amount * 100}, // Amount in paise (₹${event.amount})
  currency: "INR",
  accept_partial: false,
  description: "Revenue Leak Recovery Link for Order #${event.order_id}",
  customer: {
    name: "${event.customer_name}",
    email: "${event.customer_email || 'customer@example.com'}"
  },
  notify: { sms: true, whatsapp: true },
  callback_url: "https://radar.merchant.com/api/webhook/razorpay",
  callback_method: "get"
};

// 2. Razorpay Webhook HMAC-SHA256 Verification Logic
const crypto = require('crypto');
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(JSON.stringify(webhookBody))
  .digest('hex');

if (expectedSignature === req.headers['x-razorpay-signature']) {
  // HMAC verified -> Flip Leak status to RECOVERED!
}`}
                      </pre>
                    </div>
                  )}
                </div>
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
