'use client';

import { motion } from 'framer-motion';

export default function About() {
  const stats = [
    { label: 'Years Experience', value: '3+', icon: '⏱️' },
    { label: 'Projects Shipped', value: '15+', icon: '🚀' },
    { label: 'Technologies', value: '25+', icon: '🛠️' },
  ];

  return (
    <section id="about" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start mb-16">
          {/* Main text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              I'm a <span className="text-cyan-400 font-bold">Full Stack Developer</span> with 3+ years of experience building scalable web applications across agency and media tech environments. Currently at <span className="text-cyan-400 font-bold">The Jerusalem Post</span>, building and maintaining large-scale web platforms with Next.js, .NET, and cloud infrastructure on Azure and Google Cloud.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              I thrive in fast-paced environments where I can take ownership of projects end-to-end — from architecture decisions to final deployment. I pick up new technologies quickly, communicate clearly with clients and teammates, and consistently deliver under pressure.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Beyond development, I'm deeply involved in the <span className="text-blue-400 font-bold">AI space</span> — integrating tools like <span className="text-blue-400 font-bold">OpenAI, Claude, and LangChain</span> into real products, and continuously exploring how AI can enhance the way we build software.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, staggerChildren: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {/* Glow background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition" />

                <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 group-hover:border-cyan-500/50 transition">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-mono">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 my-12 origin-center"
        />

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Languages</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { lang: 'Hebrew', level: 'Native', icon: '🇮🇱' },
              { lang: 'English', level: 'Proficient', icon: '🇬🇧' },
              { lang: 'Arabic', level: 'Conversational', icon: '🌍' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/50 transition"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-white">{item.lang}</div>
                <div className="text-sm text-gray-400">{item.level}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
