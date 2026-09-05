import React, { useState, useEffect } from 'react';
import { User, DollarSign, Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function CustomerProfile({ customerId, onSelectCustomer, onBack }) {
  const [activeCustId, setActiveCustId] = useState(customerId || 'CUST_8812');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const CUSTOMER_LIST = [
    { id: "CUST_8812", name: "Rahul Sharma", company: "Retail Buyer", ltv: "₹84,200" },
    { id: "CUST_9014", name: "Priya Verma", company: "UPI Frequent Buyer", ltv: "₹32,100" },
    { id: "CUST_4102", name: "Apex Retail Pvt Ltd", company: "Enterprise B2B", ltv: "₹4,50,000" },
    { id: "CUST_7712", name: "Amit Kumar", company: "Low Cart Buyer", ltv: "₹12,400" },
    { id: "CUST_6511", name: "Neha Gupta", company: "Repeat E-Commerce", ltv: "₹96,500" },
    { id: "CUST_3309", name: "Suresh Mehta", company: "D2C Buyer", ltv: "₹54,000" },
    { id: "CUST_1104", name: "Vikram Patel", company: "Cards User", ltv: "₹18,900" },
    { id: "CUST_5201", name: "Kavita Reddy", company: "High LTV VIP", ltv: "₹1,12,000" },
    { id: "CUST_6420", name: "Zenith Logistics", company: "Logistics Partner B2B", ltv: "₹3,80,000" },
    { id: "CUST_7890", name: "Ananya Joshi", company: "Subscription User", ltv: "₹27,500" }
  ];

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  useEffect(() => {
    if (customerId) {
      setActiveCustId(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/customer/${activeCustId}`);
        setProfile(data);
      } catch (e) {
        console.error("Error fetching customer:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [activeCustId]);

  const handleCustomerChange = (newId) => {
    setActiveCustId(newId);
    if (onSelectCustomer) {
      onSelectCustomer(newId);
    }
  };

  if (loading || !profile) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading customer revenue profile...</div>;
  }

  const DEFAULT_TIMELINE = [
    {
      status: 'FAILURE',
      title: 'Payment Attempt Failed — HDFC Gateway Timeout (504)',
      description: 'Order #ORD-8271 (₹12,500). Gateway timeout occurred after 30s. Diagnosis: Transient bank throttling (P_nat: 12%).',
      timestamp: 'Today, 11:15 AM'
    },
    {
      status: 'ACTION',
      title: 'RecoverIQ Payment Link Sent via SMS & WhatsApp',
      description: 'Dispatched link rzp.io/i/rec_paylink_8271. Guardrails checked: Spacing ≥ 6h ✓, Discount ≤ ₹500 ✓.',
      timestamp: 'Today, 11:16 AM'
    },
    {
      status: 'SUCCESS',
      title: 'Payment Captured & Verified via RecoverIQ Webhook',
      description: 'Customer completed payment via UPI. ₹12,500 captured and settled. Recovery engine closed leak case.',
      timestamp: 'Today, 11:28 AM'
    }
  ];

  const timelineItems = Array.isArray(profile?.timeline) && profile.timeline.length > 0 ? profile.timeline : DEFAULT_TIMELINE;

  return (
    <div className="space-y-6">
      {/* Header with Enterprise Breadcrumb & Customer Selector Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 bg-white p-4 rounded-xl border shadow-2xs">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Decisions
            </button>
          )}
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>Customers</span> &bull; <span>Customer Intelligence</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{profile.customer_name || profile.name || 'Rahul Sharma'}</h1>
            <p className="text-xs text-slate-500 font-mono">{profile.customer_id || profile.id || activeCustId} &bull; {profile.customer_email || profile.email} &bull; {profile.customer_phone || '+91 98765 43210'}</p>
          </div>
        </div>

        {/* CUSTOMER SWITCHER DROPDOWN */}
        <div className="flex items-center space-x-2 font-sans self-start md:self-auto">
          <label className="text-xs font-semibold text-slate-500 shrink-0 font-mono">Select Merchant Customer:</label>
          <select
            value={activeCustId}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-2xs cursor-pointer"
          >
            {CUSTOMER_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id}) — {c.company} | LTV: {c.ltv}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lifetime Value (LTV)</div>
          <div className="text-xl font-bold text-emerald-700 num-tabular mt-1">{formatINR(profile.ltv)}</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Successful Payments</div>
          <div className="text-xl font-bold text-slate-900 num-tabular mt-1">{profile.successful_transactions || profile.succ_txs || 18} Orders</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Failed Attempts</div>
          <div className="text-xl font-bold text-amber-700 num-tabular mt-1">{profile.failed_attempts || 2} Failures</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Recovery Delay</div>
          <div className="text-xl font-bold text-slate-800 num-tabular mt-1">{profile.average_recovery_time_hours || 1.4} Hours</div>
        </div>
      </div>

      {/* Lifecycle Event Timeline */}
      <div className="bg-white rounded border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">TRANSACTION LIFELINE AUDIT TIMELINE</h2>
          <p className="text-xs text-slate-500">Chronological lifecycle debugging from checkout start down to recovery</p>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
          {timelineItems.map((item, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Dot */}
              <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                item.status === 'SUCCESS' ? 'border-emerald-600 bg-emerald-50' :
                item.status === 'FAILURE' ? 'border-rose-600 bg-rose-50' :
                item.status === 'ACTION' ? 'border-blue-600 bg-blue-50' :
                'border-slate-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  item.status === 'SUCCESS' ? 'bg-emerald-600' :
                  item.status === 'FAILURE' ? 'bg-rose-600' :
                  item.status === 'ACTION' ? 'bg-blue-600' :
                  'bg-slate-400'
                }`} />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{item.title || item.event}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{item.timestamp}</span>
                </div>
                <div className="text-xs text-slate-600 font-sans leading-relaxed">{item.description || item.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
