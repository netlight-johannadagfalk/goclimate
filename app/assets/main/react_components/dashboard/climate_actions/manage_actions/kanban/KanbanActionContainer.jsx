import React, { useState, useRef, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanActionColumn from "./KanbanActionColumn.jsx";
import { useDeletedActionUpdate } from "../../../../contexts/DeletedActionContext.js";
import { orderBy } from "lodash";
import {
  useUserActionsUpdate,
  useUserActionsColumns,
  useUserActionsColumnsUpdate,
  useUserActionsColumnsWithFormatUpdate,
  useCategoryBadgesUpdate,
  useCategoryBadgesUpdateOnDrag,
} from "../../../../contexts/UserActionsContext.js";

const KanbanActionContainer = ({ collapsed, setCollapsed, categories }) => {
  const setUserActions = useUserActionsUpdate();
  const columns = useUserActionsColumns();
  const setColumns = useUserActionsColumnsUpdate();
  const setColumnsWithFormat = useUserActionsColumnsWithFormatUpdate();
  const setDeletedAction = useDeletedActionUpdate();
  const setCategoryBadges = useCategoryBadgesUpdate();
  const setCategoryBadgesOnDrag = useCategoryBadgesUpdateOnDrag();

  const [isHovering, setIsHovering] = useState(false);

  const mounted = useRef(false);

  const handleExpanded = (item, value) => {
    const column = item.status === false ? 1 : 2;
    setColumns({
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
    setUserActions([...updatedList, ...performed]);
    setColumnsWithFormat(updatedList, destItems);
    setDeletedAction(deletedAction);
  };

  const deleteUserAction = (id) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = "/user_climate_actions/" + id.toString();
    const requestOptions = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
    };
    fetch(URL, requestOptions).catch((e) => console.warn(e));
  };

  const updateStatus = (id, status) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = "/user_climate_actions/" + id.toString();
    const requestOptions = {
      method: "PUT",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
    };
    fetch(URL, requestOptions)
      .then((res) => {
        if (mounted.current) {
          return res.json();
        }
      })
      .catch((error) => console.warn(error));
  };

  const collectPerformedUserActions = (destItems) => {
    let performedUserActions = [];
    destItems.map((category) => {
      return category.userActionsArray.map((userAction) => {
        if (userAction.status === true) {
          userAction.id.toString();
          performedUserActions = [...performedUserActions, userAction];
        }
      });
    });
    return performedUserActions;
  };

  const sortActionsBasedOnStatus = (performedActions) => {
    return orderBy(performedActions, ["status"], ["desc"]);
  };

  const handleButtonPerformOnDrag = (movedItem, perform) => {
    //Move items in kanban through buttons instead of drag and drop
    if (perform) {
      //Button for performing an action
      const sourceColumn = columns[1];
      const destColumn = columns[2];
      const sourceItems = [...sourceColumn.items];
      //Updade status both locally and DB needs to happen before the filtering through status below
      updateStatus(movedItem.id, true);
      movedItem.status = true;
      //Filter out moved item from first column by local status.
      const filteredSourceItems = sourceItems.filter(
        (item) => item.status === false
      );
      //Add moved item to second column. Helpfunction in context desides if new categoryBadge should be created or just change status and color on subitem
      const destItems = setCategoryBadgesOnDrag(movedItem, destColumn.items);
      const sortedDestItems = destItems.map((category) => {
        return {
          ...category,
          userActionsArray: sortActionsBasedOnStatus(category.userActionsArray),
        };
      });
      setCategoryBadges([...sortedDestItems]);
      //Function to get performed useraction from categoryBadges
      let performedUserActions = collectPerformedUserActions(destItems);
      setUserActions([...sourceItems, ...performedUserActions]);

      setColumns({
        ...columns,
        [1]: {
          ...sourceColumn,
          items: filteredSourceItems,
        },
        [2]: {
          ...destColumn,
          items: sortedDestItems,
        },
      });
    } else {
      /** Button for unperform */
      const sourceColumn = columns[2];
      const destColumn = columns[1];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      //When we unperform a subitem within a categoryBadge we "create" a new userAction card, which needs an id as string
      movedItem.id = movedItem.id.toString();
      //We add the card in the end of the list
      const destIndex = destItems.length;
      destItems.splice(destIndex, 0, movedItem);
      //change the local status and in DB
      movedItem.status = false;
      updateStatus(movedItem.id, false);
      //Change the status of the subitem so that color can depend the categoryBadge
      const newSourceItems = sourceItems.map((category) => {
        return {
          ...category,
          userActionsArray: category.userActionsArray.map((item) => {
            return item.id == movedItem.id ? { ...item, status: false } : item;
          }),
        };
      });

      const sortedSourceItems = newSourceItems.map((category) => {
        return {
          ...category,
          userActionsArray: sortActionsBasedOnStatus(category.userActionsArray),
        };
      });
      //Check if categoryBadge has any subitem with status true, else delete the categoryBadge
      const checkDelete = sortedSourceItems.filter((category) => {
        return category.userActionsArray.some((item) => item.status === true);
      });
      setCategoryBadges([...checkDelete]);
      setUserActions([...destItems]);
      setColumns({
        ...columns,
        [1]: {
          ...destColumn,
          items: destItems,
        },
        [2]: {
          ...sourceColumn,
          items: checkDelete,
        },
      });
    }
  };

  const onDragEnd = (result, columns, setColumns) => {
    //If you drag but drop in the same column and do not reorder items
    if (!result.destination) return;
    const { source, destination } = result;
    //Drag is only enabled from column 1 to column 2 (when merged with saras code). Keep generalized
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      updateStatus(removed.id, true);
      const destItems = setCategoryBadgesOnDrag(removed, destColumn.items);
      const sortedDestItems = destItems.map((category) => {
        return {
          ...category,
          userActionsArray: sortActionsBasedOnStatus(category.userActionsArray),
        };
      });
      let performedUserActions = collectPerformedUserActions(destItems);
      setUserActions([...sourceItems, ...performedUserActions]);
      setCategoryBadges([...sortedDestItems]);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: sortedDestItems,
        },
      });
    } else {
      //If you drag but drop in the current column but reorder the items
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
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
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              className="text-center h-1/2 pb-24 -mb-10"
              key={columnId}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="h-10">
                <p
                  className={`font-normal text-base text-primary text-lg text-center`}
                >
                  {!collapsed && column.name}
                </p>
              </div>
              <KanbanActionColumn
                column={column}
                columnId={columnId}
                key={columnId}
                handleDelete={handleDelete}
                handleButtonPerformOnDrag={handleButtonPerformOnDrag}
                categories={categories}
                setCollapsed={setCollapsed}
                collapsed={collapsed}
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
