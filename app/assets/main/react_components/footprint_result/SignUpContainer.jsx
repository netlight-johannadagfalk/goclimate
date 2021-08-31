import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';
import PriceText from './PriceText.jsx';
import Link from '../Link.jsx'
import PaymentContainer from './PaymentContainer.jsx';
import sanitizeHtml from 'sanitize-html';

/**
 * React container for Sign up components
 */
const SignUpContainer = ( props ) => {
    //const [selectedMembership, setSelectedMembership] = useState("single")
    //const [multipleOffsets, setMultipleOffsets] = useState(2);
    //const selectedMembership = props.selectedMembership
    //sluggo
    //<a> blir länken i med href

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
                        <AnswerButton
                            label={props.buttonText}
                            stylingClasses = {"button-cta" + " w-full"}
                            onAnswerGiven = {props.onContinueToPayment}
                        /> 
                        <div className={"inject-link pt-4"}
                            dangerouslySetInnerHTML={{__html: sanitizeHtml(props.signUpText.accept_policies)}}>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SignUpContainer;
