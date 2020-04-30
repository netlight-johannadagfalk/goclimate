# frozen_string_literal: true

FactoryBot.define do
  factory :climate_report_calculation do
    trait :flight_emissions do
      flight_emissions { 1000 }
      association :climate_report, :old
    end
    trait :ten_tonnes do
      association :climate_report, :ten_tonnes
    end
  end
end
