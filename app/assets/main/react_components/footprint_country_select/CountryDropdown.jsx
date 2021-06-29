import React from 'react';

const CountryDropdown = (props) => {
  
  return (
    <form className="m-lg:flex m-lg:justify-center mt-3" action="/calculator" accept-charset="UTF-8" method="get">
        <div class="select-wrapper w-full m-lg:w-auto m-lg:max-w-xs">
            <label for="country" class="sr-only">Select your country</label>
            <select skip_default_ids="false" allow_method_names_outside_object="true" class="select" required="required" name="country" id="country"><option value="">I live in...</option>
                <option value="AF">Afghanistan</option>
                <option value="AX">Åland Islands</option>
                <option value="AL">Albania</option>
            </select>
        </div>
        <input type="submit" value="Get started" class="button button-cta mt-2 m-lg:mt-0 m-lg:ml-2 w-full m-lg:w-auto" data-disable-with="Get started"/>
    </form>
  )
}

export default CountryDropdown;
