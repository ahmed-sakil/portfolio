import React from 'react';
import { cn } from '../../lib/utils';

interface HexagonBackgroundProps {
  className?: string;
  size?: number; // Side length of the regular hexagon in px (default: 14)
  strokeWidth?: number;
  opacity?: number;
}

export const HexagonBackground: React.FC<HexagonBackgroundProps> = ({
  className,
  size = 14,
  strokeWidth = 0.75,
  opacity = 0.35,
}) => {
  // Flat-topped regular equilateral hexagon honeycomb geometry:
  // For side length s:
  // Tile Width W = 3 * s
  // Tile Height H = sqrt(3) * s
  // Each hexagon has 6 equal sides of length s and interior angles of 120°.
  // Every hexagon is surrounded by exactly 6 adjacent regular hexagons.
  const s = size;
  const sHalf = s / 2;
  const W = 3 * s;
  const H = +(Math.sqrt(3) * s).toFixed(4);
  const hH = +(H / 2).toFixed(4);

  // Exact 6 non-overlapping segments per unit tile:
  const pathD = `M 0,${hH} L ${sHalf},0 H ${s + sHalf} L ${2 * s},${hH} L ${s + sHalf},${H} M 0,${hH} L ${sHalf},${H} M ${2 * s},${hH} H ${W}`;

  return (
    <div
      className={cn('absolute inset-0 pointer-events-none overflow-hidden z-0', className)}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="mathematical-honeycomb-pattern"
            width={W}
            height={H}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={strokeWidth}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mathematical-honeycomb-pattern)" />
      </svg>
    </div>
  );
};
