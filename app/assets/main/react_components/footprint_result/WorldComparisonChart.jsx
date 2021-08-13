import React from 'react'

const WorldComparisonChart = ({ footprint, countryAverage, worldComparisonText, lang }) => {

    const maxValue = Math.max(footprint.total.co2e, countryAverage.co2e.co2e, 2.5);

    return (
        <div className="pr-16">
            <div className="relative pb-1">
                <div className="space-y-6">
                    <div>
                        <p className="relative font-bold z-10"> {worldComparisonText.you} &lt;-</p>
                        <div className="relative h-6 bg-green-accent rounded-r" style={{width: footprint.total.co2e / maxValue * 100 + "%"}}>
                            <span className="absolute left-100 ml-2 font-bold">
                                {(Math.round(footprint.total.co2e / 100) / 10).toFixed(1)}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="relative z-10">
                            {countryAverage.countries ? 
                                worldComparisonText.average_in.replace('%{region}', footprint.country.data.translations[lang])
                                : worldComparisonText.world_average}
                        </p>
                        <div className="relative h-6 bg-primary rounded-r" style={{width: countryAverage.co2e.co2e / maxValue * 100 + "%"}}>
                            <span className="absolute left-100 ml-2 font-bold">{(Math.round(countryAverage.co2e.co2e / 100) / 10).toFixed(1)}</span>
                        </div>
                    </div>
                    <div>
                        <p className="relative z-10">{worldComparisonText.goal_2030}</p>
                        <div className="relative h-6 bg-primary rounded-r" style={{width: 2500 / maxValue * 100 + "%"}}>
                            <span className="absolute left-100 ml-2 font-bold">2.5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorldComparisonChart;

