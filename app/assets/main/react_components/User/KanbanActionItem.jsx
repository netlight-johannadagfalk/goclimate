import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({ item, index, handleDelete, handlePerformance }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => {
        return (
          <div
            className="callout grid grid-cols-3 gap-4 items-baseline space-x-6 text-l font-bold"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              userSelect: "none",
              padding: 16,
              margin: "0 0 8px 0",
              minHeight: "auto",
              ...provided.draggableProps.style,
            }}
          >
            <div>{item.name}</div>
            {item.status === false ? (
              <div className="col-end-auto col-span-2 ">
                <button
                  className="button ml-4 button-cta col-end-auto "
                  onClick={() => handlePerformance(item, true)}
                >
                  Performed{" >"}
                </button>
                <button
                  className=" ml-4 fas fa-trash col-end-auto "
                  onClick={() => handleDelete(item.id, item.climate_action_id)}
                ></button>
                <button
                  className={`ml-4 fas col-end-auto ${
                    expanded ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                  onClick={() => setExpanded(!expanded)}
                ></button>
              </div>
            ) : (
              <div className="col-span-2  ">
                <button
                  className="button button-cta  "
                  onClick={() => handlePerformance(item, false)}
                >
                  Unperform{" <"}
                </button>
                <button
                  className={`ml-4 fas  ${
                    expanded ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                  onClick={() => setExpanded(!expanded)}
                ></button>
              </div>
            )}

            {expanded && (
              <div
                className="text-s ml-0  inherit"
                style={{
                  margin: "0",
                  fontWeight: "normal",
                  fontSize: "16px",
                }}
              >
                <div className="flex-1">
                  <p>
                    {item.description.length > 40
                      ? item.description.slice(0, 40) + "..."
                      : item.description}
                  </p>
                </div>
                <div className="flex-1">
                  <img src="earth.png" className=" flex"></img>
                </div>
                {item.itemsArray &&
                  item.itemsArray.map((subItem) => (
                    <div>
                      <p>{subItem.name}</p>
                      <button
                        className=" ml-4 fas fa-trash col-end-auto "
                        onClick={() =>
                          handleDelete(item.id, item.climate_action_id)
                        }
                      ></button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanActionItem;
