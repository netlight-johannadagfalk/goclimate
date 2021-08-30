class UpdateForeignKeyAddOnDeleteConstraintToUserClimateActions < ActiveRecord::Migration[6.0]
  def change
    remove_reference :user_climate_actions, :climate_action, null:false, foreign_key: { to_table: :climate_actions}
    add_reference :user_climate_actions, :climate_action, null:false, foreign_key: {to_table: :climate_actions, on_delete: :cascade}
  end
end
