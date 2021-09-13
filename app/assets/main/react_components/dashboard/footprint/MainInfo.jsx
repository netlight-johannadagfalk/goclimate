import React from "react";
import FootprintContainer from "./FootprintContainer.jsx";
import FootprintFooter from "./FootprintFooter.jsx";
import MonthlyAction from "../../common/MonthlyAction.jsx";

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
      <div className="flex flex-row">
        <FootprintContainer
          footprint={footprint}
          commonText={commonText}
          countryAverage={countryAverage}
          modelText={modelText}
          lang={lang}
          registrationsText={registrationsText}
        ></FootprintContainer>

        <div className="">
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
