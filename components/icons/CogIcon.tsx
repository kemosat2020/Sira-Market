
import React from 'react';

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 0115 0m-15 0H3m18 0h-1.5m-16.5 4.5l.223.447a11.25 11.25 0 0111.106 4.053l.447.223M3.75 7.5l.223-.447a11.25 11.25 0 0011.106-4.053l.447-.223M7.5 21a7.5 7.5 0 0010.607-10.607M7.5 3a7.5 7.5 0 0110.607 10.607" />
  </svg>
);

export default CogIcon;
