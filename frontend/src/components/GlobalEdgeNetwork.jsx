import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import SoundEngine from '../utils/soundEffects';
import {
  Globe,
  Radio,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  RefreshCw,
  Server,
  Layers,
  ChevronRight,
  Pause,
  Play
} from 'lucide-react';

// 10 Global AI Edge Hubs
export const EDGE_NODES = [
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    country: 'India',
    region: 'Asia-South (HQ Primary Core)',
    lat: 12.9716,
    lon: 77.5946,
    basePing: 5.2,
    health: '99.999%',
    load: '46%',
    status: 'PRIMARY DISPATCH',
    hardware: '128x NVIDIA H100 SXM5 Tensor Mesh',
    p2pMesh: '800 Gbps RoCEv2 Direct Connect',
    isHQ: true,
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia-Southeast',
    lat: 1.3521,
    lon: 103.8198,
    basePing: 8.4,
    health: '99.998%',
    load: '58%',
    status: 'OPTIMIZED',
    hardware: '64x NVIDIA H100 SXM5 Cluster',
    p2pMesh: '400 Gbps Subsea Cross-Connect',
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia-Northeast',
    lat: 35.6762,
    lon: 139.6503,
    basePing: 11.2,
    health: '99.997%',
    load: '64%',
    status: 'OPTIMIZED',
    hardware: '96x NVIDIA H100 SXM5 Cluster',
    p2pMesh: '400 Gbps Low-Jitter Trans-Pacific',
  },
  {
    id: 'frankfurt',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Europe-Central',
    lat: 50.1109,
    lon: 8.6821,
    basePing: 13.8,
    health: '99.999%',
    load: '52%',
    status: 'OPTIMIZED',
    hardware: '64x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'DE-CIX Peering Interconnect',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe-West',
    lat: 51.5074,
    lon: -0.1278,
    basePing: 15.6,
    health: '99.996%',
    load: '61%',
    status: 'OPTIMIZED',
    hardware: '48x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'LINX Ultra-Low Latency Backbone',
  },
  {
    id: 'san-francisco',
    city: 'San Francisco',
    country: 'United States',
    region: 'US-West (Silicon Valley)',
    lat: 37.7749,
    lon: -122.4194,
    basePing: 18.4,
    health: '99.998%',
    load: '76%',
    status: 'OPTIMIZED',
    hardware: '128x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'Terabit Silicon Optical Fabric',
  },
  {
    id: 'new-york',
    city: 'New York',
    country: 'United States',
    region: 'US-East',
    lat: 40.7128,
    lon: -74.006,
    basePing: 16.9,
    health: '99.999%',
    load: '68%',
    status: 'OPTIMIZED',
    hardware: '96x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'Direct Wall Street Dark Fiber',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East Hub',
    lat: 25.2048,
    lon: 55.2708,
    basePing: 12.1,
    health: '99.995%',
    load: '44%',
    status: 'OPTIMIZED',
    hardware: '48x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'Gulf Subsea Optical Ring',
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    region: 'Oceania-South',
    lat: -33.8688,
    lon: 151.2093,
    basePing: 22.8,
    health: '99.994%',
    load: '38%',
    status: 'OPTIMIZED',
    hardware: '32x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'Southern Cross Subsea Cable',
  },
  {
    id: 'sao-paulo',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'South America-East',
    lat: -23.5505,
    lon: -46.6333,
    basePing: 24.5,
    health: '99.992%',
    load: '34%',
    status: 'OPTIMIZED',
    hardware: '32x NVIDIA H100 SXM5 Cluster',
    p2pMesh: 'Atlantic Latam Optical Mesh',
  },
];

// Backbone High-Speed Connection Arcs between Nodes
const CONNECTION_ARCS = [
  ['bengaluru', 'singapore'],
  ['bengaluru', 'dubai'],
  ['dubai', 'frankfurt'],
  ['frankfurt', 'london'],
  ['london', 'new-york'],
  ['new-york', 'san-francisco'],
  ['san-francisco', 'tokyo'],
  ['tokyo', 'singapore'],
  ['singapore', 'sydney'],
  ['new-york', 'sao-paulo'],
];

const GLOBE_RADIUS = 2.15;

