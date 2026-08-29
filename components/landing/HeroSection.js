import Image from 'next/image';
import AuthCTA from './AuthCTA';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-brand-radial">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="text-center md:text-left">
          <p className="font-nunito text-sm font-semibold uppercase tracking-widest text-brand-blue">
            Shared expenses. Zero stress.
          </p>
          <h1 className="mt-4 font-nunito text-4xl font-bold leading-tight tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
            Split bills with roommates,{' '}
            <span className="text-gradient-brand">not spreadsheets</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-muted sm:text-lg md:mx-0 mx-auto">
            Track shared expenses with your flatmates, see who owes whom in real
            time, and settle up with the fewest payments possible.
          </p>
          <AuthCTA
            className="mt-8"
            loggedOutPrimary={{ label: 'Get started free', href: '/auth/signup' }}
            loggedOutSecondary={{ label: 'Log in', href: '/auth/login' }}
          />
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-10 blur-2xl" />
            <Image
              src="/logo.png"
              alt="SplitBuddy — shared expenses for roommates"
              width={320}
              height={320}
              priority
              className="relative h-auto w-full max-w-[280px] object-contain sm:max-w-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
