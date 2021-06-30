
import React from 'react'

const ChecklistItem = ({ challenge, ifChecked }) => {

    return (
        <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0" onDoubleClick={() => ifChecked(challenge.id)}>
            <form>
                <div className={` ${challenge.accepted ? 'callout space-y-6 ml-lg border-8' : 'callout space-y-6 ml-lg'}`}>
                    <label className="space-x-6 text-xl font-bold">
                        <input type="checkbox" onChange={() => ifChecked(challenge.id)} />
                        {' ' + challenge.text}
                        {' ' + challenge.emoji}
                    </label>
                </div>
            </form>
        </div>

    );
}
export default ChecklistItem;