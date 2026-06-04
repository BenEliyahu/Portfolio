'use client';

import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

function isMac() {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mac, setMac] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => setMac(isMac()), []);

  // Shrink/solidify nav after a little scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver.
  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const observed = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openPalette = () =>
    window.dispatchEvent(new CustomEvent('open-command-palette'));

  return (
    <>
      {/* Top scroll-progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3"
      >
        <nav
          className={`flex items-center gap-1 sm:gap-2 rounded-2xl border px-3 py-2 transition-all duration-300 ${
            scrolled
              ? 'border-slate-700/60 bg-slate-950/70 backdrop-blur-xl shadow-lg shadow-black/30'
              : 'border-transparent bg-slate-950/20 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => go('home')}
            data-cursor="hover"
            className="group mr-1 flex items-center gap-2 rounded-xl px-2 py-1"
            aria-label="Home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-slate-950 shadow-md shadow-cyan-500/30 transition group-hover:scale-110">
              BE
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => go(link.id)}
                  data-cursor="hover"
                  className={`relative rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active === link.id
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 ring-1 ring-cyan-400/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* ⌘K trigger */}
          <button
            onClick={openPalette}
            data-cursor="hover"
            className="ml-1 hidden items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-500/50 hover:text-white sm:flex"
            aria-label="Open command palette"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <kbd className="font-mono">{mac ? '⌘' : 'Ctrl'} K</kbd>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 grid h-9 w-9 place-items-center rounded-xl border border-slate-700/70 bg-slate-900/60 text-slate-300 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="flex flex-col gap-1">
              <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }} className="block h-0.5 w-5 bg-current" />
              <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block h-0.5 w-5 bg-current" />
              <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0 }} className="block h-0.5 w-5 bg-current" />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed left-4 right-4 top-[4.5rem] z-50 rounded-2xl border border-slate-700/60 bg-slate-950/90 p-3 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.id)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-base font-medium transition ${
                      active === link.id
                        ? 'bg-cyan-500/15 text-white ring-1 ring-cyan-400/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { setMenuOpen(false); openPalette(); }}
                  className="mt-1 w-full rounded-xl border border-slate-700/60 px-4 py-3 text-left text-sm text-slate-400"
                >
                  Open command palette →
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
