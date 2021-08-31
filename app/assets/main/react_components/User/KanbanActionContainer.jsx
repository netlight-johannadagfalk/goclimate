import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanActionColumn from "./KanbanActionColumn.jsx";
import { useUserActionsUpdate } from "./contexts/UserActionsContext.js";
import { useDeletedActionUpdate } from "./contexts/DeletedActionContext.js";
import {
  useUserActionsColumns,
  useUserActionsColumnsUpdate,
  useUserActionsColumnsWithFormatUpdate,
} from "./contexts/UserActionsContext.js";

const KanbanActionContainer = ({ collapsed, categoryColor }) => {
  const setUserActions = useUserActionsUpdate();
  const columns = useUserActionsColumns();
  const setColumns = useUserActionsColumnsUpdate();
  const setColumnsWithFormat = useUserActionsColumnsWithFormatUpdate();
  const setDeletedAction = useDeletedActionUpdate();

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
      const sourceColumn = columns[1];
      const destColumn = columns[2];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const sourceIndex = sourceItems.indexOf(theItem);
      const destIndex = destItems.length;
      const [removed] = sourceItems.splice(sourceIndex, 1);
      destItems.splice(destIndex, 0, removed);
      setUserActions([...sourceItems, ...destItems]);
      const newDestItems = destItems.map((item) =>
        item.status === false ? { ...item, status: !item.status } : item
      );
      setUserActions([...sourceItems, ...newDestItems]);
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
      setUserActions([...sourceItems, ...destItems]);
      const newDestItems = destItems.map((item) =>
        item.status === true ? { ...item, status: !item.status } : item
      );
      setUserActions([...sourceItems, ...newDestItems]);
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

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setUserActions([...sourceItems, ...destItems]);
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
      if (destColumn.id === columns[2].id) {
        const theItem = destItems.find((item) => item.status === false);
        const newDestItems = destItems.map((item) =>
          item.status === false ? { ...item, status: !item.status } : item
        );
        setUserActions([...sourceItems, ...newDestItems]);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: newDestItems,
          },
        });
        updateStatus(theItem.id, true);
      } else {
        const theItem = destItems.find((item) => item.status === true);
        const newDestItems = destItems.map((item) =>
          item.status === true ? { ...item, status: !item.status } : item
        );
        setUserActions([...sourceItems, ...newDestItems]);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: newDestItems,
          },
        });
        updateStatus(theItem.id, false);
      }
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
