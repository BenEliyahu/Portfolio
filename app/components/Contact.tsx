'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsLoading(false);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const contactLinks = [
    { label: 'Email', value: 'beneliyahu15@gmail.com', href: 'mailto:beneliyahu15@gmail.com', icon: '📧' },
    { label: 'Phone', value: '+972 50-824-8488', href: 'tel:+972508248488', icon: '📱' },
    { label: 'LinkedIn', value: 'ben-eliyahu', href: 'https://linkedin.com/in/ben-eliyahu', icon: '💼' },
    { label: 'GitHub', value: 'BenEliyahu', href: 'https://github.com/BenEliyahu', icon: '💻' },
  ];

  return (
    <section id="contact" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
            Let's Work Together
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full" />
          <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">
            Have a project in mind? Want to collaborate? Let's connect and build something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {contactLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ x: 10 }}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur -z-10" />

                  <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 group-hover:border-cyan-500/50 transition">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{link.icon}</span>
                      <div>
                        <h3 className="text-sm text-gray-400 font-mono uppercase tracking-widest">
                          {link.label}
                        </h3>
                        <p className="text-white font-bold text-lg group-hover:text-cyan-400 transition">
                          {link.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Name */}
            <div className="group">
              <label className="block text-sm text-gray-300 mb-2 font-mono">Full Name</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="name"
                placeholder="Your name..."
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 backdrop-blur-xl text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-700/50 focus:border-cyan-500 transition font-mono placeholder-gray-500"
              />
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm text-gray-300 mb-2 font-mono">Email</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 backdrop-blur-xl text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-700/50 focus:border-cyan-500 transition font-mono placeholder-gray-500"
              />
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-sm text-gray-300 mb-2 font-mono">Message</label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                name="message"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-slate-800/50 backdrop-blur-xl text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-700/50 focus:border-cyan-500 transition font-mono placeholder-gray-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold py-4 rounded-lg transition duration-300 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : submitted ? (
                <>
                  <span>✓ Message Sent!</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
