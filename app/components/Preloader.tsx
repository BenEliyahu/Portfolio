'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const NAME = 'BEN ELIYAHU';

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // Only show once per browser session.
    if (typeof window !== 'undefined' && sessionStorage.getItem('preloaded')) {
      setSkip(true);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      setDone(true);
      sessionStorage.setItem('preloaded', '1');
    }, reduce ? 300 : 1900);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  if (skip) return null;

  return (
    <AnimatePresence onExitComplete={() => { document.body.style.overflow = ''; }}>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020817]"
        >
          {/* Pulsing rings */}
          <div className="relative mb-8 grid place-items-center">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-cyan-400/30"
                initial={{ width: 40, height: 40, opacity: 0.8 }}
                animate={{ width: [40, 160], height: [40, 160], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-xl font-black text-slate-950 shadow-lg shadow-cyan-500/40"
            >
              BE
            </motion.div>
          </div>

          {/* Name reveal */}
          <div className="flex overflow-hidden">
            {NAME.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
                className="font-mono text-sm tracking-[0.35em] text-slate-300"
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </div>

          {/* Loading bar */}
          <div className="mt-6 h-[2px] w-40 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              className="h-full w-full bg-gradient-to-r from-cyan-400 to-indigo-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
