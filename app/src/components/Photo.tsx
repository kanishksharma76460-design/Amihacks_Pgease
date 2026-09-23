import { Building2 } from 'lucide-react';
import { gradientFor } from '../lib/listings';
import { cx } from '../lib/utils';

export default function Photo({
  seed,
  label,
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  const [a, b] = gradientFor(seed);
  return (
    <div
      className={cx('relative flex items-center justify-center overflow-hidden', className)}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <Building2 size={42} className="text-white/60" />
      {label ? (
        <span className="absolute bottom-2 left-2 rounded bg-black/30 px-1.5 py-0.5 text-xs font-medium text-white">
          {label}
        </span>
      ) : null}
    </div>
  );
}
