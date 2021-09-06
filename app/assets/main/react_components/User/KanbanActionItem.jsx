import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";

import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({
  item,
  index,
  handleDelete,
  handleButtonPerformOnDrag,
  categories,
  collapsed,
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [collapsed]);

  const setStyleWithoutReordering = (style, snapshot) => {
    /** Moving element from accepted column to achieved column */
    if (!snapshot.isDragging) {
      return {
        userSelect: "none",
        padding: 16,
        margin: "0 0 8px 0",
        minHeight: "auto",
      };
    }
  };

  const setStyleWithReordering = (style) => {
    /** Moving element inside accepted column */
    return {
      userSelect: "none",
      padding: 16,
      margin: "0 0 8px 0",
      minHeight: "auto",
      ...style,
    };
  };

  return (
    <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
      isDragDisabled={item.status !== false}
    >
      {(provided, snapshot) => {
        return (
          <div
            className={`border border-gray-tint-2 rounded-lg shadow-lg p-4 space-y-3 pt-0 ${
              collapsed ? "w-24" : "w-96"
            }
            ${expanded ? "h-48" : "w-24"}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={
              item.status === false
                ? setStyleWithReordering(provided.draggableProps.style)
                : setStyleWithoutReordering(
                    provided.draggableProps.style,
                    snapshot
                  )
            }
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
                        : "url('/achievement_images/AchievementClimateFriend.png')",
                  }}
                ></div>
              </div>
            ) : (
              <div className="flex flex-col">
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
                          : "url('/achievement_images/AchievementClimateFriend.png')",
                    }}
                  ></div>

                  <div className="font-bold">{item.name}</div>

                  <button
                    className={`ml-4 fas float-right ${
                      expanded ? "fa-chevron-up" : "fa-chevron-down"
                    }`}
                  ></button>
                </div>
                {item.userActionsArray && (
                  <div className="flex justify-center ml-6 -mt-5">
                    {/* <progress value={progress_bar} max="100" /> */}
                    <ProgressBar
                      categories={categories}
                      item={item}
                      userActions={item.userActionsArray}
                      actions={item.actionsArray}
                    />
                  </div>
                )}
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
                              <div className="text-danger">{subitem.name}</div>
                            ) : (
                              <div className="">{subitem.name}</div>
                            )}
                            {subitem.status === true && (
                              <button
                                className="button ml-4 button-cta"
                                onClick={() =>
                                  handleButtonPerformOnDrag(subitem, false)
                                }
                              >
                                Unperformed{" <"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    {item.actionsArray &&
                      item.actionsArray.map((subitem) => {
                        return (
                          <div key={subitem.id}>
                            <div className="">{subitem.name}</div>
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
