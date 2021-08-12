import React from "react";
import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({item, index, handleDelete}) => {

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => {
        return (
          <div
            className="callout space-x-6 text-l font-bold"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              userSelect: "none",
              padding: 16,
              margin: "0 0 8px 0",
              minHeight: "50px",
              ...provided.draggableProps.style,
            }}
          >
            {item.name}
            {item.status === false &&
            <button className="float-right fas fa-trash" onClick={() => handleDelete(item.id, item.climate_action_id) }> 
            </button>
            }
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanActionItem;
