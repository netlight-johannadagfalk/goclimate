import { uniqWith } from "lodash";

const filterCategoryRelatedUserActions = (filter, condition, status) => {
  return filter.filter(
    (filterUserAction) =>
      filterUserAction.climate_action_category_id === condition &&
      filterUserAction.status === status
  );
};

const filterCategoryRelatedActions = (filter, condition) => {
  return filter.filter(
    (filterUserAction) =>
      filterUserAction.climate_action_category_id === condition
  );
};
const membershipAchievement = (userSubscriptionType) => {
  const res = {
    id: "-1",
    name: "Climate Friend",
    badge_image_url: "/achievement_images/AchievementClimateFriend.png",
    userActionsArray: [
      { id: "-2", name: "GoClimate free membership", status: true },
      {
        id: "-3",
        name: "GoClimate paid membership",
        status: userSubscriptionType == true ? true : false,
      },
    ],
    actionsArray: [],
  };
  return res;
};

const findCategory = (performedColumn, item) => {
  return performedColumn.find(
    (performedItem) => item.climate_action_category_id == performedItem.id
  );
};

const appendUserActionsArrayToCategory = (
  climateActionCategories,
  userActions
) => {
  return (
    climateActionCategories
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
      .filter((removed) => removed)
  );
};

export const getCompleteCategoryArrays = (
  actionsWithoutUserActions,
  allUserActions,
  climateActionCategories,
  userSubscriptionType
) => {
  const userActions = allUserActions;
  const res = [
    ...appendUserActionsArrayToCategory(
      climateActionCategories,
      userActions
    ).map((category) => {
      const allActionsWithoutUserActions = filterCategoryRelatedActions(
        actionsWithoutUserActions,
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
    membershipAchievement(userSubscriptionType),
  ];
  return res;
};

export const handleAchievementsOnMove = (
  movedItem,
  performedColumn,
  climateActionCategories,
  userActions,
  actionsWithoutUserActions,
  actionsWithUserActions,
  formatedUserActions
) => {
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
    const updatedUserItemsArray = category.userActionsArray.filter((action) => {
      return action.name != movedItem.name;
    });
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
    const newCategory = climateActionCategories.find(
      (cat) => cat.id === movedItem.climate_action_category_id
    );
    /** Fetch all actions */
    const allClimateActions = [
      ...filterCategoryRelatedActions(
        actionsWithoutUserActions,
        newCategory.id
      ),
      ...filterCategoryRelatedActions(actionsWithUserActions, newCategory.id),
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
    const combinedActionsArray = [
      ...updatedUserActionsArray,
      ...updatedActionsArray,
    ];

    /** Uses uniqwith to be able to search for unique values */
    const newCombinedActionsArray = uniqWith(
      combinedActionsArray,
      filterDuplicatesNames
    );

    /** Updates the result that consists of no duplicates */
    const updatedAchievements = {
      ...newCategory,
      userActionsArray: newCombinedActionsArray.filter(
        (userAction) => userAction.user_id
      ),
      actionsArray: newCombinedActionsArray.filter((action) => !action.user_id),
      id: newCategory.id.toString(),
    };

    /** Combines the final result */
    const resultArray = [...performedColumn, updatedAchievements];

    return resultArray;
  }
};
