import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const phone = '919113233351';
  const defaultText = encodeURIComponent('Hello Nexvo Technology, I would like to inquire about your services.');
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultText}`;

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct message on WhatsApp (+91 91132 33351)"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        style={{
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.45)',
        }}
      >
        {/* Pulse beacon rings */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageSquare className="w-6 h-6 fill-current relative z-10" />

        {/* Floating tooltip */}
        <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900/95 border border-slate-700/80 px-3.5 py-1.5 text-xs font-mono font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md">
          💬 Chat on WhatsApp (+91 91132 33351)
        </span>
      </a>
    </aside>
  );
}
