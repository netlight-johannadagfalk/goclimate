import React, { useState } from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";
import CarouselCategoryButton from "./CarouselCategoryButton.jsx";
import { useCategory } from "./contexts/CategoryContext.js";

const CarouselContainer = ({
  user,
  updateLocalAccepted,
  climateActionCategories,
}) => {
  const formatedCategories = JSON.parse(climateActionCategories);
  const [allCategories, setAllCategories] = useState(true);
  const category = useCategory();

  return (
    <div className="max-w-5xl mx-auto space-y-3 t:bg-transparent t:rounded-lg t:p-8 mt-4">
      <CarouselHeader />
      <CarouselCategoryButton
        categoryName={"All categories"}
        categoryID={null}
        active={allCategories}
        setAllCategories={setAllCategories}
      />
      {formatedCategories.map((cat) => (
        <CarouselCategoryButton
          key={cat.id}
          categoryName={cat.name}
          categoryID={cat.id}
          active={category === cat.id ? true : false}
          setAllCategories={setAllCategories}
        />
      ))}

      <CarouselList
        user={user}
        updateLocalAccepted={updateLocalAccepted}
        categories={formatedCategories}
      ></CarouselList>
    </div>
  );
};

export default CarouselContainer;
