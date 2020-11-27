class AddHomeAreaToLifestyleFootprintsAndLifestyleCalculators < ActiveRecord::Migration[6.0]
  def change
    add_column :lifestyle_footprints, :home_area_answer, :text
    add_column :lifestyle_calculators, :home_area_options, :jsonb
  end
end
