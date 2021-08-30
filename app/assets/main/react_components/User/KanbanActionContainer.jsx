import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanActionColumn from "./KanbanActionColumn.jsx";

const KanbanActionContainer = ({
  setLocalAccepted,
  columns,
  setColumns,
  setTotUserActions,
  categoryColor,
  climateActionCategories,
  climateActionsUser,
  categoryBadges,
  userActions,
  actionsWithoutUserActions,
}) => {
  const [render, setRender] = useState();
  useEffect(() => {
    setRender(columns);
  }, [columns]);

  console.log("columns" + JSON.stringify(columns));
  const handleDelete = (id, actionID) => {
    deleteUserAction(id);
    setLocalAccepted(
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
      const sourceColumn = columns[1];
      const destColumn = columns[2];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const sourceIndex = sourceItems.indexOf(theItem);
      const destIndex = destItems.length;
      const [removed] = sourceItems.splice(sourceIndex, 1);
      destItems.splice(destIndex, 0, removed);
      setTotUserActions([...sourceItems, ...destItems]);
      const newDestItems = destItems.map((item) =>
        item.status === false ? { ...item, status: !item.status } : item
      );
      setTotUserActions([...sourceItems, ...newDestItems]);
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
      const sourceColumn = columns[2];
      const destColumn = columns[1];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const sourceIndex = sourceItems.indexOf(theItem);
      const destIndex = destItems.length;
      const [removed] = sourceItems.splice(sourceIndex, 1);
      destItems.splice(destIndex, 0, removed);
      setTotUserActions([...sourceItems, ...destItems]);
      const newDestItems = destItems.map((item) =>
        item.status === true ? { ...item, status: !item.status } : item
      );
      setTotUserActions([...sourceItems, ...newDestItems]);
      setColumns({
        ...columns,
        [2]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [1]: {
          ...destColumn,
          items: newDestItems,
        },
      });
      updateStatus(theItem.id, false);
    }
  };

  // const appendSubItem = (item, columns) => {
  //   console.log("item" + item.climate_action_category_id);
  //   console.log("categoryBadge is a type of " + JSON.stringify(categoryBadges)); //array with objects
  //   /** Feteches the correct category */
  //   const theCategory = categoryBadges.find(
  //     (category) => category.id === item.climate_action_category_id
  //     //console.log(category.id);
  //   );
  //   console.log("thecategroy" + theCategory.id);
  //   const theCategoryIndex = categoryBadges.findIndex(
  //     (category) => category.id === item.climate_action_category_id
  //   );
  //   console.log("THE FINAL INDEX IS: " + theCategoryIndex);

  //   console.log("ALL USER ACTIONS: " + JSON.stringify(climateActionsUser));

  //   /** Get all actions related to category id */
  //   const actionsToCategory = climateActionsUser.filter(
  //     (actions) =>
  //       actions.climate_action_category_id === item.climate_action_category_id
  //   );

  //   console.log("FOUND ACTIONS: " + JSON.stringify(actionsToCategory));

  //   console.log("NEW COLUMNS: " + JSON.stringify(columns[2].items));

  //   //const userClimateActions = columns[2].items.

  //   /** Need user climate actions data, so we can use status */

  //   // const subItems = [...categoryBadges[theCategoryIndex].items];
  //   // subItems.splice(subItems.lenght, 0, item);

  //   /** Update status for the moved item, both locally and to database */
  //   item.status = true;
  //   console.log("ITEM STATUS: " + item.status);
  //   updateStatus(item.id, true);

  //   console.log(
  //     "CATEGORYBADGES BEFORE " +
  //       JSON.stringify(categoryBadges[theCategoryIndex])
  //   );

  //   categoryBadges[theCategoryIndex].itemsArray = actionsToCategory;
  //   console.log(
  //     "CATEGORYBADGES WITH ADDED ACTOINS: " +
  //       JSON.stringify(categoryBadges[theCategoryIndex])
  //   );

  //   return categoryBadges;
  // };

  const filterCategoriesWithoutStatus = (filter, condition) => {
    return JSON.parse(filter).filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition
    );
  };

  const filterCategories = (filter, condition, status) => {
    return JSON.parse(filter).filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition &&
        filterUserAction.status === status
    );
  };

  const findCategory = (performedColumn, item) => {
    return performedColumn.find(
      (performedItem) => item.climate_action_category_id === performedItem.id
    );
  };

  const setNewPerformedActions = (item, performedColumn) => {
    const updated = false;
    /** Check if the category is already created in the performed column, if so, we add the action to the category */
    // const resultArray = performedColumn.map((performedItem) => {
    //   if (item.climate_action_category_id === performedItem.id) {
    //     const foundAction = performedItem.itemsArray.filter(
    //       (action) => action.id === item.id
    //       //console.log("I ENTER ID IF");
    //       //return { ...action, status: true };
    //     );
    //     return {
    //       ...performedColumn,
    //       performedItem.itemsArray.foundAction,
    //       status: true,
    //     };
    //   }
    // });

    const category = findCategory(performedColumn, item);
    if (category !== undefined) {
      console.log("CATEGORY: " + JSON.stringify(category));
      console.log("ITEM: " + JSON.stringify(item));
      const updatedItemsArray = category.itemsArray.map((action) =>
        action.id == item.id ? { ...action, status: true } : action
      );

      const resultArray = performedColumn.map((performedCategory) => {
        return performedCategory.id === category.id
          ? { ...performedCategory, itemsArray: updatedItemsArray }
          : performedCategory;
      });
      console.log("RESULTEDARRAY: " + JSON.stringify(resultArray));
      return resultArray;
    } else {
      const newCategory = JSON.parse(climateActionCategories).find(
        (cat) => cat.id === item.climate_action_category_id
      );
      const secondMatching = filterCategoriesWithoutStatus(
        actionsWithoutUserActions,
        newCategory.id
      );
      const thirdMatching = filterCategories(
        userActions,
        newCategory.id,
        false
      );

      const result = {
        ...newCategory,
        itemsArray: [...secondMatching, ...thirdMatching],
      };

      console.log("RESULT WHEN MOVED NEW ACTION: " + JSON.stringify(result));
      /*const categoryIndex = result.findIndex(
        (foundCategory) => foundCategory.id == newCategory.id
      );*/
      const updatedItemsArray = result.itemsArray.map((action) =>
        action.id == item.id ? { ...action, status: true } : action
      );

      const updatedResult = {
        ...newCategory,
        itemsArray: updatedItemsArray,
      };
      //const resultArray = performedColumn.push(updatedItemStatus);

      const resultArray = [...performedColumn, updatedResult];
      console.log(
        "RESULTARRAY WHEN DRAG NEW ITEM " + JSON.stringify(resultArray)
      );
      return resultArray;
    }

    /** The category for the action does not exist in performed so need to create a new one*/
    // if (!updated) {
    //   /**Find the category for the performed item */
    //   const category = JSON.parse(climateActionCategories).find(
    //     (category) => category.id === item.climate_action_category_id
    //   );
    //   /** Find all actions without user actions for the category */
    //   const secondMatching = filterCategoriesWithoutStatus(
    //     actionsWithoutUserActions,
    //     category.id
    //   );

    //   /** Find all actions that the user have accepted that is in the category */
    //   const thirdMatching = filterCategories(userActions, category.id, false);

    //   const result = {
    //     ...category,
    //     itemsArray: [...secondMatching, ...thirdMatching],
    //   };

    //   /** Add the found result to the performed column */
    //   resultArray = [...performedColumn, ...result];
    // }
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    //Since destination column will always be the second one, update status here!
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      //Set data to second column
      //const destItems = [...destColumn.items];
      updateStatus(removed.id, true);

      const updatedDestItems = setNewPerformedActions(
        removed,
        columns[2].items
      );
      const destItems = [...updatedDestItems];
      setTotUserActions([...sourceItems, ...destItems]);

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
      console.log("newDESTITEMS: " + JSON.stringify(columns[2].items));
      // if (destColumn.id === columns[2].id) {
      //   const theItem = destItems.find((item) => item.status === false);
      //   const newDestItems = destItems.map((item) =>
      //     item.status === false ? { ...item, status: !item.status } : item
      //   );
      //   setTotUserActions([...sourceItems, ...newDestItems]);
      //   setColumns({
      //     ...columns,
      //     [source.droppableId]: {
      //       ...sourceColumn,
      //       items: sourceItems,
      //     },
      //     [destination.droppableId]: {
      //       ...destColumn,
      //       items: newDestItems,
      //     },
      //   });
      //   updateStatus(theItem.id, true);
      // } else {
      //   const theItem = destItems.find((item) => item.status === true);
      //   const newDestItems = destItems.map((item) =>
      //     item.status === true ? { ...item, status: !item.status } : item
      //   );
      //   setTotUserActions([...sourceItems, ...newDestItems]);
      //   setColumns({
      //     ...columns,
      //     [source.droppableId]: {
      //       ...sourceColumn,
      //       items: sourceItems,
      //     },
      //     [destination.droppableId]: {
      //       ...destColumn,
      //       items: newDestItems,
      //     },
      //   });
      //   updateStatus(theItem.id, false);
      // }
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

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <div className="callout" style={{ margin: 8 }}>
                <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded">
                  {column.name}
                </p>
                <KanbanActionColumn
                  column={column}
                  columnId={columnId}
                  key={columnId}
                  handleDelete={handleDelete}
                  handlePerformance={handlePerformance}
                  categoryColor={categoryColor}
                />
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default KanbanActionContainer;
