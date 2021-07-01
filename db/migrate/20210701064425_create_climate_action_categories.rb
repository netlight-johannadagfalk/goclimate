class CreateClimateActionCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :climate_action_categories, id: false do |t|
      t.primary_key :id
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
