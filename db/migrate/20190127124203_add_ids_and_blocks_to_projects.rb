class AddIdsAndBlocksToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :gold_standard_id, :integer
    add_column :projects, :cdm_id, :integer
    add_column :projects, :start_block, :integer
    add_column :projects, :end_block, :integer
  end
end
