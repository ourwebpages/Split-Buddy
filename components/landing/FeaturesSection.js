import SectionHeading from './ui/SectionHeading';

const features = [
  {
    title: 'Log & split',
    description:
      'Add expenses with who paid and who shares — equal split in seconds.',
    gradient: 'from-brand-teal to-emerald-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" aria-hidden>
        <path
          d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Live balances',
    description:
      'See who owes whom update in real time as roommates add expenses.',
    gradient: 'from-brand-orange to-amber-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" aria-hidden>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 19c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 17.5c0-1.5 1-2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Fewest payments',
    description:
      'Get the minimum number of transactions to settle everyone up.',
    gradient: 'from-brand-blue to-brand-purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" aria-hidden>
        <path
          d="M5 12h14M14 7l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Everything your flat needs"
          subtitle="No mental math, no awkward reminders — just clear balances and simple settlements."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-md"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 font-nunito text-lg font-bold text-brand-navy">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
