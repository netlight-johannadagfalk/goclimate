import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";

import { Draggable } from "react-beautiful-dnd";
import { useMediaQuery } from "react-responsive";

const KanbanActionItem = ({
  item,
  index,
  handleDelete,
  handleButtonPerformOnDrag,
  categories,
  collapsed,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const isBadge = item.userActionsArray ? true : false;

  const categoryName = () => {
    for (let i = 0; i <= Object.keys(categories).length; i++) {
      if (isBadge) return "";

      if (categories[i].id === item.climate_action_category_id) {
        return categories[i].name.toString();
      }
    }
    return "unknown";
  };

  const categoryColor = categoryName();
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
            className={`border border-gray-tint-2 rounded-lg shadow-lg p-0 space-y-3 pt-0 ${
              collapsed ? "w-24" : isTabletOrMobile ? "w-80 ml-5" : "w-96"
            }
            
            ${expanded ? "h-auto" : "w-24"}`}
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
              <div className="flex flex-1 items-center justify-center shadow-md">
                <div
                  className={`rounded-full h-16 w-16 bg-cover`}
                  style={{
                    backgroundImage:
                      item.status === false
                        ? `url('${item.image_url}')`
                        : "url('/achievement_images/AchievementClimateFriend.png')",
                    backgroundSize: "100%",
                  }}
                ></div>
              </div>
            ) : (
              <>
                <div>
                  {!isBadge && (
                    <div
                      className={`${
                        "category_" +
                        categoryColor.toLowerCase().replace(/ /g, "_") +
                        "_active"
                      } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60`}
                    ></div>
                  )}
                  <div
                    className={`flex flex-row h-14 ${
                      expanded && "border-b border-b-gray-tint-2 "
                    }`}
                    onClick={() => setExpanded(!expanded)}
                  >
                    <div className="flex flex-1">
                      <div
                        className={`mx-auto ${
                          !isBadge && "-mt-1/4"
                        } rounded-full h-16 w-16 items-center justify-center bg-contain bg-center shadow-lg`}
                        style={{
                          backgroundImage:
                            item.status === false
                              ? `url('${item.image_url}')`
                              : "url('/achievement_images/AchievementClimateFriend.png')",
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-2 justify-start">
                      <div className="flex flex-1 font-bold text-left">
                        {item.name}
                      </div>
                    </div>
                    <div className="flex flex-1 justify-center items-start">
                      <button
                        className={`ml-4 fas float-right mt-4 focus:outline-none ${
                          expanded ? "fa-chevron-up" : "fa-chevron-down"
                        }`}
                      ></button>
                    </div>
                  </div>
                  {isBadge && (
                    <div className="flex justify-center ml-6 -mt-5">
                      <ProgressBar
                        categories={categories}
                        item={item}
                        userActions={item.userActionsArray}
                        actions={item.actionsArray}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {expanded && !collapsed && (
              <div className="mb-4 mx-2">
                {item.status === false ? (
                  <div className="flex flex-1 flex-col text-center">
                    <div className="flex-1 justify-center">
                      <p>
                        {item.description.length > 200
                          ? item.description.slice(0, 200) + "..."
                          : item.description}
                      </p>
                    </div>
                    <div className="flex-1 justify-center my-4">
                      <button
                        className=" mr-4 fas fa-times-circle h-4 w-4 focus:outline-none"
                        onClick={() =>
                          handleDelete(item.id, item.climate_action_id)
                        }
                      ></button>
                      <button
                        className="ml-4 fas fa-check-circle focus:outline-none"
                        onClick={() => handleButtonPerformOnDrag(item, true)}
                      ></button>
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
