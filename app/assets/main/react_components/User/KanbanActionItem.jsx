import React, { useState, useEffect } from "react";

import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({
  item,
  index,
  handleDelete,
  handlePerformance,
  categoryColor,
  collapsed,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [collapsed]);

  return (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
      isDragDisabled={collapsed}
    >
      {(provided) => {
        return (
          <div
            className={`${categoryColor} border border-gray-tint-2 rounded-lg shadow-lg p-4 h-full space-y-3 pt-0 ${
              collapsed ? "w-24" : "w-96"
            }`}
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
            onClick={() => setExpanded(!expanded)}
          >
            {collapsed ? (
              <div className="flex items-center justify-between">
                {/* image that should be loaded from items.imgage and when status is changed, the image changes to category.image (badge) */}
                <img
                  src={
                    item.status === false
                      ? "https://www.goclimate.com/blog/wp-content/uploads/2020/07/DJI_0974-768x512.jpg"
                      : "https://www.goclimate.com/bundles/images/climate_tips/diet_meat-2x-7655d2c5801c3203a42ed27da6e83f6c.jpg"
                  }
                  className="h-14 w-14 rounded-full mt-4"
                ></img>
              </div>
            ) : (
              <div
                className="flex items-center justify-between"
                onClick={() => setExpanded(!expanded)}
              >
                {/* image that should be loaded from items.imgage and when status is changed, the image changes to category.image (badge) */}
                <img
                  src={
                    item.status === false
                      ? "https://www.goclimate.com/blog/wp-content/uploads/2020/07/DJI_0974-768x512.jpg"
                      : "https://www.goclimate.com/bundles/images/climate_tips/diet_meat-2x-7655d2c5801c3203a42ed27da6e83f6c.jpg"
                  }
                  className="h-14 w-14 rounded-full mt-4"
                ></img>

                <div className="font-bold">{item.name}</div>

                <button
                  className={`ml-4 fas float-right ${
                    expanded ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></button>
              </div>
            )}

            {expanded && !collapsed && (
              <div>
                {item.status === false ? (
                  <div className="flex flex-col text-center">
                    <div className="flex-1 justify-center">
                      <p>
                        {item.description.length > 40
                          ? item.description.slice(0, 40) + "..."
                          : item.description}
                      </p>
                    </div>
                    <div className="flex-1 justify-center">
                      <button
                        className=" ml-4 fas fa-trash"
                        onClick={() =>
                          handleDelete(item.id, item.climate_action_id)
                        }
                      ></button>
                      <button
                        className="button ml-4 button-cta"
                        onClick={() => handlePerformance(item, true)}
                      >
                        Performed{" >"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col text-center">
                    <div className="justify-center">
                      <p>
                        {item.description.length > 40
                          ? item.description.slice(0, 40) + "..."
                          : item.description}
                      </p>
                    </div>
                    <button
                      className="button button-cta  "
                      onClick={() => handlePerformance(item, false)}
                    >
                      Unperform{" <"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanActionItem;
