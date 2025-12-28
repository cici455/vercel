'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // 重定向到 index.html
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
}
