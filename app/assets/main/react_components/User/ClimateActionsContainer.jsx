import React, {useState} from 'react'
import CarouselContainer from './CarouselContainer.jsx'
import KanbanActionContainer from './KanbanActionContainer.jsx'

const ClimateActionsContainer = ({climateActionsProps, user, userActions, actionsWithUserActions, actionsWithoutUserActions}) => {
    const [totUserActions, setTotUserActions] = useState(JSON.parse(userActions))
    const [actionDeleted, setActionDeleted] = useState(null)
    const handleRender = (action, res) => {
        const a = {
            id: res.id,
            name: action.name,
            description: action.description,
            climate_action_id: action.id,
            status: res.status,
            user_id: res.user_id}
        
            setTotUserActions([...totUserActions, a])
    };

    const setLocalAccepted = (updatedList, deletedAction) => {
        setTotUserActions(updatedList)
        setActionDeleted(deletedAction)
    }


    return(
        <>
            <CarouselContainer  
            user = {user}
            actionsWithUserActions = {JSON.parse(actionsWithUserActions)}
            actionsWithoutUserActions= {JSON.parse(actionsWithoutUserActions)}
            render = {handleRender}
            actionDeleted={actionDeleted}/> 

            <KanbanActionContainer 
            userActions = {totUserActions} 
            setLocalAccepted = {setLocalAccepted}
            />
        </>
    );
}
export default ClimateActionsContainer;