class AddDescriptionToBusinessCalculatorCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :business_calculators_calculator_categories, :description, :text
  end
end
