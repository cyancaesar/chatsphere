import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const defaultUrl = 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'ChatSphere',
  description: 'ChatSphere built with Next.js and powered by Supabase!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <main className='min-h-screen flex flex-col items-center'>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
