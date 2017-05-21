class AddCostInSekToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :cost_in_sek, :integer
  end
end
