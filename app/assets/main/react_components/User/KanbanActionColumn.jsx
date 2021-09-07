import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanActionItem from "./KanbanActionItem.jsx";

const KanbanActionColumn = ({
  column,
  columnId,
  handleDelete,
  handleButtonPerformOnDrag,
  categories,
  setCollapsed,
  collapsed,
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
              {column.items
                .slice(0, collapsed ? 4 : column.items.length)
                .map((item, index) => {
                  return (
                    <KanbanActionItem
                      item={item}
                      index={index}
                      key={item.id}
                      handleDelete={handleDelete}
                      handleButtonPerformOnDrag={handleButtonPerformOnDrag}
                      categories={categories}
                      collapsed={collapsed}
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
