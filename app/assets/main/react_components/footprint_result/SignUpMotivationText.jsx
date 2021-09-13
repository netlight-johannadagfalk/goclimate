import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext';

/**
 * React container signup motivation text
 */
const SignUpMotivationText = () => {
  const {
    registrationsText: { sign_up_description },
  } = useTexts();

  return <p className="text-center">{sign_up_description}</p>;
};

export default SignUpMotivationText;
