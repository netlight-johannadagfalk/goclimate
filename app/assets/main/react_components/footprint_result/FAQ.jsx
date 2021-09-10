import React from 'react';
import FAQListChild from './FAQListChild.jsx';
import { useTexts } from '../context/Footprint/TextsContext.js';

const FAQ = () => {
  const {
    registrationsText: { faq },
    commonText: { faq_questions },
  } = useTexts();

  const questionKeys = {
    climate_neutrality: ['q2'],
    offsetting: ['q2', 'q3', 'q6', 'q9', 'q11'],
    our_service: ['q1', 'q3', 'q4'],
  };
  let filteredQuestions = [];
  Object.keys(questionKeys).forEach((questionCategory) => {
    const filteredQuestionsForCategory = Object.entries(
      faq_questions[questionCategory].questions
    ).filter(([q]) => questionKeys[questionCategory].includes(q));
    filteredQuestionsForCategory.forEach((q) => filteredQuestions.push(q[1]));
  });

  return (
    <div className='text-center max-w-2xl mx-auto space-y-3'>
      <h2 className='heading'>{faq}</h2>
      {filteredQuestions.map((question) => {
        return (
          <FAQListChild
            key={question.question}
            question={question.question}
            answer={question.answer}
          />
        );
      })}
    </div>
  );
};

export default FAQ;
