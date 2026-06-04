'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const SUGGESTIONS = [
  'What does Ben do?',
  'Tell me about his AI work',
  'What are his best projects?',
  'What tech does he use?',
];

let idCounter = 0;
const nextId = () => `${Date.now()}-${idCounter++}`;

/* Tiny, safe markdown renderer: **bold**, `code`, [text](url), and "- " lists. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2]) nodes.push(<strong key={`${keyPrefix}-b${i}`} className="font-semibold text-white">{m[2]}</strong>);
    else if (m[4]) nodes.push(<code key={`${keyPrefix}-c${i}`} className="rounded bg-slate-700/70 px-1 py-0.5 font-mono text-[0.8em] text-cyan-300">{m[4]}</code>);
    else if (m[6] && m[7]) nodes.push(<a key={`${keyPrefix}-a${i}`} href={m[7]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline decoration-cyan-400/40 underline-offset-2 hover:text-cyan-300">{m[6]}</a>);
    last = regex.lastIndex;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Markdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} className="my-1 list-disc space-y-0.5 pl-4">
          {list.map((li, i) => <li key={i}>{renderInline(li, `${key}-${i}`)}</li>)}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      list.push(trimmed.replace(/^[-*]\s+/, ''));
    } else {
      flushList(`ul-${i}`);
      if (trimmed) blocks.push(<p key={`p-${i}`} className="my-0.5">{renderInline(trimmed, `p-${i}`)}</p>);
    }
  });
  flushList('ul-end');
  return <div className="space-y-1">{blocks}</div>;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      text: "Hey! 👋 I'm Ben's AI assistant. Ask me anything about his **projects**, **skills**, or experience!",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Allow the command palette (or anything) to open the chat.
  useEffect(() => {
    const open = () => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 200); };
    window.addEventListener('open-chatbot', open);
    return () => window.removeEventListener('open-chatbot', open);
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const history = messages;
    const userMessage: Message = { id: nextId(), text: trimmed, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botId = nextId();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, conversationHistory: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }

      // Stream tokens into a single growing bot message.
      setMessages((prev) => [...prev, { id: botId, text: '', sender: 'bot' }]);
      setIsLoading(false);
      setStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: acc } : m)));
      }
      if (!acc.trim()) {
        setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: "Hmm, I couldn't generate a response. Try asking about Ben's projects!" } : m)));
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== botId),
        { id: nextId(), text: 'Sorry, I hit an error reaching the AI. Please try again in a moment!', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
      setStreaming(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const showSuggestions = messages.length === 1 && !isLoading;

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        data-cursor="hover"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-2xl shadow-cyan-500/40"
        whileHover={{ scale: 1.12, boxShadow: '0 0 40px rgba(34,211,238,0.6)' }}
        whileTap={{ scale: 0.94 }}
        aria-label="Chat with AI assistant"
      >
        {/* Pulse ring */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-cyan-400/40"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.svg className="relative h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ rotate: isOpen ? 90 : 0 }}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </motion.svg>
      </motion.button>

      {/* Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="fixed bottom-24 right-4 z-40 flex h-[30rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500/90 to-indigo-500/90 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15 text-lg">
                  🤖
                  <span className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full border-2 border-cyan-500 bg-emerald-400" />
                </span>
                <div className="leading-tight">
                  <h3 className="font-bold">Ben&apos;s AI Assistant</h3>
                  <p className="text-[11px] text-cyan-50/80">{streaming ? 'typing…' : 'Online · ask me anything'}</p>
                </div>
              </div>
              <motion.button onClick={() => setIsOpen(false)} whileHover={{ scale: 1.2, rotate: 90 }} className="rounded p-1 transition hover:bg-white/20" aria-label="Close chat">✕</motion.button>
            </div>

            {/* Messages */}
            <div className="scroll-slim flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'rounded-br-sm bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg'
                        : 'rounded-bl-sm border border-slate-700/50 bg-slate-800/80 text-slate-100'
                    }`}
                  >
                    {msg.sender === 'bot' ? <Markdown text={msg.text || '…'} /> : msg.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-1.5 pl-2">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full bg-cyan-400" animate={{ y: [0, -7, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
                  ))}
                </div>
              )}

              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t border-slate-700/50 bg-slate-900/60 p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything…"
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-slate-600/50 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white transition disabled:opacity-40"
                  aria-label="Send"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-slate-600">Powered by GPT-4o · streamed live</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
