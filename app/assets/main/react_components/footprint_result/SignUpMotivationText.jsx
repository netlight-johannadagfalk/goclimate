import React from 'react';
import { useTexts } from '../context/Footprint/StaticDataContext';

/**
 * React container signup motivation text
 */
const SignUpMotivationText = () => {

    return (
        <p className="text-center"> 
            {useTexts().registrationsText.sign_up_description}
        </p>
    )
}

export default SignUpMotivationText;
