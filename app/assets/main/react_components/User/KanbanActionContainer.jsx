import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import KanbanActionColumn from "./KanbanActionColumn.jsx";

const KanbanActionContainer = ({
  setLocalAccepted,
  columns,
  setColumns,
  setTotUserActions,
  decreaseLocalNrOfAccepted,
}) => {
  const [render, setRender] = useState();
  useEffect(() => {
    setRender(columns);
  }, [columns]);

  const handleDelete = (id, actionID) => {
    deleteUserAction(id);
    setLocalAccepted(
      columns[1].items.filter((item) => item.id.toString() !== id),
      columns[2].items,
      actionID
    );
    decreaseLocalNrOfAccepted(actionID);
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
    // console.log("entered updatestatus" + id);
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
      if (destColumn.id === columns[2].id) {
        const theItem = destItems.find((item) => item.status === false);
        const newDestItems = destItems.map((item) =>
          item.status === false ? { ...item, status: !item.status } : item
        );
        setTotUserActions([...sourceItems, ...newDestItems]);
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
        setTotUserActions([...sourceItems, ...newDestItems]);
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
