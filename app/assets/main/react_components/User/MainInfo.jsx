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
  countryAverage,
  modelText,
  lang,
  registrationsText,
}) => {
  // console.log(commonText);
  // const commonStrings = JSON.parse(commonText);
  // console.log(commonStrings);
  return (
    <section className="section-padding pb-28">
      {/* Fixa så ej hårdkodat! */}
      <h2 className="heading-xl">Hello, climate friend!</h2>

      <div className="relative">
        <FootprintContainer
          footprint={footprint}
          commonText={commonText}
          countryAverage={countryAverage}
          modelText={modelText}
          lang={lang}
          registrationsText={registrationsText}
        ></FootprintContainer>

        <MonthlyAction
          action={action}
          user={user}
          updateLocalAccepted={updateLocalAccepted}
          categories={categories}
        ></MonthlyAction>
      </div>

      <FootprintFooter footprint={footprint}></FootprintFooter>
    </section>
  );
};

export default MainInfo;
