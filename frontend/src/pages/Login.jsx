import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Zap, AlertCircle, Sparkles, Terminal, Play, Cpu, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/auth';

export default function Login({ onLoginSuccess, onNavigateSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 5000);
  };
  const [loading, setLoading] = useState(false);
  const [selectedEdgeCase, setSelectedEdgeCase] = useState('mandate');

  const edgeCases = {
    mandate: [
      "[TRACE 04:12.8] RecoverIQ Webhook: Mandate Auth Timeout #ORD-98124",
      "[TRACE 04:12.9] Evaluating baseline P_nat (Organic Recovery Prob): 0.88",
      "[TRACE 04:13.1] Decision: WAIT / SUPPRESS NUDGE. Customer organic retry imminent.",
      "[TRACE 04:13.2] Result: Saved ₹6.50 WhatsApp API fee. Margin intact."
    ],
    timeout: [
      "[TRACE 04:14.2] RecoverIQ Webhook: HDFC Gateway Auth Timeout #ORD-8271",
      "[TRACE 04:14.4] Evaluating baseline P_nat: 0.12 (High friction drop-off)",
      "[TRACE 04:14.6] Decision: ACT -> Generate RecoverIQ Payment Link + SMS Nudge",
      "[TRACE 04:14.8] Result: Expected Incremental Recovery: +₹18,500"
    ],
    b2b: [
      "[TRACE 04:16.1] RecoverIQ Webhook: Corporate Invoice Failure #ORD-4491",
      "[TRACE 04:16.3] Customer LTV: ₹4,50,000 | P_nat: 0.42",
      "[TRACE 04:16.5] Decision: ACT -> Dispatches Formal Invoice Escalation Link",
      "[TRACE 04:16.7] Result: Protected High-LTV Enterprise Receivable"
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password, rememberMe);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const data = await authService.loginAsDemo();
      onLoginSuccess(data.user);
    } catch (err) {
      setError('Failed to connect with Demo merchant credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] flex flex-col lg:flex-row text-slate-100 font-sans relative overflow-hidden">
      {/* High-Contrast Ambient Radial Gradients */}
      <div className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* LEFT HALF (55% Split): Live Agent Telemetry Stage */}
      <div className="lg:w-[55%] p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-slate-950 via-[#0B101D] to-blue-950/60 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative z-10">
        <div className="space-y-8">
          {/* Logo & Product Badges */}
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans italic">
              Recover<span className="text-blue-500">IQ</span>
            </span>
            <span className="bg-emerald-950/90 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-800/80 font-mono">
              AI Engine
            </span>
            <span className="text-xs font-semibold text-blue-400 border-l border-slate-800 pl-3 font-mono">
              REVENUE RECOVERY
            </span>
          </div>

          {/* Hero Headline */}
          <div className="space-y-4 pt-2">
            <div className="inline-flex items-center gap-2 bg-blue-950/90 border border-blue-800/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 font-mono">
              <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> 14ms Latency Engine
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-sans">
              Intervene only when it pays.
              <span className="block bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold">
                Causal inference for merchant revenue recovery.
              </span>
            </h1>
          </div>

          {/* Interactive Try Edge Case Toggles */}
          <div className="space-y-3 pt-2 font-sans">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Interactive Edge Case Telemetry Stage
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mandate', label: 'Mandate Fail (Organic Retry)' },
                { id: 'timeout', label: 'Gateway Timeout (Act Now)' },
                { id: 'b2b', label: 'Corporate B2B Invoice' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedEdgeCase(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    selectedEdgeCase === item.id
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-102'
                      : 'bg-slate-900/80 text-slate-400 border-white/10 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Live Terminal Telemetry Display */}
            <div className="p-4 bg-slate-950/90 border border-white/10 rounded-2xl font-mono text-xs text-slate-300 space-y-2 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-500">
                <span>AGENT TELEMETRY FEED</span>
                <span className="text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> STREAM ACTIVE</span>
              </div>
              {edgeCases[selectedEdgeCase].map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className={idx === 2 ? 'text-amber-300 font-bold' : idx === 3 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-slate-500 font-mono flex items-center justify-between">
          <span>RecoverIQ — AI-powered revenue recovery intelligence</span>
          <span>Engine Status: Operational</span>
        </div>
      </div>

      {/* RIGHT HALF (45% Split): Glassmorphic Login & Shimmer Token Button */}
      <div className="lg:w-[45%] p-8 sm:p-12 lg:p-16 flex items-center justify-center relative z-10">
        <div className="space-y-6 max-w-md w-full">
          {/* Prominent High-Polish Shimmer Demo Access Card */}
          <div className="p-5 bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-900 border border-blue-500/50 rounded-2xl shadow-xl space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wider">⚡ 1-Click Judge Access</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/40">Auto-Configured Token</span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Instant login pre-loaded with live merchant failure events:
            </p>

            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between shadow-lg hover:shadow-blue-500/20 group/btn border border-blue-400/40"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-300 group-hover/btn:scale-110 transition-transform animate-pulse" />
                <span>Launch Pre-Loaded Merchant Sandbox</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Frosted Glass Login Card */}
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">Merchant Portal Sign In</h2>
              <p className="text-sm font-normal text-slate-400 mt-1 font-sans">Access your revenue intelligence cockpit</p>
            </div>

            {forgotSent && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-200 text-xs font-medium flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Password reset link sent to registered merchant email. For instant demo access, click 'Log In as Demo Merchant'.</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs font-medium flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-sans">
                  Email Address
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@acmecommerce.in"
                  className="w-full h-[46px] px-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 font-sans text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-sans">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-blue-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-[46px] pl-3.5 pr-11 bg-slate-800/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 font-sans text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer font-sans">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[46px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md font-sans flex items-center justify-center gap-1.5 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign in to Console'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-1 font-sans">
              Don't have an account?{' '}
              <button onClick={onNavigateSignup} className="text-blue-400 hover:underline font-semibold">
                Create merchant account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
