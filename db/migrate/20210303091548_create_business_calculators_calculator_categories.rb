class CreateBusinessCalculatorsCalculatorCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :business_calculators_calculator_categories do |t|
      t.timestamps

      t.references :calculator, null: false, foreign_key: { to_table: :business_calculators_calculators }, index: { name: 'index_business_calculators_calculator_categor_on_calculator_id' }
      t.text :name
    end
  end
end
