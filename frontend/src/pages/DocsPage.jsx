import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SoundEngine from '../utils/soundEffects';
import RotatingColorCircle from '../components/RotatingColorCircle';
import {
  Cpu,
  ArrowLeft,
  Copy,
  Check,
  Play,
  Terminal,
  Code2,
  Lock,
  Globe,
  Layers,
  Sparkles,
  Phone,
  Search,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
  Activity,
  FileText
} from 'lucide-react';

const ENDPOINTS = [
  {
    id: 'auth-token',
    category: 'Authentication',
    method: 'POST',
    path: '/api/token/',
    title: 'Obtain JWT Access & Refresh Token',
    description: 'Authenticates administrative or enterprise client credentials and returns a pair of HMAC-signed JSON Web Tokens.',
    authRequired: false,
    body: {
      username: 'admin',
      password: 'your_secure_password',
    },
    responseExample: {
      access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@nexvo.tech',
        is_staff: true,
      },
    },
    curl: `curl -X POST https://api.nexvotechnology.com/api/token/ \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "password": "your_password"}'`,
    python: `import requests

res = requests.post("https://api.nexvotechnology.com/api/token/", json={
    "username": "admin",
    "password": "your_password"
})
tokens = res.json()
print("Access Token:", tokens["access"])`,
    javascript: `const res = await fetch("https://api.nexvotechnology.com/api/token/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "your_password" })
});
const data = await res.json();
console.log(data.access);`,
    golang: `package main

import (
    "bytes"
    "net/http"
    "encoding/json"
)

func main() {
    body, _ := json.Marshal(map[string]string{
        "username": "admin",
        "password": "your_password",
    })
    http.Post("https://api.nexvotechnology.com/api/token/", "application/json", bytes.NewBuffer(body))
}`
  },
  {
    id: 'get-features',
    category: 'Core Capabilities',
    method: 'GET',
    path: '/api/features/',
    title: 'List Active Platform Services & Models',
    description: 'Retrieves all active neural features, tensor routing capabilities, and foundation models displayed on the public platform.',
    authRequired: false,
    body: null,
    responseExample: [
      {
        id: 1,
        title: 'Autonomous Neural Networks',
        description: 'Self-learning multi-modal architectures with 99.98% fidelity.',
        icon_name: 'Brain',
        badge: 'Core Engine',
        order: 1,
        is_active: true
      },
      {
        id: 2,
        title: 'Quantum-Speed Microservices',
        description: 'Sub-millisecond latency distributed APIs with zero cold starts.',
        icon_name: 'Zap',
        badge: 'Ultra Low Latency',
        order: 2,
        is_active: true
      }
    ],
    curl: `curl -X GET https://api.nexvotechnology.com/api/features/ \\
  -H "Accept: application/json"`,
    python: `import requests

res = requests.get("https://api.nexvotechnology.com/api/features/")
features = res.json()
print(f"Active Features: {len(features)}")`,
    javascript: `const res = await fetch("https://api.nexvotechnology.com/api/features/");
const features = await res.json();
console.log(features);`,
    golang: `resp, err := http.Get("https://api.nexvotechnology.com/api/features/")`
  },
  {
    id: 'get-pricing',
    category: 'Subscription Tiers',
    method: 'GET',
    path: '/api/pricing/',
    title: 'Retrieve Active Pricing & SLA Tiers',
    description: 'Fetches real-time pricing plans, inference allowances, bullet points, and popular tier recommendations.',
    authRequired: false,
    body: null,
    responseExample: [
      {
        id: 1,
        plan_name: 'Starter Neural',
        price: '$49',
        billing_period: '/mo',
        features: [
          'Up to 250,000 monthly API inferences',
          'Dual-cluster neural acceleration',
          'Standard 99.9% uptime SLA'
        ],
        is_popular: false
      },
      {
        id: 2,
        plan_name: 'Enterprise Quantum',
        price: '$149',
        billing_period: '/mo',
        features: [
          'Up to 2,500,000 monthly API inferences',
          'Dedicated GPU nodes & zero cold starts',
          'Enterprise 99.99% uptime guarantee'
        ],
        is_popular: true
      }
    ],
    curl: `curl -X GET https://api.nexvotechnology.com/api/pricing/`,
    python: `import requests
res = requests.get("https://api.nexvotechnology.com/api/pricing/")
print(res.json())`,
    javascript: `const res = await fetch("https://api.nexvotechnology.com/api/pricing/");
const plans = await res.json();`,
    golang: `resp, err := http.Get("https://api.nexvotechnology.com/api/pricing/")`
  },
  {
    id: 'submit-contact',
    category: 'Leads & Inquiries',
    method: 'POST',
    path: '/api/contact/',
    title: 'Submit Enterprise Inquiry Protocol',
    description: 'Ingests new client inquiries with phone capture, automated email notifications, anti-spam honeypot verification, and direct WhatsApp routing.',
    authRequired: false,
    body: {
      full_name: 'Dr. Jordan Hayes',
      email: 'jordan@enterprise.ai',
      phone: '+91 91132 33351',
      subject: 'Custom Edge AI Deployment',
      message: 'Looking to deploy 500 edge nodes with sub-millisecond inference.'
    },
    responseExample: {
      message: 'Thank you for contacting Nexvo Technology! Our AI specialists will connect with you shortly.',
      whatsapp_url: 'https://wa.me/919113233351?text=Hi%20Nexvo...',
      inquiry: {
        id: 42,
        full_name: 'Dr. Jordan Hayes',
        email: 'jordan@enterprise.ai',
        phone: '+91 91132 33351',
        subject: 'Custom Edge AI Deployment',
        status: 'new',
        created_at: '2026-10-06T12:00:00Z'
      }
    },
    curl: `curl -X POST https://api.nexvotechnology.com/api/contact/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "full_name": "Dr. Jordan Hayes",
    "email": "jordan@enterprise.ai",
    "phone": "+91 91132 33351",
    "subject": "Custom Edge AI Deployment",
    "message": "Looking to deploy 500 edge nodes with sub-millisecond inference."
  }'`,
    python: `import requests

payload = {
    "full_name": "Dr. Jordan Hayes",
    "email": "jordan@enterprise.ai",
    "phone": "+91 91132 33351",
    "subject": "Custom Edge AI Deployment",
    "message": "Looking to deploy 500 edge nodes."
}
res = requests.post("https://api.nexvotechnology.com/api/contact/", json=payload)
print(res.json()["message"])`,
    javascript: `const res = await fetch("https://api.nexvotechnology.com/api/contact/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    full_name: "Dr. Jordan Hayes",
    email: "jordan@enterprise.ai",
    phone: "+91 91132 33351",
    subject: "Custom Edge AI Deployment",
    message: "Looking to deploy 500 edge nodes."
  })
});
const data = await res.json();`,
    golang: `// Go client submission payload`
  },
  {
    id: 'export-csv',
    category: 'Admin Matrix',
    method: 'GET',
    path: '/api/contact/export-csv/',
    title: 'Export Inquiries CSV Stream',
    description: 'Streams a complete UTF-8 formatted CSV spreadsheet of all registered inquiries for external CRM or spreadsheet analytics. Requires staff authentication.',
    authRequired: true,
    body: null,
    responseExample: 'ID,Full Name,Email,Phone,Subject,Status,Submitted At,Message\n1,"Elena Rostova","elena@synapse.io","+91 91132 33351","Edge Consultation","new","2026-10-06 10:00:00","..."',
    curl: `curl -X GET https://api.nexvotechnology.com/api/contact/export-csv/ \\
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"`,
    python: `import requests
headers = {"Authorization": "Bearer <ADMIN_JWT_TOKEN>"}
res = requests.get("https://api.nexvotechnology.com/api/contact/export-csv/", headers=headers)
with open("inquiries.csv", "w") as f:
    f.write(res.text)`,
    javascript: `const res = await fetch("https://api.nexvotechnology.com/api/contact/export-csv/", {
  headers: { "Authorization": "Bearer " + token }
});
const csvData = await res.text();`,
    golang: `// Go CSV export request with Bearer Auth`
  }
];

