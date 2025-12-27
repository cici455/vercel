import './globals.css';
import { Cinzel, Inter } from 'next/font/google';

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

export const metadata = {
  title: 'LUMINA | Celestial Breath',
  description: 'The Life Simulator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${cinzel.variable} ${inter.variable} h-full m-0 p-0 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}