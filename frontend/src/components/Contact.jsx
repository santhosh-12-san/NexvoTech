import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, User, MessageSquare, Sparkles, MapPin, Phone } from 'lucide-react';
import { ApiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Card3DTilt from './Card3DTilt';
import SoundEngine from '../utils/soundEffects';

export default function Contact({ selectedPlan }) {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    responseMsg: '',
    whatsappUrl: '',
  });

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        subject: `Inquiry Regarding ${selectedPlan} Plan`,
      }));
    }
  }, [selectedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null, responseMsg: '', whatsappUrl: '' });

    try {
      const res = await ApiService.submitContact(formData);
      SoundEngine.playSuccess();
      setStatus({
        submitting: false,
        success: true,
        error: null,
        responseMsg: res.message || 'Your inquiry has been successfully transmitted to Nexvo AI Specialists.',
        whatsappUrl: res.whatsapp_url || `https://wa.me/919113233351?text=${encodeURIComponent(`Hi Nexvo Technology, I just submitted an inquiry regarding ${formData.subject || 'Enterprise AI'} (${formData.full_name})`)}`,
      });
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Submission failed:', err);
      SoundEngine.playBeep(320, 0.15, 'sawtooth');
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.email?.[0] ||
        'Unable to send inquiry right now. Please ensure all fields are valid.';
      setStatus({
        submitting: false,
        success: false,
        error: errMsg,
        responseMsg: '',
        whatsappUrl: '',
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Background radial gradients */}
      <div
        className="absolute top-1/2 right-1/4 w-[600px] h-[600px] blur-[160px] pointer-events-none rounded-full opacity-15 transition-all duration-700"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-10 left-1/4 w-[600px] h-[600px] blur-[160px] pointer-events-none rounded-full opacity-15 transition-all duration-700"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Contact Details */}
          <div className="lg:col-span-5">
            <div
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border transition-all"
              style={{
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
                color: theme.badgeText,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>DIRECT DISPATCH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Initiate Neural{' '}
              <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Collaboration
              </span>
            </h2>

            <p className="mt-4 text-slate-400 text-base leading-relaxed font-sans">
              Have questions regarding our enterprise architecture, custom foundation models, or bespoke edge deployment? Fill out the inquiry protocol below and our executive engineering team will respond within 4 hours.
            </p>

            <div className="mt-8 space-y-4">
              <div
                className="flex items-center space-x-4 p-4 rounded-2xl border transition"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                    color: theme.primary,
                  }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Direct Email</div>
                  <div className="text-sm font-semibold text-white">contact@nexvotechnology.com</div>
                </div>
              </div>

              <div
                className="flex items-center space-x-4 p-4 rounded-2xl border transition"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                    color: theme.secondary,
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Global HQ</div>
                  <div className="text-sm font-semibold text-white">Quantum Tower, Silicon Apex &bull; Tech Hub</div>
                </div>
              </div>

              <a
                href="https://wa.me/919113233351"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-2xl border transition group hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
                title="Send a direct message on WhatsApp"
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                    color: theme.accent,
                  }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
                    <span>Priority Line / WhatsApp</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-medium flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Direct Message</span>
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center space-x-2">
                    <span>+91 91132 33351</span>
                    <span className="text-xs font-mono text-slate-400 font-normal">(Click to chat)</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form with 3D Tilt */}
          <div className="lg:col-span-7">
            <Card3DTilt maxTilt={5}>
              <div
                className="rounded-3xl p-8 sm:p-10 border shadow-2xl relative"
                style={{
                  backgroundColor: `${theme.surface}e6`,
                  borderColor: theme.borderSubtle,
                  boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px -5px ${theme.glowColor}`,
                }}
              >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                <span>Submit Transmission</span>
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.primary }}
                />
              </h3>
              <p className="text-sm text-slate-400 mb-6 font-sans">
                Direct POST ingestion to our PostgreSQL backend via Django REST Framework.
              </p>

              {/* Success Notification with direct WhatsApp follow-up */}
              {status.success && (
                <div className="mb-6 p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm animate-fade-in shadow-xl">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-white text-base">Transmission Delivered!</strong>
                      <span className="text-emerald-300/90 text-xs sm:text-sm">{status.responseMsg}</span>
                    </div>
                  </div>
                  {status.whatsappUrl && (
                    <a
                      href={status.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <span>💬 Chat on WhatsApp</span>
                    </a>
                  )}
                </div>
              )}

              {/* Error Notification */}
              {status.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 flex items-start space-x-3 text-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-white">Transmission Error:</strong>
                    <span>{status.error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Anti-spam honeypot (hidden from human visitors) */}
                <input
                  type="text"
                  name="hp_token"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.hp_token || ''}
                  onChange={handleChange}
                  className="hidden pointer-events-none"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="full_name"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Dr. Jordan Hayes"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition"
                        style={{ borderColor: theme.borderSubtle }}
                        onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                        onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                      Corporate Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jordan@enterprise.ai"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition"
                        style={{ borderColor: theme.borderSubtle }}
                        onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                        onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone / WhatsApp Field */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2 flex items-center justify-between">
                    <span>Phone / WhatsApp Number</span>
                    <span className="text-[11px] font-sans text-slate-400 font-normal">Optional &bull; For direct WhatsApp dispatch</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 91132 33351 or mobile number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition"
                      style={{ borderColor: theme.borderSubtle }}
                      onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                      onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Enterprise Quantum Deployment Architecture"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition"
                    style={{ borderColor: theme.borderSubtle }}
                    onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                    onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                    Project Specs &amp; Requirements *
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Outline your throughput expectations, models, or integration queries..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition resize-none"
                      style={{ borderColor: theme.borderSubtle }}
                      onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                      onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status.submitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r ${theme.btnGradient} active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-60 shadow-lg`}
                  style={{
                    boxShadow: `0 10px 30px -5px ${theme.glowColor}`,
                  }}
                >
                  {status.submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Payload...</span>
                    </div>
                  ) : (
                    <>
                      <span>Transmit Inquiry Payload</span>
                      <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </Card3DTilt>
        </div>
        </div>
      </div>
    </section>
  );
}
