# frozen_string_literal: true

FactoryBot.define do
  factory :climate_report do
    company_name { 'GoClimateNeutral' }
    contact_email { 'test@example.com' }
    employees { 4 }
    country { 'se' }
    calculation_period { '2018' }
  end
end
