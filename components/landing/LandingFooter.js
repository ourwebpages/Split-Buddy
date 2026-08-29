'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../lib/authContext';

export default function LandingFooter() {
  const { user, loading } = useAuth();

  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            aria-hidden
          />
          <span className="font-nunito text-base font-bold text-brand-navy">
            Split<span className="text-gradient-brand">Buddy</span>
          </span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Shared expenses. Zero stress.
        </p>

        {!loading && (
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            {user ? (
              <Link
                href="/dashboard"
                className="text-brand-navy transition hover:text-brand-blue"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-brand-navy transition hover:text-brand-blue"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-brand-navy transition hover:text-brand-blue"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        )}

        <p className="text-sm text-brand-muted">Built for roommates. Free to use.</p>
      </div>
    </footer>
  );
}
