import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

function Tasks({ task }) {
    console.log(task)
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div className="callout"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    innerRef={proveded.innerRef}>
                    <label className="space-x-6 text-l font-bold">
                        {' ' + task.content}
                    </label>
                </div>
            )}
        </Draggable>
    )
}

export default Tasks
