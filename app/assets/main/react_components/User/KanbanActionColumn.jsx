import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanActionItem from "./KanbanActionItem.jsx";

const KanbanActionColumn = ({
  column,
  columnId,
  handleDelete,
  handlePerformance,
  collapsed,
  categoryColor,
}) => {
  return (
    <div key={columnId}>
      <Droppable
        column={column}
        droppableId={columnId}
        key={columnId}
        isDropDisabled={collapsed}
      >
        {(provided, snapshot) => {
          return (
            <div
              // className="h-1/2"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "lightgrey" : "white",
                padding: 4,
                width: 410,
                // minHeight: 300,
                maxHeight: 500,
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {column.items.map((item, index) => {
                return (
                  <KanbanActionItem
                    item={item}
                    index={index}
                    key={item.id}
                    handleDelete={handleDelete}
                    handlePerformance={handlePerformance}
                    collapsed={collapsed}
                    categoryColor={categoryColor}
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
