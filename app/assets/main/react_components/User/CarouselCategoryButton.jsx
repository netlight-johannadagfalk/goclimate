import React from "react";
// import "././components/category_colors.css";

const CarouselCategoryButton = ({
  categoryName,
  categoryID,
  setCategory,
  active,
  setAllCategories,
}) => {
  const handleCategory = (categoryID) => {
    categoryID != null ? categoryClick(categoryID) : allCategoriesClick();
  };

  const allCategoriesClick = () => {
    setAllCategories(true);
    setCategory();
  };
  const categoryClick = (categoryID) => {
    setCategory(categoryID);
    setAllCategories(false);
  };

  return (
    <>
      {active ? (
        <button
          className={`${
            "category_" +
            categoryName.toLowerCase().replace(/ /g, "_") +
            "_active"
          } rounded-full py-1 px-4 button inline-block focus:outline-none text-white m-1`}
        >
          {" "}
          {categoryName}{" "}
        </button>
      ) : (
        <button
          className={` ${
            "category_" + categoryName.toLowerCase().replace(/ /g, "_")
          }
          rounded-full py-1 px-4 border-primary button inline-block m-1 focus:outline-none `}
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
