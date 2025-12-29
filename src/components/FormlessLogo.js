import React from 'react';

const FormlessLogo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon outline */}
      <path
        d="M50 2
           L93 27
           L93 73
           L50 98
           L7 73
           L7 27
           Z"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Triangle inside */}
      <path
        d="M50 25
           L75 68
           L25 68
           Z"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FormlessLogo;