// Convert Lat/Lon to 3D Cartesian coordinates
function latLonToVec3(lat, lon, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// 3D Arc Quadratic Bezier Curve Generator
function createArcCurve(p1, p2, altitude = 0.45) {
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const distance = p1.distanceTo(p2);
  const midLength = mid.length();
  if (midLength > 0.001) {
    mid.normalize().multiplyScalar(GLOBE_RADIUS + distance * altitude);
  }
  return new THREE.QuadraticBezierCurve3(p1, mid, p2);
}

// 3D Traveling Data Packet Mesh
function TravelingPacket({ curve, speed = 0.8, offset = 0, color }) {
  const packetRef = useRef();

  useFrame((state) => {
    if (!packetRef.current) return;
    const t = ((state.clock.getElapsedTime() * speed + offset) % 1 + 1) % 1;
    const pos = curve.getPoint(t);
    packetRef.current.position.copy(pos);
  });

  return (
    <mesh ref={packetRef}>
      <sphereGeometry args={[0.038, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// 3D Arc Line with Packet
function ArcLine({ fromVec, toVec, theme, speed, offset }) {
  const curve = useMemo(() => createArcCurve(fromVec, toVec), [fromVec, toVec]);
  const points = useMemo(() => curve.getPoints(40), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: theme.primary,
      transparent: true,
      opacity: 0.35,
    });
    return new THREE.Line(geometry, mat);
  }, [geometry, theme.primary]);

  return (
    <group>
      <primitive object={lineObject} />
      <TravelingPacket curve={curve} speed={speed} offset={offset} color={theme.accent || '#38bdf8'} />
    </group>
  );
}

// Node Marker on Globe
function NodeMarker({ node, isSelected, theme, onSelect }) {
  const pos = useMemo(() => latLonToVec3(node.lat, node.lon, GLOBE_RADIUS), [node.lat, node.lon]);
  const normal = useMemo(() => pos.clone().normalize(), [pos]);
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      const scale = isSelected
        ? 1.3 + Math.sin(state.clock.getElapsedTime() * 4) * 0.3
        : 1.0 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={pos} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      {/* Central Solid Node Marker */}
      <mesh>
        <sphereGeometry args={[isSelected ? 0.08 : (node.isHQ ? 0.07 : 0.05), 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : (node.isHQ ? '#10b981' : theme.primary)}
          emissive={isSelected ? theme.primary : (node.isHQ ? '#059669' : theme.secondary)}
          emissiveIntensity={isSelected ? 1.5 : 0.9}
        />
      </mesh>

      {/* Pulsing Outer Halo */}
      <mesh
        ref={ringRef}
        quaternion={useMemo(() => {
          const q = new THREE.Quaternion();
          q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
          return q;
        }, [normal])}
      >
        <ringGeometry args={[isSelected ? 0.09 : 0.06, isSelected ? 0.14 : 0.09, 20]} />
        <meshBasicMaterial
          color={node.isHQ ? '#34d399' : theme.primary}
          transparent
          opacity={isSelected ? 0.85 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* If Selected: Vertical Cyber Hologram Beacon */}
      {isSelected && (
        <mesh
          position={normal.clone().multiplyScalar(0.4)}
          quaternion={useMemo(() => {
            const q = new THREE.Quaternion();
            q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
            return q;
          }, [normal])}
        >
          <cylinderGeometry args={[0.012, 0.035, 0.8, 12]} />
          <meshBasicMaterial color={theme.primary} transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
}

// Complete 3D Holographic Globe Model
function GlobeMesh({ theme, activeNode, onSelectNode, isRotating, targetRotation }) {
  const globeGroupRef = useRef();

  // Dense Fibonacci Planetary Matrix Constellation (~1,200 points)
  const matrixPoints = useMemo(() => {
    const pts = [];
    const count = 1200;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      pts.push(new THREE.Vector3(x, y, z).multiplyScalar(GLOBE_RADIUS * 1.002));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    return geom;
  }, []);

  // Compute node vector lookup
  const nodeVectors = useMemo(() => {
    const map = {};
    EDGE_NODES.forEach((n) => {
      map[n.id] = latLonToVec3(n.lat, n.lon, GLOBE_RADIUS);
    });
    return map;
  }, []);

  useFrame((state, delta) => {
    if (!globeGroupRef.current) return;

    if (targetRotation.current.active) {
      // Smoothly rotate towards targeted node
      globeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        globeGroupRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      );
      globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        globeGroupRef.current.rotation.x,
        targetRotation.current.x,
        0.05
      );

      if (
        Math.abs(globeGroupRef.current.rotation.y - targetRotation.current.y) < 0.005 &&
        Math.abs(globeGroupRef.current.rotation.x - targetRotation.current.x) < 0.005
      ) {
        targetRotation.current.active = false;
      }
    } else if (isRotating) {
      globeGroupRef.current.rotation.y += delta * 0.14;
    }
  });

  const pointsObject = useMemo(() => {
    const mat = new THREE.PointsMaterial({
      color: theme.primary,
      size: 0.032,
      transparent: true,
      opacity: 0.55,
    });
    return new THREE.Points(matrixPoints, mat);
  }, [matrixPoints, theme.primary]);

  return (
    <group ref={globeGroupRef}>
      {/* Dark Translucent Cyber Sphere Base */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS - 0.02, 48, 48]} />
        <meshStandardMaterial
          color="#030816"
          roughness={0.65}
          metalness={0.8}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Outer Wireframe Lattice */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 28, 28]} />
        <meshStandardMaterial
          wireframe
          color={theme.three3D.wireframe}
          transparent
          opacity={0.16}
        />
      </mesh>

      {/* Planetary Matrix Point Constellation */}
      <primitive object={pointsObject} />

      {/* Orbital Satellite Ring */}
      <mesh rotation={[Math.PI / 3.5, Math.PI / 6, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 1.34, GLOBE_RADIUS * 1.35, 64]} />
        <meshBasicMaterial color={theme.secondary} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Backbone High-Speed Connection Arcs with Traveling Packets */}
      {CONNECTION_ARCS.map(([fromId, toId], idx) => {
        const fromVec = nodeVectors[fromId];
        const toVec = nodeVectors[toId];
        if (!fromVec || !toVec) return null;
        return (
          <ArcLine
            key={`${fromId}-${toId}`}
            fromVec={fromVec}
            toVec={toVec}
            theme={theme}
            speed={0.7 + (idx % 3) * 0.25}
            offset={idx * 0.12}
          />
        );
      })}

      {/* Global PoP Node Markers */}
      {EDGE_NODES.map((node) => (
        <NodeMarker
          key={node.id}
          node={node}
          isSelected={activeNode.id === node.id}
          theme={theme}
          onSelect={onSelectNode}
        />
      ))}
    </group>
  );
}

