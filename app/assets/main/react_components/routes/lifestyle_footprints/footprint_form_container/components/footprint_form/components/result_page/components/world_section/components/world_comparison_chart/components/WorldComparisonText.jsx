import React from 'react';

const WorldComparisonText = ({ text, customValues = [] }) => {
  const findCustomPlacement = /%{.*?}/i;
  customValues.forEach((customValue) => {
    text = text.replace(findCustomPlacement, customValue);
  });

  return <div className="text-left">{text}</div>;
};

export default WorldComparisonText;
