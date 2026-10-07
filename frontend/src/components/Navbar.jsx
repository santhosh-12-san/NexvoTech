import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, ShieldCheck, Menu, X, ArrowUpRight, Lock, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import RotatingColorCircle from './RotatingColorCircle';
import SoundEngine from '../utils/soundEffects';
import MagneticButton from './MagneticButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => SoundEngine.isEnabled());

  const { isAuthenticated, user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Core Features', href: '#features' },
    { name: 'About Nexvo', href: '#about' },
    { name: 'Pricing Tiers', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact Inquiry', href: '#contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
      style={{
        backgroundColor: scrolled ? `${theme.bg}dd` : 'transparent',
        borderBottom: scrolled ? `1px solid ${theme.borderSubtle}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo - Clicking returns to starting page */}
          <Link
            to="/"
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center space-x-3 group cursor-pointer"
            title="Nexvo Technology - Return to Top"
          >
            <div
              className="relative flex items-center justify-center w-10 h-10 rounded-xl p-[1px] transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 15px -3px ${theme.glowColor}`,
              }}
            >
              <div
                className="w-full h-full rounded-[11px] flex items-center justify-center transition"
                style={{ backgroundColor: theme.surface }}
              >
                <Cpu
                  className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500"
                  style={{ color: theme.primary }}
                />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-white transition">
                NEXVO
              </span>
              <span
                className="ml-1 text-xs uppercase tracking-widest font-mono font-medium"
                style={{ color: theme.primary }}
              >
                TECH
              </span>
            </div>
          </Link>

          {/* Clean Navigation Links (No pill buttons here) */}
          {isHome ? (
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors tracking-wide"
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium text-slate-300 hover:text-white transition"
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
              >
                &larr; Back to Main Website
              </Link>
            </nav>
          )}

          {/* Right Action buttons Area */}
          <div className="flex items-center space-x-3">
            {/* Authenticated Admin Status Badge (Only shown if already logged in) */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/admin-dashboard"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition"
                  style={{
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                    color: theme.badgeText,
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin: {user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* GET STARTED CTA Button */}
            {isHome && (
              <MagneticButton
                as="a"
                href="#contact"
                strength={0.5}
                fieldRadius={100}
                playSound={false}
                className="magnetic-shimmer overflow-hidden relative hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors duration-300 rounded-xl active:scale-95 group shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  boxShadow: `0 0 20px -5px ${theme.glowColor}`,
                }}
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            )}

            {/* Cyberpunk Audio Toggle */}
            <button
              onClick={() => {
                const nextState = SoundEngine.toggle();
                setSoundOn(nextState);
              }}
              className="p-2 rounded-xl bg-slate-900/80 border text-slate-400 hover:text-white transition group cursor-pointer"
              style={{ borderColor: soundOn ? theme.primary : theme.borderSubtle }}
              title={soundOn ? "Sci-Fi Sound FX Active (Click to Mute)" : "Muted (Click to enable Sci-Fi Audio)"}
              aria-label="Toggle Sci-Fi Audio Effects"
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4" style={{ color: theme.primary }} />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* ROTATING SMALL CIRCLE ONLY ON THE VERY RIGHT LAST SPOT */}
            <RotatingColorCircle />

            {/* Mobile hamburger button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden px-4 pt-3 pb-6 border-b transition-colors"
          style={{
            backgroundColor: `${theme.bg}fa`,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="space-y-3 pt-2">
            {isHome &&
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-900/50 rounded-xl"
                >
                  {link.name}
                </a>
              ))}


            {/* Mobile Audio Toggle Row */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-xs font-mono uppercase text-slate-400 font-semibold">
                  Sci-Fi Sound FX:
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: soundOn ? '#10b981' : '#94a3b8' }}>
                  {soundOn ? 'ACTIVE (AUDIBLE)' : 'MUTED'}
                </span>
              </div>
              <button
                onClick={() => {
                  const nextState = SoundEngine.toggle();
                  setSoundOn(nextState);
                }}
                className="p-2 rounded-xl bg-slate-900 border text-slate-300 hover:text-white"
                style={{ borderColor: soundOn ? theme.primary : theme.borderSubtle }}
                title="Toggle Sound Effects"
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            {/* Mobile Color Switcher Row */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-xs font-mono uppercase text-slate-400 font-semibold">
                  Theme Color Dial:
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: theme.primary }}>
                  {theme.name}
                </span>
              </div>
              <RotatingColorCircle />
            </div>

            {isAuthenticated && (
              <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
                <Link
                  to="/admin-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-mono"
                  style={{
                    backgroundColor: theme.badgeBg,
                    color: theme.badgeText,
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dashboard ({user?.username})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-mono text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
