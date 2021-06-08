# frozen_string_literal: true

module BusinessCalculators
  class CalculatorCategory < ApplicationRecord
    belongs_to :calculator, class_name: 'BusinessCalculators::Calculator'
    has_many :fields,
             ->(category) { order(sanitize_sql_for_order(["POSITION(id::text IN '?')", category.field_order])) },
             class_name: 'BusinessCalculators::CalculatorField',
             foreign_key: 'category_id',
             dependent: :destroy

    validates_presence_of :name

    accepts_nested_attributes_for :fields, allow_destroy: true, reject_if:
      proc { |attributes|
        attributes['label'].blank?
      }

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'calculator_category')
    end

    def answers
      ans = fields.each do |field|
        field
      end
    end
  end
end
