import React from 'react'
import WorldResultPage from './WorldResultPage.jsx'
import AnswerButton from './AnswerButton.jsx';

const ResultPage = ({ result, texts, lang, page, onPageChange }) => {
    const footprint = result.footprint;
    const countryAverage = result.country_average;

    return (
        <div>
            {page === 0 ?
                <WorldResultPage
                    footprint={footprint}
                    countryAverage={countryAverage} 
                    texts={texts} 
                    lang={lang}
                />
            :
                <div>
                    Placeholder: CategoriesResultPage
                </div>
            }
            <AnswerButton
                label={texts.lifestyleFootprintsText.next + " ->"}
                onAnswerGiven={onPageChange}
                stylingClasses={"w-2/3"}
            />
        </div>
    )
}

export default ResultPage
