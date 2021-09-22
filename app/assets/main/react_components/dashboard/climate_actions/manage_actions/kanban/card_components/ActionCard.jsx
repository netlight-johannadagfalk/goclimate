import React from "react";

const ActionCard = ({
  item,
  handleDelete,
  handleButtonPerformOnDrag,
  collapsed,
  categoryColor,
}) => {
  return (
    <div>
      <div
        className={`${
          "category_" +
          categoryColor.toLowerCase().replace(/ /g, "_") +
          "_active"
        } h-7 w-full rounded-t border-t-gray-tint-2 bg-opacity-60 top-0 absolute`}
      ></div>

      {item.expanded && !collapsed && (
        <div className="mt-4 mx-6">
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
