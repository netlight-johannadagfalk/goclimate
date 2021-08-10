# frozen_string_literal: true

FactoryBot.define do
  factory :business_calculator, class: 'BusinessCalculators::Calculator' do
    name { 'Calculator' }
    created_at { Time.now }
    updated_at { Time.now }
    id { 999 }

    factory :business_calculator_published do
      status { 'published' }
    end

    factory :business_calculator_with_category_and_field do
      name { 'Calc with cat' }
      categories { [association(:business_calculator_category_with_fields)] }
    end
  end
end
