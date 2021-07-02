import React, { useMemo } from 'react';
import countryList from 'react-select-country-list'

/**
 * Form for choosing country of residence prior to filling out footprint calculator
 */
const CountryForm = () => {

    const DEFAULT_DROPDOWN_VAL = "I live in...";
    const FALLBACK_TITLE = "Select your country";

    return (
        <form className="m-lg:flex m-lg:justify-center mt-3" action='/calculator'>
            <div className="select-wrapper w-full m-lg:w-auto m-lg:max-w-xs">
                <label htmlFor="country" className="sr-only">{FALLBACK_TITLE}</label>
                <select skip_default_ids="false" allow_method_names_outside_object="true" className="select" required="required" name="country" id="country">
                <option value="">{DEFAULT_DROPDOWN_VAL}</option>
                {
                    useMemo(() => countryList().getData(), []).map((country) => <option value={country.value} key={country.value}>{country.label}</option>)
                }
                </select>
            </div>
            <input type="submit" value="Get started" className="button button-cta mt-2 m-lg:mt-0 m-lg:ml-2 w-full m-lg:w-auto" data-disable-with="Get started"/>
        </form> 
    )
}

export default CountryForm;
