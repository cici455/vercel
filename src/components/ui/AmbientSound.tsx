'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Using a placeholder white noise / ambient track
  // In a real project, this would be a local file in /public/sounds/
  const AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/03/24/audio_03f5655a58.mp3?filename=space-atmosphere-21394.mp3"; 

  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <button 
        onClick={toggleSound}
        className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-starlight hover:bg-white/10 hover:border-starlight/30 transition-all duration-300 backdrop-blur-md group"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 group-hover:animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
      <audio ref={audioRef} src={AUDIO_URL} loop />
    </div>
  );
}
