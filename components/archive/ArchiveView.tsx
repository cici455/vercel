'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLuminaStore, ArchiveItem } from '@/store/luminaStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { Background, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

function Star({ item, onClick }: { item: ArchiveItem; onClick: (item: ArchiveItem) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random position on a sphere
  const position = useMemo(() => {
    const r = 20 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }, []);

  const color = item.outcome === 'gold' ? '#fbbf24' : item.outcome === 'red' ? '#f87171' : '#60a5fa';

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      if (hovered) {
        ref.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
      } else {
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onClick={() => onClick(item)}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
      >
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {hovered && (
        <Billboard>
          <Text fontSize={0.5} position={[0, 1.2, 0]} color={color}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function StarMapScene({ archives, onSelect }: { archives: ArchiveItem[], onSelect: (item: ArchiveItem) => void }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {archives.map((item) => (
        <Star key={item.id} item={item} onClick={onSelect} />
      ))}
      <Billboard position={[0, 0, 0]}>
         <Text fontSize={3} color="rgba(255,255,255,0.05)" font="https://fonts.gstatic.com/s/cinzel/v11/8vIJ7ww63mVu7gt78Uk.woff">
            ARCHIVES
         </Text>
      </Billboard>
    </>
  );
}

export function ArchiveView() {
  const { archives, setPhase } = useLuminaStore();
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => setPhase('observatory')}
          className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Exit Archives
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 35], fov: 60 }}>
        <StarMapScene archives={archives} onSelect={setSelectedItem} />
        <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
      </Canvas>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <div 
              className="w-full max-w-4xl h-[80vh] bg-[#050505] border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                <div>
                  <h2 className="text-2xl font-cinzel text-starlight mb-1">Fate Snapshot</h2>
                  <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedItem.date).toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>

              <div className="flex-1 relative bg-black/50">
                <ReactFlow
                  nodes={selectedItem.nodes}
                  edges={selectedItem.edges}
                  fitView
                  attributionPosition="bottom-right"
                  className="bg-transparent"
                  nodesDraggable={false}
                  panOnDrag={true}
                >
                   <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.1 }} />
                </ReactFlow>
              </div>
              
              <div className="p-4 border-t border-white/10 bg-white/5">
                <p className="text-sm text-white/70 italic font-serif">"{selectedItem.summary}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple OrbitControls wrapper to avoid full drei import overhead if not needed, 
// but we used Billboard/Text so we likely have drei installed. 
// Let's import OrbitControls from drei.
import { OrbitControls } from '@react-three/drei';
