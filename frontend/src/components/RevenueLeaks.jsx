import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function RevenueLeaks({ leaksData, onSelectCase }) {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredLeaks = (leaksData || []).filter(({ event }) => {
    if (categoryFilter !== 'ALL' && event.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && event.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = event.customer_name.toLowerCase().includes(term);
      const matchOrder = event.order_id.toLowerCase().includes(term);
      if (!matchName && !matchOrder) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="typo-main-heading">Revenue Leaks Workspace</h1>
          <p className="text-xs text-slate-600 font-sans mt-1">Investigate active leak events, examine baseline recovery, and execute actions</p>
        </div>
        <div className="text-xs text-slate-700 font-mono">
          Showing <span className="font-bold text-slate-900">{filteredLeaks.length}</span> of {leaksData?.length || 0} Cases
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer, order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-medium pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 font-sans"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-700 font-bold uppercase tracking-wider font-mono">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold py-2 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Categories</option>
            <option value="PAYMENT_FAILURE">Payment Failures</option>
            <option value="CHECKOUT_ABANDONMENT">Checkout Abandonment</option>
            <option value="OVERDUE_RECEIVABLE">Overdue Receivables</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold py-2 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="READY">Ready for Action</option>
            <option value="WAIT">Monitoring (Wait)</option>
            <option value="RECOVERED">Recovered</option>
          </select>
        </div>

        {(categoryFilter !== 'ALL' || statusFilter !== 'ALL' || searchTerm) && (
          <button
            onClick={() => {
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
              setSearchTerm('');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main High-Density Table with Restrained SaaS Typography */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            {/* Table Header: 12px / 600, uppercase, letter spacing 0.04em */}
            <thead className="bg-slate-50 border-b border-slate-200/80">
              <tr>
                <th className="p-3.5 typo-table-header">Customer</th>
                <th className="p-3.5 typo-table-header font-mono">Order ID</th>
                <th className="p-3.5 typo-table-header">Category</th>
                <th className="p-3.5 typo-table-header text-right">Amount</th>
                <th className="p-3.5 typo-table-header text-right">P(Nat Rec)</th>
                <th className="p-3.5 typo-table-header">Recommended Action</th>
                <th className="p-3.5 typo-table-header text-right">Expected Net</th>
                <th className="p-3.5 typo-table-header text-right">Confidence</th>
                <th className="p-3.5 typo-table-header text-center">Status</th>
                <th className="p-3.5 typo-table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLeaks.map(({ event, evaluation }) => {
                const isOptimalWait = evaluation.recommended_action === 'WAIT';
                return (
                  <tr
                    key={event.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => onSelectCase(event.id)}
                  >
                    {/* Customer Name: 15px / 600, Customer Metadata: 13px / 400 */}
                    <td className="p-3.5">
                      <div className="typo-customer-name">{event.customer_name}</div>
                      <div className="typo-customer-metadata font-mono">{event.customer_id}</div>
                    </td>

                    {/* Order ID: 13px / 600 */}
                    <td className="p-3.5 font-semibold text-[13px] text-slate-800 font-mono">#{event.order_id}</td>

                    {/* Category Badge: 13px / 600 */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md typo-badge inline-block ${
                        event.category === 'PAYMENT_FAILURE' ? 'bg-rose-50 text-rose-700 border border-rose-200/80' :
                        event.category === 'CHECKOUT_ABANDONMENT' ? 'bg-amber-50 text-amber-800 border border-amber-200/80' :
                        'bg-blue-50 text-blue-800 border border-blue-200/80'
                      }`}>
                        {event.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Amount: 16px / 600 */}
                    <td className="p-3.5 text-right typo-amount text-slate-900">{formatINR(event.amount)}</td>

                    {/* P(Nat Rec): 13px / 600 */}
                    <td className="p-3.5 text-right font-semibold text-[13px] text-amber-800 font-mono">
                      {(evaluation.natural_recovery_prob * 100).toFixed(1)}%
                    </td>

                    {/* Recommended Action Badge: 13px / 600 */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md typo-badge inline-block ${
                        isOptimalWait ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {evaluation.recommended_action.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Expected Net: 15px / 600 */}
                    <td className="p-3.5 text-right font-semibold text-[15px] text-emerald-700 font-mono">
                      +{formatINR(evaluation.expected_net_value)}
                    </td>

                    {/* Confidence: 13px / 400 */}
                    <td className="p-3.5 text-right typo-customer-metadata font-mono">
                      {(evaluation.confidence_score * 100).toFixed(0)}%
                    </td>

                    {/* Status Badge: 13px / 600 */}
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-md typo-badge inline-flex items-center gap-1 ${
                        event.status === 'RECOVERED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        event.status === 'WAIT' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {event.status === 'RECOVERED' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        {event.status === 'WAIT' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {event.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(event.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="Evaluate Case in Decision Center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
