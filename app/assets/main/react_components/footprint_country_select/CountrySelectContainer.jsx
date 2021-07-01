import React, { useState, useRef, useEffect } from 'react';
import ChooseCountryButton from './ChooseCountryButton.jsx';
import CountryDropdown from './CountryDropdown.jsx';

const CountrySelectContainer = (props) => {

  const TITLE = "Together we can save the climate!";
  const SUBTITLE = "Calculate your carbon footprint to start your personalized subscription, all in less than 2 minutes";

  const country = useRef();

  const confirmCountryChoice = () => { 
    console.log("Chosen country", country)
    // TELL CONTROLLER TO ROUTE TO CALCULATOR WITH SPECIFIED COUNTRY
  }

  return (
    <div className="relative z-20 max-w-3xl mx-auto px-4 t:px-16 d:px-0 pt-16 t:pt-24 d:pt-32 text-center">
      <h1 className="heading-xl mb-6 t:mb-12">{TITLE}</h1>
      <p className="my-4 max-w-lg mx-auto">{SUBTITLE}</p>
      <CountryDropdown 
        chooseCountry={(val) => country.current = val}
        />
      <ChooseCountryButton buttonClick={confirmCountryChoice}/>
    </div>
  )
}

export default CountrySelectContainer;
