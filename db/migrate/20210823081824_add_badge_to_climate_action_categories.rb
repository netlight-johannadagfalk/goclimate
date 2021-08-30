class AddBadgeToClimateActionCategories < ActiveRecord::Migration[6.0]
  def change
    add_column :climate_action_categories, :badge_name, :string
    add_column :climate_action_categories, :badge_description, :string
    add_column :climate_action_categories, :badge_image_url, :string
  end
end
