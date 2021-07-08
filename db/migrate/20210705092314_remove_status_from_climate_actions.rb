class RemoveStatusFromClimateActions < ActiveRecord::Migration[6.0]
  def change
    remove_column :climate_actions, :status, :string
  end
end
