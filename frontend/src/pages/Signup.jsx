import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { authService } from '../services/auth';
import { setApiBaseUrl } from '../services/api';

export default function Signup({ onSignupSuccess, onNavigateLogin }) {
  const [formData, setFormData] = useState({
    business_name: '',
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    country: 'India',
    currency: 'INR',
    agree_terms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' };
    if (pwd.length < 6) return { score: 1, label: 'Weak (min 6 chars)', color: 'bg-rose-500/20 text-rose-300 border border-rose-500/40' };
    
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;

    if (strength <= 1) return { score: 2, label: 'Medium', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' };
  };

  const pwdStrength = evaluatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.business_name || !formData.full_name || !formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agree_terms) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.signup(formData);
      onSignupSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Account creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row text-slate-100 font-sans">
      {/* LEFT PANEL: Razorpay Branding & Product Benefits */}
      <div className="md:w-5/12 p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo & Product Badges */}
          <div className="flex items-center space-x-2.5">
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans italic">
              Razor<span className="text-blue-500">pay</span>
            </span>
            <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-800 font-mono">
              Agentic Stack
            </span>
            <span className="text-xs font-bold text-blue-400 border-l border-slate-700 pl-2.5 font-mono">
              REVENUE LEAK RADAR
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="inline-flex items-center gap-1.5 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full text-xs font-bold text-blue-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Enterprise Onboarding
            </div>
            {/* Main Heading: Inter 700, 36–40px */}
            <h1 className="text-[32px] sm:text-[38px] font-bold text-white tracking-tight leading-tight font-sans">
              Create your Merchant Account
            </h1>
            {/* Subtitle / Body: Inter 400, 15–16px */}
            <p className="text-[15px] sm:text-[16px] font-normal text-slate-300 leading-relaxed font-sans">
              Deploy economic recovery intelligence across your payment gateway flows, checkout sessions, and receivables.
            </p>
          </div>

          {/* Three Product Benefits: Inter 500, 14–15px */}
          <div className="pt-2 space-y-4 font-sans">
            <div className="flex items-center space-x-3 text-[14px] sm:text-[15px] font-medium text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Instant Test Sandbox Integration</span>
            </div>
            <div className="flex items-center space-x-3 text-[14px] sm:text-[15px] font-medium text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Bounded Merchant Guardrail Policy Control</span>
            </div>
            <div className="flex items-center space-x-3 text-[14px] sm:text-[15px] font-medium text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Immutable System Rationale Audit Log</span>
            </div>
          </div>
        </div>

        {/* Sign-In Link: Inter 400, 13–14px */}
        <div className="pt-8 text-[13px] sm:text-[14px] font-normal text-slate-400 font-sans">
          Already have an account?{' '}
          <button onClick={onNavigateLogin} className="text-blue-400 hover:underline font-semibold">
            Sign in here
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Business & Account Information Form */}
      <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 bg-slate-900 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-6">
          <div>
            {/* Section Heading: Inter 700, 24–28px */}
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight font-sans">
              Business & Account Information
            </h2>
            {/* Supporting Description: Inter 400, 15px */}
            <p className="text-[15px] font-normal text-slate-400 mt-1 font-sans">
              Fill in details to set up your merchant environment
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-lg text-rose-200 text-xs font-medium flex flex-col gap-2 font-sans">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="flex-1">{error}</span>
              </div>
              {(error.includes('HTML') || error.includes('404') || error.includes('VITE_API_BASE_URL') || error.includes('JSON')) && (
                <div className="pt-2 border-t border-rose-800/60 space-y-2 text-[11px]">
                  <p className="text-amber-200 font-semibold">Enter your deployed Backend URL (Render / Railway):</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="signup_backend_url"
                      placeholder="https://razorpay-revenue-leak-radar.onrender.com"
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = document.getElementById('signup_backend_url')?.value;
                        if (val) {
                          setApiBaseUrl(val);
                          setError('');
                          alert('Backend URL saved to session! Click Create Account again.');
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shrink-0"
                    >
                      Save & Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            {/* Business Name & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="Acme Retail Private Ltd"
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Work Email & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">
                  Work Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@acmeretail.in"
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="rahuls_admin"
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password Fields with Strength Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[13px] font-semibold text-slate-300 font-sans">Password *</label>
                  {pwdStrength.label && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full font-sans ${pwdStrength.color}`}>
                      {pwdStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full h-[48px] pl-3.5 pr-11 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
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

              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Country & Currency Select Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Singapore">Singapore</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                </select>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-300 block mb-1.5 font-sans">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full h-[48px] px-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-100 font-sans text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Terms Checkbox Aligned Precisely */}
            <div className="pt-2">
              <label className="flex items-center space-x-2.5 text-[14px] text-slate-300 font-normal cursor-pointer font-sans">
                <input
                  type="checkbox"
                  checked={formData.agree_terms}
                  onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            {/* Full-width Primary CTA: Create Account & Setup Engine → */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-[15px] shadow-sm font-sans flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? 'Creating Merchant Account...' : 'Create Account & Setup Engine'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
