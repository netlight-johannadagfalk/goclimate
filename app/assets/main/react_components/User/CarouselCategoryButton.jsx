import React from "react";
import {
  useClimateActionsOriginal,
  useClimateActionsUpdate,
} from "./contexts/ClimateActionsContext";
import { useCategoryUpdate } from "./contexts/CategoryContext";
import { useUserActions } from "./contexts/UserActionsContext";

const CarouselCategoryButton = ({
  categoryName,
  categoryID,
  active,
  setAllCategories,
}) => {
  const setCategory = useCategoryUpdate();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();
  const userActions = useUserActions();

  const handleCategory = (categoryID) => {
    categoryID != null ? categoryClick(categoryID) : allCategoriesClick();
  };

  const allCategoriesClick = () => {
    setAllCategories(true);
    updateCategory();
  };
  const categoryClick = (categoryID) => {
    updateCategory(categoryID);
    setAllCategories(false);
  };

  const updateCategory = (cat) => {
    setCategory(cat);
    const filteredActions = cat
      ? totClimateActions.filter(
          (temp) => temp.climate_action_category_id === cat
        )
      : totClimateActions;

    const filteredActionsWithStatus = filteredActions.map((action) => {
      return userActions.some(
        (userAction) => userAction.climate_action_id === action.id
      )
        ? { ...action, accepted: true }
        : { ...action, accepted: false };
    });
    setClimateActions(filteredActionsWithStatus);
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
          rounded-full py-1 px-4 border-primary button inline-block m-1 hover:text-white focus:outline-none hover:bg-opacity-80`}
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
