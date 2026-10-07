import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { ApiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Card3DTilt from './Card3DTilt';
import SoundEngine from '../utils/soundEffects';

const fallbackPlans = [
  {
    id: 1,
    plan_name: 'Starter Neural',
    price: '$49',
    billing_period: '/mo',
    description: 'Ideal for ambitious startups and agile engineering squads exploring AI integration.',
    features: [
      'Up to 250,000 monthly API inferences',
      'Dual-cluster neural acceleration',
      'Community Discord & standard support',
      'REST & GraphQL endpoints access',
      'Standard 99.9% uptime SLA',
    ],
    is_popular: false,
    cta_text: 'Start Starter Trial',
  },
  {
    id: 2,
    plan_name: 'Enterprise Quantum',
    price: '$149',
    billing_period: '/mo',
    description: 'Engineered for high-throughput production workloads needing custom models and speed.',
    features: [
      'Up to 2,500,000 monthly API inferences',
      'Dedicated GPU nodes & zero cold starts',
      'Custom model fine-tuning weights pipeline',
      'Priority 24/7 technical architect support',
      'Enterprise 99.99% uptime guarantee',
      'Comprehensive compliance and audit logs',
    ],
    is_popular: true,
    cta_text: 'Launch Quantum Tier',
  },
  {
    id: 3,
    plan_name: 'Apex Sovereign',
    price: '$499',
    billing_period: '/mo',
    description: 'Full sovereign AI infrastructure with custom private cloud hosting and dedicated research engineers.',
    features: [
      'Unlimited high-speed neural executions',
      'On-premise or private VPC edge deployment',
      'Dedicated Solutions Engineer & Slack channel',
      'Custom fine-tuned foundation models',
      'Tailored hardware & custom SLA agreements',
      'SOC2 Type II, HIPAA & GDPR compliance ready',
    ],
    is_popular: false,
    cta_text: 'Schedule Executive Demo',
  },
];

export default function Pricing({ onSelectPlan }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getPricing();
      if (Array.isArray(data) && data.length > 0) {
        setPlans(data);
      } else {
        setPlans(fallbackPlans);
      }
    } catch (err) {
      console.warn('Backend not responding yet, displaying default seed plans:', err);
      setPlans(fallbackPlans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleChoose = (plan) => {
    SoundEngine.playBeep(880, 0.1);
    if (onSelectPlan) {
      onSelectPlan(plan.plan_name);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="pricing"
      className="relative py-28 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Background glow elements */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] blur-[150px] pointer-events-none rounded-full opacity-20 transition-all duration-700"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border transition-all"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.badgeText,
            }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>TRANSPARENT SCALE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Enterprise-Grade{' '}
            <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Pricing Architecture
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Predictable resource pricing with zero surprise inference overages. Styled in {theme.name} palette.
          </p>
        </div>

        {/* Pricing Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <Card3DTilt key={plan.id || idx} className="h-full">
              <div
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between h-full ${
                  plan.is_popular
                    ? 'lg:-translate-y-3 shadow-2xl'
                    : 'glass-panel glass-panel-hover'
                }`}
                style={{
                  backgroundColor: plan.is_popular ? `${theme.surface}f0` : `${theme.surface}90`,
                  borderColor: plan.is_popular ? theme.primary : theme.borderSubtle,
                  borderWidth: plan.is_popular ? '2px' : '1px',
                  boxShadow: plan.is_popular ? `0 0 35px -5px ${theme.glowColor}` : 'none',
                }}
              >
              {plan.is_popular && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-mono font-bold tracking-wider uppercase flex items-center space-x-1.5 shadow-lg bg-gradient-to-r ${theme.btnGradient}`}
                  style={{ boxShadow: `0 0 20px -3px ${theme.glowColor}` }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MOST POPULAR ENTERPRISE</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {plan.plan_name}
                  </h3>
                  {plan.is_popular && (
                    <ShieldCheck className="w-5 h-5" style={{ color: theme.primary }} />
                  )}
                </div>

                <p className="text-sm text-slate-400 min-h-[40px] mb-6">
                  {plan.description}
                </p>

                <div className="flex items-baseline mb-8">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2 font-mono text-sm">
                    {plan.billing_period || '/mo'}
                  </span>
                </div>

                {/* Features List */}
                <div
                  className="pt-6 border-t space-y-3 mb-8"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <p
                    className="text-xs font-mono uppercase tracking-wider font-semibold"
                    style={{ color: theme.primary }}
                  >
                    Tier Inclusions:
                  </p>
                  {(Array.isArray(plan.features) ? plan.features : []).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-3 text-sm text-slate-300">
                      <div
                        className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: theme.badgeBg,
                          borderColor: theme.badgeBorder,
                        }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: theme.primary }} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleChoose(plan)}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 group ${
                    plan.is_popular
                      ? `bg-gradient-to-r ${theme.btnGradient} text-white shadow-lg active:scale-98`
                      : 'bg-slate-900 border text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                  style={{
                    borderColor: plan.is_popular ? 'transparent' : theme.borderSubtle,
                    boxShadow: plan.is_popular ? `0 8px 25px -5px ${theme.glowColor}` : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.is_popular) {
                      e.currentTarget.style.borderColor = theme.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.is_popular) {
                      e.currentTarget.style.borderColor = theme.borderSubtle;
                    }
                  }}
                >
                  <span>{plan.cta_text || 'Select Tier'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2 font-mono">
                  Instant activation &bull; Cancel anytime
                </p>
              </div>
            </div>
          </Card3DTilt>
        ))}
      </div>
      </div>
    </section>
  );
}
