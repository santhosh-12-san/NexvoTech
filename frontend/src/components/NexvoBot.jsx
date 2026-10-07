import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import SoundEngine from '../utils/soundEffects';
import MagneticButton from './MagneticButton';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowUpRight,
  PhoneCall,
  Minimize2,
  ChevronRight
} from 'lucide-react';

const KNOWLEDGE_BASE = [
  {
    keywords: ['service', 'features', 'what do you do', 'offer', 'capabilities'],
    answer: "Nexvo Technology provides enterprise cognitive infrastructure, including:\n• Sub-millisecond Edge Neural Inference\n• High-throughput Django REST Framework APIs\n• Custom Foundation Model Auto-Tuning\n• Zero-knowledge privacy pipelines\n\nWould you like to explore our Core Features or discuss a custom architecture?"
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'tier', 'subscription'],
    answer: "We offer flexible subscription plans tailored to enterprise scale:\n• Starter Neural: For agile startups & edge experiments\n• Pro Quantum: Dedicated GPU capacity & sub-10ms latency\n• Enterprise AI: Sovereign on-premise clusters with custom SLA\n\nCheck out our Pricing section or connect with our architects directly on WhatsApp (+91 91132 33351)."
  },
  {
    keywords: ['contact', 'whatsapp', 'phone', 'call', 'reach', 'email'],
    answer: "You can reach our engineering team directly via:\n• Direct WhatsApp Chat: +91 91132 33351 (Immediate)\n• Corporate Email: contact@nexvotechnology.com\n• Or submit your requirements in our Inquiry Portal below!"
  },
  {
    keywords: ['tech', 'stack', 'three', 'django', 'react', 'python', 'architecture'],
    answer: "Nexvo Technology is engineered with a modern full-stack stack:\n• Backend: Django 5 + Django REST Framework + PostgreSQL + SimpleJWT\n• Frontend: React 18 + Vite + Tailwind CSS + Three.js / R3F\n• Micro-benchmarking: Sub-millisecond tensor serialization."
  }
];

export default function NexvoBot() {
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Greetings! I am the Nexvo Neural Intelligence Assistant. How can I assist your enterprise architecture today?",
      time: 'Just now',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    SoundEngine.playBeep(isOpen ? 600 : 900, 0.08);
    setIsOpen(!isOpen);
  };

  const handleSend = (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!text.trim()) return;

    SoundEngine.playBlip(1100);
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot cognitive lookup
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matched = KNOWLEDGE_BASE.find((k) =>
        k.keywords.some((w) => lower.includes(w))
      );

      const botReply = matched
        ? matched.answer
        : `Thank you for your inquiry regarding "${text.slice(0, 50)}". Our AI specialists can provide a customized architecture blueprint for your exact needs. You can chat directly with our engineers on WhatsApp (+91 91132 33351) or submit the contact form below.`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsTyping(false);
      SoundEngine.playBeep(720, 0.07);
    }, 600);
  };

  return (
    <aside aria-label="Nexvo AI Assistant" className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button (when collapsed) */}
      {!isOpen && (
        <div className="flex items-center space-x-3">
          {/* Quick WhatsApp Pill */}
          <a
            href="https://wa.me/919113233351"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp message"
            className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WhatsApp (+91 91132 33351)</span>
          </a>

          {/* Assistant Trigger Button */}
          <MagneticButton
            as="button"
            onClick={handleToggle}
            aria-label="Open Nexvo AI Assistant"
            strength={0.55}
            fieldRadius={90}
            playSound={false}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl transition-colors duration-300 active:scale-95 focus:outline-none cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 8px 30px -4px ${theme.glowColor}`,
            }}
          >
            <span
              className="absolute -inset-1 rounded-full opacity-40 animate-ping pointer-events-none"
              style={{ backgroundColor: theme.primary }}
            />
            <Bot className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-12" />
          </MagneticButton>
        </div>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div
          className="w-[92vw] sm:w-[380px] h-[520px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-fade-in"
          style={{
            backgroundColor: `${theme.surface}f5`,
            borderColor: theme.borderSubtle,
            boxShadow: `0 20px 50px -10px rgba(0,0,0,0.9), 0 0 35px -5px ${theme.glowColor}`,
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: theme.borderSubtle }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-white flex items-center space-x-1.5">
                  <span>NEXVO ASSISTANT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400 font-sans">
                  Active Neural Agent &bull; 24/7 Available
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <a
                href="https://wa.me/919113233351"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/40 transition"
                title="Open WhatsApp directly"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Minimize Assistant"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Chips Row */}
          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
            <button
              onClick={() => handleSend("What AI services do you offer?")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap transition cursor-pointer"
            >
              ⚡ Services
            </button>
            <button
              onClick={() => handleSend("What are the pricing tiers?")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 whitespace-nowrap transition cursor-pointer"
            >
              💰 Pricing
            </button>
            <a
              href="https://wa.me/919113233351"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 whitespace-nowrap transition cursor-pointer flex items-center space-x-1"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs select-text">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r text-white rounded-br-none shadow-md font-medium'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800/80 rounded-bl-none shadow-md'
                  }`}
                  style={{
                    backgroundImage:
                      msg.sender === 'user'
                        ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                        : undefined,
                  }}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950/90 border-t border-slate-800/90 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about Nexvo AI..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white placeholder-slate-500 focus:outline-none transition"
              style={{ borderColor: theme.borderSubtle }}
              onFocus={(e) => (e.target.style.borderColor = theme.primary)}
              onBlur={(e) => (e.target.style.borderColor = theme.borderSubtle)}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl text-white transition disabled:opacity-40 cursor-pointer shadow-md"
              style={{
                backgroundColor: theme.primary,
              }}
              title="Transmit query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
