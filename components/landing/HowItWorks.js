import SectionHeading from './ui/SectionHeading';

const steps = [
  {
    number: '1',
    title: 'Create a group',
    description: 'Name your flat and get a 6-character invite code to share with roommates.',
  },
  {
    number: '2',
    title: 'Add expenses',
    description: 'Groceries, utilities, takeout — log who paid and split equally.',
  },
  {
    number: '3',
    title: 'Settle up',
    description: 'See exactly who pays whom, with the fewest payments needed.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="How it works"
          subtitle="From first expense to final settlement in three simple steps."
        />

        <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          <div
            className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-brand-teal via-brand-orange to-brand-purple opacity-30 md:block"
            aria-hidden
          />

          {steps.map((step) => (
            <li key={step.number} className="relative text-center md:text-left">
              <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand font-nunito text-xl font-bold text-white shadow-md md:mx-0">
                {step.number}
              </div>
              <h3 className="mt-5 font-nunito text-lg font-bold text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
