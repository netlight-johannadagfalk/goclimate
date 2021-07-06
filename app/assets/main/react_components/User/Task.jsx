import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

function Task({ item, index }) {
    return (
        <Draggable
            key={item.id}
            draggableId={item.id}
            index={index}
        >
            {(provided, snapshot) => {
                return (
                    <div className="callout space-x-6 text-l font-bold"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            userSelect: "none",
                            padding: 16,
                            margin: "0 0 8px 0",
                            minHeight: "50px",
                            ...provided.draggableProps.style
                        }}
                    >
                        {item.name}
                    </div>
                );
            }}
        </Draggable>
    )
}

export default Task
