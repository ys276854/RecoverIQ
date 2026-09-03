import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, Building, Sliders, Database } from 'lucide-react';
import { authService } from '../services/auth';

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    business_name: user?.business_name || 'Acme Commerce India',
    industry: 'E-Commerce & Retail',
    country: 'India',
    currency: 'INR',
    max_discount_amount: 500,
    max_intervention_cost: 25,
    max_touches_per_48h: 2,
    data_connection: 'DEMO_DATASET'
  });
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await authService.completeOnboarding(formData);
        onComplete();
      } catch (e) {
        console.error("Onboarding error:", e);
        onComplete();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-8 space-y-6">
        {/* Header & Step Bar */}
        <div className="space-y-4 text-center border-b border-slate-800 pb-6">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              R
            </div>
            <span className="font-extrabold text-sm font-mono tracking-tight text-white">RAZORPAY REVENUE LEAK RADAR</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Set up your Revenue Engine</h1>
            <p className="text-xs text-slate-400 mt-0.5">Under 2 minutes to complete initial merchant configuration</p>
          </div>

          {/* Stepper */}
          <div className="flex justify-center items-center space-x-4 pt-2 font-mono text-xs">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>1</span>
              <span>Business</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-800"></div>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>2</span>
              <span>Guardrails</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-800"></div>
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>3</span>
              <span>Data Source</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Business Details */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Step 1: Business Information</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono"
                >
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="SaaS & Subscriptions">SaaS & Subscriptions</option>
                  <option value="B2B Receivables">B2B Receivables & Invoicing</option>
                  <option value="Fintech & Lending">Fintech & Lending</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    readOnly
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Recovery Preferences */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Step 2: Recovery Preferences & Caps</span>
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <label className="text-slate-300 block mb-1">Maximum Per-Order Discount Cap (₹)</label>
                <input
                  type="number"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Maximum Intervention Cost / Order (₹)</label>
                <input
                  type="number"
                  value={formData.max_intervention_cost}
                  onChange={(e) => setFormData({ ...formData, max_intervention_cost: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Maximum Customer Touches per 48 Hours</label>
                <select
                  value={formData.max_touches_per_48h}
                  onChange={(e) => setFormData({ ...formData, max_touches_per_48h: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono"
                >
                  <option value={1}>1 Touch / 48h (Strict)</option>
                  <option value={2}>2 Touches / 48h (Standard Recommended)</option>
                  <option value={3}>3 Touches / 48h (Aggressive)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Connect Data */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Step 3: Connect Data Source</span>
            </div>

            <div className="space-y-3 font-sans">
              <div
                onClick={() => setFormData({ ...formData, data_connection: 'DEMO_DATASET' })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.data_connection === 'DEMO_DATASET' ? 'border-blue-500 bg-blue-950/40' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Empirical Benchmark Dataset (Olist + Hillstrom)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">RECOMMENDED</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">Pre-loaded real payment failure, checkout abandonment, and RCT uplift benchmark datasets.</p>
              </div>

              <div
                onClick={() => setFormData({ ...formData, data_connection: 'RAZORPAY_SANDBOX' })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.data_connection === 'RAZORPAY_SANDBOX' ? 'border-blue-500 bg-blue-950/40' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="font-bold text-white">Razorpay Test Mode API</div>
                <p className="text-slate-400 text-[11px] mt-1">Connect your Razorpay API Key ID (`rzp_test_...`) to listen to live payment failure webhooks.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            {loading ? 'Initializing Engine...' : step === 3 ? 'Finish & Launch Radar' : 'Next Step'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
