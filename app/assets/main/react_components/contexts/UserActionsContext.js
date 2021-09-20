import React, { useState, useContext } from "react";
import { uniqWith } from "lodash";
import { useClimateActionsText } from "../contexts/TextContext.js";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
export const UserActionsContext = React.createContext();
export const UserActionsUpdateContext = React.createContext();
export const UserActionsColumnsContext = React.createContext();
export const UserActionsColumnsUpdateContext = React.createContext();
export const UserActionsColumnsWithFormatUpdateContext = React.createContext();
export const UserActionsColumnsWithFullFormatUpdeateContext =
  React.createContext();
//Should CategoryBadges-contexts be renamed or moved into their own context?
export const CategoryBadgesContext = React.createContext();
export const CategoryBadgesUpdateContext = React.createContext();
export const CategoryBadgesUpdateOnDragContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useUserActions = () => {
  return useContext(UserActionsContext);
};

export const useUserActionsUpdate = () => {
  return useContext(UserActionsUpdateContext);
};

export const useUserActionsColumns = () => {
  return useContext(UserActionsColumnsContext);
};
export const useUserActionsColumnsUpdate = () => {
  return useContext(UserActionsColumnsUpdateContext);
};
export const useUserActionsColumnsWithFormatUpdate = () => {
  return useContext(UserActionsColumnsWithFormatUpdateContext);
};

export const useUserActionsColumnsWithFullFormatUpdate = () => {
  return useContext(UserActionsColumnsWithFullFormatUpdeateContext);
};

//CategoryBadges related
export const useCategoryBadges = () => {
  return useContext(CategoryBadgesContext);
};

export const useCategoryBadgesUpdate = () => {
  return useContext(CategoryBadgesUpdateContext);
};

export const useCategoryBadgesUpdateOnDrag = () => {
  return useContext(CategoryBadgesUpdateOnDragContext);
};

