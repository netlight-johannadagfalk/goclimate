import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext';

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
    <div className="space-y-3">
      <h3 className="font-semibold">{heading}</h3>
      <ul className="list-check space-y-3 text-left">
        {listValues.map(([key, text]) => (
          <li key={key}>{text}</li>
        ))}
      </ul>
    </div>
  );
};

export default MoneyUsageList;
