import React, { useState, useRef, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanActionColumn from "./KanbanActionColumn.jsx";
import { useDeletedActionUpdate } from "../../../../contexts/DeletedActionContext.js";
import {
  useUserState,
  useUserActions,
} from "../../../../contexts/UserContext.js";
import { deleteUserAction } from "../../../../helpers/DBRequests.js";
import { useMediaQuery } from "react-responsive";
import { t } from "../../../../constants";
import {
  onDragEnd,
  collectPerformedUserActions,
} from "../../../../helpers/KanbanHelper.js";

const KanbanActionContainer = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  categories,
}) => {
  const setDeletedAction = useDeletedActionUpdate();
  const { data: data } = useUserState();
  const {
    updateUserActions,
    updateColumns,
    updateColumnsWithFormat,
    updateAchievements,
    updateAchievementsOnMove,
  } = useUserActions();

  const columns = data.columns;
  const [isHovering, setIsHovering] = useState(false);
  const mounted = useRef(false);
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${t})` });

  const handleExpanded = (item, value) => {
    const column = item.status === false ? 1 : 2;
    updateColumns({
      ...columns,
      [column]: {
        ...columns[column],
        items: getExpandable(columns[column], item, value),
      },
    });
  };

  const getExpandable = (column, item, value) => {
    const temp = column.items.map((expandable) => {
      return expandable.id === item.id
        ? {
            ...expandable,
            expanded: value,
          }
        : { ...expandable, expanded: false };
    });
    return temp;
  };

  const handleDelete = (userActionID, actionID) => {
    deleteUserAction(userActionID);
    let performedUserActions = collectPerformedUserActions(columns[2].items);
    updateLocalUserActions(
      columns[1].items.filter((item) => item.id.toString() !== userActionID),
      performedUserActions,
      columns[2].items,
      actionID
    );
  };

  const updateLocalUserActions = (
    updatedList,
    performed,
    destItems,
    deletedAction
  ) => {
    updateUserActions([...updatedList, ...performed]);
    updateColumnsWithFormat(updatedList, destItems);
    setDeletedAction(deletedAction);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="h-screen">
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(
            result,
            mounted.current,
            columns,
            updateUserActions,
            updateColumns,
            updateAchievements,
            updateAchievementsOnMove
          )
        }
      >
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              className="text-center h-1/2 pb-24 -mb-10"
              key={columnId}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div
                className="h-10 mt-2"
                style={
                  isTabletOrMobile || sidebarCollapsed ? {} : { width: 360 }
                }
              >
                <p
                  className={`font-normal text-base text-primary text-lg text-center`}
                >
                  {!sidebarCollapsed && column.name}
                </p>
              </div>
              <KanbanActionColumn
                column={column}
                columnId={columnId}
                key={columnId}
                handleDelete={handleDelete}
                categories={categories}
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarCollapsed={sidebarCollapsed}
                isHovering={isHovering}
                handleExpanded={handleExpanded}
              />
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default KanbanActionContainer;
