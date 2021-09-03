import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanActionItem from "./KanbanActionItem.jsx";

const KanbanActionColumn = ({
  column,
  columnId,
  handleDelete,
  handlePerformance,
  setCollapsed,
  collapsed,
  categoryColor,
  isHovering,
}) => {
  return (
    <div className="h-full" key={columnId}>
      <Droppable
        column={column}
        droppableId={columnId}
        key={columnId}
        isDropDisabled={collapsed}
      >
        {(provided, snapshot) => {
          return (
            <div
              className={`h-full overflow-x-hidden ${
                isHovering && !collapsed
                  ? "overflow-y-auto"
                  : "overflow-y-hidden"
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "lightgrey" : "white",
                padding: 4,
                width: 410,
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
      {columnId === "1" && (
        <div>
          <hr
            style={{
              color: "lightgrey",
            }}
          ></hr>
          <button
            className={`fas rounded-full h-12 w-12 bg-white border border-gray-accent -left-6 -mt-6 absolute focus:outline-none ${
              collapsed ? "fa-chevron-left" : "fa-chevron-right"
            }`}
            onClick={() => setCollapsed(!collapsed)}
          ></button>
        </div>
      )}
    </div>
  );
};

export default KanbanActionColumn;
