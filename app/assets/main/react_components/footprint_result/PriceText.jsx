import React, { useState, useEffect } from 'react';
import Link from '../Link.jsx';
import { useTexts } from '../context/Footprint/TextsContext.js';
import { useLocaleData } from '../context/Footprint/LocaleContext.js';

/**
 * Price text that adapts to region, selected membership type and referral code
 */
const PriceText = ({ priceObject, grantedReferralCode, selectedMembership, multipleOffsets }) => {

    const { commonText: { months: { one } }, registrationsText: { first_month_free, then, price_free, where_does_the_money_go : { heading } } } = useTexts()
    const { currency: { money: { currency_formats: { [priceObject.currency.iso_code]: currency } } } } = useLocaleData()

    const [price, setPrice] = useState(extractPrice())

    function extractPrice () {
        var price = (priceObject.subunit_amount/100)
        if (Math.trunc(price) != price) {
            price = price.toFixed(2);
        } 
        if (selectedMembership === "multi") {
            price = price * multipleOffsets;
        }
        if (currency === "DEFAULT") {
            price = priceObject.currency.iso_code.toUpperCase()+" "+price
        } else {
            const findCustomPlacement = /%{.*?}/i;
            price = currency.replace(findCustomPlacement, price);
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
                        {first_month_free}
                    </span>
                </p>
                <p className="font-bold text-center">
                    {then} <span>{price}</span>/{one}
                </p>
            </div>
        :
            <div id="showPrice" className="py-6 space-y-1">
                <p className="heading-lg text-center">
                    <span>
                        { selectedMembership === "free" ?
                            <span className="inline">{price_free}</span>
                            :
                            <><span>{price}</span>/{one}</>
                        }
                    </span>
                </p>
                { selectedMembership !== "free" &&
                    <div className="text-center">
                        <Link linkText={heading}/>
                    </div>
                }   
            </div>
        }
        </>
    )
}

export default PriceText;
