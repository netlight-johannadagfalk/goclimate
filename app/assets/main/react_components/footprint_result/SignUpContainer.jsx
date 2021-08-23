import React from 'react';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import RefferalCode from './ReferralCode.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ({ registrationsText }) => {

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                    <a id="sign-up" className="absolute -mt-32"></a>
                    <div className="space-y-3" data-controller="registrations--price registrations--referral-code">
                        <SignUpTitle
                            signUpTitleText={registrationsText.sign_up_heading_test_2}
                        />
                        <SignUpMotivationText
                            signUpMotivationText={registrationsText.sign_up_description}                            
                        />
                        <input type="checkbox" id="step-one-done" className="toggler"/>
                        <div className="toggler-checked:hidden">
                            <div className="space-y-3">
                                    <MembershipTypeSelector
                                        membershipText={registrationsText.membership}
                                    />
                                <div data-inactive-class="hidden">
                                    <RefferalCode
                                        text={registrationsText}
                                    />
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
