import React from 'react'
import getChartData from './result-helper';
import ResultBar from './ResultBar.jsx';

const CategoryChart = ({ footprint, categoryChartText }) => {
    const maxValue = Math.max(footprint.housing.co2e, footprint.food.co2e, footprint.car.co2e, footprint.flights.co2e, footprint.public.co2e, footprint.consumption.co2e)
    const categoryData = getChartData(footprint, categoryChartText)
    
    return (
        <>
            {categoryData.map((category) => {
                return (
                    <ResultBar
                        key={category.text}
                        title={{text: category.text, icon: category.icon}}
                        width={Math.round(category.co2e / maxValue * 100).toFixed(1)}
                        value={(Math.round(category.co2e / 100) / 10).toFixed(1) + " " + categoryChartText["tonnes"]}
                        color={category.color}
                        fontWeight={"text-sm"}
                        spaceStyling={"space-y-1 m-lg:space-y-2"}
                    />
                )
            })}
        </>
    )
}

export default CategoryChart
