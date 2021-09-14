import React from "react";
import {
  useFootprint,
  useTotalNoFootprints,
} from "../../contexts/FootprintContext.js";
import {
  useDashboardText,
  useLifestyleFootprintText,
} from "../../contexts/TextContext.js";

const FootprintFooter = () => {
  const footprint = useFootprint();
  const totalNoFootprints = useTotalNoFootprints();
  const dashboardText = useDashboardText();
  const lifestyleFootprintText = useLifestyleFootprintText();

  return (
    <div className="text-center space-y-2 space-x-4 mt-8 max-w-5xl">
      <a
        href={
          footprint.country
            ? "/calculator?country=" + footprint.country.data.alpha2
            : "/"
        }
        className="button"
      >
        <i className="fas fa-plus" aria-hidden="true"></i>
        {/* {" New calculation "} */}
        {" " + lifestyleFootprintText.show.new_calculation}
      </a>
      {totalNoFootprints && (
        <div className="inline-block">
          <a className="link whitespace-nowrap" href="/calculator/results">
            {/* See previous footprints */}
            {dashboardText.footprint.previous_footprints}
          </a>
        </div>
      )}

      <div className="inline-block">
        <a className="link whitespace-nowrap" href="/users/subscription">
          {/* Balance your footprint */}
          {dashboardText.footprint.subscribe}
        </a>
      </div>
      <div className="inline-block">
        <a
          className="link"
          href="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
          target="_blank"
        >
          {/* How do we calculate? */}
          {lifestyleFootprintText.methodology}
        </a>
      </div>
    </div>
  );
};

export default FootprintFooter;
