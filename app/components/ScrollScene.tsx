'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';

function useScrollProgress(): MutableRefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

// Keyframed path through the page — one waypoint per section.
const ORB_PATH = [
  new THREE.Vector3(2.6, 0.2, 0),      // Hero — right of text
  new THREE.Vector3(-2.8, -0.6, -1),   // About — slides left, recedes
  new THREE.Vector3(3.2, 0.8, -2),     // Projects — far right, deeper
  new THREE.Vector3(-2.4, 0.6, -0.5),  // Skills — left, closer
  new THREE.Vector3(0, 0, 1.2),        // Contact — front and center
];

const COLOR_STOPS = [
  new THREE.Color('#06b6d4'), // cyan
  new THREE.Color('#818cf8'), // indigo
  new THREE.Color('#a78bfa'), // violet
  new THREE.Color('#f472b6'), // pink
  new THREE.Color('#22d3ee'), // cyan back
];

function sampleSegment<T>(items: T[], t: number, lerp: (a: T, b: T, k: number) => T): T {
  const last = items.length - 1;
  const seg = t * last;
  const i = Math.min(Math.floor(seg), last - 1);
  const k = seg - i;
  return lerp(items[i], items[i + 1], k);
}

// Renders a mock IDE/editor onto a canvas — used as the laptop screen texture.
function makeScreenTexture(): THREE.Texture {
  const w = 512;
  const h = 320;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(0, 0, w, h);

  // Window chrome dots
  const dots: Array<[number, string]> = [
    [22, '#ef4444'],
    [48, '#fbbf24'],
    [74, '#22c55e'],
  ];
  for (const [x, color] of dots) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, 22, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tab bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 44, w, 28);
  ctx.fillStyle = '#0b1220';
  ctx.fillRect(100, 50, 130, 22);
  ctx.font = '12px "Fira Code", "Courier New", monospace';
  ctx.fillStyle = '#22d3ee';
  ctx.fillText('portfolio.tsx', 110, 65);

  // Code
  const code: Array<{ num: string; tokens: Array<{ t: string; c: string }> }> = [
    { num: '1', tokens: [{ t: 'const ', c: '#c4b5fd' }, { t: 'dev', c: '#fde68a' }, { t: ' = {', c: '#e5e7eb' }] },
    { num: '2', tokens: [{ t: '  name', c: '#7dd3fc' }, { t: ': ', c: '#94a3b8' }, { t: '"Ben"', c: '#a7f3d0' }, { t: ',', c: '#e5e7eb' }] },
    { num: '3', tokens: [{ t: '  stack', c: '#7dd3fc' }, { t: ': [', c: '#94a3b8' }, { t: '"React"', c: '#a7f3d0' }, { t: ', ', c: '#94a3b8' }, { t: '"Node"', c: '#a7f3d0' }, { t: '],', c: '#e5e7eb' }] },
    { num: '4', tokens: [{ t: '  ship', c: '#7dd3fc' }, { t: ': () ', c: '#94a3b8' }, { t: '=>', c: '#c4b5fd' }, { t: ' 🚀,', c: '#e5e7eb' }] },
    { num: '5', tokens: [{ t: '};', c: '#e5e7eb' }] },
    { num: '6', tokens: [] },
    { num: '7', tokens: [{ t: 'await ', c: '#c4b5fd' }, { t: 'build', c: '#fde68a' }, { t: '(dev);', c: '#e5e7eb' }] },
  ];

  ctx.font = '15px "Fira Code", "Courier New", monospace';
  let y = 100;
  for (const row of code) {
    ctx.fillStyle = '#475569';
    ctx.fillText(row.num, 14, y);
    let x = 40;
    for (const tok of row.tokens) {
      ctx.fillStyle = tok.c;
      ctx.fillText(tok.t, x, y);
      x += ctx.measureText(tok.t).width;
    }
    y += 26;
  }

  // Caret
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(40, y - 12, 8, 14);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function Laptop({
  openRef,
  accentMatRef,
}: {
  openRef: MutableRefObject<number>;
  accentMatRef: MutableRefObject<THREE.MeshBasicMaterial | null>;
}) {
  const lidPivotRef = useRef<THREE.Group>(null);
  const screenTex = useMemo(() => makeScreenTexture(), []);

  useFrame(() => {
    if (!lidPivotRef.current) return;
    // 0 = fully closed (lid lying flat on base, screen facing down)
    // 1 = open (lid tilted slightly back so the screen faces the viewer)
    const open = openRef.current;
    const targetRot = THREE.MathUtils.lerp(Math.PI / 2, -0.25, open);
    lidPivotRef.current.rotation.x = THREE.MathUtils.lerp(
      lidPivotRef.current.rotation.x,
      targetRot,
      0.1
    );
  });

  return (
    <group>
      {/* Base */}
      <RoundedBox
        args={[2.2, 0.12, 1.5]}
        radius={0.05}
        smoothness={3}
        position={[0, -0.06, 0]}
      >
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
      </RoundedBox>

      {/* Keyboard plate */}
      <mesh position={[0, 0.005, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 1.25]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Trackpad hint */}
      <mesh position={[0, 0.012, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.75, 0.4]} />
        <meshStandardMaterial color="#0b1220" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Lid pivot at the back edge of the base, top surface */}
      <group ref={lidPivotRef} position={[0, 0, -0.75]}>
        {/* Lid shell */}
        <RoundedBox
          args={[2.2, 1.4, 0.07]}
          radius={0.04}
          smoothness={3}
          position={[0, 0.7, 0]}
        >
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </RoundedBox>

        {/* Screen */}
        <mesh position={[0, 0.7, 0.038]}>
          <planeGeometry args={[2.0, 1.25]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>

        {/* Color accent overlay — synced with scroll color */}
        <mesh position={[0, 0.7, 0.039]}>
          <planeGeometry args={[2.0, 1.25]} />
          <meshBasicMaterial
            ref={accentMatRef}
            color="#22d3ee"
            transparent
            opacity={0.13}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

// Opening choreography: short delay so the user sees a closed laptop briefly,
// then a smooth open over ~1.5s. After that the lid stays open regardless of scroll.
const OPEN_DELAY_S = 0.4;
const OPEN_DURATION_S = 1.5;

function HeroOrb({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const accentMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const openRef = useRef(0);
  const mountTimeRef = useRef<number | null>(null);

  const tmpVec = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());
  const tmpColor = useRef(new THREE.Color());

  useFrame((state, dt) => {
    if (!groupRef.current || !innerRef.current) return;
    const t = scrollRef.current;

    // Gentle Y rotation so we see the screen from varied angles
    innerRef.current.rotation.y += dt * (0.18 + t * 0.35);
    // Subtle sway
    innerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.04;

    // Position along keyframed path
    const target = sampleSegment(ORB_PATH, t, (a, b, k) => tmpVec.current.copy(a).lerp(b, k));
    groupRef.current.position.lerp(target, 0.07);

    // Scale — laptop has volume, keep it modest
    const pulse = 0.9 + Math.sin(t * Math.PI) * 0.18;
    tmpScale.current.setScalar(pulse);
    groupRef.current.scale.lerp(tmpScale.current, 0.06);

    // Lid opens automatically on mount (independent of scroll) so the object
    // is unambiguously a laptop from frame 1.
    if (mountTimeRef.current === null) mountTimeRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - mountTimeRef.current;
    const raw = (elapsed - OPEN_DELAY_S) / OPEN_DURATION_S;
    const targetOpen = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(raw, 0, 1), 0, 1);
    openRef.current = THREE.MathUtils.lerp(openRef.current, targetOpen, 0.12);

    // Screen accent color drift
    const color = sampleSegment(COLOR_STOPS, t, (a, b, k) => tmpColor.current.copy(a).lerp(b, k));
    if (accentMatRef.current) accentMatRef.current.color.lerp(color, 0.06);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={groupRef}>
        <group ref={innerRef}>
          <Laptop openRef={openRef} accentMatRef={accentMatRef} />
        </group>
      </group>
    </Float>
  );
}

function CameraRig({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const target = useRef(new THREE.Vector3());
  useFrame((state) => {
    const t = scrollRef.current;
    // Dolly back + slight vertical pan as we descend the page
    target.current.set(Math.sin(t * Math.PI) * 0.6, -t * 0.8, 6 + t * 1.8);
    state.camera.position.lerp(target.current, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ScrollScene() {
  const scrollRef = useScrollProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#020817']} />
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 5, 5]} intensity={3} color="#06b6d4" />
        <pointLight position={[-5, -5, 5]} intensity={2.2} color="#818cf8" />
        <pointLight position={[0, 0, 8]} intensity={1.2} color="#ffffff" />
        <Stars radius={70} depth={50} count={2500} factor={4} fade speed={1} />
        <HeroOrb scrollRef={scrollRef} />
        <CameraRig scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
