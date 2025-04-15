import React from 'react';

interface FooterCornerProps {
  className?: string;
}

const FooterCorner: React.FC<FooterCornerProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 50V0C27.6142 0 50 22.3858 50 50H0Z"
        fill="currentColor"
      />
      <path
        d="M100 50V0C72.3858 0 50 22.3858 50 50H100Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FooterCorner; 