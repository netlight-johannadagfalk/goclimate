import React from 'react';

const SignUpTitle = ({ signUpTitleText }) => {
  return (
    <h2 className='text-lg d:text-xl font-semibold text-center'>
      {signUpTitleText}
    </h2>
  );
};

export default SignUpTitle;
