import React from 'react';

const ChooseCountryButton = () => {
  
  return (
    <>
    <input type="submit" className="button button-cta mt-2 m-lg:mt-0 m-lg:ml-2 w-full m-lg:w-auto" data-disable-with="Get started" value="Get started"/>
            {/* When submit, route to lifestyle_footprints/new, like before but "through React components" */}
    </>
      )
}


export default ChooseCountryButton;

/*
Funderingar till Oscar
- yml: hämta frågor och visa i React istället för erb, erfarenhet av det?
- routing: vill behålla logik i controller, så hur kommer vi iväg från home/show till lifestyle_footprints/new när vi valt land
*/