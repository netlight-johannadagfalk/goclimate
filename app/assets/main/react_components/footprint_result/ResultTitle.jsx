import React from 'react';

const ResultTitle = ({ title }) => {
  return (
    <h1 className='font-semibold text-xl t:text-2xl d-md:text-3xl my-5'>
      {title}
    </h1>
  );
};

export default ResultTitle;
