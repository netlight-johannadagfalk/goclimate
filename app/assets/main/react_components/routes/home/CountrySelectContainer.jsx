import React from 'react';
import CountryForm from './components/CountryForm.jsx';

const CountrySelectContainer = ({ slug, welcomeText, sharedText }) => {
  const {
    hero: { heading, body_text },
  } = JSON.parse(welcomeText);

  return (
    <>
      <h1 className="heading-xl mb-6 t:mb-12">{heading}</h1>
      <p className="my-4 max-w-lg mx-auto">{body_text}</p>
      <CountryForm
        slug={slug}
        countryText={{ ...JSON.parse(welcomeText), ...JSON.parse(sharedText) }}
      />
    </>
  );
};

export default CountrySelectContainer;
