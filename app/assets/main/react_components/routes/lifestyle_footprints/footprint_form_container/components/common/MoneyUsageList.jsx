import React from 'react';
import blobImage from '../../../../../../../images/shapes/blob_5.svg';
import { useTexts } from '../../../contexts/TextsContext.js';
import { useVersion } from '../../../contexts/VersionContext';

const MoneyUsageList = () => {
  const {
    registrationsText: {
      where_does_the_money_go,
      where_does_the_money_go: { heading }
    }
  } = useTexts();

  const version = useVersion();

  const listValues = Object.entries(where_does_the_money_go).filter(
    ([key]) => key !== 'heading'
  );

  return (
    <div className="my-10 mx-4 m-s:my-20 t:my-30 d:my-36">
      <div className="relative mx-auto w-full">
        {version === 'v2' && (
          <img
            className="invisible m-s:visible w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            alt=""
            src={blobImage}
          />
        )}
        <div className="relative space-y-3">
          <h3 className="text-center heading">{heading}</h3>
          <ul
            className={
              'list-check space-y-3 text-left' +
              (version === 'v2' && ' text-sm')
            }
          >
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
