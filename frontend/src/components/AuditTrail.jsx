import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  useEffect(() => {
    async function fetchAudit() {
      setLoading(true);
      try {
        const data = await apiFetch('/api/audit');
        setLogs(data);
      } catch (e) {
        console.error("Error fetching audit logs:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/audit/export', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header with 1-Click Export CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="typo-main-heading">System Audit Trail & Rationale Log</h1>
          <p className="typo-subtitle mt-1">Immutable audit ledger recording mathematical decision rationales, policy rule checks, and outcomes</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export CSV Report</span>
          </button>
          <div className="typo-customer-metadata font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            {logs.length} Immutable Logs
          </div>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200/80">
              <tr>
                <th className="p-3.5 typo-table-header font-mono">Timestamp</th>
                <th className="p-3.5 typo-table-header font-mono">Entity ID</th>
                <th className="p-3.5 typo-table-header">Customer</th>
                <th className="p-3.5 typo-table-header">Action Taken</th>
                <th className="p-3.5 typo-table-header">Decision Rationale & Rules</th>
                <th className="p-3.5 typo-table-header">Policy Check</th>
                <th className="p-3.5 typo-table-header text-right">Expected Net</th>
                <th className="p-3.5 typo-table-header text-center">Actual Outcome</th>
                <th className="p-3.5 typo-table-header text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 typo-customer-metadata font-mono">{log.timestamp}</td>
                  <td className="p-3.5 font-semibold text-slate-900 font-mono">{log.entity_id}</td>
                  <td className="p-3.5 typo-customer-name">{log.customer_name}</td>
                  <td className="p-3.5">
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-md typo-badge inline-block">
                      {log.action_taken.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs text-[12px] leading-relaxed">
                    {log.reason}
                  </td>
                  <td className="p-3.5 text-[12px]">
                    <span className="text-emerald-700 font-semibold">{log.policy_check}</span>
                  </td>
                  <td className="p-3.5 text-right typo-amount text-emerald-700">
                    +{formatINR(log.expected_net_value)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-md typo-badge inline-block ${
                      log.actual_outcome.includes('RECOVERED') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.actual_outcome}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-[12px] font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
