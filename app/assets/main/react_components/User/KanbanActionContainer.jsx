import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanActionColumn from "./KanbanActionColumn.jsx";
import { useDeletedActionUpdate } from "./contexts/DeletedActionContext.js";
import {
  useUserActions,
  useUserActionsUpdate,
  useUserActionsColumns,
  useUserActionsColumnsUpdate,
  useUserActionsColumnsWithFormatUpdate,
  useCategoryBadgesUpdate,
  useCategoryBadgesUpdateOnDrag,
} from "./contexts/UserActionsContext.js";

const KanbanActionContainer = ({
  collapsed,
  categoryColor,
  climateActionCategories,
  actionsWithoutUserActions,
}) => {
  const userActions = useUserActions();
  const setUserActions = useUserActionsUpdate();
  const columns = useUserActionsColumns();
  const setColumns = useUserActionsColumnsUpdate();
  const setColumnsWithFormat = useUserActionsColumnsWithFormatUpdate();
  const setDeletedAction = useDeletedActionUpdate();
  const setCategoryBadgesOnDrag = useCategoryBadgesUpdateOnDrag();

  const setCategoryBadges = useCategoryBadgesUpdate();

  const handleLocalAccepted = (updatedList, performed, deletedAction) => {
    setUserActions([...updatedList, ...performed]);
    setColumnsWithFormat(updatedList, performed);
    setDeletedAction(deletedAction);
  };

  const handleDelete = (id, actionID) => {
    deleteUserAction(id);
    handleLocalAccepted(
      columns[1].items.filter((item) => item.id.toString() !== id),
      columns[2].items,
      actionID
    );
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

    fetch(URL, requestOptions).catch((e) => console.log(e));
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
        return res.json();
      })
      .catch((error) => console.warn(error));
  };

  const handlePerformance = (theItem, perform) => {
    if (perform) {
      // Button for performing actions
      const sourceColumn = columns[1];
      const destColumn = columns[2];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const sourceIndex = sourceItems.indexOf(theItem);
      const destIndex = destItems.length;
      const [removed] = sourceItems.splice(sourceIndex, 1);
      destItems.splice(destIndex, 0, removed);
      //setUserActions([...sourceItems, ...destItems]);
      const newDestItems = destItems.map((item) =>
        item.status === false ? { ...item, status: !item.status } : item
      );
      //setUserActions([...sourceItems, ...newDestItems]);
      setColumns({
        ...columns,
        [1]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [2]: {
          ...destColumn,
          items: newDestItems,
        },
      });
      updateStatus(theItem.id, true);
    } else {
      /** Button for unperform */
      const sourceColumn = columns[2];
      const destColumn = columns[1];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      //const sourceIndex = sourceItems.indexOf(theItem);
      const destIndex = destItems.length;
      // const [removed] = sourceItems.splice(sourceIndex, 1);
      theItem.id = theItem.id.toString();
      destItems.splice(destIndex, 0, theItem);
      theItem.status = false;
      const newSourceItems = sourceItems.map((category) => {
        return {
          ...category,
          itemsArray: category.itemsArray.map((item) => {
            return item.id == theItem.id || item.id == theItem.climate_action_id
              ? { ...item, status: false }
              : item;
          }),
        };
      });
      console.log({ newSourceItems });
      const checkDelete = newSourceItems.filter((category) => {
        return category.itemsArray.some((item) => item.status === true);
      });
      console.log({ checkDelete });
      //setUserActions([...sourceItems, ...destItems]);
      const newDestItems = destItems.map((item) =>
        item.status === true ? { ...item, status: false } : item
      );
      setCategoryBadges([...checkDelete]);
      //setUserActions([...sourceItems, ...newDestItems]);
      setColumns({
        ...columns,
        [2]: {
          ...sourceColumn,
          items: checkDelete,
        },
        [1]: {
          ...destColumn,
          items: newDestItems,
        },
      });
      updateStatus(theItem.id, false);
    }
  };

  // const filterCategoriesWithoutStatus = (filter, condition) => {
  //   return JSON.parse(filter).filter(
  //     (filterUserAction) =>
  //       filterUserAction.climate_action_category_id === condition
  //   );
  // };

  // const filterCategories = (filter, condition, status) => {
  //   return JSON.parse(filter).filter(
  //     (filterUserAction) =>
  //       filterUserAction.climate_action_category_id === condition &&
  //       filterUserAction.status === status
  //   );
  // };

  // const findCategory = (performedColumn, item) => {
  //   return performedColumn.find(
  //     (performedItem) => item.climate_action_category_id === performedItem.id
  //   );
  // };

  // const setNewPerformedActions = (item, performedColumn) => {
  //   const category = findCategory(performedColumn, item);
  //   if (category !== undefined) {
  //     const updatedItemsArray = category.itemsArray.map((action) =>
  //       action.id == item.id || action.id == item.climate_action_id
  //         ? { ...action, status: true }
  //         : action
  //     );

  //     const resultArray = performedColumn.map((performedCategory) => {
  //       return performedCategory.id === category.id
  //         ? { ...performedCategory, itemsArray: updatedItemsArray }
  //         : performedCategory;
  //     });
  //     return resultArray;
  //   } else {
  //     const newCategory = JSON.parse(climateActionCategories).find(
  //       (cat) => cat.id === item.climate_action_category_id
  //     );
  //     const secondMatching = filterCategoriesWithoutStatus(
  //       actionsWithoutUserActions,
  //       newCategory.id
  //     );
  //     const thirdMatching = filterCategories(
  //       userActions,
  //       newCategory.id,
  //       false
  //     );

  //     const result = {
  //       ...newCategory,
  //       itemsArray: [...secondMatching, ...thirdMatching],
  //     };

  //     const updatedItemsArray = result.itemsArray.map((action) => {
  //       return action.id == item.id || action.id == item.climate_action_id
  //         ? { ...action, status: true }
  //         : action;
  //     });

  //     const updatedResult = {
  //       ...newCategory,
  //       itemsArray: updatedItemsArray,
  //     };

  //     const resultArray = [...performedColumn, updatedResult];
  //     return resultArray;
  //   }
  // };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      updateStatus(removed.id, true);

      const destItems = setCategoryBadgesOnDrag(removed, columns[2].items);
      setUserActions([...sourceItems]);
      //setTotUserActions([...sourceItems]);

      setCategoryBadges([...destItems]);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
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
  console.log({ columns });
  return (
    <div className="flex flex-col justify-center h-full">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div key={columnId}>
              <div
                className="flex flex-col"
                style={{
                  alignItems: "center",
                }}
                key={columnId}
              >
                <div className="text-center pt-8" style={{ margin: 2 }}>
                  <p
                    className={`font-normal text-base text-primary text-lg top-0 text-center`}
                  >
                    {!collapsed && column.name}
                  </p>

                  <KanbanActionColumn
                    column={column}
                    columnId={columnId}
                    key={columnId}
                    handleDelete={handleDelete}
                    handlePerformance={handlePerformance}
                    categoryColor={categoryColor}
                    collapsed={collapsed}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default KanbanActionContainer;
