import React from 'react';

const FootprintForm = (props) => {

    console.log(props.questions.en.views.lifestyle_footprints.questions)

    return (

        <>

        {Object.keys(props.questions.en.views.lifestyle_footprints.questions).map((question) => {
            return <div key={question}>{question}</div>
        })}
   
        </>

    )
}

export default FootprintForm;

     /*



            <form>
                
                questions --> blockade tills index OK

                for each question in questions:
                    <div hidden=index % questionsOwnIndex>
                    <title> question </title>    
                    <input> ans 1 </input>
                    -....
                    <div>




                    index = 2
                    synlig

                    if click, set index to index +1

                submit
            </form>



        

        <form action="/calculator" acceptCharset="UTF-8" method="post">



            <div className="question py-8" data-target="lifestyle-footprints--calculator.question" data-category="home">
              <h2 className="heading my-4">How big is your home?</h2>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="fifteen_sqm" name="lifestyle_footprint[home_area_answer]" id="lifestyle_footprint_home_area_answer_fifteen_sqm"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_fifteen_sqm">15 square metres per person</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_fifteen_sqm">15 square metres per person</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="twentyfive_sqm" name="lifestyle_footprint[home_area_answer]" id="lifestyle_footprint_home_area_answer_twentyfive_sqm"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_twentyfive_sqm">25 square metres per person</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_twentyfive_sqm">25 square metres per person</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="fortytwo_sqm" name="lifestyle_footprint[home_area_answer]" id="lifestyle_footprint_home_area_answer_fortytwo_sqm"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_fortytwo_sqm">42 square metres per person</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_fortytwo_sqm">42 square metres per person</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="sixty_sqm" name="lifestyle_footprint[home_area_answer]" id="lifestyle_footprint_home_area_answer_sixty_sqm"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_sixty_sqm">60 square metres per person</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_sixty_sqm">60 square metres per person</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="eighty_sqm" name="lifestyle_footprint[home_area_answer]" id="lifestyle_footprint_home_area_answer_eighty_sqm"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_home_area_answer_eighty_sqm">80 square metres per person</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_home_area_answer_eighty_sqm">80 square metres per person</label>
                </div>
            </div>
        </form>

        */




