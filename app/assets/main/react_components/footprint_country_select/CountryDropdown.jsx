import React, { useMemo, useState } from 'react';
import countryList from 'react-select-country-list'

const CountryDropdown = (props) => {

    console.log("RENDERING COUNTRYDROPDOWN")

    const selectCountries = useMemo(() => countryList().getData(), []).map((country) => {
        return { 
            "country": country.label, 
            "abbreviation": country.value
        }
    });
  
    return (
        <>
            <div className="select-wrapper w-full m-lg:w-auto m-lg:max-w-xs">
                <select skip_default_ids="false" allow_method_names_outside_object="true" className="select" required="required" name="country" id="country"
                    onChange={ (event) => props.chooseCountry(event.target.value) } 
                >
                    <option value="">I live in...</option>
                    {selectCountries.map((country) => <option value={country.abbreviation} key={country.abbreviation}>{country.country}</option>)}
                </select>
            </div>
        </>
    )
}

export default CountryDropdown;
