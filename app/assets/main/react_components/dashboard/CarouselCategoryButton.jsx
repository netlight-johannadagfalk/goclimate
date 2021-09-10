import React from "react";
import {
  useClimateActionsOriginal,
  useClimateActionsUpdate,
} from "../contexts/ClimateActionsContext";
import { useCategoryUpdate } from "../contexts/CategoryContext";
import { useUserActions } from "../contexts/UserActionsContext";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const CarouselCategoryButton = ({
  categoryName,
  categoryID,
  active,
  setAllCategories,
  categories,
}) => {
  const setCategory = useCategoryUpdate();
  const setClimateActions = useClimateActionsUpdate();
  const totClimateActions = useClimateActionsOriginal();
  const userActions = useUserActions();

  let options = [{ value: null, label: "All categories" }];

  const createOptions = () =>
    categories.map((cat) => {
      options.push({ value: cat.id, label: cat.name });
    });
  categories && createOptions();

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
      {categories ? (
        <div className="mx-5 ">
          <Dropdown
            placeholder="All categories"
            controlClassName="bg-transparent color-primary border-primary rounded p-2 flex flex-row w-36 justify-between"
            arrowClosed={<i className="fas fa-chevron-down" />}
            arrowOpen={<i className="fas fa-chevron-up" />}
            options={options}
            defaultOption={options[0]}
            onChange={(val) => handleCategory(val.value)}
          ></Dropdown>
        </div>
      ) : (
        <>
          {active ? (
            <button
              className={`${
                "category_" +
                categoryName.toLowerCase().replace(/ /g, "_") +
                "_active"
              } category_unknown_active rounded-full py-1 px-4 button inline-block focus:outline-none text-white m-1`}
            >
              {" "}
              {categoryName}{" "}
            </button>
          ) : (
            <button
              className={` ${
                "category_" + categoryName.toLowerCase().replace(/ /g, "_")
              }
          category_unknown rounded-full py-1 px-4 button inline-block m-1 hover:text-white focus:outline-none hover:bg-opacity-80`}
              onClick={() => handleCategory(categoryID)}
            >
              {" "}
              {categoryName}{" "}
            </button>
          )}
        </>
      )}
    </>
  );
};

export default CarouselCategoryButton;
