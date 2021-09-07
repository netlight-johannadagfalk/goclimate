import React from "react";

const FootprintFooter = () => {
  return (
    <div className="text-center space-y-2 space-x-2 mt-8 max-w-5xl">
      <a href="/calculator?country=SE" className="button">
        <i className="fas fa-plus" aria-hidden="true"></i>
        {" New calculation "}
      </a>
      <div className="inline-block">
        <a className="link whitespace-nowrap m-2" href="/users/subscription">
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
