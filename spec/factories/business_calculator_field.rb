# frozen_string_literal: true

FactoryBot.define do
  factory :business_calculator_field, class: 'BusinessCalculators::CalculatorField' do
    label { 'This is a question' }
    field_type { 'open_ended' }
  end
end
