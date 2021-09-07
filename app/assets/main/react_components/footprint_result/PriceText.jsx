import React, { useState, useEffect } from 'react';
import Link from '../Link.jsx';
import { useTexts, useLocaleData } from '../context/Footprint/StaticDataContext.js';

/**
 * Price text that adapts to region, selected membership type and referral code
 */
const PriceText = ({priceObject, grantedReferralCode, selectedMembership, multipleOffsets}) => {
    
    const text = {
        first_month_free: useTexts().registrationsText.first_month_free,
        then: useTexts().registrationsText.then,
        one: useTexts().commonText.months.one,
        price_free: useTexts().registrationsText.price_free,
        heading: useTexts().registrationsText.where_does_the_money_go.heading,
        currency: useLocaleData().currency.money.currency_formats[priceObject.currency.iso_code]
    }

    const [price, setPrice] = useState(extractPrice())

    function extractPrice () {
        var price = (priceObject.subunit_amount/100)
        if (Math.trunc(price) != price) {
            price = price.toFixed(2);
        } 
        if (selectedMembership === "multi") {
            price = price * multipleOffsets;
        }
        if (text.currency === "DEFAULT") {
            price = priceObject.currency.iso_code.toUpperCase()+" "+price
        } else {
            const findCustomPlacement = /%{.*?}/i;
            price = text.currency.replace(findCustomPlacement, price);
        }
        return price;
    }

    useEffect(() => {
        setPrice(extractPrice())
    }, [grantedReferralCode, selectedMembership, multipleOffsets])

    return (
        <>
        { grantedReferralCode && selectedMembership != "free"?
            <div id="freeMonth" className="py-6 space-y-1">
                <p className="heading-lg text-center">
                    <span>
                        {text.first_month_free}
                    </span>
                </p>
                <p className="font-bold text-center">
                    {text.then} <span>{price}</span>/{text.one}
                </p>
            </div>
        :
            <div id="showPrice" className="py-6 space-y-1">
                <p className="heading-lg text-center">
                    <span>
                        { selectedMembership === "free" ?
                            <span className="inline">{text.price_free}</span>
                            :
                            <><span>{price}</span>/{text.one}</>
                        }
                    </span>
                </p>
                { selectedMembership !== "free" &&
                    <div className="text-center">
                        <Link linkText={text.heading}/>
                    </div>
                }   
            </div>
        }
        </>
    )
}

export default PriceText;
