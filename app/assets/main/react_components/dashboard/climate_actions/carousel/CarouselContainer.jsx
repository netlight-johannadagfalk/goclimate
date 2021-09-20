import React, { useState } from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";
import CarouselCategoryButton from "./CarouselCategoryButton.jsx";
import { useCategory } from "../../../contexts/CategoryContext.js";
import { useClimateActionsOriginal } from "../../../contexts/ClimateActionsContext";
import { useMediaQuery } from "react-responsive";
import { d } from "../../../constants";
import "react-dropdown/style.css";

const CarouselContainer = ({
  user,
  updateLocalAccepted,
  categories,
  localUserActions,
  actionsToplist,
}) => {
  const [allCategories, setAllCategories] = useState(true);
  const category = useCategory();
  const totClimateActions = useClimateActionsOriginal();
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${d})` });

  const showFilterButton = (cat) => {
    return totClimateActions.some(
      (temp) => temp.climate_action_category_id === cat.id
    );
  };

  return (
    <section className="section-padding">
      <CarouselHeader />
      <div className="max-w-6xl mx-auto space-y-3 t:bg-transparent t:rounded-lg t:p-0 mt-4">
        {isTabletOrMobile ? (
          <CarouselCategoryButton
            categories={categories}
            setAllCategories={setAllCategories}
            localUserActions={localUserActions}
          ></CarouselCategoryButton>
        ) : (
          <>
            <CarouselCategoryButton
              categoryName={"All categories"}
              categoryID={null}
              active={allCategories}
              setAllCategories={setAllCategories}
              localUserActions={localUserActions}
            />
            {categories.map(
              (cat) =>
                showFilterButton(cat) && (
                  <CarouselCategoryButton
                    key={cat.id}
                    categoryName={cat.name}
                    categoryID={cat.id}
                    active={category === cat.id ? true : false}
                    setAllCategories={setAllCategories}
                    localUserActions={localUserActions}
                  />
                )
            )}
          </>
        )}
        <CarouselList
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          categories={categories}
          actionsToplist={actionsToplist}
        ></CarouselList>
      </div>
    </section>
  );
};

export default CarouselContainer;
