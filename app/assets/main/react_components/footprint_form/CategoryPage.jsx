import React from 'react';
import Title from './Title.jsx';
import CategoryChart from '../footprint_result/CategoryChart.jsx';

/**
 * Result component page for category comparison
 */
const CategoryPage = ({ text, footprint }) => {
  return (
    <div className='max-w-lg mx-auto'>
      <Title text={text.dashboard.footprint.heading_more} />
      <CategoryChart footprint={footprint} categoryChartText={text} />
    </div>
  );
};

export default CategoryPage;
