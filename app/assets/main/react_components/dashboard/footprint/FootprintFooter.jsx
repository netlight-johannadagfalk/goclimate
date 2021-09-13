import React from "react";

const FootprintFooter = ({ footprint, totalNoFootprints }) => {
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
        {" New calculation "}
      </a>
      {totalNoFootprints && (
        <div className="inline-block">
          <a className="link whitespace-nowrap" href="/calculator/results">
            See previous footprints
          </a>
        </div>
      )}

      <div className="inline-block">
        <a className="link whitespace-nowrap" href="/users/subscription">
          Balance your footprint
        </a>
      </div>
      <div className="inline-block">
        <a
          className="link"
          href="https://www.goclimate.com/blog/methodology-behind-the-carbon-footprint-calculator/"
          target="_blank"
        >
          How do we calculate?
        </a>
      </div>
    </div>
  );
};

export default FootprintFooter;
