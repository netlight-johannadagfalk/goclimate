import React from 'react';

const TextBanner = ({ text }) => {
  return (
    <div>
      <svg viewBox="0 0 140 140" className="-mt-10 -ml-1">
        <path
          id="curve"
          fill="transparent"
          d="M 10 90 C 10 15, 130 15, 130 90"
        />
        <text className="green-primary text-sm font-thin">
          <textPath xlinkHref="#curve">
            &nbsp; &nbsp; &nbsp; &nbsp; {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default TextBanner;
