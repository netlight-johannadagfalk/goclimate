import React from 'react';

const Title = ({ text, customStyle = '' }) => {
  return <h2 className={'heading ' + customStyle}>{text}</h2>;
};

export default Title;
