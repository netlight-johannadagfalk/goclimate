import React from "react";
import { useDashboardNewText } from "../../../contexts/TextContext.js";

const CarouselHeader = () => {
  const dashboardNewText = useDashboardNewText();

  return (
    <div>
      <h3 className="heading-xl mb-3">{dashboardNewText.take_action}</h3>

      <h3 className="heading-lg mb-3">
        {dashboardNewText.low_effort_high_impact_actions}
      </h3>
      <div className="flex flex-col t:flex-row t:space-x-8 space-y-6 t:space-y-0"></div>
    </div>
  );
};

export default CarouselHeader;
