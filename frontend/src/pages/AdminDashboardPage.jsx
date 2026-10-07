import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ApiService } from '../services/api';
import FeatureModal from '../components/FeatureModal';
import PricingModal from '../components/PricingModal';
import RotatingColorCircle from '../components/RotatingColorCircle';
import AdminAnalytics from '../components/AdminAnalytics';
import {
  ShieldCheck,
  Cpu,
  Mail,
  DollarSign,
  Layers,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  Clock,
  Search,
  Check,
  AlertTriangle,
  Download,
  Phone,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const { theme, themes, themeId, setTheme } = useTheme();

  // Active Tab: 'inquiries' | 'features' | 'pricing'
  const [activeTab, setActiveTab] = useState('inquiries');

  // Data States
  const [stats, setStats] = useState({
    total_features: 0,
    active_features: 0,
    total_plans: 0,
    total_inquiries: 0,
    new_inquiries: 0,
  });
  const [inquiries, setInquiries] = useState([]);
  const [features, setFeatures] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionAlert, setActionAlert] = useState(null);

  // Modal States
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);

  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const showAlert = (message, type = 'success') => {
    setActionAlert({ message, type });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, inqRes, featRes, planRes] = await Promise.all([
        ApiService.getAdminStats().catch(() => ({ stats: {} })),
        ApiService.getInquiries().catch(() => []),
        ApiService.getFeatures(true).catch(() => []),
        ApiService.getPricing().catch(() => []),
      ]);

      if (statsRes?.stats) setStats(statsRes.stats);
      if (Array.isArray(inqRes)) setInquiries(inqRes);
      if (Array.isArray(featRes)) setFeatures(featRes);
      if (Array.isArray(planRes)) setPlans(planRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showAlert('Error loading some dashboard data. Please check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Feature CRUD Handlers ---
  const handleOpenAddFeature = () => {
    setEditingFeature(null);
    setFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (feature) => {
    setEditingFeature(feature);
    setFeatureModalOpen(true);
  };

  const handleSaveFeature = async (formData) => {
    if (editingFeature) {
      await ApiService.updateFeature(editingFeature.id, formData);
      showAlert(`Feature "${formData.title}" updated successfully!`);
    } else {
      await ApiService.createFeature(formData);
      showAlert(`Feature "${formData.title}" created successfully!`);
    }
    loadAllData();
  };

  const handleDeleteFeature = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete feature "${title}"?`)) {
      try {
        await ApiService.deleteFeature(id);
        showAlert(`Feature "${title}" deleted.`);
        loadAllData();
      } catch (err) {
        showAlert('Failed to delete feature.', 'error');
      }
    }
  };

  // --- Pricing Plan CRUD Handlers ---
  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPricingModalOpen(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPricingModalOpen(true);
  };

  const handleSavePlan = async (formData) => {
    if (editingPlan) {
      await ApiService.updatePricing(editingPlan.id, formData);
      showAlert(`Pricing plan "${formData.plan_name}" updated!`);
    } else {
      await ApiService.createPricing(formData);
      showAlert(`Pricing plan "${formData.plan_name}" created!`);
    }
    loadAllData();
  };

  const handleDeletePlan = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete pricing plan "${name}"?`)) {
      try {
        await ApiService.deletePricing(id);
        showAlert(`Plan "${name}" deleted.`);
        loadAllData();
      } catch (err) {
        showAlert('Failed to delete plan.', 'error');
      }
    }
  };

  // --- Inquiry Actions ---
  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      await ApiService.updateInquiryStatus(id, newStatus);
      showAlert(`Inquiry status updated to ${newStatus}`);
      loadAllData();
    } catch (err) {
      showAlert('Failed to update inquiry status', 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Delete this inquiry record?')) {
      try {
        await ApiService.deleteInquiry(id);
        showAlert('Inquiry record removed.');
        loadAllData();
      } catch (err) {
        showAlert('Failed to delete inquiry.', 'error');
      }
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.full_name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (!inquiries.length) {
      showAlert('No inquiries available to export.', 'error');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Subject', 'Status', 'Date', 'Message'];
    const rows = inquiries.map((inq) => [
      inq.id,
      `"${(inq.full_name || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.subject || '').replace(/"/g, '""')}"`,
      `"${inq.status}"`,
      `"${new Date(inq.created_at).toLocaleString()}"`,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvText = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexvo_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAlert(`Exported ${inquiries.length} inquiries to CSV successfully!`);
  };

  const getWhatsAppReplyUrl = (inq) => {
    const rawPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
    const targetPhone = rawPhone.length === 10 ? `91${rawPhone}` : (rawPhone || '919113233351');
    const text = encodeURIComponent(`Hi ${inq.full_name}, thank you for contacting Nexvo Technology regarding "${inq.subject || 'your inquiry'}". How can our AI engineering team assist you today?`);
    return `https://wa.me/${targetPhone}?text=${text}`;
  };

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col transition-colors duration-500"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Top Admin Bar */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b py-3.5 px-4 sm:px-8"
        style={{
          backgroundColor: `${theme.surface}e6`,
          borderColor: theme.borderSubtle,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-xl p-[1px] shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 15px -3px ${theme.glowColor}`,
              }}
            >
              <div
                className="w-full h-full rounded-[11px] flex items-center justify-center"
                style={{ backgroundColor: theme.surface }}
              >
                <ShieldCheck className="w-5 h-5" style={{ color: theme.primary }} />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">NEXVO</span>
              <span
                className="ml-1 text-xs font-mono font-semibold uppercase tracking-wider"
                style={{ color: theme.primary }}
              >
                CONTROL MATRIX
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border transition"
              style={{
                backgroundColor: `${theme.surface}90`,
                borderColor: theme.borderSubtle,
              }}
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono"
              style={{
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
                color: theme.badgeText,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span>{user?.username} (Staff Admin)</span>
            </div>

            {/* Rotating Color Circle on the right side */}
            <RotatingColorCircle />

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Notification Alert */}
        {actionAlert && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-mono flex items-center space-x-3 animate-fade-in ${
              actionAlert.type === 'error'
                ? 'bg-red-950/80 border border-red-500/40 text-red-200'
                : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
            }`}
          >
            {actionAlert.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{actionAlert.message}</span>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Inquiries */}
          <div
            className="rounded-2xl p-5 border transition"
            style={{
              backgroundColor: `${theme.surface}90`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Inquiries</span>
              <Mail className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.total_inquiries}
            </div>
            <div className="text-[11px] font-mono text-amber-400 mt-1 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{stats.new_inquiries} unread pending</span>
            </div>
          </div>

          {/* Features */}
          <div
            className="rounded-2xl p-5 border transition"
            style={{
              backgroundColor: `${theme.surface}90`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Features Active</span>
              <Cpu className="w-4 h-4" style={{ color: theme.secondary }} />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.active_features} / {stats.total_features}
            </div>
            <div className="text-[11px] font-mono mt-1" style={{ color: theme.primary }}>
              Live on Hero/Landing
            </div>
          </div>

          {/* Pricing Plans */}
          <div
            className="rounded-2xl p-5 border transition"
            style={{
              backgroundColor: `${theme.surface}90`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Pricing Tiers</span>
              <DollarSign className="w-4 h-4" style={{ color: theme.accent }} />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              {stats.total_plans}
            </div>
            <div className="text-[11px] font-mono mt-1" style={{ color: theme.primary }}>
              Configured &amp; Active
            </div>
          </div>

          {/* Database & Stack State */}
          <div
            className="rounded-2xl p-5 border transition"
            style={{
              backgroundColor: `${theme.surface}90`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono uppercase">Backend Node</span>
              <Layers className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <div className="text-sm font-bold text-white font-mono flex items-center space-x-1.5 mt-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span>PostgreSQL &bull; DRF</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Dial: {theme.name}
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Actions Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-4"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition ${
                activeTab === 'inquiries'
                  ? `bg-gradient-to-r ${theme.btnGradient} text-white shadow-lg`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              style={{
                boxShadow: activeTab === 'inquiries' ? `0 4px 15px -3px ${theme.glowColor}` : 'none',
              }}
            >
              Contact Inquiries ({inquiries.length})
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'analytics'
                  ? `bg-gradient-to-r ${theme.btnGradient} text-white shadow-lg`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              style={{
                boxShadow: activeTab === 'analytics' ? `0 4px 15px -3px ${theme.glowColor}` : 'none',
              }}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics &amp; Trends</span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition ${
                activeTab === 'features'
                  ? `bg-gradient-to-r ${theme.btnGradient} text-white shadow-lg`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              style={{
                boxShadow: activeTab === 'features' ? `0 4px 15px -3px ${theme.glowColor}` : 'none',
              }}
            >
              Core Features ({features.length})
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition ${
                activeTab === 'pricing'
                  ? `bg-gradient-to-r ${theme.btnGradient} text-white shadow-lg`
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              style={{
                boxShadow: activeTab === 'pricing' ? `0 4px 15px -3px ${theme.glowColor}` : 'none',
              }}
            >
              Pricing Plans ({plans.length})
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                style={{ color: theme.primary }}
              />
            </button>

            {activeTab === 'features' && (
              <button
                onClick={handleOpenAddFeature}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-mono font-bold transition shadow-lg bg-gradient-to-r ${theme.btnGradient}`}
                style={{ boxShadow: `0 4px 15px -3px ${theme.glowColor}` }}
              >
                <Plus className="w-4 h-4" />
                <span>New Feature</span>
              </button>
            )}

            {activeTab === 'pricing' && (
              <button
                onClick={handleOpenAddPlan}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-mono font-bold transition shadow-lg bg-gradient-to-r ${theme.btnGradient}`}
                style={{ boxShadow: `0 4px 15px -3px ${theme.glowColor}` }}
              >
                <Plus className="w-4 h-4" />
                <span>New Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB: ANALYTICS & GROWTH */}
        {activeTab === 'analytics' && (
          <AdminAnalytics inquiries={inquiries} stats={stats} />
        )}

        {/* TAB 1: CONTACT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone, or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  style={{ borderColor: theme.borderSubtle }}
                  onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                  onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-slate-900 border text-slate-200 hover:text-white hover:border-emerald-500/50 transition shadow-sm self-start sm:self-auto shrink-0"
                style={{ borderColor: theme.borderSubtle }}
                title="Export all inquiries as a CSV spreadsheet"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export CSV ({inquiries.length})</span>
              </button>
            </div>

            {filteredInquiries.length === 0 ? (
              <div
                className="p-12 text-center rounded-2xl border"
                style={{
                  backgroundColor: `${theme.surface}60`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-mono text-sm">No contact inquiries matching criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-2xl p-6 border transition flex flex-col md:flex-row md:items-start justify-between gap-4"
                    style={{
                      backgroundColor: `${theme.surface}90`,
                      borderColor: theme.borderSubtle,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.borderSubtle)}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-white">{inq.full_name}</h4>
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: theme.badgeBg,
                            borderColor: theme.badgeBorder,
                            color: theme.badgeText,
                          }}
                        >
                          {inq.email}
                        </span>

                        {inq.phone && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{inq.phone}</span>
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(inq.created_at).toLocaleString()}
                        </span>
                      </div>

                      {inq.subject && (
                        <p className="text-xs font-mono font-semibold" style={{ color: theme.primary }}>
                          Subject: {inq.subject}
                        </p>
                      )}

                      <p className="text-sm text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                        {inq.message}
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0">
                      <div>
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                            inq.status === 'new'
                              ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                              : inq.status === 'in_review'
                              ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                              : inq.status === 'contacted'
                              ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                              : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          }`}
                        >
                          <option value="new">Status: New</option>
                          <option value="in_review">Status: In Review</option>
                          <option value="contacted">Status: Contacted</option>
                          <option value="resolved">Status: Resolved</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Reply on WhatsApp Button */}
                        <a
                          href={getWhatsAppReplyUrl(inq)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 transition active:scale-95"
                          title={`Chat with ${inq.full_name} on WhatsApp`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FEATURES MANAGEMENT */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.id}
                className="rounded-2xl p-6 border transition flex flex-col justify-between"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.borderSubtle)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Icon: {feat.icon_name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        feat.is_active
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {feat.is_active ? 'VISIBLE' : 'HIDDEN'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1.5">{feat.title}</h4>
                  {feat.badge && (
                    <span
                      className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded border mb-2 font-semibold"
                      style={{
                        backgroundColor: theme.badgeBg,
                        borderColor: theme.badgeBorder,
                        color: theme.badgeText,
                      }}
                    >
                      {feat.badge}
                    </span>
                  )}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {feat.description}
                  </p>
                </div>

                <div
                  className="pt-3 border-t flex items-center justify-between text-xs font-mono"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <span className="text-slate-500">Order #{feat.order}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditFeature(feat)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
                      style={{ '--hover-color': theme.primary }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = theme.primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feat.id, feat.title)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-slate-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PRICING PLANS MANAGEMENT */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl p-6 border transition flex flex-col justify-between"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: p.is_popular ? theme.primary : theme.borderSubtle,
                  boxShadow: p.is_popular ? `0 0 25px -5px ${theme.glowColor}` : 'none',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Order: {p.order}
                    </span>
                    {p.is_popular && (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold"
                        style={{
                          backgroundColor: theme.badgeBg,
                          borderColor: theme.badgeBorder,
                          color: theme.badgeText,
                        }}
                      >
                        POPULAR
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white">{p.plan_name}</h4>
                  <div className="flex items-baseline my-2">
                    <span className="text-3xl font-black font-mono text-white">{p.price}</span>
                    <span className="text-xs font-mono text-slate-400 ml-1">{p.billing_period}</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4">{p.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {(Array.isArray(p.features) ? p.features : []).map((feat, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                        <Check className="w-3 h-3 shrink-0" style={{ color: theme.primary }} />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      p.is_active ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {p.is_active ? '&bull; Active' : '&bull; Inactive'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditPlan(p)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
                      onMouseEnter={(e) => (e.currentTarget.style.color = theme.primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(p.id, p.plan_name)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-slate-800 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Feature Modal */}
      <FeatureModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
        onSave={handleSaveFeature}
        feature={editingFeature}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        onSave={handleSavePlan}
        plan={editingPlan}
      />
    </div>
  );
}
