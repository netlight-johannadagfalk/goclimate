import React from 'react';
import ResultTitle from './ResultTitle.jsx';
import CategoryChart from './CategoryChart.jsx';
import WorldComparisonChart from './WorldComparisonChart.jsx';
import Link from '../Link.jsx';
import LatestProjectsList from './LatestProjectsList.jsx';

/**
 * React container for Result page components
 */
const ResultContainer = ({ footprint, projects, countryAverage, registrationsText, commonText, lifestyleFootprintsText, lang }) => {
    return (
        <div className="relative pb-1">
            <div className="space-y-6">
                <ResultTitle
                    title={JSON.parse(registrationsText).well_done}
                />
                <WorldComparisonChart 
                    lang={lang}
                    footprint={JSON.parse(footprint)}
                    countryAverage={JSON.parse(countryAverage)}
                    worldComparisonText={{...JSON.parse(registrationsText), ...JSON.parse(commonText)}} 
                />
                <CategoryChart 
                    footprint={JSON.parse(footprint)} 
                    categoryChartText={JSON.parse(commonText)} 
                />
                <Link    
                    link={"https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"}
                    linkText={JSON.parse(lifestyleFootprintsText).methodology} 
                />
                <LatestProjectsList
                    latestProjectsText={JSON.parse(registrationsText).latest_projects}
                    projects={JSON.parse(projects)}
                />
            </div>
        </div>
    )
}

export default ResultContainer;
