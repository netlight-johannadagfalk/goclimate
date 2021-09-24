# frozen_string_literal: true

module BusinessCalculators
  class Calculator < ApplicationRecord
    has_many     :categories,
                 class_name: 'BusinessCalculators::CalculatorCategory',
                 foreign_key: 'calculator_id',
                 dependent: :destroy,
                 inverse_of: :calculator

    accepts_nested_attributes_for :categories, allow_destroy: true, reject_if:
      proc { |attributes|
        attributes['name'].blank?
      }

    validate :status_value

    after_create :set_default_status

    def ordered_categories
      BusinessCalculators::CalculatorCategory.where(calculator_id: id).order_as(category_order)
    end

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'business_calculator')
    end

    def published?
      return true if status == 'published'

      false
    end

    def archived?
      return true if status == 'archived'

      false
    end

    def draft?
      return true if status == 'draft'

      false
    end

    def publish
      self.status = 'published'
      save
    end

    def archive
      self.status = 'archived'
      save
    end

    def duplicate # rubocop:disable Layout/MethodLength
      new_calculator = dup
      new_calculator.name = "#{new_calculator.name} (copy)"
      new_calculator.status = 'draft'

      category_order = []

      if new_calculator.save
        categories.each do |category|
          new_category = category.dup
          new_category.calculator_id = new_calculator.id
          new_category.save

          category_order << new_category.id
          field_order = []

          category.fields.each do |field|
            new_field = field.dup
            new_field.category_id = new_category.id
            new_field.save
            field_order << new_field.id
          end
          new_category.update!(field_order: field_order)
        end
        new_calculator.update!(category_order: category_order)
      else
        errors.add(self, 'was not duplicated')
      end
    end

    private

    def set_default_status
      self.status = 'draft' unless status.present?
    end

    def status_value
      available_options = %w[published archived draft]
      errors.add(status, "must be one of #{available_options.join(', ')}") unless available_options.include?(status)
    end
  end
end
