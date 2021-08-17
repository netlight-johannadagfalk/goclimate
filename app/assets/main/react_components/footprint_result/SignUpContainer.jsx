import React from 'react';
import MembershipTypeChooser from './MembershipTypeChooser.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = () => {
    console.log("SignUpContainer render")

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto" data-controller="registrations--form registrations--membership-choice">
                    <a id="sign-up" className="absolute -mt-32"></a>
                    <div className="space-y-3" data-controller="registrations--price registrations--referral-code" data-target="registrations--membership-choice.priceControllerElement">
                        <h2 className="text-lg d:text-xl font-semibold text-center">
                            {/* Add translate functionality here */}
                            Sign up now! If we all contribute we can reach the goal together!
                        </h2>
                        <p className="text-sm text-center mb-6 hidden"> {/* Add translate functionality here */}Step 1/2</p>
                        <p className="text-center"> {/* Add translate functionality here */} Sign up to save your result, get support in reducing your footprint, and opt in to carbon offset.</p>
                        <input type="checkbox" id="step-one-done" className="toggler"/>
                        <div className="toggler-checked:hidden">
                            <div className="space-y-3">
                                <div className="h-px w-full bg-gray-tint-2 hidden"></div>
                                <MembershipTypeChooser/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SignUpContainer;
