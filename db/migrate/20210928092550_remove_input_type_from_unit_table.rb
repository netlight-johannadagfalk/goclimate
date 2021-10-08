class RemoveInputTypeFromUnitTable < ActiveRecord::Migration[6.0]
  def change
  	remove_column :business_calculators_units, :input_type, :text
  end
end
