import React from 'react';

const ChooseCountryButton = (props) => {
  
  return (
    <>
    <input onClick = { props.buttonClick } type="submit" className="button button-cta mt-2 m-lg:mt-0 m-lg:ml-2 w-full m-lg:w-auto" data-disable-with="Get started" value="Get started"/>
    </>
  )
}

export default ChooseCountryButton;
