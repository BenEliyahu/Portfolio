'use client';

import { motion } from 'framer-motion';

const skillCategories = [
  {
    category: 'Frontend',
    icon: '🎨',
    skills: ['React', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    skills: ['Node.js', 'Express.js', 'NestJS', 'ASP.NET Core', 'C#', 'Python', 'GraphQL'],
  },
  {
    category: 'Databases',
    icon: '💾',
    skills: ['SQL Server', 'MongoDB', 'Firebase', 'Redis', 'Entity Framework'],
  },
  {
    category: 'DevOps & Cloud',
    icon: '☁️',
    skills: ['Azure', 'AWS', 'Google Cloud', 'Docker', 'Kubernetes'],
  },
  {
    category: 'AI & LLM',
    icon: '🤖',
    skills: ['OpenAI API', 'Claude AI', 'LangChain', 'Cursor AI', 'Prompt Engineering'],
  },
  {
    category: 'Architecture',
    icon: '🏗️',
    skills: ['Design Patterns', 'MVC/MVVM', 'WebSockets', 'REST APIs', 'System Design'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, type: 'spring' as const, stiffness: 100 },
  },
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
            Technical Arsenal
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">
            A comprehensive toolkit built over years of full-stack development
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.category}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative h-full"
            >
              {/* Glow background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-xl opacity-0 group-hover:opacity-50 transition duration-500 blur group-hover:blur-lg -z-10" />

              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 h-full">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                    {category.category}
                  </h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full text-sm font-mono border border-cyan-500/30 hover:border-cyan-500/60 hover:from-cyan-500/40 hover:to-blue-500/40 transition cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
