class AddFieldAndCategoryOrderToBusinessCalculatorsAndCategory < ActiveRecord::Migration[6.0]
  def change
    add_column :business_calculators_calculators, :category_order, :integer, array: true
    add_column :business_calculators_calculator_categories, :field_order, :integer, array: true
  end
end
