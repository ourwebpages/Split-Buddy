'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../lib/authContext';
import Button from './ui/Button';

export default function LandingNav() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="SplitBuddy"
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 rounded-lg object-contain sm:h-10 sm:w-10"
          />
          <span className="font-nunito truncate text-lg font-bold text-brand-navy sm:text-xl">
            Split<span className="text-gradient-brand">Buddy</span>
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          {loading ? (
            <span className="text-sm text-brand-muted">...</span>
          ) : user ? (
            <Button href="/dashboard" variant="primary" className="px-4 sm:px-6">
              Go to dashboard
            </Button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-brand-navy transition hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              >
                Log in
              </Link>
              <Button href="/auth/signup" variant="primary" className="px-4 sm:px-6">
                Sign up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
