import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanActionItem from "./KanbanActionItem.jsx";

const KanbanActionColumn = ({
  column,
  columnId,
  handleDelete,
  handleButtonPerformOnDrag,
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
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "lightgrey" : "white",
                padding: 4,
                width: "auto",
                minHeight: 500,
              }}
            >
              {column.items.map((item, index) => {
                return (
                  <KanbanActionItem
                    item={item}
                    index={index}
                    key={item.id}
                    handleDelete={handleDelete}
                    handleButtonPerformOnDrag={handleButtonPerformOnDrag}
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
