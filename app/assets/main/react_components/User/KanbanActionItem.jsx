import React, { useState, useEffect } from "react";

import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({
  item,
  index,
  handleDelete,
  handleButtonPerformOnDrag,
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
            className={`${categoryColor} border border-gray-tint-2 rounded-lg shadow-lg p-4 space-y-3 pt-0 ${
              collapsed ? "w-24" : "w-96"
            }
            ${expanded ? "h-48" : "w-24"}`}
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
                <div
                  className={`mt-4 rounded-full h-14 w-14 bg-cover`}
                  style={{
                    backgroundImage:
                      item.status === false
                        ? `url('${item.image_url}')`
                        : `url('${item.badge_image_url}')`,
                  }}
                ></div>
              </div>
            ) : (
              <div
                className="flex items-center justify-between"
                onClick={() => setExpanded(!expanded)}
              >
                {/* image that should be loaded from items.imgage and when status is changed, the image changes to category.image (badge) */}
                <div
                  className={`mt-4 rounded-full h-14 w-14 bg-cover`}
                  style={{
                    backgroundImage:
                      item.status === false
                        ? `url('${item.image_url}')`
                        : `url('${item.badge_image_url}')`,
                  }}
                ></div>

                <div className="font-bold">{item.name}</div>

                <button
                  className={`ml-4 fas float-right ${
                    expanded ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></button>
              </div>
            )}

            {expanded && !collapsed && (
              <div className="rounded-tl-lg rounded-tr-lg p-2">
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
                        onClick={() => handleButtonPerformOnDrag(item, true)}
                      >
                        Performed{" >"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Map through both arrays in categoryBadge. All actions in the category should be rendered in a list, but those userActions that are performed should be highlighted */}
                    {item.userActionsArray &&
                      item.userActionsArray.map((subitem) => {
                        return (
                          <div key={subitem.id}>
                            {subitem.status === true ? (
                              <div className="flex mt-1">
                                <div
                                  className="mr-3 rounded-full h-7 w-7 bg-cover flex-initial"
                                  style={{
                                    backgroundImage:
                                      "url('/achievement_images/AchievementStarActive.png')",
                                  }}
                                ></div>
                                <div className="flex-initial text-left">
                                  {subitem.name}
                                </div>
                                <button
                                  className="flex-1 hover:text-gray-shade-1 text-gray-accent text-lg text-right"
                                  onClick={() =>
                                    handleButtonPerformOnDrag(subitem, false)
                                  }
                                >
                                  &times;
                                </button>
                              </div>
                            ) : (
                              <div className="flex mt-1">
                                <div
                                  className="mr-3 rounded-full h-7 w-7 bg-cover flex-initial"
                                  style={{
                                    backgroundImage:
                                      "url('/achievement_images/AchievementStarInactive.png')",
                                  }}
                                ></div>
                                <div className="flex-inital text-left text-gray-accent">
                                  {subitem.name}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    {item.actionsArray &&
                      item.actionsArray.map((subitem) => {
                        return (
                          <div key={subitem.id}>
                            <div className="flex mt-1">
                              <div
                                className="mr-3 rounded-full h-7 w-7 bg-cover flex-initial"
                                style={{
                                  backgroundImage:
                                    "url('/achievement_images/AchievementStarInactive.png')",
                                }}
                              ></div>
                              <div className="flex-inital text-left text-gray-accent">
                                {subitem.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
