import React from "react";
const CarouselImage = ({ action }) => {
  return (
    <div
      className={`mx-auto bg-gray-tint-2 bg-opacity-10 shadow-md -mt-24 rounded-full h-40 w-40 items-center justify-center bg-cover filter drop-shadow-xl`}
      style={{
        backgroundImage: action.image_url
          ? `url('${action.image_url}')`
          : "url('/action_images/Globe.png')",
        backgroundSize: "100%",
      }}
    ></div>
  );
};
export default CarouselImage;
