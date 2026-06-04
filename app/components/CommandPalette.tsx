'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigate' | 'Connect' | 'Actions';
  keywords?: string;
  icon: ReactNode;
  run: () => void;
};

const Icon = ({ d }: { d: string }) => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setCursor(0);
  }, []);

  const scrollTo = useCallback((id: string) => {
    close();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, [close]);

  const openExternal = useCallback((url: string) => {
    close();
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [close]);

  const actions = useMemo<Action[]>(() => [
    { id: 'home', group: 'Navigate', label: 'Go to Home', keywords: 'top hero start', icon: <Icon d="M3 12l9-9 9 9M5 10v10h14V10" />, run: () => scrollTo('home') },
    { id: 'about', group: 'Navigate', label: 'Go to About', keywords: 'bio story', icon: <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />, run: () => scrollTo('about') },
    { id: 'projects', group: 'Navigate', label: 'Go to Work', keywords: 'projects portfolio', icon: <Icon d="M3 7h18M3 7l1.5 12a2 2 0 002 2h11a2 2 0 002-2L21 7M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />, run: () => scrollTo('projects') },
    { id: 'skills', group: 'Navigate', label: 'Go to Skills', keywords: 'tech stack arsenal', icon: <Icon d="M13 10V3L4 14h7v7l9-11h-7z" />, run: () => scrollTo('skills') },
    { id: 'contact', group: 'Navigate', label: 'Go to Contact', keywords: 'reach hire message', icon: <Icon d="M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9-5 9 5" />, run: () => scrollTo('contact') },

    { id: 'chat', group: 'Actions', label: 'Ask the AI assistant', hint: 'chatbot', keywords: 'ai bot question gpt', icon: <Icon d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />, run: () => { close(); setTimeout(() => window.dispatchEvent(new CustomEvent('open-chatbot')), 60); } },
    { id: 'copy', group: 'Actions', label: 'Copy email address', keywords: 'clipboard mail', icon: <Icon d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V13a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-2" />, run: async () => {
      try { await navigator.clipboard.writeText('beneliyahu15@gmail.com'); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { window.location.href = 'mailto:beneliyahu15@gmail.com'; }
    } },
    { id: 'email', group: 'Connect', label: 'Email Ben', hint: 'mailto', keywords: 'mail write contact', icon: <Icon d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, run: () => { close(); window.location.href = 'mailto:beneliyahu15@gmail.com'; } },
    { id: 'github', group: 'Connect', label: 'Open GitHub', keywords: 'code repos', icon: <Icon d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />, run: () => openExternal('https://github.com/BenEliyahu') },
    { id: 'linkedin', group: 'Connect', label: 'Open LinkedIn', keywords: 'profile network', icon: <Icon d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6zM4 9h4v12H4zM6 4a2 2 0 110 4 2 2 0 010-4z" />, run: () => openExternal('https://www.linkedin.com/in/ben-eliyahu/') },
  ], [scrollTo, openExternal, close]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      (a.label + ' ' + (a.keywords ?? '') + ' ' + a.group).toLowerCase().includes(q)
    );
  }, [actions, query]);

  // Open/close via shortcut + custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  useEffect(() => {
    if (cursor >= filtered.length) setCursor(Math.max(0, filtered.length - 1));
  }, [filtered.length, cursor]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(filtered.length - 1, c + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[cursor]?.run(); }
  };

  // Build a flat list with group dividers.
  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh]"
          onMouseDown={close}
        >
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl shadow-black/50"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-slate-800 px-4">
              <svg className="h-5 w-5 shrink-0 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                className="w-full bg-transparent py-4 text-base text-white placeholder-slate-500 outline-none"
              />
              <kbd className="hidden rounded-md border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-slate-500 sm:block">ESC</kbd>
            </div>

            {/* Results */}
            <div className="scroll-slim max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-slate-500">No matching commands.</p>
              )}
              {filtered.map((a, i) => {
                const showGroup = a.group !== lastGroup;
                lastGroup = a.group;
                return (
                  <div key={a.id}>
                    {showGroup && (
                      <div className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        {a.group}
                      </div>
                    )}
                    <button
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => a.run()}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        i === cursor ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/15 text-white ring-1 ring-cyan-400/30' : 'text-slate-300'
                      }`}
                    >
                      <span className={i === cursor ? 'text-cyan-300' : 'text-slate-500'}>{a.icon}</span>
                      <span className="flex-1 text-sm font-medium">{a.label}</span>
                      {a.id === 'copy' && copied && <span className="text-xs text-emerald-400">Copied!</span>}
                      {a.hint && a.id !== 'copy' && <span className="font-mono text-[10px] text-slate-500">{a.hint}</span>}
                      {i === cursor && <kbd className="rounded border border-slate-700 px-1.5 font-mono text-[10px] text-slate-400">↵</kbd>}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="rounded border border-slate-700 px-1 font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-slate-700 px-1 font-mono">↵</kbd> select</span>
              </span>
              <span className="font-mono text-cyan-500/70">Ben Eliyahu · ⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
