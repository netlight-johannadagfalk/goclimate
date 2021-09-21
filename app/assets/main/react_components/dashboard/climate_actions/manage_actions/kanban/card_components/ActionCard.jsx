import React from "react";

const ActionCard = ({
  item,
  handleDelete,
  handleButtonPerformOnDrag,
  collapsed,
  handleExpanded,
  categoryColor,
}) => {
  return (
    <div>
      {collapsed ? (
        <div className="flex flex-1 items-center justify-center shadow-md">
          <div
            className={`rounded-full h-16 w-16 bg-cover shadow-lg my-1`}
            style={{
              backgroundImage: `url('${item.image_url}')`,
              backgroundSize: "100%",
            }}
          ></div>
        </div>
      ) : (
        <div
          className={`h-20 ${
            item.expanded && "w-full border-b border-b-gray-tint-2"
          }`}
        >
          <div
            className={`${
              "category_" +
              categoryColor.toLowerCase().replace(/ /g, "_") +
              "_active"
            } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60`}
          ></div>
          <div
            className="flex flex-row h-auto"
            onClick={() => handleExpanded(item, !item.expanded)}
          >
            <div className="flex flex-1">
              <div
                className="mx-auto -mt-1/4 rounded-full h-16 w-16 items-center justify-center bg-contain bg-center shadow-lg"
                style={{
                  backgroundImage: `url('${item.image_url}')`,
                  backgroundSize: "100%",
                }}
              ></div>
            </div>
            <div className="flex flex-2 justify-start">
              <div className="flex flex-1 font-bold text-left text-sm">
                {item.name}
              </div>
            </div>
            <div className="flex flex-1 justify-center items-start">
              <button
                className={`fas float-right focus:outline-none mt-4 ml-4 ${
                  item.expanded ? "fa-chevron-up" : "fa-chevron-down"
                }`}
                onClick={() => handleExpanded(item, !item.expanded)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {item.expanded && !collapsed && (
        <div className="mb-4 ml-7 mr-4">
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
                onClick={() => handleDelete(item.id, item.climate_action_id)}
              ></button>
              <button
                className="ml-4 fas fa-check-circle focus:outline-none"
                onClick={() => handleButtonPerformOnDrag(item, true)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionCard;
