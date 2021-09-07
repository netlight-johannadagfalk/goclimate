import { default as React } from 'react';
import Title from '../footprint_form/Title.jsx';
import PriceText from './PriceText.jsx';
import SignUpMotivationText from './SignUpMotivationText.jsx';
import { useTexts } from '../context/Footprint/StaticDataContext.js';

/**
 * React container for Sign up components
 */
const SignUpContainer = ( props ) => {

    //TODO:
    //Slug för språk i url:en
    //<a> blir länken i med href

    return (
        <div className="max-w-lg mx-auto">
            <div className="space-y-3">
                <Title
                    text={useTexts().registrationsText.sign_up_heading_collective_efficacy}
                />
                <SignUpMotivationText /> 
                <div className="toggler-checked:hidden">
                    <div className="space-y-3">
                        {props.children}
                    </div>
                </div>
                <PriceText
                    priceObject={props.price}
                    grantedReferralCode={props.grantedReferralCode}
                    selectedMembership={props.selectedMembership}
                    multipleOffsets={props.multipleOffsets}
                />
            </div>
        </div>
    )
}

export default SignUpContainer;
