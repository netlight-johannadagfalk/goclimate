import React from 'react';
import { useTexts } from '../../../../contexts/TextsContext.js';

const TextButton = ({ onClick }) => {
  const {
    lifestyleFootprintsText: { back },
  } = useTexts();
  return (
    <div className="flex justify-space-between">
      <div className="block">
        <i
          className="fas fa-chevron-left cursor-pointer"
          aria-hidden="true"
        ></i>
        <label className="px-1 cursor-pointer" onClick={onClick}>
          {back}
        </label>
      </div>
    </div>
  );
};

export default TextButton;
