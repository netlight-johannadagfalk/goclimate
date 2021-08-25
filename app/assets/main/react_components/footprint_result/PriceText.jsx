import React from 'react'

/**
 * Title used on footprint result page
 */
const PriceText = ({price, currency, months, signUpText}) => {

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
      <div className="py-6 space-y-1">
          <p className="heading-lg text-center">
            <span className="hidden">{signUpText.first_month_free}</span>
            <span><span>{extractPrice(price, currency)}</span>/{months.one}</span>
          </p>
          <p className="hidden">
            {signUpText.then} <span>{extractPrice(price, currency)}</span>/{months.one}
          </p>
      </div>
  )
}

export default PriceText;
