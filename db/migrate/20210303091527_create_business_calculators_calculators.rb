class CreateBusinessCalculatorsCalculators < ActiveRecord::Migration[6.0]
  def change
    create_table :business_calculators_calculators do |t|
      t.string :name

      t.timestamps
    end
  end
end
