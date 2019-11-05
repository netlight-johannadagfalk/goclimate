class RenameCarbonOffsetToCo2eInProject < ActiveRecord::Migration[6.0]
  def up
    rename_column :projects, :carbon_offset, :co2e
    Project.update_all('co2e = co2e * 1000')
  end

  def down
    Project.update_all('co2e = co2e / 1000')
    rename_column :projects, :co2e, :carbon_offset
  end
end
