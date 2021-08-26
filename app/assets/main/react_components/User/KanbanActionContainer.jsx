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

  const [categoryBadges, setCategoryBadges] = useState([
    ...JSON.parse(climateActionCategories),
  ]);

  const appendSubItem = (item) => {
    console.log("item" + item.climate_action_category_id);
    console.log("categoryBadge is a type of " + JSON.stringify(categoryBadges)); //array with objects
    /** Feteches the correct category */
    const theCategory = categoryBadges.find(
      (category) => category.id === item.climate_action_category_id
      //console.log(category.id);
    );
    console.log("thecategroy" + theCategory.id);
    const theCategoryIndex = categoryBadges.findIndex(
      (category) => category.id === item.climate_action_category_id
    );
    console.log("THE FINAL INDEX IS: " + theCategoryIndex);

    console.log("ALL USER ACTIONS: " + JSON.stringify(climateActionsUser));

    /** Get all actions related to category id */
    const actionsToCategory = climateActionsUser.filter(
      (actions) =>
        actions.climate_action_category_id === item.climate_action_category_id
    );
    console.log("FOUND ACTIONS: " + JSON.stringify(actionsToCategory));

    /** Need user climate actions data, so we can use status */

    // const subItems = [...categoryBadges[theCategoryIndex].items];
    // subItems.splice(subItems.lenght, 0, item);

    /** Update status for the moved item, both locally and to database */
    item.status = true;
    updateStatus(item.id, true);

    console.log(
      "CATEGORYBADGES BEFORE " +
        JSON.stringify(categoryBadges[theCategoryIndex])
    );

    categoryBadges[theCategoryIndex].itemsArray = actionsToCategory;
    console.log(
      "CATEGORYBADGES WITH ADDED ACTOINS: " +
        JSON.stringify(categoryBadges[theCategoryIndex])
    );

    return categoryBadges;
  };

  const createCategoryElement = (item) => {
    const tempCategory = {
      climate_action_id: item.climate_action_id,
      description: "description",
      id: item.id,
      name: "Food Category Badge",
      status: true,
      user_id: item.user_id,
      itemsArray: [item],
    };
    return tempCategory;
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      //const destItems = [...destColumn.items];

      // console.log("destitems" + JSON.stringify(destItems));
      const [removed] = sourceItems.splice(source.index, 1);

      console.log("removed" + JSON.stringify(removed));
      //instead of appending removed, add a category object
      //const newObject = createCategoryElement(removed);
      //destItems.splice(destination.index, 0, newObject);
      const updatedDestItems = appendSubItem(removed);
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
