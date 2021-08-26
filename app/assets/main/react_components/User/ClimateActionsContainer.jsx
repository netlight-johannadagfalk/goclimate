import React, { useState, useEffect } from "react";
import CarouselContainer from "./CarouselContainer.jsx";
import KanbanActionContainer from "./KanbanActionContainer.jsx";
import CarouselActionItem from "./CarouselActionItem.jsx";

const ClimateActionsContainer = ({
  user,
  userActions,
  actionsWithUserActions,
  actionsWithoutUserActions,
  climateActionCategories,
}) => {
  const [totUserActions, setTotUserActions] = useState(JSON.parse(userActions));
  console.log("userAction" + userActions);
  const [deletedAction, setDeletedAction] = useState(null);
  const [currCategory, setCurrCategory] = useState(null);

  const [categoryBadges, setCategoryBadges] = useState([
    ...JSON.parse(climateActionCategories),
  ]);

  useEffect(() => {
    deletedAction != null && updateLocalAccepted(deletedAction);
  }, [deletedAction]);

  const addAcceptedAction = (action, userAction) => {
    console.log("category" + action.climate_action_category_id);
    setDeletedAction(null);
    const temp = {
      id: userAction.id,
      name: action.name,
      description: action.description,
      climate_action_id: action.id,
      status: userAction.status,
      user_id: userAction.user_id,
      climate_action_category_id: action.climate_action_category_id,
    };

    const localVar = [...totUserActions, temp];
    setTotUserActions(localVar);
    setColumns(
      columnUserActions(
        acceptedUserActions(localVar),
        doneUserActions(localVar)
      )
    );
  };

  const setLocalAccepted = (updatedList, performed, deletedAction) => {
    setTotUserActions([...updatedList, ...performed]);
    setColumns(columnUserActions(updatedList, performed));
    setDeletedAction(deletedAction);
  };
  //******************************************************* */

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

  const appendItemsArrayToCategory = (actionsWithUserActions) => {
    console.log("I ENTER FUNCTION");
    const newCategoryBadges = categoryBadges.map((category) => {
      console.log("IN APPEND: " + JSON.stringify(categoryBadges));
      return (
        actionsWithUserActions.some(
          (action) => action.climate_action_category_id === category.id
        ) && { ...category, itemsArray: [...itemsArray, action] }
      );
    });

    setCategoryBadges(newCategoryBadges);

    // /** Feteches the correct category */
    // const theCategory = categoryBadges.find(
    //   (category) => category.id === item.climate_action_category_id
    // );
    // const theCategoryIndex = categoryBadges.findIndex(
    //   (category) => category.id === item.climate_action_category_id
    // );

    // /** Get all actions related to category id */
    // const actionsToCategory = climateActionsUser.filter(
    //   (actions) =>
    //     actions.climate_action_category_id === item.climate_action_category_id
    // );

    // item.status = true;
    // updateStatus(item.id, true);

    // categoryBadges[theCategoryIndex].itemsArray = actionsToCategory;

    // return categoryBadges;
  };

  // const doneUserActions = (inVal) => {
  //   return formatedUserActions(inVal)
  //     .filter((action) => action.status !== false)
  //     .map((action) => ({ ...action }));
  // };

  const columnUserActions = (acceptedList, categoryBadges) => {
    return {
      [1]: {
        id: "Accepted",
        name: "Your accepted actions:",
        items: acceptedList,
      },
      [2]: {
        id: "Performed",
        name: "Your performed actions:",
        items: categoryBadges,
      },
    };
  };

  /**CHANGE THIS SO NO FUNCTION IS BEING CALLED */
  const [columns, setColumns] = useState(updateCategoryBadges());
  //******************************************************* */

  const updateCategoryBadges = () => {
    console.log("CAAAAT: ");
    const temp = appendItemsArrayToCategory(categoryBadges);
    console.log("CATEGORYBAGDESNEW: " + JSON.stringify(categoryBadges));
    return columnUserActions(acceptedUserActions(totUserActions), temp);
  };

  const localActionsWithUserActions = JSON.parse(actionsWithUserActions).map(
    (action) => ({
      ...action,
      accepted: true,
    })
  );

  const localActionsWithoutUserActions = JSON.parse(
    actionsWithoutUserActions
  ).map((action) => ({
    ...action,
    accepted: false,
  }));

  const totClimateActions = [
    ...localActionsWithoutUserActions,
    ...localActionsWithUserActions,
  ];

  const [climateActionsUser, setClimateActionsUser] = useState([
    ...totClimateActions,
  ]);

  const updateLocalAccepted = (actionID) => {
    setClimateActionsUser(
      climateActionsUser.map((action) =>
        action.id === actionID
          ? { ...action, accepted: !action.accepted }
          : action
      )
    );
  };
  const monthlyAction = climateActionsUser.find(
    (action) => action.action_of_the_month === true
  );

  const setCategory = (cat) => {
    setCurrCategory(cat);
    const filteredActions = cat
      ? totClimateActions.filter(
          (temp) => temp.climate_action_category_id === cat
        )
      : totClimateActions;

    const filteredActionsWithStatus = filteredActions.map((x) => {
      return totUserActions.some((y) => y.climate_action_id === x.id)
        ? { ...x, accepted: true }
        : { ...x, accepted: false };
    });
    setClimateActionsUser(filteredActionsWithStatus);
  };

  return (
    <>
      <div className="w-80 mx-auto  space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2 justify-center">
        <h3 className="heading-lg mb-3">Action of the Month </h3>
        {monthlyAction && (
          <CarouselActionItem
            action={monthlyAction}
            key={monthlyAction.id}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            addAcceptedAction={addAcceptedAction}
          ></CarouselActionItem>
        )}
      </div>
      <CarouselContainer
        user={user}
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
        deletedAction={deletedAction}
        climateActionCategories={climateActionCategories}
        category={currCategory}
        setCategory={setCategory}
      />
      <KanbanActionContainer
        setLocalAccepted={setLocalAccepted}
        columns={columns}
        setColumns={setColumns}
        setTotUserActions={setTotUserActions}
        climateActionCategories={climateActionCategories}
        climateActionsUser={climateActionsUser}
        categoryBadges={categoryBadges}
      />
    </>
  );
};
export default ClimateActionsContainer;
