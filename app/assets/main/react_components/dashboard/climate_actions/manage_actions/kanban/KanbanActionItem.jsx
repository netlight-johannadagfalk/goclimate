import React, { useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";
import { Draggable } from "react-beautiful-dnd";

const KanbanActionItem = ({
  item,
  index,
  handleDelete,
  handleButtonPerformOnDrag,
  categories,
  collapsed,
  handleExpanded,
}) => {
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
    handleExpanded(item, false);
  }, [collapsed]);

  const setStyleWithoutReordering = (style, snapshot) => {
    /** Moving element from accepted column to achieved column */
    if (!snapshot.isDragging) {
      return {
        userSelect: "none",
        padding: 0,
        minHeight: "auto",
      };
    }
  };

  const setStyleWithReordering = (style) => {
    /** Moving element inside accepted column */
    return {
      userSelect: "none",
      padding: 0,
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
            className={`rounded-lg p-0 space-y-3 pt-0 w-80 mb-2 focus:outline-none transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-102 ${
              collapsed ? "d:w-24" : "t:w-80 border border-gray-tint-2 mx-5"
            }
            ${item.expanded ? "h-auto" : "w-24"}`}
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
          >
            {collapsed ? (
              <div className="flex flex-1 items-center justify-center shadow-md">
                <div
                  className={`rounded-full h-16 w-16 bg-cover shadow-lg my-1`}
                  style={{
                    backgroundImage: isBadge
                      ? `url('${item.badge_image_url}')`
                      : `url('${item.image_url}')`,
                    backgroundSize: "100%",
                  }}
                ></div>
              </div>
            ) : (
              <div className="h-20">
                <div
                  className={`h-20 ${
                    item.expanded && "w-full border-b border-b-gray-tint-2"
                  }`}
                >
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
                    className="flex flex-row h-auto"
                    onClick={() => handleExpanded(item, !item.expanded)}
                  >
                    <div className="flex flex-1">
                      <div
                        className={`mx-auto ${
                          isBadge ? "mt-2" : "-mt-1/4"
                        } rounded-full h-16 w-16 items-center justify-center bg-contain bg-center shadow-lg`}
                        style={{
                          backgroundImage: isBadge
                            ? `url('${item.badge_image_url}')`
                            : `url('${item.image_url}')`,
                          backgroundSize: "100%",
                        }}
                      ></div>
                    </div>
                    <div className="flex flex-2 justify-start">
                      <div
                        className={`flex flex-1 font-bold text-left ${
                          isBadge && "mt-5"
                        }
                      text-sm
                      `}
                      >
                        {item.name}
                      </div>
                    </div>
                    <div className="flex flex-1 justify-center items-start">
                      <button
                        className={`fas float-right focus:outline-none ${
                          isBadge ? "mt-9 ml-4" : "mt-4 ml-4"
                        } ${
                          item.expanded ? "fa-chevron-up" : "fa-chevron-down"
                        }`}
                        onClick={() => handleExpanded(item, !item.expanded)}
                      ></button>
                    </div>
                  </div>
                  {isBadge && (
                    <div className="flex justify-center ml-6 -mt-7">
                      <ProgressBar
                        categories={categories}
                        item={item}
                        userActions={item.userActionsArray}
                        actions={item.actionsArray}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {item.expanded && !collapsed && (
              <div className="mb-4 ml-7 mr-4">
                {item.status === false ? (
                  <div className="flex flex-1 flex-col text-center">
                    <div className="flex-1 justify-center text-left">
                      <p className="text-sm">
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
                              <div className="group flex items-center mt-1 mb-3">
                                <div
                                  className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                                  style={{
                                    backgroundImage:
                                      "url('/achievement_images/AchievementStarActive.png')",
                                  }}
                                ></div>
                                <div
                                  className={`flex-initial text-left text-sm
                                  `}
                                >
                                  {subitem.name}
                                </div>
                                {subitem.id > 0 && (
                                  <button
                                    className="d:opacity-0 d:group-hover:opacity-50 d:hover:!opacity-100 opacity-50 flex-1 text-lg text-right"
                                    onClick={() =>
                                      handleButtonPerformOnDrag(subitem, false)
                                    }
                                  >
                                    &times;
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex mt-1 mb-3">
                                <div
                                  className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                                  style={{
                                    backgroundImage:
                                      "url('/achievement_images/AchievementStarInactive.png')",
                                  }}
                                ></div>
                                <div
                                  className={`text-sm flex-inital text-left text-gray-accent
                                  `}
                                >
                                  {subitem.name}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
                {item.actionsArray &&
                  item.actionsArray.map((subitem) => {
                    return (
                      <div key={subitem.id}>
                        <div className="flex mt-1 mb-3">
                          <div
                            className="mr-3 rounded-full h-6 w-6 bg-cover flex-initial"
                            style={{
                              backgroundImage:
                                "url('/achievement_images/AchievementStarInactive.png')",
                            }}
                          ></div>
                          <div
                            className={`text-gray-accent text-sm flex-inital text-left "
                            `}
                          >
                            {subitem.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanActionItem;
