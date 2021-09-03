import React, { useState, useContext } from "react";
import { uniqWith } from "lodash";

//*** A context is used to share data that can be considered as "global" for the react tree ***/
export const UserActionsContext = React.createContext();
export const UserActionsUpdateContext = React.createContext();
export const CategoryBadgesUpdateContext = React.createContext();
export const CategoryBadgesContext = React.createContext();
export const UserActionsColumnsContext = React.createContext();
export const UserActionsColumnsUpdateContext = React.createContext();
export const UserActionsColumnsWithFormatUpdateContext = React.createContext();
export const UserActionsColumnsWithFullFormatUpdeateContext =
  React.createContext();

export const CategoryBadgesUpdateOnDragContext = React.createContext();

//***  Functions that endables access to the context and updating the context in the components ***/
export const useUserActions = () => {
  return useContext(UserActionsContext);
};

export const useUserActionsUpdate = () => {
  return useContext(UserActionsUpdateContext);
};

export const useCategoryBadgesUpdate = () => {
  return useContext(CategoryBadgesUpdateContext);
};

export const useCategoryBadges = () => {
  return useContext(CategoryBadgesContext);
};

export const useCategoryBadgesUpdateOnDrag = () => {
  return useContext(CategoryBadgesUpdateOnDragContext);
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

//***  To wrap components that need acces to the context in ***/
export const UserActionsProvider = ({
  children,
  allUserActions,
  actionsWithoutUserActions,
  actionsWithUserActions,
  climateActionCategories,
}) => {
  const [userActions, setUserActions] = useState(allUserActions);

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
  // const doneUserActions = (inVal) => {
  //   return formatedUserActions(inVal)
  //     .filter((action) => action.status !== false)
  //     .map((action) => ({ ...action }));
  // };

  const columnUserActions = (acceptedList, doneList) => {
    return {
      [1]: {
        id: "Accepted",
        name: "Your accepted actions:",
        items: acceptedList,
      },
      [2]: {
        id: "Performed",
        name: "Your performed actions:",
        items: doneList,
      },
    };
  };

  const updateCategoryBadges = (badge) => {
    setCategoryBadges(badge);
  };

  const updateUserActions = (actions) => {
    setUserActions(actions);
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

  // new imports connected to badges

  /** Feteches all actions for a specific category id with status */
  const filterCategories = (filter, condition, status) => {
    return filter.filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition &&
        filterUserAction.status === status
    );
  };

  /**Fetches all actions that does not contain status for a specific category id  */
  const filterCategoriesWithoutStatus = (filter, condition) => {
    return filter.filter(
      (filterUserAction) =>
        filterUserAction.climate_action_category_id === condition
    );
  };

  /** Finds the correct category based on id */
  const findCategory = (performedColumn, item) => {
    return performedColumn.find(
      (performedItem) => item.climate_action_category_id == performedItem.id
    );
  };

  /** If the user have performed actions when logged in, then these bagdes are created here */
  const appendItemsArrayToCategory = JSON.parse(climateActionCategories)
    .map((category) => {
      const userPerformedActions = filterCategories(
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

  /** This function created badges from start */
  const getCorrectCategoriesWithPerformedActions =
    appendItemsArrayToCategory.map((category) => {
      const allActionsWithoutUserActions = filterCategoriesWithoutStatus(
        JSON.parse(actionsWithoutUserActions),
        category.id
      );
      const allUserActions = filterCategories(userActions, category.id, false);
      return {
        ...category,
        userActionsArray: [...category.userActionsArray, ...allUserActions],
        actionsArray: [...allActionsWithoutUserActions],
        id: category.id.toString(),
      };
    });

  /** Updates the category badges when the user drags or click on perform */
  const updateCategoryBadgesOnDrag = (item, performedColumn) => {
    console.log({ item });
    // const filterDuplicates = (arrVal, othVal) => {
    //   /** Filter duplicates based on item name and names in the array
    //    */
    //   return arrVal.name == item.name && arrVal.name == othVal.name;
    // };
    /** filter duplicates based on name */
    const filterDuplicatesNames = (arrVal, othVal) => {
      /** Filter duplicates only based on name
       */
      return arrVal.name === othVal.name;
    };
    const category = findCategory(performedColumn, item);
    /** If category bagde is already created in the perform column */
    if (category !== undefined) {
      /** This means that the categorybagde is already created for the action*/
      item.status = true;
      /** Removes the item from the UserArray, so no duplicates, since we will add the correct version of the item later */
      const updatedUserItemsArray = category.userActionsArray.filter(
        (action) => {
          return action.name != item.name;
        }
      );
      /** Filter action if it is in actionsArray */
      const updatedActionItemsArray = category.actionsArray.filter((action) => {
        return action.name != item.name;
      });
      /** Check in case of duplicates in both arrays */
      const newActionItemsArray = category.actionsArray.filter((action) => {
        category.userActionsArray.map((useraction) => {
          return action.name !== useraction.name;
        });
      });

      console.log({ newActionItemsArray });

      /** Set the new resultArray with the new item */
      const resultArray = performedColumn.map((performedCategory) => {
        return performedCategory.id === category.id
          ? {
              ...performedCategory,
              userActionsArray: [...updatedUserItemsArray, item],
              actionsArray: updatedActionItemsArray,
            }
          : performedCategory;
      });
      console.log({ resultArray });
      return resultArray;
    } else {
      /** Category badge does not exist so we need to create a new one */
      const newCategory = JSON.parse(climateActionCategories).find(
        (cat) => cat.id === item.climate_action_category_id
      );
      /** Fetch all actions */
      const allClimateActions = [
        ...filterCategoriesWithoutStatus(
          JSON.parse(actionsWithoutUserActions),
          newCategory.id
        ),
        ...filterCategoriesWithoutStatus(
          JSON.parse(actionsWithUserActions),
          newCategory.id
        ),
      ];
      // const secondMatching = filterCategoriesWithoutStatus(
      //   allActionsWithoutUserActions,
      //   newCategory.id
      // );
      /** Fetch all actions that the user have accepted,
       * fetch with status true as well since when the user clicks on performed button its
       * status is true but the badge might not be created  */
      const allUserActions = [
        ...filterCategories(
          formatedUserActions(userActions),
          newCategory.id,
          false
        ),
        ...filterCategories(
          formatedUserActions(userActions),
          newCategory.id,
          true
        ),
      ];

      console.log("ActionsWithOUtUser", actionsWithoutUserActions);
      console.log({ allUserActions });
      console.log({ allClimateActions });

      /** Updates the moved item to status true since it is now performed */
      // thirdMatching.map((action) => {
      //   return action.id == item.id ? { ...action, status: true } : action;
      // });
      // /** Remove moved item from climate actions, so no duplicates */
      // secondMatching.filter((action) => action.id != item.climate_action_id);

      // /**Check for no duplicates */
      // secondMatching.filter((action) => {
      //   thirdMatching.map((useraction) => {
      //     return action.name != useraction.name;
      //   });
      // });
      /** Set the result */
      const result = {
        ...newCategory,
        actionsArray: [...allClimateActions],
        userActionsArray: [...allUserActions],
        id: newCategory.id.toString(),
      };
      console.log({ result });

      /** Set the correct status on the performed action */
      const updatedUserActionsArray = result.userActionsArray.map((action) => {
        return action.id == item.id ? { ...action, status: true } : action;
      });

      /** Removes the action from the actionsArray if the action is performed and exists in updatedActionsArray */
      const updatedActionsArray = result.actionsArray.filter(
        (action) => action.id != item.climate_action_id
      );
      // updatedActionsArray.filter((action) => {
      //   return updatedUserActionsArray.map((useraction) => {
      //     return action.name != useraction.name;
      //   });
      // });

      /** Combines the arrays to be able to filter out duplicates in the arrays */
      const combinedArray = [
        ...updatedUserActionsArray,
        ...updatedActionsArray,
      ];

      /** Uses uniqwith to be able to search for unique values */
      const newCombinedArray = uniqWith(combinedArray, filterDuplicatesNames);

      console.log({ newCombinedArray });

      /** Updates the result that consists of no duplicates */
      const updatedResult = {
        ...newCategory,
        userActionsArray: newCombinedArray.filter(
          (userAction) => userAction.user_id
        ),
        actionsArray: newCombinedArray.filter((action) => !action.user_id),
        id: newCategory.id.toString(),
      };

      // const updatedResult = {
      //   ...newCategory,
      //   userActionsArray: updatedUserActionsArray,
      //   actionsArray: updatedActionsArray,
      //   id: newCategory.id.toString(),
      // };

      console.log({ updatedResult });
      /** Combines the final result */
      const resultArray = [...performedColumn, updatedResult];

      /** This is probably not needed? */
      // const newResultArray = resultArray.map((category) => {
      //   return {
      //     ...category,
      //     actionsArray: uniqWith(category.actionsArray, filterDuplicates),
      //     userActionsArray: uniqWith(
      //       category.userActionsArray,
      //       filterDuplicatesNames
      //     ),
      //   };
      // });
      // console.log({ newResultArray });

      return resultArray;
    }
  };

  const [categoryBadges, setCategoryBadges] = useState(
    getCorrectCategoriesWithPerformedActions
  );
  const [columns, setColumns] = useState(
    columnUserActions(
      acceptedUserActions(userActions),
      //doneUserActions(userActions)
      getCorrectCategoriesWithPerformedActions
    )
  );

  // const [columns, setColumns] = useState(
  //   columnUserActions(
  //     acceptedUserActions(totUserActions),
  //     getCorrectCategoriesWithPerformedActions
  //   )
  // );

  // ---------------------------

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
