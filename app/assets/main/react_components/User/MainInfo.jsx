import React from "react";
import FootprintContainer from "./FootprintContainer.jsx";
import FootprintFooter from "./FootprintFooter.jsx";
import MonthlyAction from "./MonthlyAction.jsx";

const MainInfo = ({
  footprint,
  commonText,
  action,
  user,
  updateLocalAccepted,
  categories,
}) => {
  console.log(commonText);
  const commonStrings = JSON.parse(commonText);
  console.log(commonStrings);
  return (
    <section className="section-padding pb-28">
      {/* Fixa så ej hårdkodat! */}
      <h2 className="heading-xl">Hello, climate friend!</h2>

      <div className="relative">
        <FootprintContainer
          footprint={footprint}
          commonText={commonText}
        ></FootprintContainer>

        <MonthlyAction
          action={action}
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          categories={categories}
        ></MonthlyAction>
      </div>

      <FootprintFooter></FootprintFooter>
    </section>
  );
};

export default MainInfo;
