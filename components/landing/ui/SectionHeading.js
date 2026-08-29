export default function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <h2 className="font-nunito text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-brand-muted sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
