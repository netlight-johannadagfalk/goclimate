import React, { useMemo } from 'react';
import countryList from 'react-select-country-list'

const CountryDropdown = () => {

    const selectCountries = useMemo(() => countryList().getData(), []).map((country) => 
        (<option value={country.value} key={country.value}>{country.label}</option>))
  
    return (
        <form className="m-lg:flex m-lg:justify-center mt-3" action="/calculator" acceptCharset="UTF-8" method="get">
            <div className="select-wrapper w-full m-lg:w-auto m-lg:max-w-xs">
                <select skip_default_ids="false" allow_method_names_outside_object="true" className="select" required="required" name="country" id="country"><option value="">I live in...</option>
                    {selectCountries}
                </select>
            </div>
            <input type="submit" value="Get started" className="button button-cta mt-2 m-lg:mt-0 m-lg:ml-2 w-full m-lg:w-auto" data-disable-with="Get started"/>
        </form>
    )
}

export default CountryDropdown;