export default function DocsPage() {
  const { theme } = useTheme();

  const [activeEndpointId, setActiveEndpointId] = useState(ENDPOINTS[0].id);
  const [activeLang, setActiveLang] = useState('curl');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveTesting, setLiveTesting] = useState(false);
  const [liveResponse, setLiveResponse] = useState(null);

  const activeEndpoint = ENDPOINTS.find((e) => e.id === activeEndpointId) || ENDPOINTS[0];

  const filteredEndpoints = ENDPOINTS.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.path.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  });

  const handleCopyCode = (text) => {
    SoundEngine.playBeep(1100, 0.05);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryLive = () => {
    SoundEngine.playBeep(920, 0.1, 'sawtooth');
    setLiveTesting(true);
    setLiveResponse(null);

    // Simulate real-time API call response latency
    setTimeout(() => {
      setLiveResponse({
        status: 200,
        statusText: 'OK',
        latency: `${(Math.random() * 12 + 6).toFixed(1)}ms`,
        data: activeEndpoint.responseExample,
      });
      setLiveTesting(false);
      SoundEngine.playSuccess();
    }, 450);
  };

  const getMethodBadgeColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      case 'POST':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40';
      case 'PATCH':
      case 'PUT':
        return 'bg-indigo-950/80 text-indigo-400 border-indigo-500/40';
      case 'DELETE':
        return 'bg-red-950/80 text-red-400 border-red-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col transition-colors duration-500"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Top Docs Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b py-3 px-4 sm:px-8 flex items-center justify-between"
        style={{
          backgroundColor: `${theme.surface}ea`,
          borderColor: theme.borderSubtle,
        }}
      >
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            onClick={() => SoundEngine.playBlip()}
            className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white transition group py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Platform Home</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="font-bold text-sm tracking-tight text-white">
              NEXVO <span className="font-mono text-xs" style={{ color: theme.primary }}>API DOCS</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              v1.4 Enterprise
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Direct WhatsApp Dev Support */}
          <a
            href="https://wa.me/919113233351?text=Hi%20Nexvo%20Engineering%2C%20I%20have%20an%20API%20integration%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/40 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Dev Support (+91 91132 33351)</span>
          </a>

          <RotatingColorCircle />
        </div>
      </header>

      {/* Main Documentation Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Navigation Sidebar (4 cols) */}
        <aside className="lg:w-72 shrink-0 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border text-xs text-white placeholder-slate-500 focus:outline-none transition"
              style={{ borderColor: theme.borderSubtle }}
            />
          </div>

          {/* Endpoints Nav List */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
              API Endpoints Matrix
            </div>

            <nav className="space-y-1.5">
              {filteredEndpoints.map((ep) => {
                const isSelected = ep.id === activeEndpointId;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      SoundEngine.playBlip(900);
                      setActiveEndpointId(ep.id);
                      setLiveResponse(null);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${theme.surface}e6` : undefined,
                      border: isSelected ? `1px solid ${theme.borderSubtle}` : '1px solid transparent',
                    }}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getMethodBadgeColor(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>
                      <span className="truncate">{ep.path}</span>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Callout */}
          <div
            className="p-4 rounded-2xl border text-xs font-sans space-y-2"
            style={{
              backgroundColor: `${theme.surface}60`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="font-bold text-white flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Base API URL</span>
            </div>
            <code className="block p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 break-all border border-slate-800">
              https://api.nexvotechnology.com
            </code>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard REST architecture with JWT authorization and zero-cold-start edge compute.
            </p>
          </div>
        </aside>

        {/* Center / Right Content Area */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* Endpoint Header Title */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${getMethodBadgeColor(
                  activeEndpoint.method
                )}`}
              >
                {activeEndpoint.method}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
                {activeEndpoint.path}
              </h1>
              {activeEndpoint.authRequired && (
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/60 border border-amber-500/40 text-amber-300">
                  <Lock className="w-3 h-3" />
                  <span>Bearer Token Required</span>
                </span>
              )}
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              {activeEndpoint.description}
            </p>
          </div>

          {/* Request Parameters / Body Table */}
          {activeEndpoint.body && (
            <div
              className="p-5 rounded-2xl border backdrop-blur-md"
              style={{
                backgroundColor: `${theme.surface}80`,
                borderColor: theme.borderSubtle,
              }}
            >
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-3 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                <span>JSON Request Body Parameters</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2 font-semibold">Parameter</th>
                      <th className="pb-2 font-semibold">Type</th>
                      <th className="pb-2 font-semibold">Sample Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {Object.entries(activeEndpoint.body).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-2.5 font-bold" style={{ color: theme.primary }}>
                          {key}
                        </td>
                        <td className="py-2.5 text-slate-400">{typeof val}</td>
                        <td className="py-2.5 text-slate-200">
                          <code>{JSON.stringify(val)}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Code Snippets & Interactive Live Runner Split Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Code language tabs */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['curl', 'python', 'javascript', 'golang'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      SoundEngine.playBlip();
                      setActiveLang(lang);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition ${
                      activeLang === lang
                        ? 'bg-slate-800 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'javascript' ? 'Node.js' : lang}
                  </button>
                ))}
              </div>

              {/* Action Buttons: Try Live & Copy */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTryLive}
                  disabled={liveTesting}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white transition shadow-md active:scale-95 bg-gradient-to-r ${theme.btnGradient}`}
                  style={{ boxShadow: `0 4px 15px -3px ${theme.glowColor}` }}
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${liveTesting ? 'animate-spin' : ''}`} />
                  <span>{liveTesting ? 'Executing...' : 'Try Live Request'}</span>
                </button>

                <button
                  onClick={() => handleCopyCode(activeEndpoint[activeLang] || activeEndpoint.curl)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                  title="Copy code snippet"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="rounded-2xl border border-slate-800 bg-[#020617] overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Request Sample &bull; {activeLang.toUpperCase()}</span>
                <span>Content-Type: application/json</span>
              </div>
              <pre className="p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{activeEndpoint[activeLang] || activeEndpoint.curl}</code>
              </pre>
            </div>

            {/* Live Response Box (Generated when 'Try Live' clicked) */}
            {liveResponse && (
              <div className="rounded-2xl border border-emerald-500/40 bg-[#020617] overflow-hidden shadow-2xl animate-fade-in">
                <div className="px-4 py-2.5 bg-emerald-950/60 border-b border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 font-bold">LIVE RESPONSE: 200 OK</span>
                  </div>
                  <span className="text-emerald-400">Latency: {liveResponse.latency}</span>
                </div>
                <pre className="p-5 text-xs sm:text-sm font-mono text-emerald-200 overflow-x-auto leading-relaxed max-h-72">
                  <code>{JSON.stringify(liveResponse.data, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
