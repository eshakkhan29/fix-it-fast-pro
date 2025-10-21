'use client';

export interface FrenchFlagIconProps {
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
 * French flag icon component
 */
export const FrenchFlagIcon = ({
  width = 17,
  height = 16,
  className,
  style,
}: FrenchFlagIconProps) => (
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
      d="M16.5 8C16.5 12.4183 12.9183 16 8.5 16C4.08172 16 0.5 12.4183 0.5 8C0.5 3.58172 4.08172 7.97112e-07 8.5 6.03983e-07C12.9183 4.10854e-07 16.5 3.58172 16.5 8Z"
      fill="#EEEEEE"
    />
    <path
      d="M5.7 0.503688C2.66267 1.63868 0.5 4.56678 0.5 8C0.5 11.4332 2.66267 14.3613 5.7 15.4963L5.7 0.503688Z"
      fill="#002495"
    />
    <path
      d="M11.3 15.4963C14.3373 14.3613 16.5 11.4332 16.5 8C16.5 4.56678 14.3373 1.63868 11.3 0.503687L11.3 15.4963Z"
      fill="#ED2939"
    />
  </svg>
);

export default FrenchFlagIcon;
