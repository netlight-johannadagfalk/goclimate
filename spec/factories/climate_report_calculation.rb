# frozen_string_literal: true

FactoryBot.define do
  factory :climate_report_calculation do
    trait :ten_tonnes do
      association :climate_report, :ten_tonnes
    end
  end
end
