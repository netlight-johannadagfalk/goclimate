class AddDateBoughtToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :date_bought, :datetime
  end
end
