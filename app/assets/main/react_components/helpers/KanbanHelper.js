import { updateStatus } from "../helpers/DBRequests.js";
import { orderBy } from "lodash";

const sortActionsBasedOnStatus = (performedActions) => {
  return orderBy(performedActions, ["status"], ["desc"]);
};

const orderBadgesOnItemDragged = (performedCategories, movedItem) => {
  return orderBy(performedCategories, ({ id }) =>
    id == movedItem.climate_action_category_id ? 0 : 1
  );
};

export const collectPerformedUserActions = (destItems) => {
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

export const handleCompleteAction = (
  movedItem,
  columns,
  updateUserActions,
  updateColumns,
  updateAchievements,
  updateAchievementsOnMove
) => {
  const sourceColumn = columns[1];
  const destColumn = columns[2];
  const sourceItems = [...sourceColumn.items];
  updateStatus(movedItem.id, true);
  movedItem.status = true;
  const filteredSourceItems = sourceItems.filter(
    (item) => item.status === false
  );
  const destItems = updateAchievementsOnMove(movedItem, destColumn.items);
  const sortedDestItems = destItems.map((category) => {
    return {
      ...category,
      userActionsArray: sortActionsBasedOnStatus(category.userActionsArray),
    };
  });
  updateAchievements([...sortedDestItems]);
  const newSortedDestItems = orderBadgesOnItemDragged(
    sortedDestItems,
    movedItem
  );
  let performedUserActions = collectPerformedUserActions(newSortedDestItems);
  updateUserActions([...sourceItems, ...performedUserActions]);

  updateColumns({
    ...columns,
    [1]: {
      ...sourceColumn,
      items: filteredSourceItems,
    },
    [2]: {
      ...destColumn,
      items: newSortedDestItems,
    },
  });
};

export const handleUncompleteAction = (
  movedItem,
  columns,
  updateUserActions,
  updateColumns,
  updateAchievements
) => {
  const sourceColumn = columns[2];
  const destColumn = columns[1];
  const sourceItems = [...sourceColumn.items];
  const destItems = [...destColumn.items];
  movedItem.id = movedItem.id.toString();
  const destIndex = destItems.length;
  destItems.splice(destIndex, 0, movedItem);
  movedItem.status = false;
  updateStatus(movedItem.id, false);
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
  const checkDelete = sortedSourceItems.filter((category) => {
    return category.userActionsArray.some((item) => item.status === true);
  });
  updateAchievements([...checkDelete]);
  updateUserActions([...destItems]);
  updateColumns({
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
};

export const onDragEnd = (
  result,
  mounted,
  columns,
  updateUserActions,
  updateColumns,
  updateAchievements,
  updateAchievementsOnMove
) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    updateStatus(removed.id, true, mounted);
    const destItems = updateAchievementsOnMove(removed, destColumn.items);
    const sortedDestItems = destItems.map((category) => {
      return {
        ...category,
        userActionsArray: sortActionsBasedOnStatus(category.userActionsArray),
      };
    });
    let performedUserActions = collectPerformedUserActions(destItems);
    updateUserActions([...sourceItems, ...performedUserActions]);
    const newSortedDestItems = orderBadgesOnItemDragged(
      sortedDestItems,
      removed
    );
    updateAchievements([...newSortedDestItems]);
    updateColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: newSortedDestItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    updateColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};
