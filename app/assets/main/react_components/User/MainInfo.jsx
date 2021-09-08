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
  totalNoFootprints,
}) => {
  return (
    <section className="section-padding pb-28">
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

        <div className="hidden t:block">
          <MonthlyAction
            action={action}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            categories={categories}
          ></MonthlyAction>
        </div>
      </div>

      <FootprintFooter
        footprint={footprint}
        totalNoFootprints={totalNoFootprints}
      ></FootprintFooter>
    </section>
  );
};

export default MainInfo;
