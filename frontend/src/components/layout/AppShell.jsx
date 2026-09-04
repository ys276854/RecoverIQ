import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, Zap, User, TestTube, FileText, Settings as SettingsIcon,
  ShieldCheck, AlertTriangle, ChevronRight, Menu, X, ArrowUpRight, LogOut, Bell, HelpCircle, UserCheck,
  PauseCircle, Ban, Tag, Moon, Sun, Info, CheckCircle2, Sparkles, MessageSquare, Cpu, Command, Radio, Terminal
} from 'lucide-react';
import { apiFetch } from '../../services/api';

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
  const [showTourWidget, setShowTourWidget] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [webhookSimulating, setWebhookSimulating] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

  const TOUR_STEPS = [
    {
      step: 1,
      tab: 'overview',
      title: '1. Measured Money Recovered (Track Focus)',
      subtitle: 'Razorpay explicit mandate: measured money recovered across a batch.',
      talkingPoint: 'Lead with ₹11.2L recovered across 12,483 transactions (60.8% post-intervention recovery rate).',
      highlight: 'Batch Recovery Funnel & Net Recovery Yield (₹1,82,350.00)'
    },
    {
      step: 2,
      tab: 'decision',
      title: '2. AI Reasoning & Governance Guardrails',
      subtitle: 'Transparent causal decision vector + safety guardrail enforcement.',
      talkingPoint: 'Highlight ACT/WAIT/BLOCK policies, max 2 retries, 6h gap, and 5% margin cap.',
      highlight: 'Case #LEAK_8271 (Rahul Sharma - ₹12,500.00)'
    },
    {
      step: 3,
      tab: 'decision',
      title: '3. Causal Lift Math & Parameters',
      subtitle: 'EINRV formula: (P_treat - P_nat) × Value - Intervention Cost',
      talkingPoint: 'Canonical net yield: (88% - 12%) × ₹12,500 - ₹4 = ₹9,496.00 net yield.',
      highlight: 'Interactive parameter sliders + HMAC verification payload'
    },
    {
      step: 4,
      tab: 'queue',
      title: '4. Real Live Razorpay Checkout Execution',
      subtitle: 'Click "Execute Recovery" → Live Razorpay test link → Real-time status flip.',
      talkingPoint: 'Judges love seeing live test links flip status to RECOVERED (₹12,500) upon payment.',
      highlight: 'Live test payment link generation & checkout'
    },
    {
      step: 5,
      tab: 'audit',
      title: '5. Immutable Audit Trail & HMAC Logs',
      subtitle: 'Cryptographic SHA-256 HMAC signature check & transparent logs.',
      talkingPoint: 'End pitch by highlighting governance, HMAC security, and CFO audit trail.',
      highlight: 'Audit Log & CFO Approval Certificate'
    }
  ];

  const handleNextTourStep = () => {
    const nextIdx = (tourStepIndex + 1) % TOUR_STEPS.length;
    setTourStepIndex(nextIdx);
    onNavigate(TOUR_STEPS[nextIdx].tab);
  };

  const handlePrevTourStep = () => {
    const prevIdx = (tourStepIndex - 1 + TOUR_STEPS.length) % TOUR_STEPS.length;
    setTourStepIndex(prevIdx);
    onNavigate(TOUR_STEPS[prevIdx].tab);
  };

  const currentTourStep = TOUR_STEPS[tourStepIndex];

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

  const navItemsPrimary = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leaks', label: 'Revenue Leaks', icon: Search },
    { id: 'queue', label: 'Recovery Queue', icon: Zap },
    { id: 'decision', label: 'Decision Center', icon: ShieldCheck },
    { id: 'simulator', label: 'Simulator', icon: TestTube }
  ];

  const navItemsSecondary = [
    { id: 'customer', label: 'Customers', icon: User },
    { id: 'experiments', label: 'Experiments', icon: TestTube },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'settings', label: 'Guardrails', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900 pb-24">
      {/* 1. SLEEK 36PX STATUS & TELEMETRY RIBBON (Dark Acrylic) */}
      <div className="bg-[#090D16] text-slate-300 border-b border-slate-800/90 px-4 sm:px-6 py-1.5 min-h-[36px] flex items-center justify-between gap-2 shadow-xs font-mono text-[11px] z-40 select-none">
        {/* Left: Compact Consolidated Telemetry Pill */}
        <div className="flex items-center space-x-2.5">
          <span className="inline-flex items-center gap-1.5 bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-800/60 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Razorpay Autonomous Radar &bull; 18ms Latency &bull; App Store Active</span>
          </span>
          <span className="text-slate-500 hidden xl:inline">
            Causal Engine (ΔP × Value - Cost)
          </span>
        </div>

        {/* Right: Presets + Webhook Trigger + Shortcut */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40 text-[11px] font-bold transition-all shadow-xs"
            title="Return to the Login / Auth Page"
          >
            <LogOut className="w-3 h-3 text-blue-400" />
            <span>🔑 Login Screen</span>
          </button>

          {webhookMessage ? (
            <span className="text-emerald-400 font-bold text-[11px] animate-pulse">✓ {webhookMessage}</span>
          ) : (
            <button
              onClick={handleSimulateWebhook}
              disabled={webhookSimulating}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold transition-all shadow-xs"
              title="Simulate incoming Razorpay payment.failed webhook payload"
            >
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>{webhookSimulating ? 'Ingesting...' : '⚡ Webhook Simulator'}</span>
            </button>
          )}

          {/* Compact Presets Segmented Bar */}
          <div className="hidden sm:inline-flex rounded bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => onTriggerDemo('CASE_1_ACT')}
              className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-blue-400" /> Act Now
            </button>
            <button
              onClick={() => onTriggerDemo('CASE_2_WAIT')}
              className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 hover:bg-amber-600/30 hover:text-white transition-all flex items-center gap-1 border-l border-slate-800"
            >
              <PauseCircle className="w-3 h-3 text-amber-400" /> Wait
            </button>
            <button
              onClick={() => onTriggerDemo('CASE_3_STOP')}
              className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-300 hover:bg-rose-600/30 hover:text-white transition-all flex items-center gap-1 border-l border-slate-800"
            >
              <Ban className="w-3 h-3 text-rose-400" /> Block
            </button>
          </div>

          <span className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px] border border-slate-800 hidden lg:inline-flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> Ctrl+Shift+D
          </span>
        </div>
      </div>

      {/* 2. MAIN BRAND & NAVIGATION HEADER (Zero Overflow, Responsive Fit) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs font-sans">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-hidden">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1 rounded text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => onNavigate('overview')}>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans italic">
                Razor<span className="text-blue-600">pay</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-300 font-mono">
                Agentic Stack
              </span>
              <span className="hidden md:inline text-[11px] font-bold text-slate-500 font-mono pl-1.5 border-l border-slate-200">
                LEAK RADAR
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Responsive fit: Primary tabs + More ▾ dropdown) */}
          <nav className="hidden lg:flex items-center space-x-1 font-sans">
            {navItemsPrimary.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="w-px h-4 bg-slate-200 mx-1" />

            {/* Secondary Nav Items (Flat on 2XL, Dropdown on LG/XL) */}
            <div className="hidden 2xl:flex items-center space-x-1">
              {navItemsSecondary.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* "More ▾" Dropdown for standard LG and XL screens */}
            <div className="relative 2xl:hidden">
              <button
                onClick={() => setShowMoreNav(!showMoreNav)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                  navItemsSecondary.some(i => i.id === currentTab)
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>More</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showMoreNav ? 'rotate-90' : 'rotate-0'}`} />
              </button>

              {showMoreNav && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs space-y-0.5 z-40">
                  {navItemsSecondary.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setShowMoreNav(false); onNavigate(item.id); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${
                          isActive ? 'bg-blue-50 text-blue-600 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side: Merchant Info & Account Controls */}
          <div className="flex items-center space-x-2 text-xs shrink-0 font-sans">
            <span className="hidden 2xl:inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-800 font-mono text-[11px] font-bold">
              🏢 {user?.business_name || 'Acme Commerce India'}
            </span>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 transition-all"
              >
                <span className="truncate max-w-[130px]">{user?.full_name || 'Demo Merchant Admin'}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-xs space-y-0.5 z-40">
                  <div className="p-2.5 border-b border-slate-100 font-mono">
                    <div className="font-bold text-slate-900">{user?.full_name || 'Demo Merchant Admin'}</div>
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
            {[...navItemsPrimary, ...navItemsSecondary].map((item) => (
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

      {/* 5. Floating 1-Click Guided Demo Tour Widget (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        {!showTourWidget ? (
          <button
            onClick={() => {
              setShowTourWidget(true);
              onNavigate(TOUR_STEPS[tourStepIndex].tab);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl rounded-xl px-4 py-2.5 text-xs font-extrabold flex items-center gap-2 transition-all hover:scale-105 border border-blue-500 font-mono"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping"></span>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>🎯 90s Judge Guided Tour</span>
          </button>
        ) : (
          <div className="w-88 sm:w-96 bg-slate-950 text-white border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border border-blue-500/30">
                  STEP {currentTourStep.step} OF 5
                </span>
                <span className="font-bold text-white font-mono">{currentTourStep.title}</span>
              </div>
              <button onClick={() => setShowTourWidget(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-300 font-mono">{currentTourStep.subtitle}</div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">💡 What to tell the judge:</div>
                <div className="text-slate-200 text-xs leading-relaxed font-sans">{currentTourStep.talkingPoint}</div>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-bold">
                Focus area: <span className="text-white underline">{currentTourStep.highlight}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={handlePrevTourStep}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-800"
              >
                ← Prev Step
              </button>
              <span className="text-[10px] text-slate-500 font-mono">{currentTourStep.step}/5</span>
              <button
                onClick={handleNextTourStep}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono shadow-md flex items-center gap-1"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
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
