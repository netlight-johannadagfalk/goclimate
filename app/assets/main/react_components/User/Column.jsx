import React from 'react'
import Tasks from './Tasks.jsx'
import { Droppable } from 'react-beautiful-dnd'

function Column({ column, columnId }) {
    { console.log(columnId) }
    return (

        <div className="callout" key={columnId}>
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

            <Droppable column={column} droppableId={columnId} key={columnId}>
                {(provided, snapshot) => {
                    return (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                background: snapshot.isDraggingOver
                                    ? "lightblue"
                                    : "lightgrey",
                                padding: 4,
                                width: 250,
                                minHeight: 500
                            }}
                        >
                            {column.items.map((item, index) => {
                                return (
                                    <Tasks item={item} index={index} />
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    );
                }}
            </Droppable>
        </div>
    )
}

export default Column
