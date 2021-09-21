import React from "react";
import {
  useClimateActionsOriginal,
  useClimateActionsUpdate,
} from "../../../contexts/ClimateActionsContext";
import { useCategoryUpdate } from "../../../contexts/CategoryContext";
import { useUserActions } from "../../../contexts/UserActionsContext";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const CarouselCategoryButton = ({
  categoryName,
  categoryID,
  active,
  setAllCategories,
  categories,
  localUserActions,
  actionsToplist,
  setToplist,
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
    let filteredActions = [];
    if (categoryID === "toplist") {
      categoryClick(true, false);
      setCategory();
      filteredActions = actionsToplist;
    } else if (categoryID === "allCategories") {
      categoryClick(false, true);
      setCategory();
      filteredActions = totClimateActions;
    } else {
      categoryClick(false, false);
      setCategory(categoryID);
      filteredActions = totClimateActions.filter(
        (temp) => temp.climate_action_category_id === categoryID
      );
    }
    updateCategoryWithAcceptedAndTotal(filteredActions);
  };

  const categoryClick = (toplistValue, allCategoriesValue) => {
    setToplist(toplistValue);
    setAllCategories(allCategoriesValue);
  };

  const updateCategoryWithAcceptedAndTotal = (filteredActions) => {
    const filteredActionsWithStatus = filteredActions.map((action) => {
      return userActions.some(
        (userAction) => userAction.climate_action_id === action.id
      )
        ? {
            ...action,
            accepted: true,
          }
        : { ...action, accepted: false };
    });

    const filteredActionsWithStatusAndTotal = filteredActionsWithStatus.map(
      (action) => {
        return localUserActions.some(
          (localUserAction) => localUserAction[0].id === action.id
        )
          ? {
              ...action,
              total: ++action.total,
            }
          : action;
      }
    );
    setClimateActions(filteredActionsWithStatusAndTotal);
  };

  return (
    <>
      {categories ? (
        <div className="mx-5 ">
          <Dropdown
            placeholder="All categories"
            controlClassName={"dropdown-control"}
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
