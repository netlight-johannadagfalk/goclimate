class CreateBusinessCalculatorsCalculatorFields < ActiveRecord::Migration[6.0]
  def change
    create_table :business_calculators_calculator_fields do |t|
      t.timestamps

      t.references :category, null: false, foreign_key: { to_table: :business_calculators_calculator_categories }
      t.text :label
      t.jsonb :units
    end
  end
end