//***  To wrap components that need acces to the context in ***/
export const UserActionsProvider = ({
  children,
  allUserActions,
  actionsWithoutUserActions,
  actionsWithUserActions,
  climateActionCategories,
  userSubscriptionType,
}) => {
  const [userActions, setUserActions] = useState(allUserActions);
  const climateActionsText = useClimateActionsText();

  const updateUserActions = (actions) => {
    setUserActions(actions);
  };

  const formatedUserActions = (inVal) => {
    return inVal.map((userActions) => ({
      ...userActions,
      id: userActions.id.toString(),
    }));
  };

  const acceptedUserActions = (inVal) => {
    return formatedUserActions(inVal)
      .filter((action) => action.status !== true)
      .map((action) => ({ ...action }));
  };
  //doneUserActions filtering out the rest of userActions is not needed anymore

  const columnUserActions = (acceptedList, doneList) => {
    return {
      [1]: {
        id: "Accepted",
        name: climateActionsText.my_actions,
        items: acceptedList,
      },
      [2]: {
        id: "Performed",
        name: climateActionsText.achievements,
        items: doneList,
      },
    };
  };

  const updateColumns = (col) => {
    setColumns(col);
  };
  const updateColumnsWithFormat = (updatedList, performedList) => {
    setColumns(columnUserActions(updatedList, performedList));
  };
  const updateColumnsWithFullFormat = (col, categoryBadges) => {
    setColumns(columnUserActions(acceptedUserActions(col), categoryBadges));
  };

  // Code connected to badges
  const updateCategoryBadges = (badge) => {
    setCategoryBadges(badge);
  };

  const memberShipBadge = {
    id: "-1",
    name: "Climate Friend",
    badge_image_url: "/achievement_images/AchievementClimateFriend.png",
    userActionsArray:
      JSON.parse(userSubscriptionType) == true
        ? [
            { id: "-2", name: "GoClimate free membership", status: true },
            { id: "-3", name: "GoClimate paid membership", status: true },
          ]
        : [
            { id: "-2", name: "GoClimate free membership", status: true },
            { id: "-3", name: "GoClimate paid membership", status: false },
          ],
    actionsArray: [],
  };

  /** Finds the correct category based on id */
  const findCategory = (performedColumn, item) => {
    return performedColumn.find(
      (performedItem) => item.climate_action_category_id == performedItem.id
    );
  };

  //Can the two functions below be combined with optional status condition?
  /** 1. Feteches all actions for a specific category id with status */
  const filterCategoryRelatedUserActions = (filter, condition, status) => {
    return filter.filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition &&
        filterUserAction.status === status
    );
  };

  /** 2. Fetches all actions that does not contain status for a specific category id  */
  const filterCategoryRelatedActions = (filter, condition) => {
    return filter.filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition
    );
  };

  /** If the user have performed actions when logged in, then these bagdes are created here */
  const appendUserActionsArrayToCategory = JSON.parse(climateActionCategories)
    .map((category) => {
      //The userActions with status true decides weather a categoryBadge should be created
      const userPerformedActions = filterCategoryRelatedUserActions(
        userActions,
        category.id,
        true
      );

      if (userPerformedActions.length !== 0) {
        return {
          ...category,
          userActionsArray: userPerformedActions,
        };
      }
    })
    /** Filters the null values */
    .filter((removed) => removed);

  /** This function creates badges from start */
  const getCompleteCategoryArrays =
    //Add actions
    [
      ...appendUserActionsArrayToCategory.map((category) => {
        const allActionsWithoutUserActions = filterCategoryRelatedActions(
          JSON.parse(actionsWithoutUserActions),
          category.id
        );

        //Add useractions with status false
        const allUserActions = filterCategoryRelatedUserActions(
          userActions,
          category.id,
          false
        );

        //map trough userActionsArray and save latest update timestamp and set to the whole category
        return {
          ...category,
          userActionsArray: [...category.userActionsArray, ...allUserActions],
          actionsArray: [...allActionsWithoutUserActions],
          id: category.id.toString(),
        };
      }),
      memberShipBadge,
    ];

  //Check for further refactoring below:

  /** Updates the category badges when the user drags or click on perform */
  const updateCategoryBadgesOnDrag = (movedItem, performedColumn) => {
    /** filter duplicates based on name */
    const filterDuplicatesNames = (arrVal, othVal) => {
      return arrVal.name === othVal.name;
    };
    const category = findCategory(performedColumn, movedItem);
    /** If category bagde is already created in the perform column */
    if (category !== undefined) {
      /** This means that the categorybagde is already created for the action*/
      movedItem.status = true;
      /** Removes the item from the UserArray, so no duplicates, since we will add the correct version of the item later */
      const updatedUserItemsArray = category.userActionsArray.filter(
        (action) => {
          return action.name != movedItem.name;
        }
      );
      /** Filter action if it is in actionsArray */
      const updatedActionItemsArray = category.actionsArray.filter((action) => {
        return action.name != movedItem.name;
      });

      /** Set the new resultArray with the new item */
      const resultArray = performedColumn.map((performedCategory) => {
        return performedCategory.id === category.id
          ? {
              ...performedCategory,
              userActionsArray: [...updatedUserItemsArray, movedItem],
              actionsArray: updatedActionItemsArray,
            }
          : performedCategory;
      });
      return resultArray;
    } else {
      /** Category badge does not exist so we need to create a new one */
      const newCategory = JSON.parse(climateActionCategories).find(
        (cat) => cat.id === movedItem.climate_action_category_id
      );
      /** Fetch all actions */
      const allClimateActions = [
        ...filterCategoryRelatedActions(
          JSON.parse(actionsWithoutUserActions),
          newCategory.id
        ),
        ...filterCategoryRelatedActions(
          JSON.parse(actionsWithUserActions),
          newCategory.id
        ),
      ];
      /** Fetch all actions that the user have accepted,
       * fetch with status true as well since when the user clicks on performed button its
       * status is true but the badge might not be created  */
      const allUserActions = [
        ...filterCategoryRelatedUserActions(
          formatedUserActions(userActions),
          newCategory.id,
          false
        ),
        ...filterCategoryRelatedUserActions(
          formatedUserActions(userActions),
          newCategory.id,
          true
        ),
      ];

      /** Set the result */
      const result = {
        ...newCategory,
        actionsArray: [...allClimateActions],
        userActionsArray: [...allUserActions],
        id: newCategory.id.toString(),
      };

      /** Set the correct status on the performed action */
      const updatedUserActionsArray = result.userActionsArray.map((action) => {
        return action.id == movedItem.id ? { ...action, status: true } : action;
      });

      /** Removes the action from the actionsArray if the action is performed and exists in updatedActionsArray */
      const updatedActionsArray = result.actionsArray.filter(
        (action) => action.id != movedItem.climate_action_id
      );

      /** Combines the arrays to be able to filter out duplicates in the arrays */
      const combinedArray = [
        ...updatedUserActionsArray,
        ...updatedActionsArray,
      ];

      /** Uses uniqwith to be able to search for unique values */
      const newCombinedArray = uniqWith(combinedArray, filterDuplicatesNames);

      /** Updates the result that consists of no duplicates */
      const updatedResult = {
        ...newCategory,
        userActionsArray: newCombinedArray.filter(
          (userAction) => userAction.user_id
        ),
        actionsArray: newCombinedArray.filter((action) => !action.user_id),
        id: newCategory.id.toString(),
      };

      /** Combines the final result */
      const resultArray = [...performedColumn, updatedResult];

      return resultArray;
    }
  };

  const [categoryBadges, setCategoryBadges] = useState(
    getCompleteCategoryArrays
  );

  const [columns, setColumns] = useState(
    columnUserActions(
      acceptedUserActions(userActions),
      getCompleteCategoryArrays
    )
  );

  return (
    <UserActionsContext.Provider value={userActions}>
      <UserActionsUpdateContext.Provider value={updateUserActions}>
        <UserActionsColumnsContext.Provider value={columns}>
          <UserActionsColumnsUpdateContext.Provider value={updateColumns}>
            <UserActionsColumnsWithFormatUpdateContext.Provider
              value={updateColumnsWithFormat}
            >
              <UserActionsColumnsWithFullFormatUpdeateContext.Provider
                value={updateColumnsWithFullFormat}
              >
                <CategoryBadgesUpdateOnDragContext.Provider
                  value={updateCategoryBadgesOnDrag}
                >
                  <CategoryBadgesUpdateContext.Provider
                    value={updateCategoryBadges}
                  >
                    <CategoryBadgesContext.Provider value={categoryBadges}>
                      {children}
                    </CategoryBadgesContext.Provider>
                  </CategoryBadgesUpdateContext.Provider>
                </CategoryBadgesUpdateOnDragContext.Provider>
              </UserActionsColumnsWithFullFormatUpdeateContext.Provider>
            </UserActionsColumnsWithFormatUpdateContext.Provider>
          </UserActionsColumnsUpdateContext.Provider>
        </UserActionsColumnsContext.Provider>
      </UserActionsUpdateContext.Provider>
    </UserActionsContext.Provider>
  );
};
