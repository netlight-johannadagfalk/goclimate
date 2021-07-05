import React from 'react'
import Kanban from './Kanban.jsx'
import ChecklistHeader from './ChecklistHeader.jsx'
import ChecklistFooter from './ChecklistFooter.jsx'

const ClimateActionContainer = ({ climateActionsProps, userClimateActionsProps }) => {

    return (
        <div>
            <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
                <ChecklistHeader />
                <Kanban climateActionsProps={climateActionsProps} userClimateActionsProps={userClimateActionsProps} />
            </div>
            <ChecklistFooter />
        </div>
    );
}

export default ClimateActionContainer;