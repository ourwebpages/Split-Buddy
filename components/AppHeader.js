'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';

export default function AppHeader({ title, backHref }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/auth/login');
  }

  const initial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <Link
              href={backHref}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              title="Go back"
            >
              ←
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SplitBuddy"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-lg object-contain"
              />
              <span className="font-nunito hidden text-lg font-bold text-brand-navy sm:inline">
                Split<span className="text-gradient-brand">Buddy</span>
              </span>
            </Link>
          )}
          {title && (
            <div className="min-w-0">
              <h1 className="truncate font-nunito text-base font-bold text-brand-navy sm:text-lg">
                {title}
              </h1>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-gray-50/80 py-1 pl-1.5 pr-3 shadow-2xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-[11px] font-bold text-white shadow-xs">
                {initial}
              </div>
              <span className="hidden max-w-[9rem] truncate text-xs font-semibold text-gray-700 sm:inline">
                {user.displayName || user.email}
              </span>
            </div>
          )}
          <button
            type="button"
            aria-label="Log out"
            onClick={handleLogout}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
