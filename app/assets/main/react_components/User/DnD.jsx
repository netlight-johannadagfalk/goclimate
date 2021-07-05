import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column.jsx';

const itemsFromBackend = [
    { id: 1, content: "First task" },
    { id: 2, content: "Second task" },
    { id: 3, content: "Third task" },
    { id: 4, content: "Fourth task" },
    { id: 5, content: "Fifth task" }
];

const columnsFromBackend = {
    [1]: {
        name: "Requested",
        items: itemsFromBackend
    },
    [2]: {
        name: "To do",
        items: []
    },
    [3]: {
        name: "In Progress",
        items: []
    },
    [4]: {
        name: "Done",
        items: []
    }
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


    const onDragEnd = () => {

        // empty for now
    }


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                {/* {columnOrder.map((order) => (
                column = columns.find(({ id }) => id === 'column-1')
            ))} */}

                {column.items.map((item, index) => {
                    // {columns.map((column) => (
                    < Column key={column.id} column={column} tasks={tasks} />

                })}

            </div>
        </DragDropContext>
    )
}

export default DnD
