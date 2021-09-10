import React, { useState } from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";
import CarouselCategoryButton from "./CarouselCategoryButton.jsx";
import { useCategory } from "./contexts/CategoryContext.js";

const CarouselContainer = ({ user, updateLocalAccepted, categories }) => {
  const [allCategories, setAllCategories] = useState(true);
  const category = useCategory();

  return (
    <section className="section-padding pb-28">
      <CarouselHeader />
      <div className="max-w-7xl mx-auto space-y-3 t:bg-transparent t:rounded-lg t:p-8 mt-4 overflow-visible">
        <CarouselCategoryButton
          categoryName={"All categories"}
          categoryID={null}
          active={allCategories}
          setAllCategories={setAllCategories}
        />
        {categories.map((cat) => (
          <CarouselCategoryButton
            key={cat.id}
            categoryName={cat.name}
            categoryID={cat.id}
            active={category === cat.id ? true : false}
            setAllCategories={setAllCategories}
          />
        ))}
        <div className="overflow-visible">
          <CarouselList
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            categories={categories}
          ></CarouselList>
        </div>
      </div>
    </section>
  );
};

export default CarouselContainer;
