import React, { useState } from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import { useLocaleData } from '../context/Footprint/LocaleContext.js';

/**
 * Result text for your footprint
 * Includes a footprint result in tonnes
 */
const YourFootprintText = ({ footprintValue, priceObject }) => {
  const {
    commonText: {
      months: { one: month },
      tonnes,
    },
    reactContentText: {
      react: {
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
  } = useLocaleData();

  const [price] = useState(extractPrice());

  function extractPrice() {
    var price = priceObject.subunit_amount / 100;
    if (Math.trunc(price) != price) {
      price = price.toFixed(2);
    }
    if (currency === 'DEFAULT') {
      price = priceObject.currency.iso_code.toUpperCase() + ' ' + price;
    } else {
      const findCustomPlacement = /%{.*?}/i;
      price = currency.replace(findCustomPlacement, price);
    }
    return price;
  }

  return (
    <div>
      <div className="text-left mt-8">
        {text_part_before}
        <span className="text-lg font-bold text-green-accent">
          {' '}
          {footprintValue}{' '}
        </span>
        <span className="font-bold text-green-accent"> {tonnes} </span>{' '}
        {text_part_middle}{' '}
        <span className="text-lg font-bold text-green-accent">{price}</span>
        <span className="font-bold text-green-accent">/{month} </span>
        {text_part_end}
      </div>
    </div>
  );
};

export default YourFootprintText;
