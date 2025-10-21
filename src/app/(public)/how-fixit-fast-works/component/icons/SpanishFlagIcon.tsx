'use client';

export interface SpanishFlagIconProps {
  /** Width of the icon */
  width?: number;
  /** Height of the icon */
  height?: number;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Spanish flag icon component
 */
export const SpanishFlagIcon = ({
  width = 17,
  height = 16,
  className,
  style,
}: SpanishFlagIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M8.5 16C4.08172 16 0.5 12.4183 0.5 8C0.5 3.58172 4.08172 -1.93129e-07 8.5 0C12.9183 1.93129e-07 16.5 3.58172 16.5 8C16.5 12.4183 12.9183 16 8.5 16Z"
      fill="#FFDB44"
    />
    <path
      d="M15.9963 5.2C14.8613 2.16267 11.9332 1.50071e-07 8.5 0C5.06678 -1.50071e-07 2.13868 2.16267 1.00369 5.2L15.9963 5.2Z"
      fill="#D90026"
    />
    <path
      d="M1.00369 10.8C2.13868 13.8373 5.06678 16 8.5 16C11.9332 16 14.8613 13.8373 15.9963 10.8L1.00369 10.8Z"
      fill="#D90026"
    />
  </svg>
);

export default SpanishFlagIcon;
