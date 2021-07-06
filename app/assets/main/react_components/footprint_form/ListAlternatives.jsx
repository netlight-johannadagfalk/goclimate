import React from 'react';
import AnswerButton from './AnswerButton.jsx';

const ListAlternatives = (props) => {
  console.log(props)
  return (
      <>
      {props.map((question) => (
          <AnswerButton nextQuestion={props.nextQuestion} text={question}/>
      ))}
      </>
  )
}

export default ListAlternatives;
