import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Central Quantum Core (in Hero view)
function QuantumCore({ scrollProgress, mousePos, theme }) {
  const groupRef = useRef();
  const wireframeRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Float oscillation in Hero
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.25;
      // Tilt with mouse
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.current.y * 0.4,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.current.x * 0.5 + t * 0.2,
        0.05
      );
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.2;
      wireframeRef.current.rotation.y += delta * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.25;
      innerRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Glow Ring Wireframe */}
      <mesh ref={wireframeRef} scale={2.2}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          wireframe
          color={theme.three3D.wireframe}
          emissive={theme.three3D.emissive}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Inner Crystalline Octahedron Core */}
      <mesh ref={innerRef} scale={1.3}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={theme.three3D.inner}
          emissive={theme.secondary}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// 3D Floating Geometries Dispersed Down the Entire Page
function ContinuousFloatingGeometries({ scrollProgress, theme }) {
  const meshesRef = useRef([]);

  // Set of 3D objects dispersed at different depths (Y coordinates) for each section
  const geometries = useMemo(() => {
    const colors = theme.three3D.nodes;
    return [
      // Hero area floating cubes
      { type: 'box', pos: [-3.2, 1.6, -1], rotSpeed: 0.6, scale: 0.65, color: colors[0] },
      { type: 'box', pos: [3.3, 1.2, -0.8], rotSpeed: 0.5, scale: 0.75, color: colors[1] },
      { type: 'box', pos: [-2.7, -1.6, 0.2], rotSpeed: 0.7, scale: 0.55, color: colors[2] },
      { type: 'box', pos: [2.9, -1.9, -1.2], rotSpeed: 0.6, scale: 0.6, color: colors[3] },
      { type: 'box', pos: [0.1, 2.7, -2], rotSpeed: 0.4, scale: 0.5, color: colors[4] },

      // About Section depth (Y: -3 to -6)
      { type: 'torus', pos: [-3.8, -4.5, -1.5], rotSpeed: 0.4, scale: 0.9, color: theme.primary },
      { type: 'octa', pos: [3.5, -5.2, -1], rotSpeed: 0.5, scale: 0.8, color: theme.secondary },

      // Features Section depth (Y: -7 to -12)
      { type: 'icosa', pos: [-3.6, -9.0, -1.2], rotSpeed: 0.35, scale: 0.85, color: theme.primary },
      { type: 'box', pos: [3.7, -10.5, -0.5], rotSpeed: 0.65, scale: 0.7, color: colors[1] },
      { type: 'torus', pos: [-3.2, -12.0, -1], rotSpeed: 0.5, scale: 0.75, color: colors[3] },

      // Pricing Section depth (Y: -13 to -17)
      { type: 'octa', pos: [3.4, -14.5, -1], rotSpeed: 0.55, scale: 0.8, color: theme.primary },
      { type: 'box', pos: [-3.5, -16.0, -0.8], rotSpeed: 0.6, scale: 0.65, color: colors[2] },

      // Testimonials & Contact depth (Y: -18 to -24)
      { type: 'torus', pos: [3.6, -19.5, -1.5], rotSpeed: 0.45, scale: 0.85, color: theme.secondary },
      { type: 'icosa', pos: [-3.4, -22.0, -1], rotSpeed: 0.4, scale: 0.8, color: theme.primary },
      { type: 'octa', pos: [3.2, -24.0, -0.6], rotSpeed: 0.5, scale: 0.7, color: colors[0] },
    ];
  }, [theme]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    meshesRef.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.x += delta * 0.4;
        mesh.rotation.y += delta * 0.5;
        // Subtle floating pulse
        mesh.position.y = geometries[i].pos[1] + Math.sin(t * 1.5 + i) * 0.25;
      }
    });
  });

  return (
    <group>
      {geometries.map((geo, idx) => (
        <mesh
          key={`${theme.id}-${idx}`}
          ref={(el) => (meshesRef.current[idx] = el)}
          position={geo.pos}
          scale={geo.scale}
        >
          {geo.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {geo.type === 'octa' && <octahedronGeometry args={[1, 0]} />}
          {geo.type === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
          {geo.type === 'torus' && <torusGeometry args={[1, 0.18, 16, 32]} />}

          <meshStandardMaterial
            color={geo.color}
            emissive={geo.color}
            emissiveIntensity={0.65}
            metalness={0.8}
            roughness={0.25}
            wireframe={geo.type === 'torus'}
          />
        </mesh>
      ))}
    </group>
  );
}

// Deep Multi-Layer Cosmic Particle Stream Across Entire Page Height
function FullPageParticleField({ theme, scrollProgress }) {
  const pointsRef = useRef();
  const count = 1200;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      // Stretched along the full vertical height of all sections (Y: +5 to -30)
      pos[i * 3 + 1] = (Math.random() * 38) - 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.025;
      pointsRef.current.rotation.x -= delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color={theme.three3D.particles}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Camera Controller tracking scroll down the entire website
function ScrollCamera({ scrollProgress, mousePos }) {
  useFrame((state) => {
    const targetY = -(scrollProgress.current * 22);
    // Smooth camera interpolation
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    // Subtle mouse tilt
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mousePos.current.x * 0.8, 0.05);
  });
  return null;
}

export default function Global3DBackground() {
  const { theme } = useTheme();
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        scrollProgress.current = Math.min(1, Math.max(0, window.scrollY / totalScrollable));
      }
    };

    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-colors duration-500 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        {/* Vertical tiered lighting illuminating Hero, About, Features, Pricing, and Contact */}
        <pointLight position={[10, 5, 8]} intensity={1.8} color={theme.three3D.light1} />
        <pointLight position={[-10, -4, 8]} intensity={1.6} color={theme.three3D.light2} />
        <pointLight position={[8, -11, 8]} intensity={1.6} color={theme.primary} />
        <pointLight position={[-8, -17, 8]} intensity={1.6} color={theme.secondary} />
        <pointLight position={[6, -23, 8]} intensity={1.6} color={theme.accent} />

        <ScrollCamera scrollProgress={scrollProgress} mousePos={mousePos} />
        <QuantumCore scrollProgress={scrollProgress} mousePos={mousePos} theme={theme} />
        <ContinuousFloatingGeometries scrollProgress={scrollProgress} theme={theme} />
        <FullPageParticleField theme={theme} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
