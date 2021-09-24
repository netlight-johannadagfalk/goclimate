import React from "react";
const ShowActionPoints = ({ action }) => {
  return (
    <div className="flex-1 flex flex-row justify-center self-center">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <span
            className={`flex flex-row self-center bg-gray-tint-2 m-2 rounded-full h-6 w-6 justify-center bg-cover`}
            key={action.name + index}
            style={
              index <= action.points
                ? {
                    backgroundImage: "url('/action_images/Globe.png')",
                  }
                : {}
            }
          ></span>
        );
      })}
    </div>
  );
};
export default ShowActionPoints;
