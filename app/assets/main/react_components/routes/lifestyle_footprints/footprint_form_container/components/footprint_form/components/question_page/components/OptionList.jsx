import React from 'react';
import AnswerButton from '../../common/AnswerButton.jsx';

const OptionList = ({ onAnswerGiven, options, selectedKey }) => {
  return (
    <div className="space-y-3">
      {options.map(([key, value]) => {
        return (
          <div key={key}>
            <AnswerButton
              label={value}
              onAnswerGiven={() => onAnswerGiven(key)}
              stylingClasses={(selectedKey == key && 'button-cta') + ' w-full'}
            />
          </div>
        );
      })}
    </div>
  );
};

export default OptionList;
