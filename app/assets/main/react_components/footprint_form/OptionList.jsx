import React from 'react';
import AnswerButton from './AnswerButton.jsx';

const OptionList = ({ onAnswerGiven, options, selectedKey }) => {
  return (
    <>
      {options.map(([key, value]) => {
        return (
          <div key={key} className='my-3 flex-1'>
            <AnswerButton
              label={value}
              onAnswerGiven={() => onAnswerGiven(key)}
              stylingClasses={(selectedKey == key && 'button-cta') + ' w-full'}
            />
          </div>
        );
      })}
    </>
  );
};

export default OptionList;
