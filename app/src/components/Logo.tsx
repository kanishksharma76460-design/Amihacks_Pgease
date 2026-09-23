import { useId } from 'react';

export default function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const raw = useId();
  const id = 'pg' + raw.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id})`} />
      <path
        d="M9 21v-7.5L16 8l7 5.5V21"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="13.5" y="17.5" width="5" height="3.5" rx="1" fill="#fff" />
      <circle cx="22.5" cy="9.5" r="2.25" fill="#fde68a" />
    </svg>
  );
}
