import React from 'react'
import Task from './Tasks.jsx'
import { Droppable } from 'react-beautiful-dnd'

function Column({ column, tasks }) {
    console.log(tasks)
    return (
        <div className="callout">
            {/* <label className="space-x-6 text-l font-bold">
                {' ' + column.title}
            </label>
            <Droppable droppableId={column.id}> {(provided) => (
                <div className="callout"
                    innerRef={provided.innerRef}
                    {...provided, droppableProps}
                >
                    {tasks.map((task, index) => (
                        <Task key={task.id} task={task} index={index} />))}
                    {provided.placeholder}
                </div>
            )}
            </Droppable> */}
        </div>
    )
}

export default Column
