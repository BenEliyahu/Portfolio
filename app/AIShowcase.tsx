'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';

const STAGES = [
  { label: 'Explore.',  caption: 'Curiosity that maps the problem space.' },
  { label: 'Engineer.', caption: 'Architect systems with structure & taste.' },
  { label: 'Integrate.', caption: 'Wire intelligence into real products.' },
  { label: 'Deliver.',  caption: 'Ship — measurable, observable, fast.' },
];

const ACCENT_COLORS = [
  new THREE.Color('#22d3ee'), // cyan
  new THREE.Color('#818cf8'), // indigo
  new THREE.Color('#a78bfa'), // violet
  new THREE.Color('#34d399'), // emerald
];

const PARTICLE_COUNT = 1800;

type Shape = 'sphere' | 'cube' | 'torus' | 'helix';

function generateShape(shape: Shape, count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;
    if (shape === 'sphere') {
      const r = 2.1;
      const y0 = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y0 * y0);
      const theta = goldenAngle * i;
      x = Math.cos(theta) * radius * r;
      y = y0 * r;
      z = Math.sin(theta) * radius * r;
    } else if (shape === 'cube') {
      const side = Math.ceil(Math.cbrt(count));
      const s = 3.4;
      const ix = i % side;
      const iy = Math.floor(i / side) % side;
      const iz = Math.floor(i / (side * side)) % side;
      x = (ix / (side - 1) - 0.5) * s;
      y = (iy / (side - 1) - 0.5) * s;
      z = (iz / (side - 1) - 0.5) * s;
    } else if (shape === 'torus') {
      const R = 1.7;
      const r = 0.7;
      const u = (i / count) * Math.PI * 2 * 6;
      const v = (i * 0.7) % (Math.PI * 2);
      x = (R + r * Math.cos(v)) * Math.cos(u);
      y = r * Math.sin(v);
      z = (R + r * Math.cos(v)) * Math.sin(u);
    } else {
      // helix
      const t = i / count;
      const turns = 6;
      x = Math.cos(t * Math.PI * 2 * turns) * (1.3 + t * 0.6);
      y = (t - 0.5) * 4.2;
      z = Math.sin(t * Math.PI * 2 * turns) * (1.3 + t * 0.6);
    }
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

function MorphingPoints({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const shapes = useMemo(
    () => [
      generateShape('sphere', PARTICLE_COUNT),
      generateShape('cube', PARTICLE_COUNT),
      generateShape('torus', PARTICLE_COUNT),
      generateShape('helix', PARTICLE_COUNT),
    ],
    []
  );

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const tmpColor = useRef(new THREE.Color());

  // Initial position = first shape
  useEffect(() => {
    positions.set(shapes[0]);
    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
  }, [positions, shapes]);

  useFrame((state) => {
    const progress = progressRef.current;
    const t = progress * (shapes.length - 1);
    const i = Math.min(Math.floor(t), shapes.length - 2);
    const k = t - i;
    const eased = k * k * (3 - 2 * k);

    const a = shapes[i];
    const b = shapes[i + 1];
    const time = state.clock.elapsedTime;

    for (let p = 0; p < PARTICLE_COUNT; p++) {
      const j = p * 3;
      const jitter = 0.025;
      positions[j]     = a[j]     + (b[j]     - a[j])     * eased + Math.sin(time * 0.7 + p * 0.13) * jitter;
      positions[j + 1] = a[j + 1] + (b[j + 1] - a[j + 1]) * eased + Math.cos(time * 1.1 + p * 0.17) * jitter;
      positions[j + 2] = a[j + 2] + (b[j + 2] - a[j + 2]) * eased + Math.sin(time * 0.9 + p * 0.11) * jitter;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0022;
      pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
    }
    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
    if (materialRef.current) {
      const colorT = progress * (ACCENT_COLORS.length - 1);
      const ci = Math.min(Math.floor(colorT), ACCENT_COLORS.length - 2);
      const ck = colorT - ci;
      tmpColor.current.copy(ACCENT_COLORS[ci]).lerp(ACCENT_COLORS[ci + 1], ck);
      materialRef.current.color.lerp(tmpColor.current, 0.08);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        sizeAttenuation
        color="#22d3ee"
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        depthWrite={false}
      />
    </points>
  );
}

function CameraDrift({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const target = useRef(new THREE.Vector3(0, 0, 6));
  useFrame((state) => {
    const p = progressRef.current;
    target.current.set(Math.sin(p * Math.PI * 2) * 0.6, Math.cos(p * Math.PI) * 0.3, 6 - p * 0.6);
    state.camera.position.lerp(target.current, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function AIShowcase() {
  const outerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const update = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, el.offsetHeight - vh);
      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / total));
      progressRef.current = p;
      setProgress(p);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Compute current stage with smooth crossfade
  const stageT = progress * (STAGES.length - 1);
  const stageIdx = Math.min(STAGES.length - 1, Math.floor(stageT + 0.5));
  const stage = STAGES[stageIdx];
  const accent = ACCENT_COLORS[stageIdx].getStyle();

  return (
    <section
      ref={outerRef}
      className="relative w-full bg-slate-950"
      style={{ height: '320vh' }}
      aria-label="What I do"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={['#020817']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
            <pointLight position={[-10, -5, 5]} intensity={1.0} color="#a78bfa" />
            <MorphingPoints progressRef={progressRef} />
            <CameraDrift progressRef={progressRef} />
          </Canvas>
        )}

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(2,8,23,0.7) 100%)',
          }}
        />

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between py-16 sm:py-20 px-4">
          {/* Top kicker */}
          <div className="text-center">
            <div
              className="font-mono text-[10px] sm:text-xs tracking-[0.3em] mb-3"
              style={{ color: accent, transition: 'color 300ms' }}
            >
              HOW I BUILD
            </div>
            <div
              className="w-12 h-px mx-auto"
              style={{ backgroundColor: accent, opacity: 0.6, transition: 'background-color 300ms' }}
            />
          </div>

          {/* Center label + caption with crossfade */}
          <div className="relative w-full max-w-3xl text-center">
            <div className="relative h-32 sm:h-40 md:h-48">
              {STAGES.map((s, i) => {
                const distance = Math.abs(stageT - i);
                const opacity = Math.max(0, 1 - distance * 1.6);
                const translate = (i - stageT) * 30;
                return (
                  <h2
                    key={i}
                    className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight"
                    style={{
                      opacity,
                      transform: `translateY(${translate}px)`,
                      background: `linear-gradient(135deg, #ffffff, ${ACCENT_COLORS[i].getStyle()})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      willChange: 'opacity, transform',
                    }}
                  >
                    {s.label}
                  </h2>
                );
              })}
            </div>
            <p
              key={stageIdx}
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 tracking-wide"
              style={{ animation: 'fadeInSoft 600ms ease-out' }}
            >
              {stage.caption}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-3">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === stageIdx ? '36px' : '10px',
                  height: '10px',
                  background:
                    i <= stageIdx ? ACCENT_COLORS[i].getStyle() : 'rgba(148, 163, 184, 0.25)',
                  boxShadow:
                    i === stageIdx
                      ? `0 0 16px ${ACCENT_COLORS[i].getStyle()}aa`
                      : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInSoft {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
