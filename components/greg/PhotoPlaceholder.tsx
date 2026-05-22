import { Camera } from 'lucide-react';

interface PhotoPlaceholderProps {
  label?: string;
  className?: string;
  /** CSS aspect-ratio value, e.g. "4 / 3". */
  aspect?: string;
}

/**
 * Stand-in for a project photo that has not been added yet. Keeps the
 * layout intact and makes it obvious where a real image belongs, with
 * no broken-image icons.
 */
export default function PhotoPlaceholder({
  label = 'Project photo',
  className = '',
  aspect,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-bg-tertiary text-text-dim ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <Camera size={24} aria-hidden />
      <span className="px-3 text-center text-[11px] font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
