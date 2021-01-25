# frozen_string_literal: true

FactoryBot.define do
  factory :lifestyle_calculator do
    countries { ['se'] }
    region_options do
      [
        { key: 'first', formula: '1' },
        { key: 'second', formula: '2' }
      ]
    end
    home_options do
      [
        { key: 'apartment', formula: '5' },
        { key: 'house', formula: '10' }
      ]
    end
    home_area_options do
      [
        { key: 'fifteen_sqm', formula: '3' },
        { key: 'twentyfive_sqm', formula: '6' }
      ]
    end
    heating_options do
      [
        { key: 'district', formula: '2' },
        { key: 'electricity', formula: '1' }
      ]
    end
    green_electricity_options do
      [
        { key: 'yes', formula: '0' },
        { key: 'no', formula: '0' }
      ]
    end
    food_options do
      [
        { key: 'vegan', formula: '1000' },
        { key: 'omnivore', formula: '2000' }
      ]
    end
    shopping_options do
      [
        { key: 'zerowaste', formula: '1000' },
        { key: 'average', formula: '1500' }
      ]
    end
    car_type_options do
      [
        { key: 'petrol', formula: '0.2' },
        { key: 'electric', formula: '0.001' }
      ]
    end
    car_distance_unit { 'km' }
    housing_formula { 'IF(green_electricity_answer = "yes", home * 0.5, home * 2)' }
    food_formula { 'food' }
    car_formula { 'car_type * car_distance' }
    flights_formula { 'flight_hours * 0.2' }
    consumption_formula { 'shopping' }
    public_formula { '2000' }
  end
end
