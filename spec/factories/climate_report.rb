# frozen_string_literal: true

FactoryBot.define do
  factory :climate_report do
    company_name { 'GoClimateNeutral' }
    contact_email { 'test@example.com' }
    employees { 4 }
    country { 'se' }
    calculation_period { '2018' }
    calculation_period_length { 'year' }

    trait :old do
      flight_hours { 100 }
      calculation_period { '2017' }
    end

    trait :ten_tonnes do
      other_co2e { 10_000 }
    end
  end
end
