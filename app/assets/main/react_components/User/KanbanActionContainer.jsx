import React, { useState } from "react";
import { DragDropContext } from 'react-beautiful-dnd';

import KanbanColumn from './KanbanColumn.jsx';

const itemsFromBackend = [
    { id: "1", name: "First task", status: false },
    { id: "2", name: "Second task", status: false },
    { id: "3", name: "Third task", status: false },
    { id: "4", name: "Fourth task", status: false },
    { id: "5", name: "Fifth task", status: false }
];

function KanbanActionContainer() {
    // const newItemsFromBackend = JSON.parse(itemsFromBackend)

    // newItemsFromBackend.map((newItemFromBackend) => {
    //     { newItemFromBackend.id = newItemFromBackend.id.toString() }
    // })

    const columnsFromBackend = {
        [1]: {
            name: "Your accepted actions:",
            items: itemsFromBackend
        },
        [2]: {
            name: "Your performed actions:",
            items: []
        },
    };

    const [columns, setColumns] = useState(columnsFromBackend);
    //const [items, setItems] = useState(newItemsFromBackend);

    // const changeState = () => {
    //     setItems(items.map((item) => {
    //         item.status === false ? { ...item, status: !item.status } : item
    //         console.log(item.status === false)
    //         console.log(item)
    //     }
    //     ))
    // }

    // const changeState = (destItems) => {
    //     console.log("hej")
    //     setItems(items.map((item) => {
    //         console.log(item)
    //         if (true) {
    //             item.status = !item.status;
    //         }
    //         console.log(item)
    //         // true ? { ...item, status: true } : { ...item, status: true }
    //         // console.log(item.status === false)
    //         // console.log(item)
    //         // console.log(destItems)
    //         // console.log(destItems.find(destItem => destItem.content === "1"))

    //     }
    //     ))
    // }

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            // const newItems = destItems.map((item) => {
            //     item.status === false ? { ...item, status: !item.status } : item

            //        console.log(columns)
            // })

            //changeState(destItems);

            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems.map((item) =>
                        item.status === false ? { ...item, status: !item.status } : item)
                },
                // [2]: {
                //     ...destColumn,
                //     items: newItems
                // },
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
                    items: copiedItems
                }
            });
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >
                {Object.entries(columns).map(([columnId, column]) => {

                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                            //kanske ta bort key?
                            key={columnId}
                        >
                            <div className="callout" style={{ margin: 8 }}>
                                <p className="font-bold inline-block text-green-accent py-1 px-2 -ml-2 rounded" >{column.name}</p>
                                <KanbanColumn column={column} columnId={columnId} key={columnId} />
                            </div>
                        </div>
                    );

                })}
            </DragDropContext>
        </div >
    )
}

export default KanbanActionContainer
