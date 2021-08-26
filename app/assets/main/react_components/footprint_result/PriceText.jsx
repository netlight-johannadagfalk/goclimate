import React, { useState } from 'react'

/**
 * Title used on footprint result page
 */
const PriceText = ({price, currency, months, signUpText, grantedRefferalCode}) => {

  function extractPrice (price, currency) {
    var currencyText = currency.money.currency_formats[price.currency.iso_code];
    const findCustomPlacement = /%{.*?}/i;
    var price = (price.subunit_amount/100)
    if (Math.trunc(price) != price) {
      price = price.toFixed(2);
    } 
    return currencyText.replace(findCustomPlacement, price);
  }

  return (
    <>
    {
      !grantedRefferalCode ?
        <div id="showPrice"className="py-6 space-y-1">
          <p className="heading-lg text-center">
            <span><span>{extractPrice(price, currency)}</span>/{months.one}</span>
          </p>
        </div>
      :
      <div id="freeMonth"className="py-6 space-y-1">
        <p className="heading-lg text-center">
          <span>{signUpText.first_month_free}</span>
        </p>
        <p class="font-bold text-center">
          {signUpText.then} <span>{extractPrice(price, currency)}</span>/{months.one}
        </p>
      </div>
    }
    </>
  )
}

export default PriceText;
