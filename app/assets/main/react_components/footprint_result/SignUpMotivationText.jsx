import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext';

const SignUpMotivationText = () => {
  const {
    registrationsText: { sign_up_description },
  } = useTexts();

  return <p className="text-center">{sign_up_description}</p>;
};

export default SignUpMotivationText;
