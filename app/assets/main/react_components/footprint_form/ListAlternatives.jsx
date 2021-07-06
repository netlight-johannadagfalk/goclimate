import React from 'react';
import AnswerButton from './AnswerButton.jsx';

const ListAlternatives = (props) => {

  return (
      <>
      {Object.entries(props.options).map(([k, question]) => {
        return (
          <AnswerButton key={k} nextQuestion={props.nextQuestion} alternative={question}/>
        )
      })}
      </>
  )
}

export default ListAlternatives;
