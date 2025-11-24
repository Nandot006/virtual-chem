import type { SVGProps } from "react";

interface BeakerIconProps extends SVGProps<SVGSVGElement> {
  liquidPercentage?: number;
  liquidColor?: string;
}

const BeakerIcon = ({ liquidPercentage = 0, liquidColor = "hsla(210, 90%, 50%, 0.5)", ...props }: BeakerIconProps) => {
  const liquidHeight = Math.max(0, Math.min(100, liquidPercentage));
  const y = 100 - liquidHeight;

  return (
    <svg viewBox="0 0 100 100" {...props}>
      <defs>
        <clipPath id="beakerClip">
          <path d="M15 95V15H85V95L75 85H25L15 95Z" />
        </clipPath>
      </defs>

      {/* Liquid */}
      <g clipPath="url(#beakerClip)">
        <rect x="0" y={y} width="100" height={liquidHeight} fill={liquidColor} style={{ transition: "y 0.5s ease, fill 0.5s ease" }} />
      </g>
      
      {/* Beaker Outline */}
      <path
        d="M10 5H90V10H85V90L75 100H25L15 90V10H10V5Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Markings */}
      <path d="M25 30H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 50H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 70H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default BeakerIcon;
