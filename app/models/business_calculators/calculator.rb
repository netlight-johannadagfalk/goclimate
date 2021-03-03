# frozen_string_literal: true

module BusinessCalculators
  class Calculator < ApplicationRecord
    has_many :categories, class_name: 'BusinessCalculators::CalculatorCategory'
  end
end
