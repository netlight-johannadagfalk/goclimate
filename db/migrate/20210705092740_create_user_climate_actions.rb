class CreateUserClimateActions < ActiveRecord::Migration[6.0]
  def change
    create_table :user_climate_actions do |t|
      t.boolean :status

      t.references :climate_action, null: false, foreign_key: { to_table: :climate_actions }
      t.references :user, null: false, foreign_key: { to_table: :users}
      t.timestamps
    end
  end
end
