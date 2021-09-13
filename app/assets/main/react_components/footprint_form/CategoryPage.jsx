import React from 'react';
import CategoryChart from '../footprint_result/CategoryChart.jsx';
import SignUpIngress from '../footprint_result/SignUpIngress.jsx';
import Title from './Title.jsx';

/**
 * Result component page for category comparison
 */
const CategoryPage = ({ text, footprint }) => {
    return (
        <div className="max-w-lg mx-auto">
            <Title 
                text={text.dashboard.footprint.heading_more}
                custom_style="text-lgr"
            />
            <SignUpIngress
                text={"Här kommer fannys text!"}                            
            /> 
            <CategoryChart
                footprint={footprint} 
                categoryChartText={text} 
            />
        </div>
    )
}

export default CategoryPage
