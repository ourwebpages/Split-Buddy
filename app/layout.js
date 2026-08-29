import './globals.css';
import { Nunito } from 'next/font/google';
import { AuthProvider } from '../lib/authContext';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata = {
  title: 'SplitBuddy',
  description:
    'Track shared expenses with roommates and settle up with the fewest payments possible.',
  openGraph: {
    title: 'SplitBuddy',
    description:
      'Shared expenses. Zero stress. Track group spending and settle up with minimum payments.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} bg-gray-50 text-gray-900`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
