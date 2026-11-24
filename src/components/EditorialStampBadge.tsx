import React, { useId } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorialStampBadgeProps {
  text?: string;
  size?: number;
  highContrast?: boolean;
  className?: string;
}

export const EditorialStampBadge: React.FC<EditorialStampBadgeProps> = ({
  text = 'VOXEXAM PRO · VOICE ACCESSIBLE · INCLUSIVE · ',
  size = 112,
  highContrast = false,
  className = '',
}) => {
  const pathId = useId();

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 select-none',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full animate-stamp-spin"
      >
        <defs>
          <path
            id={pathId}
            d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke={highContrast ? '#FFFFFF' : '#1E1D1B'}
          strokeOpacity="0.14"
          strokeWidth="1"
        />
        <text
          fill={highContrast ? '#FFFFFF' : '#1E1D1B'}
          fontSize="8.6"
          fontWeight="600"
          letterSpacing="2.2"
          className="font-display uppercase"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none'
        )}
      >
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center border',
            highContrast
              ? 'border-white bg-black text-[#FF6B4A]'
              : 'border-[#1E1D1B]/12 bg-[#F7F4F0] text-[#E85A3C]'
          )}
        >
          <Heart className="w-4 h-4 fill-current" />
        </div>
      </div>
    </div>
  );
};
