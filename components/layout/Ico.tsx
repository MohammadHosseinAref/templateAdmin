import type { IcoProps } from '@/types/layout/ico';

export type { IcoProps };

export default function Ico({ d, d2, className, strokeWidth = 1.8 }: IcoProps) {
  return (
    <svg
      className={className ?? 'w-5 h-5 flex-shrink-0'}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      {d2 && <path strokeLinecap="round" strokeLinejoin="round" d={d2} />}
    </svg>
  );
}