// Main Interactive Component
export default function GlobalEdgeNetwork() {
  const { theme } = useTheme();
  const [activeNode, setActiveNode] = useState(EDGE_NODES[0]); // Default to Bengaluru HQ
  const [isRotating, setIsRotating] = useState(true);
  const [livePing, setLivePing] = useState(activeNode.basePing);
  const [liveThroughput, setLiveThroughput] = useState(2.84);
  const targetRotation = useRef({ x: 0, y: 0, active: false });

  // Simulate real-time micro-jitter telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      // Add subtle real-time fluctuation (± 0.4 ms)
      const jitter = (Math.random() - 0.5) * 0.8;
      const current = parseFloat((activeNode.basePing + jitter).toFixed(1));
      setLivePing(Math.max(1.2, current));

      const tpJitter = (Math.random() - 0.5) * 0.06;
      setLiveThroughput(parseFloat((2.84 + tpJitter).toFixed(2)));
    }, 1800);
    return () => clearInterval(interval);
  }, [activeNode]);

  // Handle switching nodes & orienting globe
  const handleSelectNode = (node) => {
    SoundEngine.playBeep(920, 0.08);
    setActiveNode(node);
    setLivePing(node.basePing);

    // Calculate rotation angles to orient target node to face camera
    const phi = (90 - node.lat) * (Math.PI / 180);
    const theta = (node.lon + 180) * (Math.PI / 180);
    const targetY = -theta + Math.PI / 2;
    const targetX = phi - Math.PI / 2;

    targetRotation.current = {
      x: targetX * 0.4,
      y: targetY,
      active: true,
    };
  };

  // Interactive mouse/touch drag to spin the 3D globe
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;
    prevPointer.current = { x: e.clientX, y: e.clientY };

    targetRotation.current.y += deltaX * 0.007;
    targetRotation.current.x += deltaY * 0.007;
    targetRotation.current.active = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const getWhatsAppLeadLink = () => {
    const msg = encodeURIComponent(
      `Hello Nexvo Engineering, I am interested in routing enterprise AI workloads through your Global Edge Mesh (targeting the ${activeNode.city} node - ${activeNode.region}). Can we discuss architecture, zero-latency SLAs, and dedicated cluster availability?`
    );
    return `https://wa.me/919113233351?text=${msg}`;
  };

  return (
    <section
      id="network"
      className="relative py-24 border-t overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: `${theme.bg}`,
        borderColor: theme.borderSubtle,
      }}
    >
      {/* Background Decorative Ambient Glows */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[130px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-4 border shadow-lg"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.badgeText,
            }}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" style={{ color: theme.primary }} />
            <span className="font-semibold uppercase tracking-wider">PLANETARY COGNITIVE MESH</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
            Zero-Latency Global{' '}
            <span
              className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
            >
              Edge Telemetry
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Ten tier-1 cognitive super-nodes interconnected across six continents. Tap or drag the holographic globe below to inspect real-time tensor dispatch telemetry and subsea fiber links.
          </p>
        </div>

        {/* Global Planetary Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div
            className="p-4 rounded-2xl border transition backdrop-blur-md"
            style={{
              backgroundColor: `${theme.surface}95`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
              <Server className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>ACTIVE PoPs</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              48 <span className="text-xs text-emerald-400 font-sans font-semibold">ONLINE</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Across 6 Continents</div>
          </div>

          <div
            className="p-4 rounded-2xl border transition backdrop-blur-md"
            style={{
              backgroundColor: `${theme.surface}95`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
              <Activity className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
              <span>MEDIAN INFERENCE</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono flex items-center space-x-1.5">
              <span>{livePing} ms</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Real-time edge response</div>
          </div>

          <div
            className="p-4 rounded-2xl border transition backdrop-blur-md"
            style={{
              backgroundColor: `${theme.surface}95`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>THROUGHPUT MESH</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {liveThroughput} <span className="text-xs font-mono text-amber-400">TB/s</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Subsea Optical Cross-Connect</div>
          </div>

          <div
            className="p-4 rounded-2xl border transition backdrop-blur-md"
            style={{
              backgroundColor: `${theme.surface}95`,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECURITY PROTOCOL</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              mTLS 1.3
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Zero-Knowledge Hardware Enclave</div>
          </div>
        </div>

        {/* Main Interactive Stage: 3D Globe + Telemetry HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Top: 3D Holographic Globe Canvas (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] rounded-3xl border overflow-hidden flex items-center justify-center backdrop-blur-xl shadow-2xl touch-none select-none"
              style={{
                backgroundColor: `${theme.surface}60`,
                borderColor: theme.borderSubtle,
                boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px -10px ${theme.glowColor}`,
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Overlay Interactive Hint */}
              <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs font-mono backdrop-blur-md">
                <Globe className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                <span>3D ORBITAL VIEW (DRAG & ROTATE)</span>
              </div>

              {/* Pause/Resume Rotation Button */}
              <button
                onClick={() => {
                  SoundEngine.playBlip(750);
                  setIsRotating(!isRotating);
                }}
                className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer backdrop-blur-md"
                title={isRotating ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
              >
                {isRotating ? (
                  <>
                    <Pause className="w-3 h-3 text-cyan-400" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>ROTATE</span>
                  </>
                )}
              </button>

              {/* Three.js Canvas */}
              <Canvas
                camera={{ position: [0, 0, 5.4], fov: 48 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color={theme.three3D?.light1 || '#38bdf8'} />
                <pointLight position={[-10, -10, -10]} intensity={1.0} color={theme.secondary || '#6366f1'} />
                <GlobeMesh
                  theme={theme}
                  activeNode={activeNode}
                  onSelectNode={handleSelectNode}
                  isRotating={isRotating}
                  targetRotation={targetRotation}
                />
              </Canvas>

              {/* Active Node Floating HUD Badge in Canvas */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-3 h-3 rounded-full animate-ping"
                    style={{ backgroundColor: activeNode.isHQ ? '#10b981' : theme.primary }}
                  />
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide">
                      {activeNode.city}, {activeNode.country}
                    </span>
                    <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase">
                      {activeNode.region}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-slate-400">INFERENCE:</span>
                  <span
                    className="font-bold px-2 py-0.5 rounded text-[11px]"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText,
                    }}
                  >
                    {livePing} ms
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Node Selector Chips Carousel below Canvas */}
            <div className="w-full mt-4 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {EDGE_NODES.map((node) => {
                const isSelected = activeNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleSelectNode(node)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                      isSelected
                        ? 'text-white shadow-lg scale-105'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border-slate-800'
                    }`}
                    style={{
                      backgroundColor: isSelected ? theme.badgeBg : undefined,
                      borderColor: isSelected ? theme.primary : undefined,
                      color: isSelected ? theme.badgeText : undefined,
                    }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        node.isHQ ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}
                      style={{ backgroundColor: isSelected ? theme.primary : undefined }}
                    />
                    <span>{node.city}</span>
                    {node.isHQ && <span className="text-[10px] text-emerald-400 font-bold">(HQ)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right / Bottom: Live Cyber Telemetry Inspector (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-6 sm:p-7 rounded-3xl border shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: `${theme.surface}f0`,
                borderColor: theme.borderSubtle,
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.7), 0 0 25px -8px ${theme.glowColor}`,
              }}
            >
              {/* Top Accent Gradient Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                }}
              />

              {/* Inspector Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    <Radio className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                    <span>NODE TELEMETRY INSPECTOR</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                    <span>{activeNode.city}</span>
                    <span className="text-sm font-normal text-slate-400 font-mono">
                      ({activeNode.country})
                    </span>
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 mt-0.5">
                    {activeNode.region}
                  </div>
                </div>

                <div
                  className="px-3 py-1 rounded-xl text-xs font-mono font-bold border shrink-0"
                  style={{
                    backgroundColor: activeNode.isHQ ? 'rgba(16, 185, 129, 0.15)' : theme.badgeBg,
                    borderColor: activeNode.isHQ ? 'rgba(16, 185, 129, 0.35)' : theme.badgeBorder,
                    color: activeNode.isHQ ? '#34d399' : theme.badgeText,
                  }}
                >
                  {activeNode.status}
                </div>
              </div>

              {/* Telemetry Grid Specs */}
              <div className="space-y-3.5 font-mono text-xs">
                {/* Ping Bar Indicator */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">INFERENCE LATENCY:</span>
                    <span className="text-sm font-bold text-emerald-400 flex items-center space-x-1">
                      <span>{livePing} ms</span>
                      <span className="text-[10px] text-slate-500 font-normal">(SUB-10MS SLA)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(10, (livePing / 30) * 100))}%`,
                        backgroundColor: livePing < 10 ? '#10b981' : livePing < 18 ? theme.primary : '#f59e0b',
                      }}
                    />
                  </div>
                </div>

                {/* Node Hardware Cluster */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">HARDWARE CLUSTER:</span>
                    <span className="text-slate-200 font-semibold">{activeNode.hardware}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-400">P2P FABRIC:</span>
                    <span className="text-slate-300">{activeNode.p2pMesh}</span>
                  </div>
                </div>

                {/* Telemetry Stats Rows */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] mb-0.5">CURRENT LOAD</div>
                    <div className="text-base font-bold text-white">{activeNode.load}</div>
                    <div className="text-[10px] text-slate-500">Auto-balanced</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-slate-400 text-[11px] mb-0.5">UPTIME SLA</div>
                    <div className="text-base font-bold text-emerald-400">{activeNode.health}</div>
                    <div className="text-[10px] text-slate-500">Zero Fault Tolerance</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Direct Connect to HQ + Inquire */}
              <div className="mt-6 pt-5 border-t border-slate-800/90 space-y-2.5">
                <a
                  href={getWhatsAppLeadLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg active:scale-95 group"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 8px 25px -6px ${theme.glowColor}`,
                  }}
                >
                  <span>Route Workload to {activeNode.city} via WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1">
                  <span>Bengaluru HQ Direct:</span>
                  <a
                    href="https://wa.me/919113233351"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    +91 91132 33351
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
