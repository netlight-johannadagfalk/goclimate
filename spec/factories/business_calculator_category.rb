# frozen_string_literal: true

FactoryBot.define do
  factory :business_calculator_category, class: 'BusinessCalculators::CalculatorCategory' do
    name { 'Category 1' }

    factory :business_calculator_category_with_fields do
      name { 'Category with fields' }
      fields { [association(:business_calculator_field)] }
    end
  end
end
