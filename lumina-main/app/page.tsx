'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // 立即重定向到 index.html（双重保险）
    if (typeof window !== 'undefined') {
      // 使用 replace 而不是 href，避免在历史记录中留下记录
      window.location.replace('/index.html');
    }
  }, []);

  // 如果 JavaScript 未加载，meta refresh 标签会处理重定向
  return (
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
      fontFamily: 'sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{ textAlign: 'center', zIndex: 9999 }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '2px solid #fff', 
          borderTop: '2px solid transparent',
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ marginBottom: '1rem', fontSize: '1rem' }}>正在跳转...</p>
        <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
          <a href="/index.html" style={{ color: '#4fd1c7', textDecoration: 'underline', cursor: 'pointer' }}>
            如果未自动跳转，请点击这里
          </a>
        </p>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        ` }} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if (typeof window !== 'undefined') {
              window.location.replace('/index.html');
            }
          })();
        ` }} />
      </div>
    </div>
  );
}
