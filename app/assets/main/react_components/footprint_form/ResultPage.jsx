import React from 'react'
import WorldPage from './WorldPage.jsx'
import AnswerButton from './AnswerButton.jsx';
import CategoryPage from './CategoryPage.jsx';

/**
 * Container for FootprintForm page that is related to results
 * If the page number is 0, then the first page, i.e. WorldComparison, should be visible
 * AnswerButton is used to increase currentIndex and with this the page number
 */
const ResultPage = ({ result, texts, lang, page, onPageChange }) => {
    const footprint = result.footprint;
    const countryAverage = result.country_average;
    return (
        <div>
            <div className="mb-8">
                {page === 0 ?
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
                    <div>Placeholder next page</div>
                }
            </div>
            <AnswerButton
                label={texts.lifestyleFootprintsText.next + " ->"}
                onAnswerGiven={onPageChange}
                stylingClasses={"w-2/3"}
            />
        </div>
    )
}

export default ResultPage
