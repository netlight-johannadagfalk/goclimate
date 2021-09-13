import { default as React } from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import Title from '../footprint_form/Title.jsx';
import PriceText from './PriceText.jsx';
import SignUpIngress from './SignUpIngress.jsx';

/**
 * React container for Sign up components
 */
const SignUpContainer = ( props ) => {

    //TODO:
    //Slug för språk i url:en
    //<a> blir länken i med href

    const { registrationsText: { sign_up_heading_collective_efficacy, sign_up_description,  } } = useTexts()

    return (
        <div className="max-w-lg mx-auto">
            <div className="space-y-3">
                <Title text={sign_up_heading_collective_efficacy} custom_style="text-lgr" />
                <SignUpIngress
                    text={sign_up_description}                            
                /> 
                <div className="toggler-checked:hidden">
                    <div className="space-y-3 py-3">
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
