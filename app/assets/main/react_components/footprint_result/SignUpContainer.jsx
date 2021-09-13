import { default as React } from 'react';
import Title from '../footprint_form/Title.jsx';
import PriceText from './PriceText.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ( props ) => {

    //TODO:
    //Slug för språk i url:en
    //<a> blir länken i med href

    console.log(props.signUpText.sign_up_heading_collective_efficacy)

    return (
        <div className="max-w-lg mx-auto">
            <div className="space-y-3">
                <Title text={props.signUpText.sign_up_heading_collective_efficacy} custom_style="text-lgr" />
                <SignUpMotivationText
                    signUpMotivationText={props.signUpText.sign_up_description}                            
                /> 
                <div className="toggler-checked:hidden">
                    <div className="space-y-3 py-3">
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
            </div>
        </div>
    )
}

export default SignUpContainer;
