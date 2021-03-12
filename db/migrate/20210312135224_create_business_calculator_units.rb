class CreateBusinessCalculatorUnits < ActiveRecord::Migration[6.0]
  def change
    create_table :business_calculators_units do |t|
      t.timestamps

      t.text :key
      t.text :name
      t.text :input_type
    end
  end
end
