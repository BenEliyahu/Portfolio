'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Strava Analyzer',
    description: 'Fitness data analysis platform. Connects to Strava API to visualize training stats, trends, and performance insights.',
    tech: ['Node.js', 'JavaScript', 'Strava API', 'Railway'],
    github: 'https://github.com/BenEliyahu/strava-analyzer',
    live: 'https://strava-analyzer-production.up.railway.app/',
    icon: '🏃',
  },
  {
    id: 2,
    title: 'ChainResource',
    description: 'Tiered caching system using Chain of Responsibility pattern. Fetches exchange rates from memory, file system, or live API — in order of speed.',
    tech: ['C#', '.NET', 'Chain of Responsibility', 'JSON'],
    github: 'https://github.com/BenEliyahu/ChainResource',
    icon: '⛓️',
  },
  {
    id: 3,
    title: 'CV Improver',
    description: 'AI-powered resume enhancement tool. Analyzes your CV and provides smart suggestions to boost your job applications.',
    tech: ['Node.js', 'JavaScript', 'HTML', 'Railway'],
    github: 'https://github.com/BenEliyahu/CV-Improver',
    live: 'https://cv-improver-production.up.railway.app/',
    icon: '📄',
  },
  {
    id: 4,
    title: 'Box Arrangement System',
    description: 'Advanced data structures using Binary Search Trees. Organize items by size & date.',
    tech: ['C#', 'Data Structures', 'BST', 'OOP'],
    github: 'https://github.com/BenEliyahu/Box-Arrangement-System',
    icon: '📦',
  },
  {
    id: 5,
    title: 'MovieIL',
    description: 'Movie information app. JavaScript mastery with dynamic content & interactive UI.',
    tech: ['JavaScript', 'HTML', 'CSS', 'API Integration'],
    github: 'https://github.com/BenEliyahu/MovieIL',
    live: 'https://movie-il.vercel.app/',
    icon: '🎬',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
  },
};

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full" />
          <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">
            Showcasing my best work across full-stack development, AI integration, and modern architecture
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative h-full"
            >
              {/* Glow background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur group-hover:blur-xl -z-10" />

              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition">{project.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <motion.span
                      key={tech}
                      whileHover={{ scale: 1.1 }}
                      className="text-xs px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full border border-cyan-500/30 hover:border-cyan-500 transition font-mono"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold transition group/link"
                  >
                    <span>GitHub</span>
                    <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  {'live' in project && project.live && (
                    <Link
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition group/live"
                    >
                      <span>Live Demo</span>
                      <svg className="w-5 h-5 transform group-hover/live:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
