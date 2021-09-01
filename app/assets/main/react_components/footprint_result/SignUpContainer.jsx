import React from 'react';
import sanitizeHtml from 'sanitize-html';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
import PriceText from './PriceText.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import SignUpTitle from './SignUpTitle.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ( props ) => {

    //TODO:
    //Slug för språk i url:en
    //<a> blir länken i med href
    //A/B-test för titeln givet props.sign_up_heading_test_number

    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <div className="callout max-w-md mx-auto">
                    <a id="sign-up" className="absolute -mt-32"></a>
                    <div className="space-y-3">
                        <SignUpTitle
                            signUpTitleText={props.registrationsText.sign_up_heading_test_2}
                        />
                        <SignUpMotivationText
                            signUpMotivationText={props.registrationsText.sign_up_description}                            
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
                            months={props.commonStrings.months}
                            signUpText={props.registrationsText}
                            grantedReferralCode={props.grantedReferralCode}
                            selectedMembership={props.selectedMembership}
                            multipleOffsets={props.multipleOffsets}
                        />
                        <AnswerButton
                            label={props.isPayment ? props.registrationsText.start_subscription : props.registrationsText.continue_to_payment}
                            stylingClasses = {"button-cta" + " w-full"}
                            onAnswerGiven = {props.onContinueToPayment}
                        /> 
                        { props.isPayment &&
                        <div className={"inject-link pt-4"}
                            dangerouslySetInnerHTML={{__html: sanitizeHtml(props.registrationsText.accept_policies)}}>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SignUpContainer;
