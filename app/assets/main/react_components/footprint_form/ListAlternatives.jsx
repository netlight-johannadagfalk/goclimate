import React from 'react';
import AnswerButton from './AnswerButton.jsx';

const ListAlternatives = (props) => {
  return (
      <>
          <AnswerButton nextQuestion={props.nextQuestion}/>
      </>
  )
}

export default ListAlternatives;
