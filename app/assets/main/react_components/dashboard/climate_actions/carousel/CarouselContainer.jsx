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
  const [popular, setPopular] = useState(false);
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
      <div className="max-w-6xl mx-auto space-y-3 t:bg-transparent t:rounded-lg">
        {isTabletOrMobile ? (
          <CarouselCategoryButton
            categories={categories}
            setPopular={setPopular}
            setAllCategories={setAllCategories}
            localUserActions={localUserActions}
            actionsToplist={actionsToplist}
          ></CarouselCategoryButton>
        ) : (
          <>
            <CarouselCategoryButton
              categoryName={"All categories"}
              categoryID={"allCategories"}
              active={allCategories}
              setPopular={setPopular}
              setAllCategories={setAllCategories}
              localUserActions={localUserActions}
            />
            {actionsToplist.length > 0 && (
              <CarouselCategoryButton
                categoryName={"Popular"}
                categoryID={"popular"}
                active={popular}
                setPopular={setPopular}
                setAllCategories={setAllCategories}
                localUserActions={localUserActions}
                actionsToplist={actionsToplist}
              />
            )}
            {categories.map(
              (cat) =>
                showFilterButton(cat) && (
                  <CarouselCategoryButton
                    key={cat.id}
                    categoryName={cat.name}
                    categoryID={cat.id}
                    active={category === cat.id ? true : false}
                    setPopular={setPopular}
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
