import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanActionItem from "./KanbanActionItem.jsx";

const KanbanColumn = ({column, columnId, handleDelete}) => {
  return (
    <div key={columnId}>
      <Droppable column={column} droppableId={columnId} key={columnId}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "lightgrey" : "white",
                padding: 4,
                width: 438,
                minHeight: 500,
              }}
            >
              {column.items.map((item, index) => {
                return (
                  <KanbanActionItem item={item} index={index} key={item.id} handleDelete={handleDelete}/>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
