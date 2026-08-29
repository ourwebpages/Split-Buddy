import Link from 'next/link';

const variants = {
  primary:
    'bg-gradient-brand text-white shadow-md hover:opacity-90 focus-visible:ring-brand-blue',
  secondary:
    'border border-gray-300 bg-white text-brand-navy hover:bg-gray-50 focus-visible:ring-brand-blue',
  ghost: 'text-brand-navy hover:text-brand-blue focus-visible:ring-brand-blue',
  white:
    'bg-white text-brand-blue shadow-md hover:bg-gray-50 focus-visible:ring-white',
};

export default function Button({
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
