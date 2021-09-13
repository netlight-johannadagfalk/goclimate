import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import CategoryChart from '../footprint_result/CategoryChart.jsx';
import SignUpIngress from '../footprint_result/SignUpIngress.jsx';
import Title from './Title.jsx';

/**
 * Result component page for category comparison
 */
const CategoryPage = ({ footprint }) => {

    const { commonText: { dashboard: { footprint: { heading_more } } } } = useTexts()

    return (
        <div className="max-w-lg mx-auto">
            <Title 
                custom_style="text-lgr"
                text={heading_more}
            />
            <SignUpIngress
                text={"Här kommer fannys text!"}                            
            /> 
            <CategoryChart
                footprint={footprint} 
            />
        </div>
    )
}

export default CategoryPage
