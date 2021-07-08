import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import KanbanActionItem from './KanbanActionItem.jsx';

function KanbanColumn({ column, columnId }) {
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
                                width: 438,
                                minHeight: 500
                            }}
                        >
                            {column.items.map((item, index) => {
                                console.log(item)
                                return (
                                    <KanbanActionItem item={item} index={index} key={item.id} />
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

export default KanbanColumn
