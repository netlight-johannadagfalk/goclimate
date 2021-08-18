import React from "react";

const CarouselCategoryButton = ({
  categoryName,
  categoryID,
  setCategory,
  active,
  setAllCategories,
}) => {
  const handleCategory = (categoryID) => {
    categoryID != null ? y(categoryID) : x();
  };

  const x = () => {
    setAllCategories(true);
    setCategory();
  };
  const y = (categoryID) => {
    setCategory(categoryID);
    setAllCategories(false);
  };

  return (
    <>
      {active ? (
        <button className="button inline-block focus:outline-none m-1 bg-primary text-white">
          {" "}
          {categoryName}{" "}
        </button>
      ) : (
        <button
          className="button inline-block m-1 focus:outline-none"
          onClick={() => handleCategory(categoryID)}
        >
          {" "}
          {categoryName}{" "}
        </button>
      )}
    </>
  );
};

export default CarouselCategoryButton;
