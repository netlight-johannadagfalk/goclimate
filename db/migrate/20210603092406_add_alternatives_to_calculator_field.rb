class AddAlternativesToCalculatorField < ActiveRecord::Migration[6.0]
  def change
    add_column :business_calculators_calculator_fields, :alternatives, :text, array: true
  end
end
