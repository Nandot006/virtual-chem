import type { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2l7.79 4.5V17.5L12 22l-7.79-4.5V6.5L12 2z" />
    <path d="M12 2v10" />
    <path d="m19.79 6.5-15.58 9" />
    <path d="m4.21 6.5 15.58 9" />
  </svg>
);

export default Logo;
