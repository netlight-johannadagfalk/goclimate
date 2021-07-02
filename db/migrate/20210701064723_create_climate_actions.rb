class CreateClimateActions < ActiveRecord::Migration[6.0]
  def change
    create_table :climate_actions, id: false do |t|
      t.primary_key :id
      t.string :name
      t.string :description
      t.integer :points
      t.string :status
      t.boolean :repeatable
      t.boolean :action_of_the_month

      t.references :climate_action_category, null: false, foreign_key: { to_table: :climate_action_categories }

      t.timestamps
    end
  end
end
