import type { Metadata } from 'next';
import { Cinzel, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import FilmGrain from '@/components/ui/FilmGrain';

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
      <body className={`${cinzel.variable} ${inter.variable} ${spaceGrotesk.variable} h-full m-0 p-0 overflow-hidden bg-[#000000] text-[#e2e8f0] antialiased`}>
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E')] "></div>
        {/* Remove static vignette here as IntroView handles it now */}
        <FilmGrain />
        {children}
      </body>
    </html>
  );
}
