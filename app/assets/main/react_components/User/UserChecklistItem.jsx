import React from 'react'

import Button from '../Button.jsx'

const UserChecklistItem = ({ userClimateAction, onAccepted, onPerformed }) => {
    return (
        <div className="text-left" //onClick={() => onPerformed(userClimateAction.id)}
        >
            <form>
                <div className={` ${userClimateAction.status ? 'callout border-8 max-w-2xl' : 'callout max-w-2xl '}`}>

                    <Button className="float-left" onClick={() => onAccepted(climateAction.id)} > <label> > </label> </Button>
                    <label className="space-x-6 text-l font-bold">
                        {' ' + userClimateAction.name}
                    </label>
                    <Button className="float-right" onClick={() => onPerformed(userClimateAction.id)} > <label> > </label>  </Button>
                </div>
            </form>
        </div >
    );
}

export default UserChecklistItem;