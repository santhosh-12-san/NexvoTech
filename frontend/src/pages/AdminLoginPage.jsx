import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, User, Key, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/admin-dashboard';

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await login(username, password);
    setSubmitting(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern transition-colors duration-500"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Background glow auras */}
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] blur-[150px] pointer-events-none rounded-full opacity-20 transition-all duration-700"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] blur-[150px] pointer-events-none rounded-full opacity-20 transition-all duration-700"
        style={{ backgroundColor: theme.secondary }}
      />

      {/* Floating Back to Home button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white px-3.5 py-2 rounded-xl border backdrop-blur-md transition"
        style={{
          backgroundColor: `${theme.surface}90`,
          borderColor: theme.borderSubtle,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.primary)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.borderSubtle)}
      >
        <ArrowLeft className="w-3.5 h-3.5" style={{ color: theme.primary }} />
        <span>Return to Nexvo Portal</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div
          className="rounded-3xl p-8 sm:p-10 border shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor: `${theme.surface}cc`,
            borderColor: theme.borderSubtle,
            boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 35px -5px ${theme.glowColor}`,
          }}
        >
          {/* Header Accent Line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
            }}
          />

          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-4 shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
                color: theme.primary,
                boxShadow: `0 0 20px -3px ${theme.glowColor}`,
              }}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              NEXVO COMMAND MATRIX
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
              Restricted &bull; Staff Authentication Gateway
            </p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div
            className="mb-6 p-3 rounded-xl border flex items-center justify-between text-xs"
            style={{
              backgroundColor: `${theme.bg}b0`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="font-mono text-slate-300">
              <span className="font-bold" style={{ color: theme.primary }}>Demo Seed: </span>
              <span>admin / admin123</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-mono px-2 py-1 rounded border transition"
              style={{
                backgroundColor: theme.badgeBg,
                borderColor: theme.badgeBorder,
                color: theme.badgeText,
              }}
            >
              Autofill
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition"
                  style={{ borderColor: theme.borderSubtle }}
                  onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                  onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                Security Passphrase
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-sm focus:outline-none transition"
                  style={{ borderColor: theme.borderSubtle }}
                  onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                  onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r ${theme.btnGradient} active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-60 shadow-lg`}
              style={{
                boxShadow: `0 8px 25px -5px ${theme.glowColor}`,
              }}
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Decrypting Session...</span>
                </div>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderColor: theme.borderSubtle }}
          >
            <p className="text-[11px] font-mono text-slate-500">
              JWT SimpleJWT Encryption &bull; Mode: {theme.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
