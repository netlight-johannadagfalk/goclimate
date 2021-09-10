import React from "react";
import FootprintContainer from "./FootprintContainer.jsx";
import FootprintFooter from "./FootprintFooter.jsx";
import MonthlyAction from "./MonthlyAction.jsx";

const MainInfo = ({ action, user, updateLocalAccepted, categories }) => {
  return (
    <section className="section-padding pb-28">
      <div className="flex flex-row">
        <FootprintContainer />

        <div className="hidden d-lg:block">
          <MonthlyAction
            action={action}
            user={user}
            updateLocalAccepted={updateLocalAccepted}
            categories={categories}
          ></MonthlyAction>
        </div>
      </div>
      <FootprintFooter />
    </section>
  );
};

export default MainInfo;
