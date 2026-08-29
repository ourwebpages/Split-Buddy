'use client';

import AuthCTA from './AuthCTA';

export default function FinalCTA() {
  return (
    <section className="bg-gradient-brand py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-nunito text-3xl font-bold text-white sm:text-4xl">
          Ready to stop the spreadsheet?
        </h2>
        <p className="mt-4 text-base text-white/90 sm:text-lg">
          Create a group, invite your roommates, and start tracking shared expenses
          in under two minutes.
        </p>
        <AuthCTA
          className="mt-8 justify-center"
          layout="column"
          loggedOutPrimary={{ label: 'Create your group', href: '/auth/signup' }}
          loggedOutSecondary={null}
          loggedIn={{ label: 'Go to dashboard', href: '/dashboard' }}
          primaryVariant="white"
          loggedInVariant="white"
        />
      </div>
    </section>
  );
}
