import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SHARED = `@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
.gbg{background-image:linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px);background-size:60px 60px;}
.scan{background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(16,185,129,0.02) 2px,rgba(16,185,129,0.02) 4px);}
.cc::before,.cc::after{content:'';position:absolute;width:12px;height:12px;border-color:#10b981;border-style:solid;}
.cc::before{top:0;left:0;border-width:2px 0 0 2px;} .cc::after{bottom:0;right:0;border-width:0 2px 2px 0;}
.inp:focus{box-shadow:0 0 0 1px #10b981,0 0 15px rgba(16,185,129,0.2);outline:none;}
@keyframes typing{0%,60%,100%{opacity:1}30%{opacity:0}}
.dot1{animation:typing 1.4s infinite 0s}
.dot2{animation:typing 1.4s infinite 0.2s}
.dot3{animation:typing 1.4s infinite 0.4s}
@keyframes pulse-ring{0%{transform:scale(0.8);opacity:0.8}100%{transform:scale(1.4);opacity:0}}
.pulse-ring{animation:pulse-ring 2s ease-out infinite;}`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "What should I eat for breakfast to control blood pressure?",
  "I feel dizzy, what should I do?",
  "Remind me about my medication side effects",
  "What gentle exercises are good for my joints?",
  "How much water should I drink daily?",
  "I'm feeling lonely today, can we talk?",
];

export default function AICompanion() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello${profile?.full_name ? ', ' + profile.full_name.split(' ')[0] : ''}! 👋 I'm CARE-AI, your personal health companion. I'm here to help you with health tips, medication reminders, and friendly conversation. How are you feeling today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      // ✅ Call your Supabase Edge Function — NOT Anthropic directly
      const { data, error } = await supabase.functions.invoke('ai-companion', {
        body: { messages: conversationHistory },
      });

      if (error) throw error;

      const reply = data?.reply || 'I apologize, I could not process that. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);

    } catch (err) {
      console.error('ai-companion error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please check your connection and try again.',
        timestamp: new Date(),
      }]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Hello again${profile?.full_name ? ', ' + profile.full_name.split(' ')[0] : ''}! Chat cleared. How can I help you today?`,
      timestamp: new Date(),
    }]);
  };

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }} className="min-h-screen bg-[#050810] text-white flex flex-col">
      <style>{SHARED}</style>
      <div className="fixed inset-0 gbg scan pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto w-full p-6 flex flex-col" style={{ height: '100vh' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full pulse-ring" style={{ background: 'rgba(16,185,129,0.2)' }} />
              <div className="w-14 h-14 rounded-xl flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg,#10b981,#00d4ff)' }}>
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050810] bg-[#10b981] animate-pulse" />
            </div>
            <div>
              <div className="text-[#10b981]/60 text-[10px] tracking-widest mb-0.5" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// AI_COMPANION</div>
              <h1 style={{ fontFamily: "'Orbitron', sans-serif" }} className="text-2xl font-black text-white">
                CARE<span className="text-[#10b981]">-AI</span>
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[10px] text-[#10b981]" style={{ fontFamily: "'Share Tech Mono', monospace" }}>ONLINE · READY TO HELP</span>
              </div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 border border-[#10b981]/20 rounded-lg text-[#8892a4] hover:text-[#10b981] hover:border-[#10b981]/40 transition-all text-xs"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <RefreshCw className="w-3 h-3" /> CLEAR
          </motion.button>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,0.2) transparent' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-[#10b981] to-[#00d4ff]'
                    : 'bg-gradient-to-br from-[#7c3aed] to-[#00d4ff]'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                </div>

                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`relative px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-[#0a0f1e] border border-[#10b981]/20 text-white'
                      : 'text-white border border-[#7c3aed]/30'
                  }`}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(0,212,255,0.1))' } : {}}>
                    {msg.role === 'assistant' && (
                      <Sparkles className="w-3 h-3 text-[#10b981] absolute -top-1.5 -left-1.5" />
                    )}
                    {msg.content}
                  </div>
                  <div className="text-[10px] text-[#8892a4] px-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10b981] to-[#00d4ff] flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="px-4 py-4 rounded-xl bg-[#0a0f1e] border border-[#10b981]/20 flex items-center gap-1.5">
                <span className="dot1 w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="dot2 w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="dot3 w-2 h-2 rounded-full bg-[#10b981]" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 shrink-0">
            <div className="text-[10px] text-[#10b981]/50 mb-2 tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// QUICK_QUESTIONS</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q, i) => (
                <motion.button key={i} whileHover={{ scale: 1.03, borderColor: '#10b981' }} whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#10b981]/20 text-[#8892a4] hover:text-[#10b981] bg-[#0a0f1e]/60 transition-all text-left"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative flex gap-3 items-center p-4 border border-[#10b981]/20 rounded-xl bg-[#0a0f1e]/90 shrink-0 cc">
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask me anything about your health..."
            disabled={loading}
            className="inp flex-1 bg-transparent text-white text-sm placeholder-[#8892a4] transition-all"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 400 }} />
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-30 transition-all"
            style={{ background: 'linear-gradient(135deg,#10b981,#00d4ff)' }}>
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </motion.div>

        <p className="text-center text-[10px] text-[#8892a4] mt-2 shrink-0" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
          CARE-AI provides wellness guidance only · Always consult a real doctor for medical decisions
        </p>
      </div>
    </div>
  );
}