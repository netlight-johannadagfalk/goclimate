# frozen_string_literal: true

module BusinessCalculators
  class CalculatorField < ApplicationRecord
    belongs_to :category, class_name: 'BusinessCalculators::CalculatorCategory'

    attribute :units, :allowed_units

    validates_presence_of :label
    validate :units_exists

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'calculator_field')
    end

    private

    def units_exists
      return if units.nil?

      units.each_key do |key|
        errors.add(:units, 'the key can\'t  be blank') if key.blank?
        unless BusinessCalculators::Unit.exists?(key: key)
          errors.add(:units, 'the key must correspond to an existing unit')
        end
      end
    end
  end
end
