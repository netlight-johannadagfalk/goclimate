import React from 'react'
import WorldPage from './WorldPage.jsx'
import AnswerButton from './AnswerButton.jsx';
import CategoryPage from './CategoryPage.jsx';
import SignUpContainer from '../footprint_result/SignUpContainer.jsx';

/**
 * Container for FootprintForm page that is related to results
 * If the page number is 0, then the first page, i.e. WorldComparison, should be visible
 * AnswerButton is used to increase currentIndex and with this the page number
 */
const ResultPage = ({ result, texts, lang, page, onPageChange, currency }) => {
    const footprint = result.footprint;
    const countryAverage = result.country_average;

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
                : page === 2 ?
                    <SignUpContainer 
                        signUpText={texts.registrationsText}
                        price={result.plan.price}
                        currency={currency}
                        months={texts.commonText.months}
                    />
                :
                    <div>Payment placeholder</div>
                }
            </div>
            <AnswerButton
                label={page !== 2 ? texts.lifestyleFootprintsText.next + " ->" : texts.registrationsText.continue_to_payment}
                onAnswerGiven={onPageChange}
                stylingClasses={"w-2/3 " + (page === 2 && "button-cta")}
            />
        </div>
    )
}

export default ResultPage
