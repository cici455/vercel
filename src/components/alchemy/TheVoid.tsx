'use client';

import { useState } from 'react';
import { useLuminaStore } from '@/store/luminaStore';
import { Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TheVoid() {
  const { addVoidEnergy, deleteMessage } = useLuminaStore();
  const [isHovering, setIsHovering] = useState(false);
  const [active, setActive] = useState(false);

  const handleDrop = (e: React.DragEvent, messageId: string) => {
    e.preventDefault();
    setIsHovering(false);
    setActive(true);
    
    // Process "eating" the message
    deleteMessage(messageId);
    addVoidEnergy(10);

    setTimeout(() => setActive(false), 1000);
  };

  return (
    <div 
      className="absolute bottom-8 right-8 z-50 flex flex-col items-center justify-center"
      onDragOver={(e) => {
        e.preventDefault();
        setIsHovering(true);
      }}
      onDragLeave={() => setIsHovering(false)}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("text/plain");
        if (id) handleDrop(e, id);
      }}
    >
      <div className="relative">
        {/* Black Hole Core */}
        <motion.div 
          animate={{ 
            scale: isHovering ? 1.5 : 1,
            rotate: 360 
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.3 }
          }}
          className={`w-16 h-16 rounded-full bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden transition-all duration-300 ${isHovering ? 'border-starlight/50 shadow-[0_0_50px_rgba(212,175,55,0.3)]' : ''}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/80 to-black" />
          <Trash2 className={`w-6 h-6 text-white/20 transition-colors ${isHovering ? 'text-red-400' : ''}`} />
        </motion.div>

        {/* Event Horizon Particles */}
        {active && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 2,
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100
                }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-starlight blur-[1px]"
              />
            ))}
          </>
        )}
      </div>
      
      <p className="mt-2 text-[10px] uppercase tracking-widest text-white/20 font-cinzel">
        The Void
      </p>
    </div>
  );
}
