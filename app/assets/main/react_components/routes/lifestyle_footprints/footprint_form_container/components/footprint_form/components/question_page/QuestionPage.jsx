import React from 'react';
import Title from '../common/Title.jsx';
import OptionList from './components/OptionList.jsx';
import OptionNumerical from './components/OptionNumerical.jsx';

const QuestionPage = ({
  currentObject,
  onAnswerGiven,
  selectedKey,
  onNumericalInput,
  savedValue,
}) => {
  return (
    <>
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
    </>
  );
};

export default QuestionPage;
