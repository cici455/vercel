import type { Metadata } from 'next';
import { Cinzel, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import FilmGrain from '@/components/ui/FilmGrain';
import Background from '@/components/Background';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUMINA | The Architecture of Fate',
  description: 'Summon The Council. Analyze your fate.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${cinzel.variable} ${inter.variable} ${spaceGrotesk.variable} h-full m-0 p-0 overflow-hidden bg-black text-[#e2e8f0] antialiased`}>
        {/* Global liquid background */}
        <Background />
        
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27 opacity=%270.05%27/%3E%3C/svg%3E')] "></div>
        <FilmGrain />
        
        {/* Page content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
