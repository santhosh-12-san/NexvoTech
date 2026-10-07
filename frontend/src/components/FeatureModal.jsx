import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ICON_OPTIONS = ['Brain', 'Zap', 'Eye', 'Shield', 'Activity', 'Globe', 'Cpu', 'Lock', 'Layers', 'Terminal', 'Sparkles', 'Database'];

export default function FeatureModal({ isOpen, onClose, onSave, feature = null }) {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Cpu',
    badge: 'AI Powered',
    order: 0,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (feature) {
      setFormData({
        title: feature.title || '',
        description: feature.description || '',
        icon_name: feature.icon_name || 'Cpu',
        badge: feature.badge || '',
        order: feature.order ?? 0,
        is_active: feature.is_active ?? true,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        icon_name: 'Cpu',
        badge: 'AI Powered',
        order: 0,
        is_active: true,
      });
    }
    setError(null);
  }, [feature, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save feature.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border"
        style={{
          backgroundColor: `${theme.surface}f2`,
          borderColor: theme.borderHover,
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 35px -5px ${theme.glowColor}`,
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
            <span style={{ color: theme.primary }}>#</span>
            <span>{feature ? 'EDIT FEATURE' : 'CREATE NEW FEATURE'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none"
              style={{ borderColor: theme.borderSubtle }}
              onFocus={(e) => (e.target.style.borderColor = theme.primary)}
              onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
              placeholder="e.g. Cognitive Neural Core"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Icon
              </label>
              <select
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none"
                style={{ borderColor: theme.borderSubtle }}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none"
                style={{ borderColor: theme.borderSubtle }}
                onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                placeholder="e.g. Quantum Ready"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none resize-none font-sans"
              style={{ borderColor: theme.borderSubtle }}
              onFocus={(e) => (e.target.style.borderColor = theme.primary)}
              onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
              placeholder="Explain technical capability..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none font-mono"
                style={{ borderColor: theme.borderSubtle }}
              />
            </div>

            <div className="flex items-center space-x-2 pt-5">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: theme.primary }}
              />
              <label htmlFor="is_active" className="text-xs font-mono text-slate-300 cursor-pointer">
                Active / Visible
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 rounded-xl text-white text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-lg bg-gradient-to-r ${theme.btnGradient}`}
              style={{ boxShadow: `0 4px 15px -3px ${theme.glowColor}` }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving...' : 'Save Feature'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
