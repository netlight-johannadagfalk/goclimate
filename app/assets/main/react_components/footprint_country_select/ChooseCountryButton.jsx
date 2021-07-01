import React from 'react';

const ChooseCountryButton = (props) => {

  console.log("RENDERING BUTTON ")
  
  return (
    <input type="submit" className="button button-cta mt-2 m-lg:mt-0 m-lg:ml-2 w-full m-lg:w-auto" data-disable-with="Get started" value="Get started"
      onClick={props.buttonClick} 
    />
  )
}

export default ChooseCountryButton;
