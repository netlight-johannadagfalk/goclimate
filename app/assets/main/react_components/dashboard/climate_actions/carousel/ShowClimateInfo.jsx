import React from "react";
const ShowClimateInfo = ({ action }) => {
  return (
    <div>
      <div className=" flex-1 justify-center align-center self-center">
        <h3 className={`text-base font-bold self-center`}>
          {action.name.length > 40
            ? action.name.slice(0, 40) + "..."
            : action.name}
        </h3>
      </div>

      <div className="flex-4">
        <p className="text-sm">
          {action.description.length > 200
            ? action.description.slice(0, 200) + "..."
            : action.description}
        </p>
      </div>
    </div>
  );
};
export default ShowClimateInfo;
