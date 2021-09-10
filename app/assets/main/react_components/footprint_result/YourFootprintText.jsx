import React from 'react'

/**
 * Result text for your footprint
 * Includes a heading and the footprint result in tonnes
 */
const YourFootprintText = ({ footprintText, footprintValue, priceObject, currency, months }) => {
    console.log(months)
    const txt = " Ditt årliga klimatavtryck är %{footprint} %{unit_of_co2} koldioxid. För %{price} %{time_unit} hjälper vi dig att klimatkompensera ditt avtryck. Summan fördelas till olika klimatavtryck som gör skillnad för klimatet."
    const unit_of_c02 = "ton "
    var t = txt.split("%{footprint}")
    var a = t[1].split("%{unit_of_co2}")
    var p = a[1].split("%{price}")
    var s = p[1].split("%{time_unit}")

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
                <span className="font-bold text-green-accent"> {unit_of_c02}</span>
                {p[0]}
                <span className="text-lg font-bold text-green-accent">{extractPrice(priceObject, currency)}</span>
                <span className="font-bold text-green-accent">/{months.one}</span>
                {s[1]}
            </div>
        </div>
    )
}

export default YourFootprintText
