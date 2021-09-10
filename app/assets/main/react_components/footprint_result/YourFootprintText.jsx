import React from 'react'

/**
 * Result text for your footprint
 * Includes a heading and the footprint result in tonnes
 */
const YourFootprintText = ({ footprintText, footprintValue, priceObject, currency }) => {
    const txt = footprintText.heading + " is %{footprint} %{unit_of_co2}. It costs you %{price} %{time_unit} to climate compensate."
    var t = txt.split("%{footprint}")
    //var a = t[1].split("%{unit_of_co2}")
    // console.log(a)
    var p = t[1].split("%{price}")
    console.log(p)

    function extractPrice (priceObject, currency) {
        var currencyText = currency.money.currency_formats[priceObject.currency.iso_code];
        var price = (priceObject.subunit_amount/100)
        if (Math.trunc(price) != price) {
            price = price.toFixed(2);
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
        <div>
            <div className="text-left mt-8">
                {t[0]} 
                <span className="text-lg font-bold text-green-accent">{footprintValue}</span>
                {/* <span className="text-sm font-bold text-green-accent">unit</span> */}
                {p[0]}
                <span className="text-lg font-bold text-green-accent">{extractPrice(priceObject, currency)}</span>
                {p[1]}
            </div>

            <span className="text-xl font-bold text-green-accent">{footprintValue}</span>

            <div className="mt-1">
                <span className="text-xl font-bold text-green-accent">{footprintValue}</span>
                <span className="text-lg font-semibold"> {footprintText.tonnes_CO2}</span>
            </div>
        </div>
    )
}

export default YourFootprintText
