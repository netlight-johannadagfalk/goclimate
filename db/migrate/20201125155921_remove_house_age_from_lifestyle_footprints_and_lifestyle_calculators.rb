class RemoveHouseAgeFromLifestyleFootprintsAndLifestyleCalculators < ActiveRecord::Migration[6.0]
  def change
    remove_column :lifestyle_footprints, :house_age_answer
    remove_column :lifestyle_calculators, :house_age_options
  end
end
