import React from 'react';
import CountryDropdown from './CountryDropdown.jsx';

const CountrySelectContainer = (props) => {
  
  return (
    <div className="relative z-20 max-w-3xl mx-auto px-4 t:px-16 d:px-0 pt-16 t:pt-24 d:pt-32 text-center">
      CONTAINER START
      <h1 className="heading-xl mb-6 t:mb-12">Together we can save the climate!</h1>
      <p className="my-4 max-w-lg mx-auto">Calculate your carbon footprint to start your personalized subscription, all in less than 2 minutes</p>
      <CountryDropdown/>
      CONTAINER END
    </div>
  )
}

export default CountrySelectContainer;
