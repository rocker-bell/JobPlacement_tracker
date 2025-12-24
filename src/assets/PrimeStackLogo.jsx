import React from 'react';

const PrimeStackLogo = ({ width = 180, height = 40, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 185 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Prime Stack Logo"
      style={{ cursor: 'pointer' }}
    >
      {/* Icon: Stacked Layers */}
      {/* Bottom Layer */}
      <rect x="0" y="27" width="24" height="6" rx="3" fill="#1f2937" />
      {/* Middle Layer (Highlight) */}
      <rect x="0" y="17" width="24" height="6" rx="3" fill="#f97316" />
      {/* Top Layer */}
      <rect x="0" y="7" width="24" height="6" rx="3" fill="#1f2937" />

      {/* Text: Prime */}
      <text
        x="34"
        y="30"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#1f2937"
        letterSpacing="-0.5px"
      >
        Prime
      </text>

      {/* Text: Stack */}
      <text
        x="106"
        y="30"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="24"
        fill="#f97316"
        letterSpacing="-0.5px"
      >
        Stack
      </text>
    </svg>
  );
};

export default PrimeStackLogo;