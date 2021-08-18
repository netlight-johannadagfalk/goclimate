import React from 'react';
import MembershipTypeChooser from './MembershipTypeChooser.jsx';
import RefferalCode from './ReferralCode.jsx';
import SignUpMotivationText from './signUpMotivationText.jsx';
import SignUpTitle from './signUpTitle.jsx';

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
                        <SignUpTitle></SignUpTitle>
                        <SignUpMotivationText></SignUpMotivationText>
                        <input type="checkbox" id="step-one-done" className="toggler"/>
                        <div className="toggler-checked:hidden">
                            <div className="space-y-3">
                                <div className="h-px w-full bg-gray-tint-2 hidden"></div>
                                    <MembershipTypeChooser/>
                                <div className="h-px w-full bg-gray-tint-2 hidden"></div>
                                <div data-target="registrations--membership-choice.subscriptionInfo" data-inactive-class="hidden">
                                    <RefferalCode/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SignUpContainer;
