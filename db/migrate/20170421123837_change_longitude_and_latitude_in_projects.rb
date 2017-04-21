class ChangeLongitudeAndLatitudeInProjects < ActiveRecord::Migration[5.1]
  def change
    change_column :projects, :longitude, :decimal, :precision => 10, :scale => 6
    change_column :projects, :latitude, :decimal, :precision => 10, :scale => 6
  end
end