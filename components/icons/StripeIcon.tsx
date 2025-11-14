import React from 'react';

const StripeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
<svg width="100%" height="100%" viewBox="0 0 48 20" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill="currentColor">
            <path d="M6,1 C9.3137085,1 12,3.6862915 12,7 C12,10.3137085 9.3137085,13 6,13 C2.6862915,13 0,10.3137085 0,7 C0,3.6862915 2.6862915,1 6,1 Z M33,1 C36.3137085,1 39,3.6862915 39,7 C39,10.3137085 36.3137085,13 33,13 C29.6862915,13 27,10.3137085 27,7 C27,3.6862915 29.6862915,1 33,1 Z"></path>
            <path d="M9,7 C9,4.23857625 11.2385763,2 14,2 L24,2 C26.7614237,2 29,4.23857625 29,7 L29,7 L29,18 L25,18 L25,7 C25,6.44771525 24.5522847,6 24,6 L14,6 C13.4477153,6 13,6.44771525 13,7 L13,18 L9,18 L9,7 Z"></path>
            <rect x="38" y="2" width="10" height="16" rx="2"></rect>
        </g>
    </g>
</svg>
);

export default StripeIcon;
