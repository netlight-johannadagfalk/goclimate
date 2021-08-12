import React, { useMemo } from 'react';
import countryList from 'react-select-country-list'

/**
 * Form for choosing country of residence prior to filling out footprint calculator
 */
const CountryForm = ({ lang, countryText }) => {

    return (
        <form className="m-lg:flex m-lg:justify-center mt-3" action={lang === 'en' ? '/calculator' : lang === 'sv' ? 'se/calculator' : lang + '/calculator'}>
            <div className="select-wrapper w-full m-lg:w-auto m-lg:max-w-xs">
                <label htmlFor="country" className="sr-only">{countryText.select_country}</label>
                <select skip_default_ids="false" allow_method_names_outside_object="true" className="select" required="required" name="country" id="country">
                    <option value="">{countryText.i_live_in}</option>
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
