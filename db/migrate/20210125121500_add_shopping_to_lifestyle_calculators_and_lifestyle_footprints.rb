class AddShoppingToLifestyleCalculatorsAndLifestyleFootprints < ActiveRecord::Migration[6.0]
  def change
    add_column :lifestyle_calculators, :shopping_options, :jsonb
    add_column :lifestyle_footprints, :shopping_answer, :text
  end
end
