# frozen_string_literal: true

FactoryBot.define do
  factory :lifestyle_footprint do
    lifestyle_calculator
    country { lifestyle_calculator.countries.first }
    region_answer { 'first' }
    home_answer { 'apartment' }
    home_area_answer { 'fifteen_sqm' }
    heating_answer { 'district' }
    green_electricity_answer { 'yes' }
    food_answer { 'vegan' }
    shopping_answer { 'zerowaste' }
    car_type_answer { 'electric' }
    car_distance_answer { 1000 }
    flight_hours_answer { 5 }
    housing { 1000 }
    food { 1000 }
    car { 100 }
    flights { 1000 }
    consumption { 1000 }
    public { 2000 }
    total { 6100 }
  end
end
