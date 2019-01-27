class RenameLinkToCdmUrlInProjects < ActiveRecord::Migration[5.2]
  def change
    rename_column :projects, :link, :cdm_url
    add_column :projects, :gold_standard_url, :string
  end
end
