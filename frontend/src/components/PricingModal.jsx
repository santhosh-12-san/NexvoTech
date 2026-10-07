import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PricingModal({ isOpen, onClose, onSave, plan = null }) {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    plan_name: '',
    price: '$99',
    billing_period: '/mo',
    description: '',
    features: [''],
    is_popular: false,
    cta_text: 'Get Started',
    order: 0,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (plan) {
      setFormData({
        plan_name: plan.plan_name || '',
        price: plan.price || '$99',
        billing_period: plan.billing_period || '/mo',
        description: plan.description || '',
        features: Array.isArray(plan.features) && plan.features.length > 0 ? plan.features : [''],
        is_popular: plan.is_popular ?? false,
        cta_text: plan.cta_text || 'Get Started',
        order: plan.order ?? 0,
        is_active: plan.is_active ?? true,
      });
    } else {
      setFormData({
        plan_name: '',
        price: '$99',
        billing_period: '/mo',
        description: '',
        features: ['Up to 500k monthly inferences', 'Zero cold-start GPUs'],
        is_popular: false,
        cta_text: 'Select Plan',
        order: 0,
        is_active: true,
      });
    }
    setError(null);
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureRow = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureRow = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleanedFeatures = formData.features.map(f => f.trim()).filter(f => f.length > 0);
    if (cleanedFeatures.length === 0) {
      setError('Please provide at least one feature bullet point.');
      setSubmitting(false);
      return;
    }

    try {
      await onSave({ ...formData, features: cleanedFeatures });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save pricing plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-xl my-8 rounded-3xl p-6 sm:p-8 shadow-2xl relative border"
        style={{
          backgroundColor: `${theme.surface}f2`,
          borderColor: theme.borderHover,
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 35px -5px ${theme.glowColor}`,
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
            <span style={{ color: theme.primary }}>$</span>
            <span>{plan ? 'EDIT PRICING TIER' : 'CREATE PRICING TIER'}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none"
                style={{ borderColor: theme.borderSubtle }}
                onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                placeholder="e.g. Enterprise Quantum"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Price *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none font-mono"
                style={{ borderColor: theme.borderSubtle }}
                onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                placeholder="$149"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Billing Period
              </label>
              <input
                type="text"
                value={formData.billing_period}
                onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none font-mono"
                style={{ borderColor: theme.borderSubtle }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Button CTA Text
              </label>
              <input
                type="text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none"
                style={{ borderColor: theme.borderSubtle }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Highlight Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border text-white text-sm focus:outline-none font-sans"
              style={{ borderColor: theme.borderSubtle }}
            />
          </div>

          {/* Features Dynamic List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase text-slate-300">
                Plan Features / Inclusions
              </label>
              <button
                type="button"
                onClick={addFeatureRow}
                className="text-xs font-mono flex items-center space-x-1"
                style={{ color: theme.primary }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet Point</span>
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {formData.features.map((feat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature #${index + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border text-white text-xs focus:outline-none"
                    style={{ borderColor: theme.borderSubtle }}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureRow(index)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4 items-center pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_popular"
                checked={formData.is_popular}
                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: theme.primary }}
              />
              <label htmlFor="is_popular" className="text-xs font-mono text-slate-300 cursor-pointer">
                Highlight as Popular Tier
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="plan_is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: theme.primary }}
              />
              <label htmlFor="plan_is_active" className="text-xs font-mono text-slate-300 cursor-pointer">
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
              <span>{submitting ? 'Saving...' : 'Save Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
