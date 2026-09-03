import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, Zap, User, TestTube, FileText, Settings as SettingsIcon,
  ShieldCheck, AlertTriangle, ChevronRight, Menu, X, ArrowUpRight, LogOut, Bell, HelpCircle, UserCheck,
  PauseCircle, Ban, Tag, Moon, Sun, Info, CheckCircle2, Sparkles, MessageSquare, Cpu, Command, Radio, Terminal
} from 'lucide-react';

export default function AppShell({ 
  user, 
  currentTab, 
  onNavigate, 
  onLogout, 
  onTriggerDemo, 
  onReload,
  onSelectCase,
  children 
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [showRayWidget, setShowRayWidget] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [webhookSimulating, setWebhookSimulating] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

  const handleSimulateWebhook = async () => {
    setWebhookSimulating(true);
    try {
      const res = await fetch('/api/webhook/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: "payment.failed",
          amount: 16500.0,
          customer_name: "Vikram Aditya",
          payment_method: "UPI"
        })
      });
      const data = await res.json();
      setWebhookMessage(data.message);
      onReload();
      setTimeout(() => setWebhookMessage(''), 4000);
    } catch (e) {
      console.error("Webhook simulation error:", e);
    } finally {
      setWebhookSimulating(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leaks', label: 'Revenue Leaks', icon: Search },
    { id: 'queue', label: 'Recovery Queue', icon: Zap },
    { id: 'decision', label: 'Decision Center', icon: ShieldCheck },
    { id: 'simulator', label: 'Simulator', icon: TestTube },
    { id: 'customer', label: 'Customers', icon: User },
    { id: 'experiments', label: 'Experiments', icon: TestTube },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'settings', label: 'Guardrails', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900 pb-24">
      {/* 1. SINGLE CONSOLIDATED 44PX UTILITY HEADER (Dark Acrylic Glass) */}
      <div className="bg-[#090D16] text-slate-200 border-b border-slate-800 px-4 sm:px-8 py-2 min-h-[44px] flex flex-wrap items-center justify-between gap-3 shadow-md font-mono select-none text-xs z-40">
        {/* Left Side: Brand Badges + Latency Pill + Formula */}
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="font-bold text-white font-sans text-xs tracking-tight">Razorpay Autonomous Leak Radar</span>
          <span className="inline-flex items-center gap-1 bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 text-[10px] font-bold">
            <Cpu className="w-3 h-3 text-blue-400" /> 18ms Latency
          </span>
          <span className="text-slate-400 hidden xl:inline text-[11px]">
            Causal Engine (ΔP × Value - Cost)
          </span>
        </div>

        {/* Right Side: Presets Segmented Buttons + Webhook Trigger + Key Shortcut */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {webhookMessage ? (
            <span className="text-emerald-400 font-bold text-[11px] animate-pulse">✓ {webhookMessage}</span>
          ) : (
            <button
              onClick={handleSimulateWebhook}
              disabled={webhookSimulating}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all text-xs font-bold shadow-xs"
              title="Simulate incoming Razorpay payment.failed webhook payload"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{webhookSimulating ? 'Ingesting...' : '⚡ Webhook Simulator'}</span>
            </button>
          )}

          {/* Compact Segmented Controls */}
          <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => onTriggerDemo('CASE_1_ACT')}
              className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-blue-400" /> Act Now
            </button>
            <button
              onClick={() => onTriggerDemo('CASE_2_WAIT')}
              className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-amber-300 hover:bg-amber-600/30 hover:text-white transition-all flex items-center gap-1 border-l border-slate-800"
            >
              <PauseCircle className="w-3 h-3 text-amber-400" /> Wait
            </button>
            <button
              onClick={() => onTriggerDemo('CASE_3_STOP')}
              className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-rose-300 hover:bg-rose-600/30 hover:text-white transition-all flex items-center gap-1 border-l border-slate-800"
            >
              <Ban className="w-3 h-3 text-rose-400" /> Block
            </button>
          </div>

          <span className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded text-[10px] border border-slate-800 hidden md:inline-flex items-center gap-1">
            <Command className="w-3 h-3" /> Ctrl+Shift+D
          </span>
        </div>
      </div>

      {/* 2. SINGLE CLEAN WHITE NAVBAR WITH PROPER HORIZONTAL PADDING (px-8, NO CLIPPING) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1 rounded text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('overview')}>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans italic">
                  Razor<span className="text-blue-600">pay</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-300 font-mono">
                  Agentic Stack
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-1.5 pl-3 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-600 font-mono tracking-tight">LEAK RADAR</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Tenant Switcher & Profile Button (Zero Overflow) */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs shrink-0">
            <span className="hidden xl:inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-800 font-mono text-[11px] font-bold">
              🏢 {user?.business_name || 'Acme Commerce Pvt Ltd'}
            </span>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span className="truncate max-w-[140px]">{user?.full_name || 'Merchant Console'}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs space-y-0.5 z-40">
                  <div className="p-2.5 border-b border-slate-100 font-mono">
                    <div className="font-bold text-slate-900">{user?.full_name || 'Admin'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{user?.email || 'demo@acmecommerce.in'}</div>
                  </div>
                  <button
                    onClick={() => { setShowProfileMenu(false); onNavigate('settings'); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Merchant Guardrails & Caps
                  </button>
                  <button
                    onClick={() => { setShowProfileMenu(false); onLogout(); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-rose-50 text-rose-700 font-semibold border-t border-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-slate-50 p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${
                  currentTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 3. Main Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>

      {/* 4. Floating AI Agent Drawer: "Ask RAY" */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowRayWidget(!showRayWidget)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 border border-slate-700"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Ask RAY (Agentic Radar)</span>
        </button>

        {showRayWidget && (
          <div className="absolute bottom-14 right-0 w-84 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-3 text-xs font-sans z-50">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 font-mono">Ask RAY &bull; Causal Assistant</span>
              </div>
              <button onClick={() => setShowRayWidget(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Ask RAY why the engine recommended <strong className="text-blue-600 font-mono">ACT</strong>, <strong className="text-amber-600 font-mono">WAIT</strong>, or <strong className="text-rose-600 font-mono">STOP</strong> for any active leak event.
            </p>

            <div className="space-y-2 pt-1 font-mono text-[11px]">
              <div className="text-[10px] font-bold uppercase text-slate-400">Structured Quick Prompts:</div>

              <div
                onClick={() => { setShowRayWidget(false); onSelectCase('LEAK_8271'); }}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-800 cursor-pointer transition-all"
              >
                ❓ "Why was Case #ORD-8271 held in WAIT state?"
              </div>

              <div
                onClick={() => { setShowRayWidget(false); onNavigate('simulator'); }}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-slate-800 cursor-pointer transition-all"
              >
                📈 "What is the net ROI of granting a 5% discount nudge?"
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 text-xs text-slate-500 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-slate-900 font-sans italic">Razor<span className="text-blue-600">pay</span></span>
            <span>&bull;</span>
            <span className="font-bold text-slate-800">Revenue Leak Radar</span>
            <span>&mdash; Causal Inference & Economic Recovery Engine</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Expected Incremental Net Recovery Value (EINRV)
          </div>
        </div>
      </footer>
    </div>
  );
}
