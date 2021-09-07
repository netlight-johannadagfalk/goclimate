import React from 'react'
import Title from './Title.jsx';
import CategoryChart from '../footprint_result/CategoryChart.jsx'
import { useTexts } from '../context/Footprint/StaticDataContext.js';

/**
 * Result component page for category comparison
 */
const CategoryPage = ({ footprint }) => {
    return (
        <div className="max-w-lg mx-auto">
            <Title 
                text={useTexts().commonText.dashboard.footprint.heading_more}
            />
            <CategoryChart
                footprint={footprint} 
            />
        </div>
    )
}

export default CategoryPage
