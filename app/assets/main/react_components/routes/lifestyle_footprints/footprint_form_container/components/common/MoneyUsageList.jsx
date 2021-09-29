import React from 'react';
import blobImage from '../../../../../../../../assets/images/shapes/blob_5.svg';
import { useTexts } from '../../../contexts/TextsContext.js';

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
    <div className="my-20 mx-4">
      <div className="relative mx-auto w-full">
        <img
          className="invisible m-s:visible w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          alt=""
          src={blobImage}
        />
        <div className="relative space-y-3">
          <h3 className="text-center heading">{heading}</h3>
          <ul className="list-check space-y-3 text-left text-sm">
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
