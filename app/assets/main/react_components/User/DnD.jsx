import React, { useState } from "react";
import { DragDropContext } from 'react-beautiful-dnd';


import Column from './Column.jsx';

const itemsFromBackend = [
    { id: "1", content: "First task" },
    { id: "2", content: "Second task" },
    { id: "3", content: "Third task" },
    { id: "4", content: "Fourth task" },
    { id: "5", content: "Fifth task" }
];

const columnsFromBackend = {
    [1]: {
        name: "Accepted",
        items: itemsFromBackend
    },
    [2]: {
        name: "Performed",
        items: []
    },
};


function DnD() {

    const [columns, setColumns] = useState(columnsFromBackend);
    // const initialData = {
    //     tasks: {
    //         'task-1': { id: 'task-1', content: 'First task' },

    //         'task-2': { id: 'task-2', content: 'Second task' },

    //         'task-3': { id: 'task-3', content: 'Third task' },

    //         'task-4': { id: 'task-4', content: 'Fouth task' },
    //     },

    //     columns: {
    //         'column-1': {
    //             id: 'column-1',
    //             title: 'First column',
    //             taskIDs: ['task-1', 'task-2', 'task-3', 'task-4'],
    //         },
    //     },
    //     columnOrder: ['column-1'],
    // }
    // const tasks =
    //     [
    //         { id: 'task-1', content: 'First task' },
    //         { id: 'task-2', content: 'Second task' },
    //         { id: 'task-3', content: 'Third task' },
    //         { id: 'task-4', content: 'Fouth task' },]


    // const columns = [
    //     {
    //         id: 'column-1',
    //         title: 'First column',
    //         taskIDs: ['task-1', 'task-2', 'task-3', 'task-4'],
    //     }
    // ]

    // const columnOrder = ['column-1']

    // const onDragEnd = () => {

    //     // empty for now
    // }

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
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
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
        // <DragDropContext onDragEnd={onDragEnd}>
        //     <div>
        //         {/* {columnOrder.map((order) => (
        //         column = columns.find(({ id }) => id === 'column-1')
        //     ))} */}

        //         {column.items.map((item, index) => {
        //             // {columns.map((column) => (
        //             < Column key={column.id} column={column} tasks={tasks} />

        //         })}

        //     </div>
        // </DragDropContext>

        <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
            <DragDropContext
                onDragEnd={result => onDragEnd(result, columns, setColumns)}
            >
                {Object.entries(columns).map(([columnId, column], index) => {

                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                            key={columnId}
                        >
                            <h2>{column.name}</h2>
                            <div style={{ margin: 8 }}>
                                <Column column={column} columnId={columnId} key={columnId} />
                            </div>
                        </div>
                    );
                })}
            </DragDropContext>
        </div >

    )
}

export default DnD
