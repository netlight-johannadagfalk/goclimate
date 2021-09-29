import React from 'react';
import { useSession } from '../../../../../../../../contexts/SessionContext.js';
import { useTexts } from '../../../../../../../../contexts/TextsContext.js';
import { calculatePrice } from '../../../../../../../../helpers/result-helper.js';

const YourFootprintText = ({ footprintValue, priceObject }) => {
  const {
    commonText: {
      months: { one: month },
      tonnes,
    },
    reactContentText: {
      world_page: {
        your_footprint_result_text: {
          text_part_before,
          text_part_middle,
          text_part_end,
        },
      },
    },
  } = useTexts();

  const {
    currency: {
      money: {
        currency_formats: { [priceObject.currency.iso_code]: currency },
      },
    },
  } = useSession();

  const price = calculatePrice(priceObject, currency, true);

  return (
    <div>
      <div className="text-center mt-8">
        {text_part_before}
        <span className="text-lg font-bold text-green-accent">
          {' '}
          {footprintValue}{' '}
        </span>
        <span className="font-bold text-green-accent"> {tonnes} </span>{' '}
        {text_part_middle}{' '}
        <span className="text-lg font-bold text-green-accent">{price}</span>
        <span className="font-bold text-green-accent">/{month}</span>
        {text_part_end}
      </div>
    </div>
  );
};

export default YourFootprintText;
