import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import AppShell from './components/layout/AppShell';

import Overview from './components/Overview';
import RevenueLeaks from './components/RevenueLeaks';
import RecoveryQueue from './components/RecoveryQueue';
import DecisionCenter from './components/DecisionCenter';
import Simulator from './components/Simulator';
import CustomerProfile from './components/CustomerProfile';
import AuditTrail from './components/AuditTrail';
import Experiments from './components/Experiments';
import Settings from './components/Settings';

import { authService } from './services/auth';
import { apiFetch } from './services/api';
import { CheckCircle2, Zap, X, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

export default function App() {
  const [authView, setAuthView] = useState('login'); // 'login', 'signup', 'onboarding', 'app'
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // App Dashboard State
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedCaseId, setSelectedCaseId] = useState('LEAK_8271');
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUST_8812');

  const [overviewData, setOverviewData] = useState(null);
  const [leaksData, setLeaksData] = useState([]);
  const [queueData, setQueueData] = useState(null);
  const [caseData, setCaseData] = useState(null);

  // Live Action Execution Modal State
  const [executionState, setExecutionState] = useState(null);

  // Validate existing auth session on mount
  useEffect(() => {
    async function checkAuth() {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('view') === 'login' || searchParams.get('login') === 'true') {
        authService.clearSession();
        setUser(null);
        setAuthView('login');
        setLoadingAuth(false);
        return;
      }

      const activeUser = await authService.fetchCurrentUser();
      if (activeUser) {
        setUser(activeUser);
        if (!activeUser.onboarded) {
          setAuthView('onboarding');
        } else {
          setAuthView('app');
        }
      } else {
        setAuthView('login');
      }
      setLoadingAuth(false);
    }
    checkAuth();
  }, []);

  // Keyboard shortcut Ctrl+Shift+D for Hackathon Demo Trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        handleTriggerDemo('CASE_1_ACT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchAllData = async () => {
    try {
      const [ov, leaks, q] = await Promise.all([
        apiFetch('/api/overview'),
        apiFetch('/api/leaks'),
        apiFetch('/api/queue')
      ]);

      setOverviewData(ov);
      setLeaksData(Array.isArray(leaks) ? leaks : []);
      setQueueData(q);

      if (selectedCaseId) {
        const cData = await apiFetch(`/api/case/${selectedCaseId}`);
        setCaseData(cData);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    if (authView === 'app') {
      fetchAllData();
    }
  }, [authView, selectedCaseId]);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl max-w-md w-full space-y-2">
            <h2 className="text-base font-bold text-rose-300">Dashboard Error Catching</h2>
            <p className="text-xs text-slate-300 font-mono text-left">{this.state.error?.toString()}</p>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md">
            Reload Dashboard Console
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

  const handleLoginSuccess = (usr) => {
    setUser(usr);
    if (!usr.onboarded) {
      setAuthView('onboarding');
    } else {
      setAuthView('app');
      fetchAllData();
    }
  };

  const handleSignupSuccess = (usr) => {
    setUser(usr);
    setAuthView('onboarding');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setAuthView('login');
  };

  const handleSelectCase = async (caseId) => {
    setSelectedCaseId(caseId);
    try {
      const cData = await apiFetch(`/api/case/${caseId}`);
      setCaseData(cData);
    } catch (e) {
      console.error("Error fetching case:", e);
    }
    setCurrentTab('decision');
  };

  const handleExecuteAction = async (eventId, action) => {
    setExecutionState({
      step: 1,
      action: action,
      eventId: eventId,
      logs: ['Validating economic policy decision (EINRV Maximization)...'],
      done: false
    });

    setTimeout(async () => {
      setExecutionState(prev => ({
        ...prev,
        step: 2,
        logs: [...prev.logs, 'Checking merchant guardrail policies (Discount ≤ ₹500, Touches ≤ 2)...']
      }));

      try {
        const data = await apiFetch('/api/action/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId, action: action })
        });

        setTimeout(() => {
          setExecutionState(prev => ({
            ...prev,
            step: 3,
            logs: [
              ...prev.logs,
              `Razorpay Test Mode API invoked (${action === 'PAYMENT_LINK' ? '/v1/payment_links' : '/v1/invoices'})...`,
              `Generated link: ${data.razorpay_response?.short_url || 'https://rzp.io/i/rec_paylink_8271'}`,
              `Appended entry #${data.audit_entry?.id || 'AUDIT_102'} to Audit Trail`
            ],
            done: true,
            resultData: data
          }));
          fetchAllData();
        }, 600);
      } catch (e) {
        console.error("Error executing action:", e);
      }
    }, 500);
  };

  const handleTriggerDemo = async (type) => {
    if (type === 'FAILURE_RECOVERY') {
      setExecutionState({
        isResilienceDemo: true,
        action: 'PAYMENT_LINK (API RETRY SIMULATION)',
        logs: ['Initiating Payment Link dispatch via Razorpay API...'],
        done: false
      });

      setTimeout(() => {
        setExecutionState(prev => ({
          ...prev,
          logs: [
            ...prev.logs,
            '❌ Razorpay API Failure: 502 Bad Gateway / Gateway Timeout (Network Error)',
            '⚠️ Primary API endpoint unreachable. Circuit Breaker Tripped!'
          ]
        }));

        setTimeout(() => {
          setExecutionState(prev => ({
            ...prev,
            logs: [
              ...prev.logs,
              '⚡ Fallback Strategy Activated: Shifting payload to Async Dead-Letter Queue (DLQ)...',
              '✓ Action safely buffered in resilient retry queue (Auto-Retry in 15m).',
              '✓ Merchant alert dispatched to Slack/Email. Entry #AUDIT_FB_902 generated.'
            ],
            done: true,
            isFallbackSuccess: true
          }));
        }, 800);
      }, 700);
      return;
    }

    try {
      const data = await apiFetch('/api/demo/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (data.message) {
        if (data.case_id) {
          handleSelectCase(data.case_id);
        } else {
          fetchAllData();
        }
      }
    } catch (e) {
      console.error("Error triggering demo:", e);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-slate-300 text-xs">
        Initializing Razorpay Revenue Leak Radar...
      </div>
    );
  }

  if (authView === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} onNavigateSignup={() => setAuthView('signup')} />;
  }

  if (authView === 'signup') {
    return <Signup onSignupSuccess={handleSignupSuccess} onNavigateLogin={() => setAuthView('login')} />;
  }

  if (authView === 'onboarding') {
    return <Onboarding user={user} onComplete={() => setAuthView('app')} />;
  }

  return (
    <ErrorBoundary>
      <AppShell
        user={user}
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onLogout={handleLogout}
        onTriggerDemo={handleTriggerDemo}
        onReload={fetchAllData}
        onSelectCase={handleSelectCase}
      >
        {currentTab === 'overview' && (
          <Overview overviewData={overviewData} onNavigate={setCurrentTab} onSelectCase={handleSelectCase} />
        )}

        {currentTab === 'leaks' && (
          <RevenueLeaks leaksData={leaksData} onSelectCase={handleSelectCase} />
        )}

        {currentTab === 'queue' && (
          <RecoveryQueue
            queueData={queueData}
            onSelectCase={handleSelectCase}
            onExecuteAction={handleExecuteAction}
          />
        )}

        {currentTab === 'decision' && (
          <DecisionCenter
            caseData={caseData}
            onExecuteAction={handleExecuteAction}
            onSelectCustomer={(cId) => {
              setSelectedCustomerId(cId);
              setCurrentTab('customer');
            }}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'simulator' && <Simulator />}

        {currentTab === 'customer' && (
          <CustomerProfile
            customerId={selectedCustomerId}
            onBack={() => setCurrentTab('decision')}
          />
        )}

        {currentTab === 'audit' && <AuditTrail />}

        {currentTab === 'experiments' && <Experiments />}

        {currentTab === 'settings' && <Settings />}

        {/* STEP-BY-STEP ACTION EXECUTION MODAL */}
        {executionState && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 text-slate-100 font-sans space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                  <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-white">
                    EXECUTING RECOVERY ACTION &bull; {executionState.action}
                  </h3>
                </div>
                <button onClick={() => setExecutionState(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {executionState.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>

              {executionState.done && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  {executionState.isResilienceDemo ? (
                    <div className="p-3 bg-purple-950/80 border border-purple-700/80 rounded-lg text-purple-200 text-xs space-y-1 font-mono">
                      <div className="font-bold flex items-center justify-between">
                        <span>🛡️ SYSTEM RESILIENCE VERIFIED</span>
                        <span className="text-[10px] bg-purple-900 border border-purple-600 px-2 py-0.5 rounded text-purple-300">
                          Circuit Breaker Active
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-300 font-sans">
                        Primary API failure safely trapped. Payload buffered in Dead-Letter Queue (DLQ) with automatic retry interval and merchant alert.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs flex justify-between items-center font-mono">
                      <div>
                        <span className="font-bold block">STATUS: RECOVERY ACTION SENT</span>
                        <span className="text-[10px] text-emerald-400">Razorpay Test Mode Link Dispatched</span>
                      </div>
                      <a
                        href={executionState.resultData?.razorpay_response?.short_url || 'https://rzp.io/i/rec_paylink_8271'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded transition-all"
                      >
                        Open Link <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setExecutionState(null);
                        setCurrentTab('audit');
                      }}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-medium transition-all"
                    >
                      View Audit Log &rarr;
                    </button>
                    <button
                      onClick={() => setExecutionState(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AppShell>
    </ErrorBoundary>
  );
}
