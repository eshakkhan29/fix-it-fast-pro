'use client';

import { Box, Group, Paper } from '@mantine/core';
import { useState } from 'react';

export interface IllustrationCardProps {
  /** Custom class name for the card container */
  className?: string;
  /** Custom styles for the card container */
  style?: React.CSSProperties;
  /** Width of the card */
  width?: number | string;
  /** Height of the card */
  height?: number | string;
  /** Current active slide index */
  activeSlide?: number;
  /** Total number of slides */
  totalSlides?: number;
  /** Callback when slide changes */
  onSlideChange?: (index: number) => void;
  /** Custom icon/image to display in center */
  icon?: React.ReactNode;
}

/**
 * IllustrationCard component displays a card with gradient background and pagination dots
 * Matches Figma design with 100% accuracy
 */
export const IllustrationCard = ({
  className,
  style,
  width = 480,
  height = 440,
  activeSlide = 0,
  totalSlides = 4,
  onSlideChange,
  icon
}: IllustrationCardProps) => {
  const [currentSlide, setCurrentSlide] = useState(activeSlide);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  const defaultIcon = (
    <Box
      style={{
        width: 131,
        height: 131,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width="109"
        height="109"
        viewBox="0 0 109 109"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
        }}
      >
        <rect
          x="9.08334"
          y="18.1667"
          width="90.8333"
          height="72.6667"
          rx="4.54167"
          fill="white"
          stroke="#DFE1E6"
          strokeWidth="1.13542"
        />
        <circle
          cx="27.25"
          cy="36.3333"
          r="9.08333"
          fill="#C1C7CF"
        />
        <path
          d="M18.1667 72.6667L36.3333 54.5L54.5 72.6667"
          stroke="#C1C7CF"
          strokeWidth="2.27083"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M54.5 63.5833L63.5833 54.5L81.75 72.6667"
          stroke="#C1C7CF"
          strokeWidth="2.27083"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );

  return (
    <Paper
      className={className}
      style={{
        width,
        height,
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(0, 125, 55, 0.1) 0%, rgba(0, 50, 18, 0.004) 100%)',
        border: '1px solid var(--mantine-color-neutral-3)',
        overflow: 'hidden',
        ...style
      }}
      radius={24}
      shadow="sm"
    >
      {/* Main content area */}
      <Box
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Central icon/image */}
        {icon || defaultIcon}

        {/* Top pagination dots */}
        <Group
          gap={4}
          style={{
            position: 'absolute',
            top: 375,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <Box
              key={`top-${index}`}
              onClick={() => handleDotClick(index)}
              style={{
                width: index === currentSlide ? 33 : 11,
                height: 11,
                borderRadius: 21,
                backgroundColor: index === currentSlide ? '#5e00cc' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0px 1px 2px rgba(13, 13, 18, 0.04)'
              }}
            />
          ))}
        </Group>

        {/* Bottom pagination dots */}
        <Group
          gap={4}
          style={{
            position: 'absolute',
            top: 403,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => (
            <Box
              key={`bottom-${index}`}
              onClick={() => handleDotClick(index)}
              style={{
                width: index === currentSlide ? 33 : 11,
                height: 11,
                borderRadius: 21,
                backgroundColor: index === currentSlide ? '#5e00cc' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0px 1px 2px rgba(13, 13, 18, 0.04)'
              }}
            />
          ))}
        </Group>
      </Box>

      {/* Border overlay for crisp edges */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid #dfe1e6',
          borderRadius: 24,
          pointerEvents: 'none',
          boxShadow: '0px 1px 2px 0px rgba(13, 13, 18, 0.04)'
        }}
      />
    </Paper>
  );
};

export default IllustrationCard;