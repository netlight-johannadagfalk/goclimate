import React from 'react'
import Task from './Task.jsx'
import { Droppable } from 'react-beautiful-dnd'

function Column({ column, columnId }) {
    return (
        <div key={columnId}>

            <Droppable column={column} droppableId={columnId} key={columnId}>
                {(provided, snapshot) => {
                    return (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                background: snapshot.isDraggingOver
                                    ? "lightgrey"
                                    : "white",
                                padding: 4,
                                width: 250,
                                minHeight: 500
                            }}
                        >
                            {column.items.map((item, index) => {
                                return (
                                    <Task item={item} index={index} />
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
