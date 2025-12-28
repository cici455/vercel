import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import FilmGrain from '@/components/ui/FilmGrain';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUMINA | Archetypal Life Simulator',
  description: 'Summon The Council. Analyze your fate.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${cinzel.variable} ${inter.variable} h-full m-0 p-0 overflow-hidden bg-[#050505] text-[#ededed] antialiased`}>
        <FilmGrain />
        {children}
      </body>
    </html>
  );
}
