import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, GradientTexture, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Sparks = ({ count, colors, hovered }: { count: number, colors: string[], hovered: boolean }) => {
  const points = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const { positions, velocities } = particles;
    
    for (let i = 0; i < count; i++) {
      if (hovered) {
        positions[i * 3] += velocities[i * 3] * 2;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * 2;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * 2;
      } else {
        // Gently drift back or just stay
        positions[i * 3] += velocities[i * 3] * 0.2;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.2;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.2;
      }

      // Reset if too far
      const dist = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2);
      if (dist > 3) {
        positions[i * 3] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={particles.positions} stride={3}>
      <PointMaterial
        transparent
        color={colors[0]}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={hovered ? 0.8 : 0}
      />
    </Points>
  );
};

export const Scene = ({ isLoading }: { isLoading: boolean }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (sphereRef.current) {
      const t = state.clock.getElapsedTime();
      sphereRef.current.rotation.x = t * (isLoading ? 0.8 : 0.2);
      sphereRef.current.rotation.y = t * (isLoading ? 1.2 : 0.3);
      
      // Pulsate gently or rapidly if loading
      const pulseFreq = isLoading ? 4 : 1.5;
      const pulseAmp = isLoading ? 0.15 : 0.05;
      const pulse = 1 + Math.sin(t * pulseFreq) * pulseAmp;
      const hoverScale = hovered ? 1.1 : 1;
      sphereRef.current.scale.setScalar(pulse * hoverScale);
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0502']} />
      <fog attach="fog" args={['#0a0502', 5, 15]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

      <Float speed={isLoading ? 4 : 1.5} rotationIntensity={isLoading ? 2 : 1} floatIntensity={isLoading ? 4 : 2}>
        <group>
          <Sphere 
            ref={sphereRef} 
            args={[1.5, 64, 64]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <MeshDistortMaterial
              color={isLoading ? "#9013fe" : (hovered ? "#60a5fa" : "#4a90e2")}
              speed={isLoading ? 8 : (hovered ? 4 : 2)}
              distort={isLoading ? 0.8 : (hovered ? 0.6 : 0.4)}
              radius={1}
            >
              <GradientTexture
                stops={[0, 0.5, 1]}
                colors={isLoading ? ['#9013fe', '#ff0080', '#4a90e2'] : ['#4a90e2', '#9013fe', '#50e3c2']}
                size={1024}
              />
            </MeshDistortMaterial>
          </Sphere>
          <Sparks count={isLoading ? 300 : 100} colors={isLoading ? ['#ff0080', '#9013fe'] : ['#ffffff', '#4a90e2']} hovered={hovered || isLoading} />
        </group>
      </Float>

      {/* Floating particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <InteractiveParticle key={i} />
      ))}

      {/* Ground reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#050505" 
          roughness={0.1} 
          metalness={0.8}
        />
      </mesh>
    </>
  );
};

const InteractiveParticle = () => {
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  ] as [number, number, number], []);

  return (
    <Float speed={Math.random() * 2} rotationIntensity={2} floatIntensity={2}>
      <Sphere
        args={[0.02, 16, 16]}
        position={pos}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#4ade80" : "#ffffff"}
          emissive={hovered ? "#4ade80" : "#ffffff"}
          emissiveIntensity={hovered ? 10 : 2}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
};
