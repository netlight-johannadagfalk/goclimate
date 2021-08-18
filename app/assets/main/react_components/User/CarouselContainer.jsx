import React, { useState } from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";
import CarouselCategoryButton from "./CarouselCategoryButton.jsx";

const CarouselContainer = ({
  user,
  actionsWithUserActions,
  actionsWithoutUserActions,
  addAcceptedAction,
  deletedAction,
  climateActionCategories,
}) => {
  const [category, setCategory] = useState(null);
  const formatedCategories = JSON.parse(climateActionCategories);
  const [allCategories, setAllCategories] = useState(true);

  return (
    <div className="max-w-5xl mx-auto space-y-3 t:bg-white t:rounded-lg t:shadow-lg t:p-8 t:border t:border-gray-tint-2">
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
        actionsWithUserActions={actionsWithUserActions}
        actionsWithoutUserActions={actionsWithoutUserActions}
        addAcceptedAction={addAcceptedAction}
        deletedAction={deletedAction}
        category={category}
      ></CarouselList>
    </div>
  );
};

export default CarouselContainer;
