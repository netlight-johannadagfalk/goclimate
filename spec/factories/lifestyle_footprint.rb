# frozen_string_literal: true

FactoryBot.define do
  factory :lifestyle_footprint do
    key { 'a9993e364706816aba3e25717850c26c9cd0d89d' }
    lifestyle_calculator
    region_answer { 'first' }
    home_answer { 'apartment' }
    heating_answer { 'district' }
    green_electricity_answer { 'yes' }
    food_answer { 'vegan' }
    car_type_answer { 'electric' }
    car_distance_answer { 1000 }
    flight_hours_answer { 5 }
    housing { 1000 }
    food { 1000 }
    car { 100 }
    flights { 1000 }
    consumption { 1000 }
    public { 2000 } # rubocop:disable Layout/EmptyLinesAroundAccessModifier
    total { 6100 }
  end
end
