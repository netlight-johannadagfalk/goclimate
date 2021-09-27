import React from 'react';

const Preamble = ({ text, styling }) => {
  return <p className={styling}>{text}</p>;
};

export default Preamble;
