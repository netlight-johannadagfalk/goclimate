import React from 'react';
import Title from './Title.jsx';
import OptionList from './OptionList.jsx';
import OptionNumerical from './OptionNumerical.jsx';

const QuestionPage = ({
  currentObject,
  onAnswerGiven,
  selectedKey,
  onNumericalInput,
  savedValue,
}) => {
  return (
    <div>
      <Title text={currentObject.question} />
      {!currentObject.isNumerical ? (
        <OptionList
          onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)}
          options={Object.entries(currentObject.options)}
          selectedKey={selectedKey}
        />
      ) : (
        <OptionNumerical
          questionObject={currentObject}
          onAnswerGiven={(givenAnswer) => onAnswerGiven(givenAnswer)}
          savedValue={savedValue}
          onNumericalInput={onNumericalInput}
        />
      )}
    </div>
  );
};

export default QuestionPage;
