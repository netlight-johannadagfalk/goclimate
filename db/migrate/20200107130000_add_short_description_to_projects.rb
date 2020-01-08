class AddShortDescriptionToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :short_description, :text
  end
end
