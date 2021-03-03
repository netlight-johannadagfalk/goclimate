# frozen_string_literal: true

module BusinessCalculators
  class CalculatorCategory < ApplicationRecord
    belongs_to :calculator, class_name: 'BusinessCalculators::Calculator'
    has_many :fields, class_name: 'BusinessCalculators::CalculatorField'

    validates_presence_of :name
  end
end
