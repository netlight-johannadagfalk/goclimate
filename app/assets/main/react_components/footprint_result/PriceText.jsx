import React from 'react'

/**
 * Price text that adapts to region, selected membership type and referral code
 */
const PriceText = ({priceObject, currency, months, signUpText, grantedReferralCode, selectedMembership, currentMultipleValue}) => {

    function extractPrice (priceObject, currency) {
        var currencyText = currency.money.currency_formats[priceObject.currency.iso_code];
        var price = (priceObject.subunit_amount/100)
        if (Math.trunc(price) != price) {
            price = price.toFixed(2);
        } 
        if (selectedMembership === "multi") {
            price = price * currentMultipleValue;
        }
        if (currencyText === "DEFAULT") {
            price=priceObject.currency.iso_code.toUpperCase()+" "+price
        } else {
            const findCustomPlacement = /%{.*?}/i;
            price = currencyText.replace(findCustomPlacement, price);
        }
        return price;
    }

    return (
        <>
        { grantedReferralCode && selectedMembership != "free"?
            <div id="freeMonth" className="py-6 space-y-1">
                <p className="heading-lg text-center">
                    <span>
                        {signUpText.first_month_free}
                    </span>
                </p>
                <p className="font-bold text-center">
                    {signUpText.then} <span>{extractPrice(priceObject, currency)}</span>/{months.one}
                </p>
            </div>
        :
            <div id="showPrice" className="py-6 space-y-1">
                <p className="heading-lg text-center">
                    <span>
                        { selectedMembership === "free" ?
                            <span className="inline">{signUpText.price_free}</span>
                            :
                            <><span>{extractPrice(priceObject, currency)}</span>/{months.one}</>
                        }
                    </span>
                </p>
            </div>
        }
        </>
    )
}

export default PriceText;
