import React from 'react';

interface InverseRoundedCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  className?: string;
}

const InverseRoundedCorner: React.FC<InverseRoundedCornerProps> = ({
  position,
  size = 24,
  className = '',
}) => {
  // Position mapping for the corner
  const positionStyles: Record<InverseRoundedCornerProps['position'], React.CSSProperties> = {
    'top-left': {
      top: 0,
      left: 0,
      clipPath: 'path("M0 0 H' + size + ' V' + size + ' A' + size + ' ' + size + ' 0 0 0 0 0 Z")',
    },
    'top-right': {
      top: 0,
      right: 0,
      clipPath: 'path("M0 0 H' + size + ' V' + size + ' A' + size + ' ' + size + ' 0 0 1 0 0 Z")',
    },
    'bottom-left': {
      bottom: 0,
      left: 0,
      clipPath: 'path("M0 0 H' + size + ' V' + size + ' A' + size + ' ' + size + ' 0 0 1 0 0 Z")',
    },
    'bottom-right': {
      bottom: 0,
      right: 0,
      clipPath: 'path("M0 0 H' + size + ' V' + size + ' A' + size + ' ' + size + ' 0 0 0 0 0 Z")',
    },
  };

  return (
    <div
      className={`absolute ${className}`}
      style={{
        width: size,
        height: size,
        ...positionStyles[position],
      }}
    />
  );
};

export default InverseRoundedCorner; 