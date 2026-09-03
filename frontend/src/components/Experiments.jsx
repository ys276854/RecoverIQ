import React, { useState, useEffect } from 'react';
import { FlaskConical, TrendingUp, DollarSign, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Experiments() {
  const [expData, setExpData] = useState(null);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  useEffect(() => {
    async function fetchExperiments() {
      try {
        const data = await apiFetch('/api/experiments');
        setExpData(data);
      } catch (e) {
        console.error("Error fetching experiments:", e);
      }
    }
    fetchExperiments();
  }, []);

  if (!expData) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading experimentation benchmarks...</div>;
  }

  const { experiment_name, status, duration, metrics } = expData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Policy Experimentation & Benchmarking</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live A/B testing framework comparing legacy static retry policies against algorithmic EINRV recovery</p>
        </div>
        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
          {status} &bull; {duration}
        </span>
      </div>

      {/* Primary Lift Banner */}
      <div className="bg-blue-900 text-white p-5 rounded border border-blue-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">Experiment Outcome</div>
          <h2 className="text-lg font-bold text-white mt-0.5">{experiment_name}</h2>
          <p className="text-xs text-blue-100 mt-1">
            Radar EINRV policy generates <span className="font-bold text-emerald-400">+{formatINR(metrics.net_lift_amount)}</span> net revenue gain over static retries.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-blue-200 font-medium uppercase">Net Revenue Lift</div>
          <div className="text-3xl font-bold text-emerald-400 font-mono mt-0.5">{metrics.net_lift_pct}</div>
        </div>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            A/B COHORT PERFORMANCE METRICS (50/50 Split)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Performance Dimension</th>
                <th className="p-3 text-right">Control (Static Policy)</th>
                <th className="p-3 text-right">Treatment (Radar EINRV)</th>
                <th className="p-3 text-right font-bold">NET LIFT / SAVINGS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="p-3 font-sans font-medium text-slate-900">Total Eligible Cases</td>
                <td className="p-3 text-right text-slate-700">{metrics.control.eligible_cases}</td>
                <td className="p-3 text-right font-bold text-slate-900">{metrics.treatment.eligible_cases}</td>
                <td className="p-3 text-right text-slate-400">--</td>
              </tr>

              <tr>
                <td className="p-3 font-sans font-medium text-slate-900">Gross Recovered Value</td>
                <td className="p-3 text-right text-slate-700">{formatINR(metrics.control.gross_recovered)}</td>
                <td className="p-3 text-right font-bold text-blue-900">{formatINR(metrics.treatment.gross_recovered)}</td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  +{formatINR(metrics.treatment.gross_recovered - metrics.control.gross_recovered)}
                </td>
              </tr>

              <tr>
                <td className="p-3 font-sans font-medium text-slate-900">Direct Message Outbound Costs</td>
                <td className="p-3 text-right text-rose-700">{formatINR(metrics.control.direct_costs)}</td>
                <td className="p-3 text-right font-bold text-emerald-700">{formatINR(metrics.treatment.direct_costs)}</td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  -{formatINR(metrics.control.direct_costs - metrics.treatment.direct_costs)} Saved (-60.0%)
                </td>
              </tr>

              <tr>
                <td className="p-3 font-sans font-medium text-slate-900">Total Margin Discounts Granted</td>
                <td className="p-3 text-right text-rose-700">{formatINR(metrics.control.margin_discounts)}</td>
                <td className="p-3 text-right font-bold text-emerald-700">{formatINR(metrics.treatment.margin_discounts)}</td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  -{formatINR(metrics.control.margin_discounts - metrics.treatment.margin_discounts)} Saved (-75.7%)
                </td>
              </tr>

              <tr className="bg-blue-50/70 font-bold text-sm">
                <td className="p-3 font-sans text-slate-900">NET REVENUE RECOVERED</td>
                <td className="p-3 text-right text-slate-700">{formatINR(metrics.control.net_recovered)}</td>
                <td className="p-3 text-right text-blue-900">{formatINR(metrics.treatment.net_recovered)}</td>
                <td className="p-3 text-right text-emerald-700">
                  +{formatINR(metrics.net_lift_amount)} ({metrics.net_lift_pct})
                </td>
              </tr>

              <tr>
                <td className="p-3 font-sans font-medium text-slate-900">Customer Opt-Out / Spam Rate</td>
                <td className="p-3 text-right text-rose-700">{metrics.control.spam_rate}</td>
                <td className="p-3 text-right font-bold text-emerald-700">{metrics.treatment.spam_rate}</td>
                <td className="p-3 text-right font-bold text-emerald-700">-87.5% Friction Drop</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
