import React from 'react';
import { useTexts } from '../../../contexts/TextsContext.js';
// import blob from '../../../../../../../../bundles/images/shapes/blob_3.svg';
import blob2 from './blob_5.svg';

const MoneyUsageList = () => {
  const {
    registrationsText: {
      where_does_the_money_go,
      where_does_the_money_go: { heading },
    },
  } = useTexts();

  const listValues = Object.entries(where_does_the_money_go).filter(
    ([key]) => key !== 'heading'
  );

  return (
    <div className="mt-20 mb-16">
      <div className="relative mx-auto w-full  ">
        <img className="invisible t:visible w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" alt="" src={blob2}/>
        <div className="relative space-y-3">
          <h3 className="text-center heading">{heading}</h3>
          <ul className="list-check space-y-3 text-left">
              {listValues.map(([key, text]) => (
              <li key={key}>{text}</li>
            ))}  
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MoneyUsageList;
