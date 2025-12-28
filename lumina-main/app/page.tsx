'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // 立即重定向到 index.html
    if (typeof window !== 'undefined') {
      window.location.replace('/index.html');
    }
  }, []);

  return (
    <>
      <Script id="redirect" strategy="beforeInteractive">
        {`if (typeof window !== 'undefined') { window.location.replace('/index.html'); }`}
      </Script>
      <div style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: '#000', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        fontFamily: 'sans-serif' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '2px solid #fff', 
            borderTop: '2px solid transparent',
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ marginBottom: '1rem' }}>正在跳转...</p>
          <p style={{ fontSize: '0.875rem' }}>
            <a href="/index.html" style={{ color: '#4fd1c7', textDecoration: 'underline' }}>
              如果未自动跳转，请点击这里
            </a>
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}
