import Hero3D from './components/Hero3D';
import Projects from './components/Projects';
import About from './components/About';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';
import ScrollScene from './components/ScrollScene';
import AIShowcase from './components/AIShowcase';

export default function Home() {
  return (
    <main className="relative">
      <ScrollScene />
      <div className="relative" style={{ zIndex: 1 }}>
        <Hero3D />
        <About />
        <AIShowcase />
        <Projects />
        <Skills />
        <Contact />
        <ChatBot />

        {/* Footer */}
        <footer className="bg-slate-950/80 backdrop-blur-md text-gray-400 py-8 text-center border-t border-slate-800">
          <p>© 2026 Ben Eliyahu. Built with Next.js, Three.js, and Claude AI.</p>
        </footer>
      </div>
    </main>
  );
}
