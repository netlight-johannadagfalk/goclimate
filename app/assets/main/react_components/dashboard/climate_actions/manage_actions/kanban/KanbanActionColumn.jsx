import React from "react";
import { Droppable } from "react-beautiful-dnd";
import KanbanCard from "./card_components/KanbanCard.jsx";
import { useMediaQuery } from "react-responsive";
import { t } from "../../../../constants";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const KanbanActionColumn = ({
  column,
  columnId,
  handleDelete,
  handleCompleteAction,
  handleUncompleteAction,
  categories,
  setSidebarCollapsed,
  sidebarCollapsed,
  isHovering,
  handleExpanded,
}) => {
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });
  return (
    <div
      className={`h-full ${
        isTabletOrMobile &&
        "lg:flex lg:justify-evenly lg:justify-items-center flex justify-evenly justify-items-center"
      }`}
      key={columnId}
    >
      <Droppable
        column={column}
        droppableId={columnId}
        key={columnId}
        isDropDisabled={sidebarCollapsed}
      >
        {(provided, snapshot) => {
          return (
            <div
              className={`h-full overflow-x-hidden pt-1 d:flex d:items-stretch flex items-center flex-col inline-block w-full 
              ${
                (isHovering && !sidebarCollapsed) || isTabletOrMobile
                  ? "overflow-y-auto"
                  : "overflow-y-hidden"
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver ? "GhostWhite" : "white",
                width: "100%",
              }}
            >
              {!sidebarCollapsed &&
              columnId == 2 &&
              column.items.length == 0 ? (
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
              <TransitionGroup component={null}>
                {column.items
                  .slice(0, sidebarCollapsed ? 4 : column.items.length)
                  .map((item, index) => {
                    return (
                      <CSSTransition
                        timeout={{
                          enter: 100,
                          exit: 500,
                        }}
                        classNames="display"
                        key={item.id}
                      >
                        <KanbanCard
                          item={item}
                          index={index}
                          key={item.id}
                          handleDelete={handleDelete}
                          handleCompleteAction={handleCompleteAction}
                          handleUncompleteAction={handleUncompleteAction}
                          categories={categories}
                          sidebarCollapsed={sidebarCollapsed}
                          handleExpanded={handleExpanded}
                        />
                      </CSSTransition>
                    );
                  })}
              </TransitionGroup>
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
          {!isTabletOrMobile && (
            <button
              className={`fas rounded-full h-12 w-12 bg-white border border-gray-accent -left-6 -mt-6 absolute focus:outline-none ${
                sidebarCollapsed ? "fa-chevron-left" : "fa-chevron-right"
              }`}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            ></button>
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanActionColumn;
