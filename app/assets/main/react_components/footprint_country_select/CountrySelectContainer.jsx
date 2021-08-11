import React from "react";
import CountryForm from "./CountryForm.jsx";

/**
 * Main component for React components on start page 
 */
const CountrySelectContainer = ({ lang, data, shared }) => {

    return (
      <>
          <h1 className="heading-xl mb-6 t:mb-12">{JSON.parse(data).hero.heading}</h1>
          <p className="my-4 max-w-lg mx-auto">{JSON.parse(data).hero.body_text}</p>
          <CountryForm lang={lang} data={JSON.parse(data)} shared={JSON.parse(shared)} />
      </>
    );
};

export default CountrySelectContainer;
