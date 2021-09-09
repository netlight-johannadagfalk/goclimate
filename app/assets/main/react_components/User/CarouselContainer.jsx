import React, { useState } from "react";
import CarouselHeader from "./CarouselHeader.jsx";
import CarouselList from "./CarouselList.jsx";
import CarouselCategoryButton from "./CarouselCategoryButton.jsx";
import { useCategory } from "./contexts/CategoryContext.js";
import { useMediaQuery } from "react-responsive";
import "react-dropdown/style.css";

const CarouselContainer = ({ user, updateLocalAccepted, categories }) => {
  const [allCategories, setAllCategories] = useState(true);
  const category = useCategory();

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-3 t:bg-transparent t:rounded-lg t:p-8 mt-4">
        <div className=" mx-4">
          <CarouselHeader />
        </div>
        {isTabletOrMobile ? (
          <CarouselCategoryButton
            categories={categories}
            setAllCategories={setAllCategories}
          ></CarouselCategoryButton>
        ) : (
          <>
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
          </>
        )}
        <CarouselList
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          categories={categories}
        ></CarouselList>
      </div>
    </>
  );
};

export default CarouselContainer;
