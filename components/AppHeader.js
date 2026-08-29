'use client';

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

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          {backHref ? (
            <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-900">
              Back
            </Link>
          ) : (
            <Link href="/dashboard" className="text-sm font-medium text-gray-900">
              split-buddy
            </Link>
          )}
          {title && (
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden max-w-[10rem] truncate text-sm text-gray-500 sm:inline">
            {user?.displayName || user?.email}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
