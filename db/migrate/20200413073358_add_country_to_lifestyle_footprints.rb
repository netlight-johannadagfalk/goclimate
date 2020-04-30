class AddCountryToLifestyleFootprints < ActiveRecord::Migration[6.0]
  def change
    change_table :lifestyle_footprints do |t|
      t.text :country
    end
  end
end
