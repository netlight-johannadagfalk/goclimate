
import React from 'react'

const ChecklistItem = ({ challenge, ifChecked }) => {

    return (
        <div className="text-left" onClick={() => ifChecked(challenge.id)}>
            <form>
                <div className={` ${challenge.accepted ? 'callout border-8 max-w-2xl' : 'callout max-w-2xl '}`}>
                    <label className="space-x-6 text-l font-bold">

                        {' ' + challenge.text}
                    </label>
                    <p className="float-right">{challenge.emoji}</p>
                </div>
            </form>
        </div>

    );
}
export default ChecklistItem;