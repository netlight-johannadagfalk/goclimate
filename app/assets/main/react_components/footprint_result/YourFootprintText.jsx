import React, { useState } from 'react'
import { useTexts } from '../context/Footprint/TextsContext.js'
import { useLocaleData } from '../context/Footprint/LocaleContext.js';

/**
 * Result text for your footprint
 * Includes a heading and the footprint result in tonnes
 */
const YourFootprintText = ({ footprintText, footprintValue, priceObject }) => {

    const { commonText: { dashboard: { footprint: { heading } }, months: { one: month }, tonnes_CO2 } } = useTexts()
    const {
        currency: {
          money: {
            currency_formats: { [priceObject.currency.iso_code]: currency },
          },
        },
    } = useLocaleData();
    const [price] = useState(extractPrice())

    var text = " Ditt årliga klimatavtryck är %{footprint} %{unit_of_co2} koldioxid. För %{price} %{time_unit} hjälper vi dig att klimatkompensera ditt avtryck. Summan fördelas till olika klimatavtryck som gör skillnad för klimatet."
    const unit_of_co2 = "ton "
    const stringKeys = ["%{footprint}" ,"%{unit_of_co2}", "%{price}", "%{time_unit}"]
    var stringParts = []

    stringKeys.forEach((key) => {
        stringParts.push(text.split(key)[0])
        text=text.split(key)[1]
    })
    stringParts.push(text)

    function extractPrice () {
        // var currencyText = currency.money.currency_formats[priceObject.currency.iso_code];
        var price = (priceObject.subunit_amount/100)
        if (Math.trunc(price) != price) {
            price = price.toFixed(2);
        } 
        if (currency === "DEFAULT") {
            price=priceObject.currency.iso_code.toUpperCase()+" "+price
        } else {
            const findCustomPlacement = /%{.*?}/i;
            price = currency.replace(findCustomPlacement, price);
        }
        return price;
    }

    return (
        <div>
            <div className="text-left mt-8">
                {stringParts[0]}
                <span className="text-lg font-bold text-green-accent">{footprintValue}</span>
                <span className="font-bold text-green-accent"> {unit_of_co2}</span>
                {stringParts[2]}
                <span className="text-lg font-bold text-green-accent">{price}</span>
                <span className="font-bold text-green-accent">/{month}</span>
                {stringParts[4]}

            </div>
        </div>
    )
}

export default YourFootprintText
