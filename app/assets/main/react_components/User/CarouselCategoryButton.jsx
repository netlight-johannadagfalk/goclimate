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