/*
** old htmlForm **


            do we need this?
                <input type="hidden" name="authenticity_token" value="NVZvwAuXZzeyoogL6QAd0OEj7IqoISJBScfXptU/XsTBMlyEt5uQB0lxX/52DQ/LIdPkRZwjz7ueCh7aS4l3sQ=="/>
                <input type="hidden" value="2" name="lifestyle_footprint[lifestyle_calculator_id]" id="lifestyle_footprint_lifestyle_calculator_id"/>
                <input type="hidden" value="AS" name="lifestyle_footprint[country]" id="lifestyle_footprint_country"/>
                <input type="hidden" name="campaign" id="campaign"/>



            rest

            <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="home">
              <h2 className="heading my-4">How do you heat your home?</h2>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="heating_oil" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_heating_oil"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_heating_oil">Heating oil</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_heating_oil">Heating oil</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="natural_gas" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_natural_gas"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_natural_gas">Natural gas</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_natural_gas">Natural gas</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="electricity" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_electricity"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_electricity">Electricity</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_electricity">Electricity</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="district" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_district"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_district">District heating</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_district">District heating</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="coal" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_coal"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_coal">Coal</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_coal">Coal</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="biomass" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_biomass"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_biomass">Biomass</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_biomass">Biomass</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="dont_know" name="lifestyle_footprint[heating_answer]" id="lifestyle_footprint_heating_answer_dont_know"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_heating_answer_dont_know">I don't know/Other</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_heating_answer_dont_know">I don't know/Other</label>
                </div>
            </div>

            <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="home">
              <h2 className="heading my-4">Do you use green electricity?</h2>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="yes" name="lifestyle_footprint[green_electricity_answer]" id="lifestyle_footprint_green_electricity_answer_yes"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_green_electricity_answer_yes">Yes</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_green_electricity_answer_yes">Yes</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="fifty_percent" name="lifestyle_footprint[green_electricity_answer]" id="lifestyle_footprint_green_electricity_answer_fifty_percent"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_green_electricity_answer_fifty_percent">50% green</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_green_electricity_answer_fifty_percent">50% green</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="no" name="lifestyle_footprint[green_electricity_answer]" id="lifestyle_footprint_green_electricity_answer_no"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_green_electricity_answer_no">No</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_green_electricity_answer_no">No</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="dont_know" name="lifestyle_footprint[green_electricity_answer]" id="lifestyle_footprint_green_electricity_answer_dont_know"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_green_electricity_answer_dont_know">I don't know</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_green_electricity_answer_dont_know">I don't know</label>
                </div>
            </div>

            <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="food">
              <h2 className="heading my-4">What is your diet mostly like?</h2>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="vegan" name="lifestyle_footprint[food_answer]" id="lifestyle_footprint_food_answer_vegan"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_food_answer_vegan">Plant-based</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_food_answer_vegan">Plant-based</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="vegetarian" name="lifestyle_footprint[food_answer]" id="lifestyle_footprint_food_answer_vegetarian"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_food_answer_vegetarian">Vegetarian</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_food_answer_vegetarian">Vegetarian</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="pescetarian" name="lifestyle_footprint[food_answer]" id="lifestyle_footprint_food_answer_pescetarian"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_food_answer_pescetarian">Pescetarian (fish but no meat)</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_food_answer_pescetarian">Pescetarian (fish but no meat)</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="meat_low" name="lifestyle_footprint[food_answer]" id="lifestyle_footprint_food_answer_meat_low"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_food_answer_meat_low">Some meat (less than 50 g per day)</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_food_answer_meat_low">Some meat (less than 50 g per day)</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="meat_medium" name="lifestyle_footprint[food_answer]" id="lifestyle_footprint_food_answer_meat_medium"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_food_answer_meat_medium">Meat-eater</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_food_answer_meat_medium">Meat-eater</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="meat_high" name="lifestyle_footprint[food_answer]" id="lifestyle_footprint_food_answer_meat_high"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_food_answer_meat_high">Lots of meat (more than 100 g per day)</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_food_answer_meat_high">Lots of meat (more than 100 g per day)</label>
                </div>
            </div>

            <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="consumption">
              <h2 className="heading my-4">Considering clothing, shoes, electronics, furniture and other items, how much do you purchase brand-new?</h2>
                <label className="block button my-3">
                  <input required="required" className="hidden" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="low" name="lifestyle_footprint[shopping_answer]" id="lifestyle_footprint_shopping_answer_low"/>
                  None or just a few in the last year
                </label>
                <label className="block button my-3">
                  <input required="required" className="hidden" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="average" name="lifestyle_footprint[shopping_answer]" id="lifestyle_footprint_shopping_answer_average"/>
                  Every now and then
                </label>
                <label className="block button my-3">
                  <input required="required" className="hidden" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="high" name="lifestyle_footprint[shopping_answer]" id="lifestyle_footprint_shopping_answer_high"/>
                  Multiple every month, or multiple larger products in the last year
                </label>
            </div>

            <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="car">
              <h2 className="heading my-4">What type of car do you use to get around?</h2>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="petrol" name="lifestyle_footprint[car_type_answer]" id="lifestyle_footprint_car_type_answer_petrol"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_car_type_answer_petrol">Petrol</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_car_type_answer_petrol">Petrol</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="diesel" name="lifestyle_footprint[car_type_answer]" id="lifestyle_footprint_car_type_answer_diesel"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_car_type_answer_diesel">Diesel</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_car_type_answer_diesel">Diesel</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="hybrid_plugin" name="lifestyle_footprint[car_type_answer]" id="lifestyle_footprint_car_type_answer_hybrid_plugin"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_car_type_answer_hybrid_plugin">Hybrid Plug-in</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_car_type_answer_hybrid_plugin">Hybrid Plug-in</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextQuestion" type="radio" value="electric" name="lifestyle_footprint[car_type_answer]" id="lifestyle_footprint_car_type_answer_electric"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_car_type_answer_electric">Electric</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_car_type_answer_electric">Electric</label>
                </div>
                <div className="my-3">
                  <input required="required" className="toggler" data-action="click->lifestyle-footprints--calculator#nextCategory" type="radio" value="no_car" name="lifestyle_footprint[car_type_answer]" id="lifestyle_footprint_car_type_answer_no_car"/>
                  <label className="hidden button button-cta toggler-checked:block" htmlFor="lifestyle_footprint_car_type_answer_no_car">I don't have a car</label>
                  <label className="block button toggler-checked:hidden" htmlFor="lifestyle_footprint_car_type_answer_no_car">I don't have a car</label>
                </div>
            </div>

            <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="car">
              <h2 className="heading my-4">How much do you travel by car each week?</h2>
              <div className="flex flex-col m-lg:flex-row">
                <label className="input mb-3 m-lg:mb-0 m-lg:mr-3 flex">
                  <input type="number" name="car_distance_week_answer" id="car_distance_week_answer" value="" min="0" max="2147483647" size="7" className="flex-1"/>
                  <span className="ml-3">km</span>
                </label>
                <button name="button" type="button" className="button flex-1" data-action="click->lifestyle-footprints--calculator#nextQuestion">Next</button>
              </div>
            </div>

          <div className="question py-8 hidden" data-target="lifestyle-footprints--calculator.question" data-category="flights">
            <h2 className="heading my-4">How many hours did you travel by plane in the last year?</h2>
            <div className="flex flex-col m-lg:flex-row">
              <input min="0" max="2147483647" size="7" className="input mb-3 m-lg:mb-0 m-lg:mr-3" type="number" name="lifestyle_footprint[flight_hours_answer]" id="lifestyle_footprint_flight_hours_answer"/>
              <input type="submit" name="commit" value="Next" className="button flex-1" data-disable-with="Next"/>
            </div>
          </div>

*/