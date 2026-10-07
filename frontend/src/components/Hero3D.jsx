import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Rotating Interactive Central Core with Theme-Reactive Materials
function QuantumCore({ mousePos, theme }) {
  const groupRef = useRef();
  const wireframeRef = useRef();
  const innerRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Floating oscillation
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.25;
      // Gentle tilt based on mouse position
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePos.current.y * 0.3,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.current.x * 0.4,
        0.05
      );
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.25;
      wireframeRef.current.rotation.y += delta * 0.35;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.3;
      innerRef.current.rotation.z += delta * 0.2;
    }
  });

  const wireframeColor = hovered ? '#ffffff' : theme.three3D.wireframe;
  const wireframeEmissive = theme.three3D.emissive;

  return (
    <group ref={groupRef}>
      {/* Outer Glow Ring Wireframe */}
      <mesh
        ref={wireframeRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 2.3 : 2.1}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          wireframe
          color={wireframeColor}
          emissive={wireframeEmissive}
          emissiveIntensity={hovered ? 1.5 : 0.8}
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

// Orbiting Floating Geometric Cubes with Theme-Reactive Colors
function SingleNode({ initialPos, rotSpeed, floatSpeed, floatOffset, color, scale }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotSpeed;
      meshRef.current.rotation.y += delta * (rotSpeed * 1.3);
      meshRef.current.position.y = initialPos[1] + Math.sin(t * floatSpeed + floatOffset) * 0.35;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPos}
      scale={hovered ? scale * 1.35 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? '#ffffff' : color}
        emissive={color}
        emissiveIntensity={hovered ? 1.6 : 0.75}
        metalness={0.8}
        roughness={0.25}
      />
    </mesh>
  );
}

function FloatingNodes({ theme }) {
  const nodeColors = theme.three3D.nodes;
  const nodes = [
    { initialPos: [-3.2, 1.6, -0.8], rotSpeed: 0.6, floatSpeed: 1.8, floatOffset: 0, color: nodeColors[0], scale: 0.65 },
    { initialPos: [3.3, 1.2, -0.5], rotSpeed: 0.5, floatSpeed: 1.5, floatOffset: 1.2, color: nodeColors[1], scale: 0.75 },
    { initialPos: [-2.7, -1.6, 0.4], rotSpeed: 0.7, floatSpeed: 2.1, floatOffset: 2.4, color: nodeColors[2], scale: 0.55 },
    { initialPos: [2.9, -1.9, -1.0], rotSpeed: 0.6, floatSpeed: 1.7, floatOffset: 3.5, color: nodeColors[3], scale: 0.6 },
    { initialPos: [0.1, 2.7, -1.8], rotSpeed: 0.4, floatSpeed: 1.4, floatOffset: 4.2, color: nodeColors[4], scale: 0.5 },
  ];

  return (
    <>
      {nodes.map((node, i) => (
        <SingleNode key={`${theme.id}-${i}`} {...node} />
      ))}
    </>
  );
}

// Cyber Particle Field using Theme-Reactive Color
function ParticleField({ theme }) {
  const pointsRef = useRef();
  const count = 750;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.035;
      pointsRef.current.rotation.x -= delta * 0.015;
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

export default function Hero3D() {
  const { theme } = useTheme();
  const mousePos = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mousePos.current.x = (clientX / innerWidth) * 2 - 1;
    mousePos.current.y = -(clientY / innerHeight) * 2 + 1;
  };

  return (
    <div
      className="w-full h-full absolute inset-0 pointer-events-auto transition-colors duration-500"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[10, 10, 10]} intensity={1.6} color={theme.three3D.light1} />
        <pointLight position={[-10, -10, -10]} intensity={1.3} color={theme.three3D.light2} />
        <pointLight position={[0, 0, 5]} intensity={0.9} color={theme.primary} />

        <QuantumCore mousePos={mousePos} theme={theme} />
        <FloatingNodes theme={theme} />
        <ParticleField theme={theme} />
      </Canvas>
    </div>
  );
}
