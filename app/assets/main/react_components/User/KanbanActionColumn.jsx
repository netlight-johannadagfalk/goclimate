import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanActionItem from "./KanbanActionItem.jsx";

const KanbanActionColumn = ({
  column,
  columnId,
  handleDelete,
  handlePerformance,
}) => {
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
              {columnId == 2 && column.items.length == 0 ? (
                <p
                  style={{
                    fontStyle: "italic",
                    marginTop: "25%",
                  }}
                >
                  Drag your finished actions here
                </p>
              ) : (
                ""
              )}
              {column.items.map((item, index) => {
                return (
                  <KanbanActionItem
                    item={item}
                    index={index}
                    key={item.id}
                    handleDelete={handleDelete}
                    handlePerformance={handlePerformance}
                  />
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

export default KanbanActionColumn;
