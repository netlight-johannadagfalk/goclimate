import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({ item, index, handleDelete }) => {
  const [expanded, setExpanded] = useState(false);

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
              minHeight: "auto",
              ...provided.draggableProps.style,
            }}
          >
            {item.name}
            <button
                className={`float-right ml-4 fas ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                onClick={() => setExpanded(!expanded)}
              ></button>

            {item.status === false && (
              <button
                className="float-right fas fa-trash"
                onClick={() => handleDelete(item.id, item.climate_action_id)}
              ></button>
            )}

              {expanded ? 
              <div className="text-s ml-0 flex inherit"
                style={{
                  margin: "0",
                  fontWeight: "normal",
                  fontSize: "16px",
              }}>
                <p>{item.description}</p>
              </div> 
              : null }
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanActionItem;
