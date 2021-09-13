import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import MembershipSelector from '../footprint_result/MembershipSelector.jsx';
import Payment from '../footprint_result/Payment.jsx';
import SignUpContainer from '../footprint_result/SignUpContainer.jsx';
import AnswerButton from './AnswerButton.jsx';
import CategoryPage from './CategoryPage.jsx';
import WorldPage from './WorldPage.jsx';

/**
 * Container for FootprintForm page that is related to results
 * If the page number is 0, then the first page, i.e. WorldComparison, should be visible
 * AnswerButton is used to increase currentIndex and with this the page number
 */
const ResultPage = ({ result, texts, lang, slug, page, onPageChange, currency }) => {
    const footprint = result.footprint;
    const countryAverage = result.country_average;
    const [selectedMembership, setSelectedMembership] = useState("single")
    const [multipleOffsets, setMultipleOffsets] = useState(2);
    const [grantedReferralCode, setGrantedReferralCode] = useState(false)
    const stripePromise = loadStripe('pk_test_4QHSdRjQiwkzokPPCiK33eOq')
    const commonStrings = texts.commonText

    if (texts.registrationsText.accept_policies === undefined) {
        texts.registrationsText.accept_policies = "By signing up you accept the <a>terms of use and policies</a>"
    }

    return (
        <div>
            <div className="my-8">
                { page === 0 ?
                    <WorldPage
                        footprint={footprint}
                        countryAverage={countryAverage} 
                        texts={texts} 
                        lang={lang}
                    />
                : page === 1 ?
                    <CategoryPage
                        text={texts.commonText}
                        footprint={footprint}
                    />
                : 
                    <Elements  stripe={stripePromise}  options={{locale: lang}} >
                        <SignUpContainer 
                            commonStrings={commonStrings}
                            selectedMembership={selectedMembership}
                            multipleOffsets={multipleOffsets}
                            registrationsText={texts.registrationsText}
                            grantedReferralCode={grantedReferralCode}
                            signUpText={texts.registrationsText}
                            price={result.plan.price}
                            currency={currency}
                            months={texts.commonText.months}
                        >
                            { page === 2 ?
                                <MembershipSelector 
                                    selectedMembership={selectedMembership} 
                                    setSelectedMembership={setSelectedMembership}
                                    multipleOffsets={multipleOffsets}
                                    setMultipleOffsets={setMultipleOffsets}
                                    signUpText={texts.registrationsText}
                                    setGrantedReferralCode={setGrantedReferralCode}
                                    grantedReferralCode={grantedReferralCode}>
                                </MembershipSelector>
                            :
                                <Payment
                                    commonStrings={commonStrings} 
                                    selectedMembership={selectedMembership}
                                />
                            }
                        </SignUpContainer>
                    </Elements>
                }
            </div>
            <AnswerButton
                label={page === 2 ? texts.registrationsText.continue_to_payment + " ->" : page === 3 ? texts.registrationsText.start_subscription : texts.lifestyleFootprintsText.next}
                onAnswerGiven={onPageChange}
                stylingClasses={"w-2/3 " + ((page === 2 || page === 3) && "button-cta")}
            />
            { page === 3 && 
                <div className={"inject-link pt-4"}
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(texts.registrationsText.accept_policies.replace("<a>","<a href='"+ ((slug === 'en' || slug === null) ? "" : "/" + slug) +"/privacy-policy' target='_blank'>" ))}}
                    >
                </div>
            }
        </div>
    )
}

export default ResultPage
