# frozen_string_literal: true

module BusinessCalculators
  class CalculatorCategory < ApplicationRecord
    belongs_to :calculator, class_name: 'BusinessCalculators::Calculator'
    has_many     :fields,
                 class_name: 'BusinessCalculators::CalculatorField',
                 foreign_key: 'category_id',
                 dependent: :destroy,
                 inverse_of: :category

    validates_presence_of :name

    accepts_nested_attributes_for :fields, allow_destroy: true, reject_if:
      proc { |attributes|
        attributes['label'].blank?
      }

    scope :order_as, lambda { |ids|
      return unless ids

      order = sanitize_sql_array(["position((',' || id::text || ',') in ?)", ids
        .join(',') + ','])
      where(id: ids).order(Arel.sql(order)) if order
    }

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'calculator_category')
    end

    def ordered_fields
      BusinessCalculators::CalculatorField.where(category_id: id).order_as(field_order)
    end
  end
end
