import React from 'react'

const ChecklistItem = ({ climateAction, onCheck }) => {
    return (
        <div className="text-left" onClick={() => onCheck(climateAction.id)}>
            <form>
                <div className={` ${climateAction.accepted ? 'callout border-8 max-w-2xl' : 'callout max-w-2xl '}`}>
                    <label className="space-x-6 text-l font-bold">

                        {' ' + climateAction.text}
                    </label>
                    <p className="float-right">{climateAction.emoji}</p>
                </div>
            </form>
        </div>
    );
}

export default ChecklistItem;