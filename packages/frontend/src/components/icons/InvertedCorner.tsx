import React from 'react';

interface InvertedCornerProps {
  width?: number;
  height?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  radius?: number;
  className?: string;
}

const InvertedCorner: React.FC<InvertedCornerProps> = ({
  width = 50,
  height = 50,
  position = 'top-right',
  color = '#e02d3a',
  radius = 25,
  className = '',
}) => {
  // Default path is for top-right
  let path = '';
  let clipPath = '';
  
  switch (position) {
    case 'top-left':
      path = `M${width},0 H0 V${height} H${radius} C${radius},${radius} ${width-radius},${radius} ${width},${height-radius} V0 Z`;
      clipPath = `M0,${height} H${radius} C${radius},${radius} ${width-radius},${radius} ${width},${height-radius} V${height} H0 Z`;
      break;
    case 'top-right':
      path = `M0,0 H${width} V${height} H${width-radius} C${width-radius},${radius} ${radius},${radius} 0,${height-radius} V0 Z`;
      clipPath = `M${width},${height} H${width-radius} C${width-radius},${radius} ${radius},${radius} 0,${height-radius} V${height} H${width} Z`;
      break;
    case 'bottom-left':
      path = `M${width},${height} H0 V0 H${radius} C${radius},${height-radius} ${width-radius},${height-radius} ${width},${radius} V${height} Z`;
      clipPath = `M0,0 H${radius} C${radius},${height-radius} ${width-radius},${height-radius} ${width},${radius} V0 H0 Z`;
      break;
    case 'bottom-right':
      path = `M0,${height} H${width} V0 H${width-radius} C${width-radius},${height-radius} ${radius},${height-radius} 0,${radius} V${height} Z`;
      clipPath = `M${width},0 H${width-radius} C${width-radius},${height-radius} ${radius},${height-radius} 0,${radius} V0 H${width} Z`;
      break;
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <clipPath id={`invertedCornerClip-${position}`}>
          <path d={clipPath} />
        </clipPath>
      </defs>
      <path 
        d={path} 
        fill={color}
        clipPath={`url(#invertedCornerClip-${position})`} 
      />
    </svg>
  );
};

export default InvertedCorner; 