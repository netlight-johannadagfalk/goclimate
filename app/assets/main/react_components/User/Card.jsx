import React from "react";

function Card({ monthlyAction, categoryColor }) {
  return (
    <div className="max-w-md d:w-80 pt-20 m-lg:pt-24 flex justify-evenly">
      <div
        className={`${categoryColor} border border-gray-tint-2 rounded-lg shadow-lg p-4 h-full space-y-3 pt-0`}
      >
        <div className="inline-block w-full">
          <img
            className="mx-auto h-40 w-40 -mt-20 m-lg:h-40 m-lg:w-40 m-lg:-mt-20 rounded-full object-cover"
            src="https://www.goclimate.com/blog/wp-content/uploads/2020/07/DJI_0974-768x512.jpg"
          />
        </div>
        <div className="flex flex-col text-center">
          <div className="flex-1">
            <h4 className="text-base font-bold justify-center">
              {monthlyAction.name.length > 25
                ? monthlyAction.name.slice(0, 25) + "..."
                : monthlyAction.name}
            </h4>
          </div>
          <div className="flex-1">
            <p>
              {monthlyAction.description.length > 40
                ? monthlyAction.description.slice(0, 40) + "..."
                : monthlyAction.description}
            </p>
          </div>
          <div className="flex-1 flex flex-row mb-1 justify-center">
            {[1, 2, 3, 4, 5].map((index) => {
              return (
                <span
                  className={`flex flex-row ${
                    index <= monthlyAction.points
                      ? "bg-black"
                      : "bg-gray-pastel"
                  } m-2 rounded-full h-4 w-4 flex items-center justify-center`}
                  key={monthlyAction.name + index}
                ></span>
              );
            })}
          </div>
          <div className="flex-1">
            {monthlyAction.accepted ? (
              <button
                className="button inline-block "
                disabled={true}
                style={{ color: "rgba(28, 70, 55)" }}
              >
                Accepted
              </button>
            ) : (
              <button
                className="button button-cta inline-block "
                // onClick={() => handleClickAccepted(monthlyAction)}
              >
                Accept challenge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
