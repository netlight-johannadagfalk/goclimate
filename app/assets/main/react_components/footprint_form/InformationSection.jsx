import React from 'react'
import MoneyUsageList from '../footprint_result/MoneyUsageList.jsx'
import LatestProjectsList from '../footprint_result/LatestProjectsList.jsx'
import FAQ from '../footprint_result/FAQ.jsx'

/**
 * Container for additional information components
 */
const InformationSection = ({ texts, projects }) => {
    return (
        <div className="text-left space-y-6">
            <MoneyUsageList 
                moneyUsageText={texts.registrationsText.where_does_the_money_go}
            />
            <LatestProjectsList
                latestProjectsText={texts.registrationsText.latest_projects}
                projects={projects}
            />
            <FAQ
                questions={texts.commonText.faq_questions}
                faqText={texts.registrationsText.faq}
            />
        </div>
    )
}

export default InformationSection
