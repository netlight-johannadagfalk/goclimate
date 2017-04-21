class CreateProjects < ActiveRecord::Migration[5.1]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :link
      t.string :image_url
      t.string :blog_url
      t.decimal :longitude
      t.decimal :latitude
      t.integer :carbon_offset
      t.string :country
      t.string :type

      t.timestamps
    end
  end
end
