import React from 'react'

function ChecklistHeader() {
    return (
        <div>
            <h3 className="heading-lg mb-3">Action Challenges </h3>
            <div class="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0">
                <div class="t:w-1/2 space-y-6">
                    <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >Choose your actions:</p>
                </div>
                <div class="t:w-1/2 space-y-6">
                    <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >Your actions:</p>
                </div>
            </div>
        </div>
    )
}

export default ChecklistHeader
