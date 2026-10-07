import React from 'react';
import { Star, ShieldCheck, Quote, Terminal, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Card3DTilt from './Card3DTilt';

export default function Testimonials() {
  const { theme } = useTheme();

  const reviews = [
    {
      name: 'Dr. Evelyn Morales',
      role: 'VP of Autonomous Systems, Hyperion Dynamics',
      quote:
        'Migrating our perception pipelines to Nexvo reduced our edge inference latency from 18ms to under 1.4ms. The architectural resilience in distributed environments is second to none.',
      rating: 5,
      avatar: 'EM',
    },
    {
      name: 'David K. Thorne',
      role: 'Chief Technology Officer, Synthetix AI Labs',
      quote:
        'Nexvo Technology delivers the exact bridge between human engineering governance and bleeding-edge foundation models. Our deployment velocity spiked 4x in the first quarter.',
      rating: 5,
      avatar: 'DT',
    },
    {
      name: 'Aria Takahashi',
      role: 'Head of Infrastructure, Orbit Data Systems',
      quote:
        'Zero downtime model weight updates across 300 global edge points without breaking websocket connections. It completely revolutionized our real-time streaming operations.',
      rating: 5,
      avatar: 'AT',
    },
  ];

  const trustLogos = [
    { name: 'SOC2 TYPE II CERTIFIED', icon: ShieldCheck },
    { name: 'ISO 27001 COMPLIANT', icon: Cpu },
    { name: 'HIPAA READY', icon: Terminal },
    { name: 'POST-QUANTUM CRYPTO', icon: ShieldCheck },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-28 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border transition-all"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.badgeText,
            }}
          >
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>ENTERPRISE REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Trusted by Leaders in{' '}
            <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              High-Stakes AI
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg">
            Engineering teams deploying mission-critical intelligence rely on Nexvo Technology.
          </p>
        </div>

        {/* Review Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((rev, idx) => (
            <Card3DTilt key={idx} className="h-full">
              <div
                className="glass-panel glass-panel-hover rounded-2xl p-8 relative flex flex-col justify-between group h-full"
                style={{
                  backgroundColor: `${theme.surface}90`,
                  borderColor: theme.borderSubtle,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.borderHover;
                  e.currentTarget.style.boxShadow = `0 10px 30px -10px ${theme.glowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.borderSubtle;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-1 text-yellow-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400" />
                      ))}
                    </div>
                    <Quote
                      className="w-6 h-6 transition-colors opacity-40 group-hover:opacity-80"
                      style={{ color: theme.primary }}
                    />
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{rev.quote}"
                  </p>
                </div>

                <div
                  className="pt-4 border-t flex items-center space-x-3"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <div
                    className="w-10 h-10 rounded-full p-[1px] shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      boxShadow: `0 0 10px -2px ${theme.glowColor}`,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold font-mono"
                      style={{
                        backgroundColor: theme.bg,
                        color: theme.primary,
                      }}
                    >
                      {rev.avatar}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white transition-colors">
                      {rev.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{rev.role}</p>
                  </div>
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div
          className="pt-8 border-t"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustLogos.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border text-slate-400 font-mono text-xs transition"
                  style={{
                    backgroundColor: `${theme.surface}60`,
                    borderColor: theme.borderSubtle,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.borderSubtle;
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
