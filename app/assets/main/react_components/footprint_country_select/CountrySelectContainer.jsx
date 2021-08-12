import React from "react";
import CountryForm from "./CountryForm.jsx";

/**
 * Main component for React components on start page 
 */
const CountrySelectContainer = ({ lang, welcomeText, sharedText }) => {

    return (
      <>
          <h1 className="heading-xl mb-6 t:mb-12">{JSON.parse(welcomeText).hero.heading}</h1>
          <p className="my-4 max-w-lg mx-auto">{JSON.parse(welcomeText).hero.body_text}</p>
          <CountryForm lang={lang} countryText={{...JSON.parse(welcomeText), ...JSON.parse(sharedText)}} />
      </>
    );
};

export default CountrySelectContainer;
