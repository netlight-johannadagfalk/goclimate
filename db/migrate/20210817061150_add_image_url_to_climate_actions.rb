class AddImageUrlToClimateActions < ActiveRecord::Migration[6.0]
  def change
    add_column :climate_actions, :image_url, :string
  end
end
