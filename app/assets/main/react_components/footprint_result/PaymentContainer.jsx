import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import CardInformation from './CardInformation.jsx';
import MembershipTypeSelector from './MembershipTypeSelector.jsx';
import ReferralCode from './ReferralCode.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';
import Link from '../Link.jsx'

/**
 * React container for Sign up components
 */
const PaymentContainer = ({ commonStrings, registrationsStrings, test_number }) => {
    console.log(registrationsStrings.sign_up_heading_test_1)
    function onNextStep () {
        console.log("Dummy function")
    }

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                    <SignUpTitle signUpTitleText={registrationsStrings.sign_up_heading_test_1} />
                    <SignUpMotivationText signUpMotivationText={registrationsStrings.sign_up_description} />
                    <CardInformation commonStrings={commonStrings}/>
                    <Link linkText={registrationsStrings.where_does_the_money_go.heading}/>
                    <AnswerButton 
                            label={registrationsStrings.start_subscription}
                            stylingClasses={"button-cta w-full mt-3"}
                            onAnswerGiven={() => onNextStep()}  
                    />
                    <Link 
                        link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
                        linkText={registrationsStrings.accept_policies}
                    />
                </div>
            </div>
        </div>

    )
}

export default PaymentContainer;
