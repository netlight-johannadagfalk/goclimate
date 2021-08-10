import React, {useState} from 'react'
import CarouselContainer from './CarouselContainer.jsx'
import KanbanActionContainer from './KanbanActionContainer.jsx'

const ClimateActionsContainer = ({climateActionsProps, user, userActions, allActionsAndUserActions, actionsWithoutUserActions}) => {

    const [totUserActions, setTotUserActions] = useState(JSON.parse(userActions))
    
    const handleRender = async (action, res) => {
        const a = {
            id: res.id,
            name: action.name,
            description: action.description,
            climate_action_id: action.id,
            status: res.status,
            user_id: res.user_id}
        
            setTotUserActions([...totUserActions, a])
    };


    return(
        <>
            <CarouselContainer climateActionsProps={climateActionsProps}  
            user = {user}
            userActions= {totUserActions}
            allActionsAndUserActions = {allActionsAndUserActions}
            actionsWithoutUserActions= {actionsWithoutUserActions}
            render = {handleRender}/> 

            <KanbanActionContainer 
            userActions = {totUserActions} 
           
            />
        </>
    );
}
export default ClimateActionsContainer;