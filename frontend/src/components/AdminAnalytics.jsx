import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  Activity,
  Users
} from 'lucide-react';

export default function AdminAnalytics({ inquiries = [], stats = {} }) {
  const { theme } = useTheme();

  // Calculate Status Metrics
  const totalInquiries = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inReviewCount = inquiries.filter((i) => i.status === 'in_review').length;
  const contactedCount = inquiries.filter((i) => i.status === 'contacted').length;
  const resolvedCount = inquiries.filter((i) => i.status === 'resolved').length;

  const resolutionRate = totalInquiries > 0 ? Math.round(((contactedCount + resolvedCount) / totalInquiries) * 100) : 0;
  const phoneCaptureRate = totalInquiries > 0 ? Math.round((inquiries.filter((i) => !!i.phone).length / totalInquiries) * 100) : 0;

  // Compute Weekly Volume Distribution (Mon - Sun)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

  inquiries.forEach((inq) => {
    try {
      const d = new Date(inq.created_at);
      const dayName = daysOfWeek[d.getDay()];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    } catch (e) {}
  });

  const maxDayCount = Math.max(...Object.values(dayCounts), 1);

  // Status breakdown array
  const statusItems = [
    { label: 'New Unread', count: newCount, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
    { label: 'In Review', count: inReviewCount, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)' },
    { label: 'Contacted', count: contactedCount, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.4)' },
    { label: 'Resolved', count: resolvedCount, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-md"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Lead Velocity</span>
            <Activity className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalInquiries}</div>
          <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Ingestion Uptime</span>
          </div>
        </div>

        {/* Resolution Rate */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-md"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Engagement Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{resolutionRate}%</div>
          <div className="text-xs font-mono text-slate-400 mt-1">Contacted or Resolved</div>
        </div>

        {/* WhatsApp & Phone Capture Rate */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-md"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">WhatsApp Capture</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{phoneCaptureRate}%</div>
          <div className="text-xs font-mono text-emerald-400 mt-1">Direct Phone/WA Captured</div>
        </div>

        {/* Target Response SLA */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-md"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Target SLA</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">&lt; 4 Hours</div>
          <div className="text-xs font-mono text-cyan-400 mt-1">Executive response team</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Ingestion Volume Bar Chart (7 Cols) */}
        <div
          className="lg:col-span-7 p-6 rounded-3xl border shadow-xl backdrop-blur-md"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" style={{ color: theme.primary }} />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Weekly Ingestion Volume
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Distribution by Day</span>
          </div>

          {/* Responsive SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const count = dayCounts[day] || 0;
              const heightPercent = Math.max(Math.round((count / maxDayCount) * 100), 12);
              return (
                <div key={day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[11px] font-mono text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div
                    className="w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:brightness-125 cursor-pointer relative"
                    style={{
                      height: `${heightPercent}%`,
                      background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary}80)`,
                      boxShadow: `0 0 15px -3px ${theme.glowColor}`,
                    }}
                  />
                  <span className="text-xs font-mono text-slate-400 mt-3 group-hover:text-white transition-colors">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Aggregated telemetry from web contact form &amp; inquiries</span>
            <span className="text-emerald-400">● Real-time sync</span>
          </div>
        </div>

        {/* Status Pipeline & Breakdown (5 Cols) */}
        <div
          className="lg:col-span-5 p-6 rounded-3xl border shadow-xl backdrop-blur-md flex flex-col justify-between"
          style={{
            backgroundColor: `${theme.surface}95`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" style={{ color: theme.secondary }} />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Pipeline Status Mix
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{totalInquiries} total</span>
            </div>

            {/* Visual Stacked Progress Bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800 mb-6">
              {totalInquiries === 0 ? (
                <div className="w-full h-full bg-slate-800" />
              ) : (
                statusItems.map((item, idx) => {
                  const pct = (item.count / totalInquiries) * 100;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                      className="h-full transition-all duration-500"
                      title={`${item.label}: ${item.count} (${pct.toFixed(0)}%)`}
                    />
                  );
                })
              )}
            </div>

            {/* List breakdown */}
            <div className="space-y-3">
              {statusItems.map((item, idx) => {
                const pct = totalInquiries > 0 ? Math.round((item.count / totalInquiries) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition"
                    style={{
                      backgroundColor: item.bg,
                      borderColor: item.border,
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-200 font-semibold">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-bold">{item.count}</span>
                      <span className="text-slate-400 text-[10px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tip Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Automated CRM Sync:</span>
            <span className="text-emerald-400 font-semibold">Active // WhatsApp Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
