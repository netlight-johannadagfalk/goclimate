# frozen_string_literal: true

module BusinessCalculatorsHelper
  def update_order(calculator, category_order)
    @category_order = category_order
    @calculator = calculator

    update_category_order
    update_field_order
  end

  private

  def update_category_order
    # When a new calculator is created
    if @calculator.category_order.nil?
      @calculator.update(category_order: @calculator.categories.pluck(:id))
    # New category added or a category is deleted
    elsif @calculator.category_order.sort != @calculator.categories.pluck(:id).sort
      new_categories = @calculator.categories.pluck(:id) - @calculator.category_order
      deleted_categories = @calculator.category_order - @calculator.categories.pluck(:id)
      categories = @calculator.category_order + new_categories - deleted_categories
      @calculator.update(category_order: categories)
    # When categories are reordered
    else
      @calculator.update(category_order: @category_order)
    end
  end

  def update_field_order
    @calculator.categories.each do |category|
      # When a new category is created
      if category.field_order.nil?
        category.update(field_order: category.fields.pluck(:id))
      # New field added or a field is deleted
      elsif category.field_order.sort != category.fields.pluck(:id).sort
        new_fields = category.fields.pluck(:id) - category.field_order
        deleted_fields = category.field_order - category.fields.pluck(:id)
        fields = category.field_order + new_fields - deleted_fields
        category.update(field_order: fields)
      # When fields are reordered
      else
        category.update(field_order: category['field_order'])
      end
    end
  end
end
