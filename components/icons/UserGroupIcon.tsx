
import React from 'react';

const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72M10.5 18.75a9.094 9.094 0 01-3.741-.479 3 3 0 01-4.682-2.72m7.5-2.962V18a9.094 9.094 0 01-3.741-.479M15 15a3 3 0 01-3-3m3 3a3 3 0 00-3-3m-3.75 3H9.75m-4.5 0H5.25m5.25 0H9.75m-4.5 0H5.25M9 9.75a3 3 0 01-3-3m3 3a3 3 0 00-3-3m-3.75 3H3.75m4.5 0H6.75m2.25 0H9.75m4.5 0H13.5m-2.25 0H12m2.25 0H13.5m2.25 0H15.75m-2.25 0h.008v.008h-.008v-.008z" />
  </svg>
);

export default UserGroupIcon;
