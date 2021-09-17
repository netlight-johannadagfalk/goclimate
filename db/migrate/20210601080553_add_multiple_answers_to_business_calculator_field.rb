class AddMultipleAnswersToBusinessCalculatorField < ActiveRecord::Migration[6.0]
  def change
    add_column :business_calculators_calculator_fields, :multiple_answers, :boolean, default: false
  end
end
