import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import CategoryChart from '../footprint_result/CategoryChart.jsx';
import SignUpPreamble from '../footprint_result/SignUpPreamble.jsx';
import Title from './Title.jsx';

/**
 * Result component page for category comparison
 */
const CategoryPage = ({ footprint }) => {

    const { commonText: { dashboard: { footprint: { heading_more } } } } = useTexts()
    const { 
        reactContentText: {
            react: { 
                category_chart: { 
                    title, 
                    desc
                }         
            }
        }  
    } = useTexts();

    return (
        <div className="max-w-lg mx-auto">
            <Title 
                custom_style="text-lgr"
                text={title}
            />
            <SignUpPreamble
                text={desc}                            
            /> 
            <CategoryChart
                footprint={footprint} 
            />
        </div>
    )
}

export default CategoryPage
