import React, { useEffect, useState } from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";
import CarouselCategoryButton from "./CarouselCategoryButton.jsx";
import { useCategory } from "./contexts/CategoryContext.js";

const CarouselContainer = ({
  user,
  climateActionsUser,
  updateLocalAccepted,
  addAcceptedAction,
  climateActionCategories,
  //category,
  setCategory,
}) => {
  const formatedCategories = JSON.parse(climateActionCategories);
  const [allCategories, setAllCategories] = useState(true);

  //**** Using the context to assign it to a const */
  const category = useCategory();

  return (
    <div className="max-w-5xl mx-auto space-y-3 t:bg-transparent t:rounded-lg t:p-8 mt-4">
      <CarouselHeader />
      <CarouselCategoryButton
        categoryName={"All categories"}
        categoryID={null}
        setCategory={setCategory}
        active={allCategories}
        setAllCategories={setAllCategories}
      />
      {formatedCategories.map((cat) => (
        <CarouselCategoryButton
          key={cat.id}
          categoryName={cat.name}
          categoryID={cat.id}
          setCategory={setCategory}
          active={category === cat.id ? true : false}
          setAllCategories={setAllCategories}
        />
      ))}

      <CarouselList
        user={user}
        climateActionsUser={climateActionsUser}
        updateLocalAccepted={updateLocalAccepted}
        addAcceptedAction={addAcceptedAction}
        category={category}
      ></CarouselList>
    </div>
  );
};

export default CarouselContainer;
