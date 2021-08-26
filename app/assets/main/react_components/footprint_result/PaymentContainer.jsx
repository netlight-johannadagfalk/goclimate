import React from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import CardInformation from './CardInformation.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';
import Link from '../Link.jsx'

/**
 * React container for Sign up components
 */
const PaymentContainer = ({ commonStrings, registrationsStrings, sign_up_heading_test_number }) => {

    function onNextStep () {
        console.log("Dummy function")
    }

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                    <SignUpTitle signUpTitleText={eval("registrationsStrings.sign_up_heading_test_" + sign_up_heading_test_number)} />
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
