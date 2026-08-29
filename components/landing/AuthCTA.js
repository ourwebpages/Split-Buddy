'use client';

import { getPostAuthPath, useAuth } from '../../lib/authContext';
import Button from './ui/Button';

export default function AuthCTA({
  loggedOutPrimary = { label: 'Get started free', href: '/auth/signup' },
  loggedOutSecondary = { label: 'Log in', href: '/auth/login' },
  loggedIn = { label: 'Go to dashboard', href: '/dashboard' },
  layout = 'row',
  primaryVariant = 'primary',
  secondaryVariant = 'secondary',
  loggedInVariant = 'primary',
  className = '',
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-sm text-brand-muted">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className={className}>
        <Button href={getPostAuthPath(user)} variant={loggedInVariant}>
          {loggedIn.label}
        </Button>
      </div>
    );
  }

  const flexClass =
    layout === 'column'
      ? 'flex flex-col items-center gap-3'
      : 'flex flex-wrap items-center justify-center gap-3 sm:justify-start';

  return (
    <div className={`${flexClass} ${className}`}>
      <Button href={loggedOutPrimary.href} variant={primaryVariant}>
        {loggedOutPrimary.label}
      </Button>
      {loggedOutSecondary && (
        <Button href={loggedOutSecondary.href} variant={secondaryVariant}>
          {loggedOutSecondary.label}
        </Button>
      )}
    </div>
  );
}
