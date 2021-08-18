import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const KanbanActionItem = ({ item, index, handleDelete, handlePerformance }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => {
        if (item.status) {
          return (
            <div
              className="space-x-6 text-l font-bold"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                userSelect: 'none',
                padding: 16,
                margin: '0 0 8px 0',
                minHeight: '50px',
                //backgroundImage: `url("https://www.emojimeaning.com/img/img-apple-160/1f947.png")`,

                ...provided.draggableProps.style,
              }}
            >
              {item.name}
              <h3 className="text-5xl">🥇 </h3>
              {item.status === false ? (
                <div>
                  <button
                    className="float-right fas fa-trash"
                    onClick={() =>
                      handleDelete(item.id, item.climate_action_id)
                    }
                  ></button>
                  <button
                    className="button button-cta"
                    onClick={() => handlePerformance(item, true)}
                  >
                    Performed{' >'}
                  </button>
                </div>
              ) : (
                <button
                  className="button button-cta"
                  onClick={() => handlePerformance(item, false)}
                >
                  Unperform{' <'}
                </button>
              )}
            </div>
          )
        } else {
          return (
            <div
              className="callout space-x-6 text-l font-bold"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                userSelect: 'none',
                padding: 16,
                margin: '0 0 8px 0',
                minHeight: '50px',
                ...provided.draggableProps.style,
              }}
            >
              {item.name}
              {item.status === false ? (
                <div>
                  <button
                    className="float-right fas fa-trash"
                    onClick={() =>
                      handleDelete(item.id, item.climate_action_id)
                    }
                  ></button>
                  <button
                    className="button button-cta"
                    onClick={() => handlePerformance(item, true)}
                  >
                    Performed{' >'}
                  </button>
                </div>
              ) : (
                <button
                  className="button button-cta"
                  onClick={() => handlePerformance(item, false)}
                >
                  Unperform{' <'}
                </button>
              )}
            </div>
          )
        }
      }}
    </Draggable>
  )
}

export default KanbanActionItem
