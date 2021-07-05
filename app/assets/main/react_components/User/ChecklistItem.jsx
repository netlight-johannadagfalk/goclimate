import React from 'react'
import Button from '../Button.jsx'

const ChecklistItem = ({ climateAction, onAccepted }) => {
    return (
        <div className="text-left" // onClick={() => onAccepted(climateAction.id)}
        >
            <form>
                <div className={` ${climateAction.status ? 'callout border-8 max-w-2xl' : 'callout max-w-2xl '}`}>
                    <label className="space-x-6 text-l font-bold">
                        {' ' + climateAction.name}
                    </label>
                    <p className="float-right">{climateAction.emoji}</p>
                    <Button className="float-right" onClick={() => onAccepted(climateAction.id)} > > </Button>
                </div>
            </form>
        </div>
    );
}

export default ChecklistItem;