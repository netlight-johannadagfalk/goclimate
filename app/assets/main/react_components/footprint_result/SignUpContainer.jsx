import React from 'react';
import MembershipTypeChooser from './MembershipTypeChooser.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = () => {
    console.log("SignUpContainer render")

    return (
        <div className="pr-16">
            <MembershipTypeChooser/>
        </div>
    )
}

export default SignUpContainer;
