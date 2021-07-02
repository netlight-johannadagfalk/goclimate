import React from "react";
import CountryForm from "./CountryForm.jsx";

/**
 * Main component for React components on start page 
 */
const CountrySelectContainer = (props) => {
    const TITLE = "Together we can save the climate!";
    const SUBTITLE =
    "Calculate your carbon footprint to start your personalized subscription, all in less than 2 minutes";

    return (
      <>
          <h1 className="heading-xl mb-6 t:mb-12">{TITLE}</h1>
          <p className="my-4 max-w-lg mx-auto">{SUBTITLE}</p>
          <CountryForm />
      </>
    );
};

export default CountrySelectContainer;
