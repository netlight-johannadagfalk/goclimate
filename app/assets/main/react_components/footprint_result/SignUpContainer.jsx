import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';
import PriceText from './PriceText.jsx';
import Link from '../Link.jsx'
import PaymentContainer from './PaymentContainer.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ( props ) => {
    console.log(props)
    const [selectedMembership, setSelectedMembership] = useState("single")
    const [multipleOffsets, setMultipleOffsets] = useState(2);

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                    <a id="sign-up" className="absolute -mt-32"></a>
                    <div className="space-y-3">
                        <SignUpTitle
                            signUpTitleText={props.signUpText.sign_up_heading_test_2}
                        />
                        <SignUpMotivationText
                            signUpMotivationText={props.signUpText.sign_up_description}                            
                        />
                        <input type="checkbox" id="step-one-done" className="toggler"/>
                        <div className="toggler-checked:hidden">
                            <div className="space-y-3">
                                {props.children}
                            </div>
                        </div>
                        <PriceText
                            priceObject={props.price}
                            currency={props.currency}
                            months={props.months}
                            signUpText={props.signUpText}
                            grantedReferralCode={props.grantedReferralCode}
                            selectedMembership={props.selectedMembership}
                            multipleOffsets={props.multipleOffsets}
                        />
                        {!props.selectStep ??
                            <Link 
                                link="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
                                linkText={props.signUpText.accept_policies}
                            />
                        }
                        <AnswerButton
                            label={props.buttonText}
                            stylingClasses = {"button-cta" + " w-full"}
                            onAnswerGiven = {props.onContinueToPayment}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SignUpContainer;
