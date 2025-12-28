'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars(props: any) {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random positions and initial phases for breathing
  const [positions, phases] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 100; // Radius between 50 and 150
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      phases[i] = Math.random() * Math.PI * 2;
    }
    return [positions, phases];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Drift
      ref.current.rotation.x -= delta / 50;
      ref.current.rotation.y -= delta / 60;
      
      // Breathing effect handled in shader or simply by scaling/opacity if using custom shader
      // For PointMaterial, we can't easily animate per-particle opacity without a custom shader.
      // So we will just drift the whole group and maybe pulse the size slightly?
      // Or we can use a custom shader material.
      // For simplicity and performance, let's stick to rotation drift for now, 
      // but maybe add a sine wave to the scale to simulate "breathing" of the whole field?
      // Actually, let's use the 'transparent' and 'opacity' prop on PointMaterial and animate that?
      // No, that would flash all stars.
      
      // Let's just stick to the drift as requested: "slow drift".
      // "breathing opacity" is hard without custom shader for Points.
      // I will use @react-three/drei's <Stars> again but with better settings or stick to this manual one.
      // The user asked for "breathing (opacity change)". 
      // I'll try to implement a simple shader material for that.
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

// Custom Shader Star for Breathing
const StarShaderMaterial = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color('#ffffff') }
  },
  vertexShader: `
    attribute float phase;
    varying float vAlpha;
    uniform float time;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      
      // Breathing calculation
      float breath = 0.5 + 0.5 * sin(time * 1.0 + phase);
      vAlpha = breath;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying float vAlpha;
    void main() {
      if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
      gl_FragColor = vec4(color, vAlpha);
    }
  `
};

function BreathingStars() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, phases] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      phases[i] = Math.random() * Math.PI * 2;
    }
    return [positions, phases];
  }, []);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#ffffff') }
    },
    vertexShader: StarShaderMaterial.vertexShader,
    fragmentShader: StarShaderMaterial.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  useFrame((state) => {
    if (ref.current) {
      // Update time uniform
      const material = ref.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.elapsedTime;
      
      // Drift
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={phases.length}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial attach="material" args={[shaderArgs]} />
    </points>
  );
}

export default function StarField() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <BreathingStars />
      </Canvas>
    </div>
  );
}
