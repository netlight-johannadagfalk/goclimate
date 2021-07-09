import React from 'react'
import CarouselHeader from './CarouselHeader.jsx'
import CarouselList from './CarouselList.jsx'
import { useState } from 'react'



const CarouselContainer = ({climateActionsProps, user, userActions, allActionsAndUserActions, actionsWithoutUserActions}) => {
    const [climateActions, setClimateActions] = useState(JSON.parse(climateActionsProps));
    userActions = JSON.parse(userActions);
    console.log("HEJ")
    console.log(JSON.parse(allActionsAndUserActions));
    actionsWithoutUserActions = JSON.parse(actionsWithoutUserActions);

    return (
        <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
            <CarouselHeader/>
            <CarouselList 
                climateActions={climateActions} 
                user={user}
                userActions={userActions}
                actionsWithoutUserActions={actionsWithoutUserActions}
            ></CarouselList>
        </div>
    );
}

export default CarouselContainer;