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
  setActionsToplist,
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
    if (categoryID === "toplist") {
      toplistClick(categoryID);
    } else if (categoryID === "allCategories") {
      allCategoriesClick(categoryID);
    } else {
      categoryClick(categoryID);
    }
  };

  const allCategoriesClick = (categoryID) => {
    setAllCategories(true);
    setActionsToplist(false);
    updateCategory(categoryID);
  };

  const toplistClick = (categoryID) => {
    setAllCategories(false);
    setActionsToplist(true);
    updateCategory(categoryID);
  };

  const categoryClick = (categoryID) => {
    updateCategory(categoryID);
    setAllCategories(false);
    setActionsToplist(false);
  };

  const updateCategory = (cat) => {
    let filteredActions = [];
    if (cat === "toplist") {
      setCategory();
      filteredActions = actionsToplist;
    } else if (cat === "allCategories") {
      setCategory();
      filteredActions = totClimateActions;
    } else {
      setCategory(cat);
      filteredActions = totClimateActions.filter(
        (temp) => temp.climate_action_category_id === cat
      );
    }

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
