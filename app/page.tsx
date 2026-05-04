import Hero3D from './components/Hero3D';
import Projects from './components/Projects';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';

export default function Home() {
  return (
    <main className="bg-slate-900">
      <Hero3D />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <ChatBot />

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-8 text-center border-t border-slate-800">
        <p>© 2025 Ben Eliyahu. Built with Next.js, Three.js, and Claude AI.</p>
      </footer>
    </main>
  );
}
